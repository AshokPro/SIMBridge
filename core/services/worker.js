const { getNextPending, updateStatus } = require('./queueService');
const { sendSMS, delay } = require('./smsService');

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
      updateStatus(job.id, 'failed', result.error);
    }

    await delay(2000);
  }
}

module.exports = {
  processQueue,
  pauseWorker,
  resumeWorker
};