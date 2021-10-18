/**
 * Simple button on home screen to toggle proximity on / off.
 * Changes the text on the button to indicate current state.
 */
const xapi = require('xapi');
const ui = require('./ui');
const { Config, ActionButton } = require('./ui-builder');

function createButton(isOn) {
  const name = isOn ? 'Disable Proximity' : 'Enable proximity';
  const actionButton = Config({}, [
    ActionButton({
      name, panelId: 'proximity', icon: 'Proximity', color: '#003399',
    })
  ]);
  ui.panelSave('proximity', actionButton);
}

async function proximityEnabled() {
  const vol = await xapi.Config.Audio.Ultrasound.MaxVolume.get();
  return vol > 0;
}

async function proximityChanged() {
  const on = await proximityEnabled();
  createButton(on);
}

function init() {
  proximityChanged();

  // update button when config is changed
  xapi.Config.Audio.Ultrasound.MaxVolume
    .on(proximityChanged);

  ui('proximity').onPanelClicked(async () => {
    const isOn = await proximityEnabled();
    xapi.Config.Audio.Ultrasound.MaxVolume.set(isOn ? 0 : 70);
  });
}

init();
