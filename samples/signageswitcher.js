const xapi = require('xapi');
const ui = require('./ui');
const { Config, Panel, Page, Row, GroupButton, Button } = require('./ui-builder');

const urls = {
  webexhome: 'https://mysignage.com/receptionsignage',
  visitor: 'https://yr.no', // todo get correct link
};

function changeSignage(id) {
  const url = urls[id];
  console.log('signage', id, url);
  if (url) {
    xapi.Config.Standby.Signage.Url.set(url);
  }
}

async function onSignageChanged() {
  const url = await xapi.Config.Standby.Signage.Url.get();
  const item = Object.entries(urls).find(u => u[1] === url);
  if (item) {
    const id = item[0];
    ui('signage-options').widgetSetValue(id)
      .catch(() => console.log('widget doesnt exist'));
  }
  else {
    console.warn('signage url', url, 'not known');
  }
}

function activateHalfwake() {
  xapi.Command.Standby.Halfwake();
}

function createPanel() {
  const panel = Config({}, [
    Panel({ name: 'Signage', icon: 'Home', color: 'orange' }, [
      Page({ name: 'Signage' }, [
        Row({ text: 'Choose mode' }, [
          GroupButton({
            widgetId: 'signage-options',
            buttons: {
              webexhome: 'Dashboard',
              visitor: 'Visitors',
            }
          }),
       ]),
       Row({}, Button({ widgetId: 'halfwake', text: 'Activate' })),
     ]),
   ])
  ]);

  ui('signage-options').onWidgetReleased(e => changeSignage(e.Value));
  ui('halfwake').onWidgetClicked(activateHalfwake);
  ui.panelSave('signage-switcher', panel);
}

xapi.Config.Standby.Signage.Url.on(onSignageChanged);
onSignageChanged();
createPanel();
// ui.panelRemove('signage-switcher').catch(() => console.log('panel not found'));
