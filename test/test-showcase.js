const jsxapi = require('jsxapi');
const Module = require('module');

const originalRequire = Module.prototype.require;

function connectXapi (host, username, password) {
  return new Promise((resolve, reject) => {
    jsxapi
    .connect('wss://' + host, {
      username,
      password,
    })
    .on('error', e => reject(e))
    .on('ready', async (xapi) => {
      resolve(xapi);
    });
  });
}

connectXapi('10.0.0.25', 'tore', 'ynglinge').then((xapi) => {
  Module.prototype.require = function() {
    const moduleName = arguments[0];
    return moduleName === 'xapi' ? xapi : originalRequire.apply(this, arguments);
  };

  // run macro as an external integration. when it calls require('xapi') it will get the connected
  // object from above
  require('../src/showcase');
});
