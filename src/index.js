require('dotenv').config();

const express      = require('express');
const path         = require('path');
const webhookRoutes = require('./routes/webhook');
const leadsRoutes   = require('./routes/leads');
const { startScheduler } = require('./scheduler');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Twilio + Formspree send urlencoded

// ── Routes ───────────────────────────────────────────────────
app.use('/webhook', webhookRoutes);
app.use('/api/leads', leadsRoutes);

// Serve dashboard
app.use(express.static(path.join(__dirname, 'dashboard')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard', 'index.html'));
});

// Health check (useful for uptime monitors and deployment verification)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n[Server] Ulloa Construction CRM running on port ${PORT}`);
  console.log(`[Server] Dashboard: http://localhost:${PORT}`);
  console.log(`[Server] Health:    http://localhost:${PORT}/health\n`);
  startScheduler();
});
