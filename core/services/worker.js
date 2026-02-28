const { getNextPending, updateStatus } = require('./queueService');
const { sendSMS, delay } = require('./smsService');

const { incrementRetry } = require('./queueService');

let isPaused = false;

function pauseWorker() {
  isPaused = true;
  console.log("Worker paused.");
}

function resumeWorker() {
  isPaused = false;
  console.log("Worker resumed.");
}

async function processQueue() {
  while (true) {
    if (isPaused) {
      await delay(1000);
      continue;
    }

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
      if (job.retry_count < 3 && result.error !== 'Daily limit reached') {
        console.log(`Retrying job ${job.id}...`);
        incrementRetry(job.id);
      } else {
        updateStatus(job.id, 'failed', result.error);
}
    }

    await delay(2000);
  }
}

module.exports = {
  processQueue,
  pauseWorker,
  resumeWorker
};