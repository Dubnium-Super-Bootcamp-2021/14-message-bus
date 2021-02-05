// const { connect } = require('./lib/orm');
// const { TaskSchema } = require('./tasks/task.model');
// const { WorkerSchema } = require('./worker/worker.model');
// const workerServer = require('./worker/server');

/**
 * intiate database and other stroage dependency
 */
async function init() {
  try {
    console.log('connect to database');
    await connect([WorkerSchema, TaskSchema], {
      type: 'postgres',
      host: 'localhost',
      port: 3306,
      username: 'root',
      //   password: 'postgres',
      database: 'dubnium',
    });
    console.log('database connected');
  } catch (err) {
    console.error('database connection failed');
    return;
  }
}

/**
 * main routine
 * @param {string} command launch command
 * @returns {Promise<void>}
 */
async function main(command) {
  switch (command) {
    case 'task':
      // TODO: implement task service
      await init();

      break;
    case 'worker':
      await init();
      workerServer.run();
      break;
    default:
      console.log(`${command} tidak dikenali`);
      console.log('command yang valid: task, worker');
  }
}

main(process.argv[2]);
