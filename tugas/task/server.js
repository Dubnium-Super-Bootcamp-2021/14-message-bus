const { createServer } = require('http');
const url = require('url');
const { stdout } = require('process');
const { addService, listService } = require('./task.service');

let server;

/**
 * run server
 */
async function run() {
  server = createServer((req, res) => {
    /**
     * write http response message
     * @param {number} statusCode http response code, default to 200
     * @param {string} message respose message
     */
    function respond(statusCode, message) {
      res.statusCode = statusCode || 200;
      res.write(message || '');
      res.end();
    }

    // route service based on its pathname
    try {
      const uri = url.parse(req.url, true);
      switch (uri.pathname) {
        case '/add':
          console.log('/add');
          if (req.method === 'POST') {
            return await addService(req, res);
          } else {
            respond(404);
          }
          break;
        case '/list':
          if (req.method === 'GET') {
            return listService(req, res);
          } else {
            respond(404);
          }
          break;
        default:
          respond(404);
      }
    } catch (err) {
      respond(500, 'unkown server error');
    }
  });

  // run server
  const PORT = 1212;
  server.listen(PORT, () => {
    stdout.write(`server listening on port ${PORT}\n`);
  });
}

/**
 * stop server
 */
function stop() {
  if (server) {
    server.close();
  }
}

module.exports = {
  run,
  stop,
};
