const cron = require('node-cron');
const { processNurtureSequences } = require('./services/nurture');

function startScheduler() {
  // Run every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    await processNurtureSequences();
  });

  console.log('[Scheduler] Nurture scheduler started — runs every 15 minutes');

  // Also run immediately on startup so leads don't wait up to 15 min
  setTimeout(() => processNurtureSequences(), 5000);
}

module.exports = { startScheduler };
