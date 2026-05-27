require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const webhookRoutes = require('./routes/webhook');
const leadsRoutes   = require('./routes/leads');
const { startScheduler } = require('./scheduler');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: [
    'https://ulloa-construction.com',
    'https://www.ulloa-construction.com',
    'http://localhost:3000'
  ]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/webhook', webhookRoutes);
app.use('/api/leads', leadsRoutes);

app.use(express.static(path.join(__dirname, 'dashboard')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard', 'index.html'));
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n[Server] Ulloa Construction CRM running on port ${PORT}`);
  console.log(`[Server] Dashboard: http://localhost:${PORT}`);
  console.log(`[Server] Health:    http://localhost:${PORT}/health\n`);
  startScheduler();
});