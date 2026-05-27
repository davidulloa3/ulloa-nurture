const { Resend } = require('resend');

// Lazy init so the module can load without env vars set yet
let _resend;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

/**
 * Send a plain-text email via Resend.
 */
async function sendEmail({ to, subject, body }) {
  const { data, error } = await getResend().emails.send({
    from: process.env.FROM_EMAIL || 'David Ulloa <david@ulloa-construction.com>',
    reply_to: process.env.OWNER_EMAIL,
    to,
    subject,
    text: body
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  console.log(`[Email] Sent to ${to} — ID: ${data.id}`);
  return data.id;
}

module.exports = { sendEmail };
