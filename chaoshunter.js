const http = require('http');
const url = require('url');
// Import Common module
const common = require('./svc/common')();
// Import Home-Page modules, passing the Common module
const loadhome = require('./load/home')(common);
const apishome = require('./api/home')(common);
const loadimg = require('./load/img')();
const apisimg = require('./api/img')(common);

// Port configuration adopted from Heroku example.
const port = process.env.PORT || 5000;
// Content Cache (Not really a cache)
const content = {};
// Routing
const api = {
  '/': apishome.html,
  '/css': apishome.css,
  '/font': apishome.font,
  '/js': apishome.js,
  '/ico': apishome.ico,
  '/favicon.ico': common.sendRedirect('/ico'),
  '/img': apisimg.png,
};
// Loading
const loader = {
  '/': loadhome.html,
  '/css': loadhome.css,
  '/font': loadhome.font,
  '/js': loadhome.js,
  '/ico': loadhome.ico,
  '/img': loadimg.png,
};

// Server Internal Logic
const serve = async function baseServiceLogic(request, response) {
  const path = url.parse(request.url);
  const route = api[path.pathname];
  const load = loader[path.pathname];
  if (route) {
    if (!content[path.pathname + path.search]) {
      if (load) {
        content[path.pathname + path.search] = await load(path.search);
      }
    }
    route(content[path.pathname + path.search], response);
  } else common.sendResponse(response, 'Not Found', 404);
};
// Server Startup Process
const boot = async function bootstrapServer() {
  const server = http.createServer(serve);

  server.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });
};
// Bootstrap
boot();
