const { getNextPending, updateStatus } = require('./queueService');
const { sendSMS, delay } = require('./smsService');

async function processQueue() {
  while (true) {
    const job = getNextPending();

    if (!job) {
      await delay(1000);
      continue;
    }

    updateStatus(job.id, 'processing');

    const result = await sendSMS(job.phone, job.message);

    if (result.success) {
      updateStatus(job.id, 'sent');
    } else {
      updateStatus(job.id, 'failed', result.error);
    }

    await delay(2000);
  }
}

module.exports = {
  processQueue
};