const supabase            = require('../db/supabase');
const { generateSMSMessage, generateEmailMessage } = require('./ai');
const { sendSMS }         = require('./sms');
const { sendEmail }       = require('./email');

// Days in the sequence and how many hours after lead creation to send
const SEQUENCE = [
  { day: 1,  hoursAfter: 0   },  // Send immediately on first scheduler run
  { day: 3,  hoursAfter: 72  },
  { day: 7,  hoursAfter: 168 },
  { day: 14, hoursAfter: 336 }
];

/**
 * Main entry point called by the scheduler every 15 minutes.
 * Processes all active leads that are not in owner takeover.
 */
async function processNurtureSequences() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Nurture check running...`);

  const { data: leads, error } = await supabase
    .from('leads')
    .select('*, nurture_log(*)')
    .eq('status', 'active')
    .eq('owner_takeover', false);

  if (error) {
    console.error('[Nurture] Failed to fetch leads:', error.message);
    return;
  }

  if (!leads || leads.length === 0) {
    console.log('[Nurture] No active leads to process.');
    return;
  }

  console.log(`[Nurture] Processing ${leads.length} active lead(s)...`);

  for (const lead of leads) {
    try {
      await processLead(lead);
    } catch (err) {
      console.error(`[Nurture] Error processing lead ${lead.id}:`, err.message);
    }
  }
}

/**
 * Evaluate a single lead against the sequence and fire any due messages.
 */
async function processLead(lead) {
  const leadAgeHours = getLeadAgeHours(lead.created_at);

  for (const { day, hoursAfter } of SEQUENCE) {
    if (leadAgeHours < hoursAfter) continue; // Not time yet

    const hasSentSMS   = hasLogEntry(lead.nurture_log, day, 'sms');
    const hasSentEmail = hasLogEntry(lead.nurture_log, day, 'email');

    if (!hasSentSMS && lead.phone) {
      await sendNurtureMessage({ lead, dayNumber: day, channel: 'sms' });
    }

    if (!hasSentEmail && lead.email) {
      await sendNurtureMessage({ lead, dayNumber: day, channel: 'email' });
    }
  }

  // Check if sequence is fully complete
  await checkCompletion(lead);
}

/**
 * Generate and send a single nurture message (SMS or email), then log it.
 */
async function sendNurtureMessage({ lead, dayNumber, channel }) {
  let content = null;

  try {
    if (channel === 'sms') {
      content = await generateSMSMessage({ lead, dayNumber });
      await sendSMS({ to: lead.phone, body: content });
    } else {
      const { subject, body } = await generateEmailMessage({ lead, dayNumber });
      content = `Subject: ${subject}\n\n${body}`;
      await sendEmail({ to: lead.email, subject, body });
    }

    await logMessage({ leadId: lead.id, dayNumber, channel, content, status: 'sent' });
    console.log(`[Nurture] Day ${dayNumber} ${channel.toUpperCase()} sent to ${lead.name}`);
  } catch (err) {
    console.error(`[Nurture] Day ${dayNumber} ${channel} FAILED for ${lead.name}:`, err.message);
    await logMessage({ leadId: lead.id, dayNumber, channel, content, status: 'failed' });
  }
}

/**
 * Mark a lead as completed if all sequence messages have been sent.
 */
async function checkCompletion(lead) {
  // Reload fresh log count from DB
  const { data: logs } = await supabase
    .from('nurture_log')
    .select('id')
    .eq('lead_id', lead.id)
    .eq('status', 'sent');

  const channels = [lead.phone ? 1 : 0, lead.email ? 1 : 0].reduce((a, b) => a + b, 0);
  const expected = SEQUENCE.length * channels;

  if (logs && logs.length >= expected) {
    await supabase.from('leads').update({ status: 'completed' }).eq('id', lead.id);
    console.log(`[Nurture] Sequence complete for ${lead.name}`);
  }
}

// ── Helpers ──────────────────────────────────────────────────

function getLeadAgeHours(createdAt) {
  return (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
}

function hasLogEntry(logs, dayNumber, channel) {
  return logs.some(l => l.day_number === dayNumber && l.channel === channel);
}

async function logMessage({ leadId, dayNumber, channel, content, status }) {
  await supabase.from('nurture_log').insert({
    lead_id: leadId,
    day_number: dayNumber,
    channel,
    content,
    status
  });
}

module.exports = { processNurtureSequences, sendNurtureMessage };
