const ui = require('./ui');

// ui.debug(true);
ui.onUsbKeyPressed(key => console.log('pressed', key));
ui.onUsbKeyReleased(key => console.log('released', key));
