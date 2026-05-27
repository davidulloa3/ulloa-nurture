const express = require('express');
const router  = express.Router();
const supabase = require('../db/supabase');
const { notifyOwner } = require('../services/sms');

// ── Formspree webhook ────────────────────────────────────────
// Configure in Formspree dashboard: Settings > Integrations > Webhooks
// Point it to: https://your-server.com/webhook/formspree
router.post('/formspree', async (req, res) => {
  try {
    const payload = req.body;

    // Formspree sends data under field names matching your form inputs
    const name         = payload.name        || payload.Name        || '';
    const email        = payload.email       || payload.Email       || '';
    const phone        = payload.phone       || payload.Phone       || '';
    const service_type = payload.service     || payload.Service     || payload['service-type'] || '';
    const message      = payload.message     || payload.Message     || '';

    if (!name || (!email && !phone)) {
      console.warn('[Webhook] Formspree: missing name or contact info', payload);
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('leads')
      .insert({
        name:         name.trim(),
        email:        email.trim()   || null,
        phone:        phone          ? normalizePhone(phone) : null,
        service_type: service_type.trim() || null,
        message:      message.trim() || null,
        source:       'website'
      })
      .select()
      .single();

    if (error) throw error;

    console.log(`[Lead] New website lead: ${name} | ${email || phone}`);
    res.status(200).json({ success: true, lead_id: data.id });
  } catch (err) {
    console.error('[Webhook] Formspree error:', err.message);
    res.status(500).json({ error: 'Failed to process lead' });
  }
});

// ── Twilio inbound SMS webhook ───────────────────────────────
// Configure in Twilio console: Phone Numbers > Manage > Active Numbers
// Under "A message comes in", set webhook to: https://your-server.com/webhook/twilio/inbound
router.post('/twilio/inbound', async (req, res) => {
  try {
    const from = req.body.From || '';
    const body = req.body.Body || '';

    if (!from) {
      return res.set('Content-Type', 'text/xml').send('<Response></Response>');
    }

    const normalizedFrom = normalizePhone(from);

    // Look up the lead by phone number
    const { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('phone', normalizedFrom)
      .maybeSingle();

    if (lead) {
      // Log the inbound message
      await supabase.from('inbound_messages').insert({
        lead_id:     lead.id,
        from_number: normalizedFrom,
        body:        body
      });

      // Pause automation for this lead
      await supabase
        .from('leads')
        .update({ owner_takeover: true })
        .eq('id', lead.id);

      // Alert David
      await notifyOwner({ lead, inboundMessage: body });

      console.log(`[Inbound] SMS from ${lead.name}: "${body}" — automation paused`);
    } else {
      console.log(`[Inbound] SMS from unknown number ${normalizedFrom}: "${body}"`);
    }

    // Twilio requires a TwiML response (even if empty)
    res.set('Content-Type', 'text/xml').send('<Response></Response>');
  } catch (err) {
    console.error('[Webhook] Twilio inbound error:', err.message);
    res.set('Content-Type', 'text/xml').send('<Response></Response>');
  }
});

// ── Helpers ──────────────────────────────────────────────────

function normalizePhone(phone) {
  const digits = String(phone).replace(/\D/g, '');
  if (digits.startsWith('1') && digits.length === 11) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  return `+${digits}`;
}

module.exports = router;
