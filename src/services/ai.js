const Anthropic = require('@anthropic-ai/sdk');
const supabase  = require('../db/supabase');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const DEFAULT_CONTEXT = `You are an AI sales assistant for Ulloa Construction, a licensed general contracting business (CSLB #1144906) based in Anaheim, CA. The company specializes in kitchen remodeling, bathroom renovations, room additions, and ADUs across all 34 Orange County cities. The owner's name is David Ulloa.

Tone rules:
- Warm, human, and conversational — never robotic or salesy
- Never use em dashes
- No marketing buzzwords
- Sound like a real person texting or emailing, not a company blast
- Never mention AI or automation`;

const DEFAULT_SIGNATURE = 'David @ Ulloa Construction';

const DAY_GOALS = {
  1:  'Warmly confirm you received their inquiry. Let them know you will reach out shortly and offer to schedule a free estimate. Keep it brief and welcoming.',
  3:  'Check in and add brief value related to their project type. Share a quick insight about what to expect with their remodel or ADU project in Orange County. Ask if they have any questions.',
  7:  'Create gentle urgency. Your schedule is filling up for the season and you want to make sure you can fit them in. Ask if they are still looking to move forward.',
  14: 'Final soft touch. No pressure at all. Let them know you are still available whenever they are ready and that you would love to help when the time is right.'
};

// Load AI settings from DB (falls back to defaults if not set)
async function loadSettings() {
  try {
    const { data } = await supabase
      .from('ai_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    return data || {};
  } catch {
    return {};
  }
}

/**
 * Generate a personalized SMS for a lead on a given nurture day.
 */
async function generateSMSMessage({ lead, dayNumber }) {
  const settings = await loadSettings();
  const context   = settings.extra_context
    ? `${DEFAULT_CONTEXT}\n\nAdditional instructions: ${settings.extra_context}`
    : DEFAULT_CONTEXT;
  const tone      = settings.tone || 'warm and conversational';
  const signature = settings.sms_signature || DEFAULT_SIGNATURE;

  const prompt = `${context}

Generate a follow-up SMS for day ${dayNumber} of a lead nurture sequence.

Lead info:
- Name: ${lead.name}
- Service they are interested in: ${lead.service_type || 'home remodeling'}
- Their original message: ${lead.message || '(none provided)'}
- Internal notes: ${lead.notes || '(none)'}

Goal for day ${dayNumber}: ${DAY_GOALS[dayNumber]}

Tone: ${tone}

Requirements:
- Absolute maximum 160 characters (count carefully)
- Address them by first name only
- Sign off as "${signature}"
- No em dashes
- No hashtags or emojis
- End with a simple, low-pressure call to action

Return ONLY the SMS text. No quotes, no explanation.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 200,
    messages: [{ role: 'user', content: prompt }]
  });

  return response.content[0].text.trim();
}

/**
 * Generate a personalized email for a lead on a given nurture day.
 */
async function generateEmailMessage({ lead, dayNumber }) {
  const settings = await loadSettings();
  const context   = settings.extra_context
    ? `${DEFAULT_CONTEXT}\n\nAdditional instructions: ${settings.extra_context}`
    : DEFAULT_CONTEXT;
  const tone = settings.tone || 'warm and conversational';

  const prompt = `${context}

Generate a follow-up email for day ${dayNumber} of a lead nurture sequence.

Lead info:
- Name: ${lead.name}
- Service they are interested in: ${lead.service_type || 'home remodeling'}
- Their original message: ${lead.message || '(none provided)'}
- Internal notes: ${lead.notes || '(none)'}

Goal for day ${dayNumber}: ${DAY_GOALS[dayNumber]}

Tone: ${tone}

Requirements:
- 3 to 5 sentences max in the body
- Warm and personal, not a newsletter
- No em dashes
- Sign off as: David Ulloa | Ulloa Construction | (714) 487-1860 | ulloa-construction.com
- Plain text only, no HTML or markdown

Return ONLY a JSON object in this exact format (no markdown fences, no explanation):
{"subject":"...","body":"..."}`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }]
  });

  const raw = response.content[0].text.trim();
  return JSON.parse(raw);
}

module.exports = { generateSMSMessage, generateEmailMessage };