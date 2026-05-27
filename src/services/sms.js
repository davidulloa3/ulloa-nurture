const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send an SMS message via Twilio.
 */
async function sendSMS({ to, body }) {
  const message = await client.messages.create({
    body,
    from: process.env.TWILIO_PHONE_NUMBER,
    to
  });
  console.log(`[SMS] Sent to ${to} — SID: ${message.sid}`);
  return message.sid;
}

/**
 * Notify the owner (David) when a lead replies to a text.
 * Sends a plain SMS alert to the owner's personal number.
 */
async function notifyOwner({ lead, inboundMessage }) {
  const firstName = lead.name.split(' ')[0];
  const body = `Ulloa CRM: ${firstName} replied: "${inboundMessage.substring(0, 80)}${inboundMessage.length > 80 ? '...' : ''}". Automation paused. Text them: ${lead.phone}`;

  return sendSMS({
    to: process.env.OWNER_PHONE_NUMBER,
    body
  });
}

module.exports = { sendSMS, notifyOwner };
