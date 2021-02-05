const Busboy = require('busboy');
const url = require('url');
const { Writable } = require('stream');
const { add, list, remove, ERROR_WORKER_NOT_FOUND } = require('./task');
// const { saveFile } = require('../lib/storage');
// eslint-disable-next-line no-unused-vars
const { IncomingMessage, ServerResponse } = require('http');

/**
 * service to add new task
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
function addService(req, res) {
  const busboy = new Busboy({ headers: req.headers });

  const data = {
    job: '',
    desc: '',
    filename: '',
  };

  let finished = false;

  function abort() {
    req.unpipe(busboy);
    if (!req.aborted) {
      res.statusCode = 413;
      res.end();
    }
  }

  busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
    switch (fieldname) {
      case 'filename':
        try {
          //   data.photo = await saveFile(file, mimetype);
          data.filename = 'ini-file-dummy.jpeg';
        } catch (err) {
          abort();
        }
        if (finished) {
          try {
            const task = await add(data);
            res.setHeader('content-type', 'application/json');
            res.write(JSON.stringify(task));
          } catch (err) {
            if (err === 'Data task kurang lengkap') {
              res.statusCode = 401;
            } else {
              res.statusCode = 500;
              console.log('test 500');
            }
            res.write(err);
            console.log('test err');
          }
          res.end();
        }
        break;
      default: {
        const noop = new Writable({
          write(chunk, encding, callback) {
            setImmediate(callback);
          },
        });
        file.pipe(noop);
      }
    }
  });

  busboy.on('field', (fieldname, val) => {
    if (['job', 'desc', 'filename'].includes(fieldname)) {
      data[fieldname] = val;
    }
  });

  busboy.on('finish', async () => {
    finished = true;
  });

  req.on('aborted', abort);
  busboy.on('error', abort);

  req.pipe(busboy);
}

/**
 * service to get list of tasks
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
async function listService(req, res) {
  try {
    const task = await list();
    res.setHeader('content-type', 'application/json');
    res.write(JSON.stringify(task));
    res.end();
  } catch (err) {
    res.statusCode = 500;
    res.end();
    return;
  }
}

/**
 * service to remove a task by it's id
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
async function removeSvc(req, res) {
  const uri = url.parse(req.url, true);
  const id = uri.query['id'];
  if (!id) {
    res.statusCode = 401;
    res.write('parameter id tidak ditemukan');
    res.end();
    return;
  }
  try {
    const task = await remove(id);
    res.setHeader('content-type', 'application/json');
    res.statusCode = 200;
    res.write(JSON.stringify(task));
    res.end();
  } catch (err) {
    if (err === ERROR_WORKER_NOT_FOUND) {
      res.statusCode = 404;
      res.write(err);
      res.end();
      return;
    }
    res.statusCode = 500;
    res.end();
    return;
  }
}

module.exports = {
  listService,
  addService,
  removeSvc,
};
