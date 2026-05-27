# Ulloa Construction — AI Lead Nurture System

Automated SMS + email nurture for every incoming lead, powered by Claude AI.

## How it works

1. A lead submits your website contact form (Formspree)
2. Formspree fires a webhook to this server
3. The lead is saved in Supabase
4. Every 15 minutes, the scheduler checks for due messages
5. Claude generates a personalized SMS and email for each nurture day
6. Twilio sends the SMS, Resend sends the email
7. If the lead replies by text, automation pauses and you get an alert
8. The dashboard shows you every lead, their status, and what's been sent

**Nurture schedule:** Day 1 (immediate) → Day 3 → Day 7 → Day 14

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Fill in all values in .env
```

### 3. Set up the database
- Go to your Supabase project → SQL Editor
- Run the contents of `supabase/schema.sql`

### 4. Configure Formspree webhook
- Log in to Formspree → your form (`xovznekk`) → Settings → Integrations
- Add a webhook pointing to: `https://your-server.com/webhook/formspree`
- Make sure your form fields are named: `name`, `email`, `phone`, `service`, `message`

### 5. Configure Twilio inbound webhook
- Twilio Console → Phone Numbers → Manage → Active Numbers → your number
- Under "A Message Comes In", set the webhook URL to:
  `https://your-server.com/webhook/twilio/inbound`
- Method: HTTP POST

### 6. Start the server
```bash
# Development (auto-restart on save)
npm run dev

# Production
npm start
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/leads` | List all leads (`?status=active`) |
| GET    | `/api/leads/:id` | Single lead with full history |
| POST   | `/api/leads` | Add a lead manually |
| PATCH  | `/api/leads/:id/takeover` | Pause or resume automation |
| PATCH  | `/api/leads/:id/status` | Update status (active/completed/unqualified) |
| POST   | `/webhook/formspree` | Formspree webhook (auto) |
| POST   | `/webhook/twilio/inbound` | Twilio inbound SMS (auto) |
| GET    | `/` | Dashboard |
| GET    | `/health` | Health check |

---

## Deployment (Railway / Render / Fly.io)

1. Push this repo to GitHub
2. Connect to Railway, Render, or Fly.io
3. Add all environment variables from `.env.example`
4. Deploy — the server starts automatically

For Twilio and Formspree webhooks, use your deployed public URL.

---

## Owner takeover

When a lead texts back, the system automatically:
- Pauses their nurture sequence
- Logs their message
- Sends you an SMS alert with their name and what they said

To resume automation for that lead, click **▶ Resume** in the dashboard.
