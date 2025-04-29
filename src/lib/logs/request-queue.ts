import {RequestInterface, requestModel} from '../../models/request';

const requestsQueue: RequestInterface[] = [];
const BATCH_SIZE = 10;
const FLUSH_INTERVAL = 120_000;

/**
 * Instead of writing requests directly to the database for every request, requests are queued
 * in memory and periodically flushed in batches. This reduces the number of writes to
 * the database, preventing performance degradation under high load.
 *
 * The queue is automatically processed every `FLUSH_INTERVAL` milliseconds.
 */
async function processRequestQueue() {
  if (requestsQueue.length === 0) {
    return;
  }

  const requestsToSave = requestsQueue.splice(0, BATCH_SIZE);

  try {
    await requestModel.insertMany(requestsToSave);
  } catch {
    requestsQueue.unshift(...requestsToSave);
  }
}

setInterval(processRequestQueue, FLUSH_INTERVAL);

/**
 * Adds a request entry to the queue for later insertion.
 *
 * @param {LogInterface} logData - The request data to be added to the queue.
 *
 * This function **does not write to MongoDB immediately**. Instead, it adds the request entry
 * to an in-memory queue, which is flushed in batches to improve performance.
 */
export function queueRequest(logData: RequestInterface): void {
  requestsQueue.push(logData);
}
