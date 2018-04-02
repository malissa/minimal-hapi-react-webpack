// Perform babel transforms defined in .babelrc (ES6, JSX, etc.) on server-side code
// Note: the options in .babelrc are also used for client-side code
// because we use a babel loader in webpack config
require('babel-register');
require('dotenv').config();

const config = require('./config/variables');
const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiReactViews = require('hapi-react-views');
const HapiRequireHttps = require('hapi-require-https');
const routes = require('./routes');

const server = Hapi.Server({
  host: config.server.host,
  port: config.server.port,
  state: {
    ttl: null, // browser lifetime,
    isSecure: false, // disable for localhost
    isHttpOnly: true,
    encoding: 'base64json',
    clearInvalid: true, // remove invalid cookies
    strictHeader: false, // don't allow violations of RFC 6265
    ignoreErrors: false,
    path: '/'
  }
});

// cookies
server.state('user');
server.state('redirPath');

const plugins = [
  Inert, // enables serving static files (file and directory handlers)
  Vision, // enables rendering views with custom engines (view handler)
  HapiRequireHttps // force https
];
// Enable proxying requests to webpack dev server (proxy handler)
if (process.env.NODE_ENV === 'development') {
  const H2o2 = require('h2o2'); // eslint-disable-line import/no-extraneous-dependencies, global-require
  // ^^^ RE: eslint exception – This code branch is DEV only, so dev dependencies are ok here.
  plugins.push(H2o2);
}

server.register(plugins)
  .then(() => {
    // Set up server side react views using Vision
    server.views({
      engines: { jsx: HapiReactViews },
      path: config.paths.serverViews
    });

    server.route(routes);

    if (!module.parent) { // only start server if not importing it somewhere like a test
      server.start(() => {
        console.log('Hapi server started!', server.info.host, server.info.port);
      });
    }
  })
  .catch((err) => {
    console.error(err);
  });

module.exports = server;
