const jsxapi = require('jsxapi');

const {
  toXml,
  Config,
  Panel,
  ActionButton,
  WebApp,
  Page,
  Row,
  GroupButton,
  ToggleButton,
  Button,
  Slider,
  IconButton,
  DirectionalPad,
  Text,
  Spinner,
  Spacer,
} = require('../src/uiext');

const gui = require('../src/gui');

async function addActionButton() {
  const webApp = WebApp({
    name: 'YR',
    url: 'http://yr.no',
    color: '#334455',
    icon: 'Hvac',
  });
  const config = Config({}, webApp);
  const xml = toXml(config);
  await gui.panelSave('mywebapp', xml);
  console.log('panel saved');
  gui.panelRemove('mywebapp');
}

jsxapi
  .connect('wss://10.0.0.25', {
    username: 'tore',
    password: 'ynglinge',
  })
  .on('error', console.error)
  .on('ready', async (xapi) => {
    gui.setXapi(xapi);
    addActionButton();
  });
