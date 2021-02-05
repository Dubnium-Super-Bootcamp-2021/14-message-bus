const { getConnection } = require('typeorm');
const { Task } = require('./task.model');

const ERROR_WORKER_NOT_FOUND = 'pekerja tidak ditemukan';

/**
 * Worker type definition
 * @typedef {Object} WorkerData
 * @property {[string]} id
 * @property {string} job
 * @property {number} desc
 * @property {boolean} done
 * @property {string} filename
 * @property {string} addedAt
 */

/**
 * register new worker
 * @param {WorkerData} data worker profile
 * @returns {Promise<Worker>} new worker profile with id
 */
async function add(data) {
  if (
    !data.job ||
    !data.desc ||
    // !data.done ||
    !data.filename
    // !data.addedAt
  ) {
    throw 'Data task kurang lengkap';
  }
  const taskRepo = getConnection().getRepository('Task');
  const task = new Task(
    null,
    data.job,
    data.desc,
    // data.done,
    data.filename
    // data.addedAt
  );
  await taskRepo.save(task);
  return task;
}

/**
 * get list of registered workers
 * @returns {Promise<Worker[]>} list of registered workers
 */
function list() {
  const taskRepo = getConnection().getRepository('Task');
  return taskRepo.find();
}

/**
 * remove a worker by an id
 * @param {string} id worker id
 * @returns {Promise<Worker>} removed worker
 */
async function remove(id) {
  const workerRepo = getConnection().getRepository('Worker');
  const worker = await workerRepo.findOne(id);
  if (!worker) {
    throw ERROR_WORKER_NOT_FOUND;
  }
  await workerRepo.delete(id);
  return worker;
}

module.exports = {
  add,
  list,
  remove,
  ERROR_WORKER_NOT_FOUND,
};
