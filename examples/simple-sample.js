const { toXml, Config, Panel, Page, Row, ToggleButton, GroupButton } = require('../src/ui-builder');
const ui = require('../src/ui');

const PanelId = 'panel-lights';

function buildPanel(expanded) {
  const toggleLight = ToggleButton({ widgetId: 'toggle-lights' });
  const lightsColor = GroupButton({
    widgetId: 'my-colors',
    buttons: {
      green: 'Green',
      red: 'Red',
      blue: 'Blue',
    },
  });

  const config = Config({}, Panel(
    {
      name: 'Lights',
      panelId: PanelId,
      icon: 'Lightbulb',
      color: 'yellow',
    },
    Page({
      name: 'Lights'
    }, [
        Row({ text: 'Main lights' }, toggleLight),
        expanded && Row({ text: 'Colors' }, lightsColor),
    ]),
  ));

  const xml = toXml(config);
  return ui.panelSave(PanelId, xml);
}

async function modeChanged(evt) {
  const modeOn = evt.Value === 'on';
  await buildPanel(modeOn);
  ui.widgetSetValue('toggle-lights', modeOn ? 'on' : 'off');
}

async function go() {
  await buildPanel(false);
  ui.panelOpen(PanelId);
  ui.onToggleButtonChanged('toggle-lights', modeChanged);
}

go();
