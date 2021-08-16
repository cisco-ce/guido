/**
 * Adapter that makes it possible to run a pure macro from an external node context instead.
 * Useful to develop, test and commit macros on own laptop instead of in macro editor,
 * then just copy/paste/export/commit & push the macro file when done.
 *
 * Macros on video device can just import the xapi object directly, but when external you need
 * to provide login details. Some magic here makes lets you connect to the video device with jsxapi,
 * then require the macro file, which will run as if it had the same xapi object as the video device
 *
 * Usage:
 *  const adapter = require('./universal-adapter');
 *  const videoDevice = { host: '10.0.0.99', username: 'admin', password: 'password };
 *  const macroModule = './mymacro'; // the file name you would usually use in require()
 *  adapter(videoDevice, macroModule); // connect and start macro
 *
 */

const jsxapi = require('jsxapi');
const Module = require('module');

const originalRequire = Module.prototype.require;

function connectXapi ({ host, username, password }) {
  return new Promise((resolve, reject) => {
    jsxapi
    .connect('wss://' + host, {
      username,
      password,
    })
    .on('error', e => reject(e))
    .on('ready', async (xapi) => {
      console.log('Connected to', host);
      resolve(xapi);
    });
  });
}

async function init(deviceLogin, macroModuleName) {

    const xapi = await connectXapi(deviceLogin);
    Module.prototype.require = function() {
      const moduleName = arguments[0];
      return moduleName === 'xapi' ? xapi : originalRequire.apply(this, arguments);
    }

    // run macro as an external integration. when it calls require('xapi') it will get the
    // connected xapi object
    require(macroModuleName);
}

module.exports = init;
