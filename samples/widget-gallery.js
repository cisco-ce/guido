const ui = require('./ui');
const builder = require('./ui-builder');
const xapi = require('xapi');

const IdChangeWidget = 'choose-widget';
const IdPanel = 'widget-gallery';
const IdWidgetType = 'widget-type';
const IdTextEvent = 'widget-event-text';
const IdMainWidget = 'main-widget';

let currentWidgetIndex = 0;
let lastEventTime = 0;

// action button: quick dial, go to half wake, toggle self view.
const widgets = [
  {
    type: 'Button',
    options: { size: 3, text: 'Simple push button' },
    info: 'For simple state-less actions',
  },
  {
    type: 'Spinner',
    options: { size: 2 },
    info: 'To increment/decrement values',
  },
  {
    type: 'GroupButton',
    options: { buttons: { 1: 'Alt 1', 2: 'Alt 2', 3: 'Alt 3' }},
    info: 'To select btw presets',
  },
  {
    type: 'ToggleButton',
    options: { },
    info: 'Toggle on/off switch',
  },
  {
    type: 'Slider',
    options: {},
    info: 'To adjust values such as ligth dimmer',
  },
  {
    type: 'DirectionalPad',
    options: {},
    info: 'Eg navigate in menus',
  },
  {
    type: 'IconButton',
    options: { icon: 'power' },
    info: 'Small toggle-able icon button for menus etc',
  },
  {
    type: 'Text',
    options: { text: 'Pure text widget', size: 4 },
    info: 'Display info text, or show dynamic values',
  },
];

function createDemoPanel(mainWidget) {
  const { Config, Panel, Page, Row, Spinner, Text } = builder;
  const config = Config({ version: '1.7' },
    Panel({ panelId: IdPanel, color: '#D541D8', name: 'Widget Gallery', icon: 'Blinds' }, [
      Page({ pageId: 'widget-gallery', name: 'Widget gallery' }, [
        Row({ text: 'Choose widget'}, [
          Text({ widgetId: IdWidgetType, size: 2 }),
          Spinner({ widgetId: IdChangeWidget, size: 2, style: 'horizontal' }),
        ]),
        Row({ text: 'Widget' }, mainWidget),
        Row({ text: 'Event' }, Text({ widgetId: IdTextEvent, size: 4 })),
      ]),
    ])
  );

  ui.panelSave(IdPanel, config);
  ui(IdTextEvent).setValue('Interact with widget to see events');
}

function createWidget(type, props) {
  const attrs = Object.assign({ widgetId: IdMainWidget }, props);
  return builder[type](attrs);
}

function setWidget(index) {
  const { type, options } = widgets[index];
  const mainWidget = createWidget(type, options);
  createDemoPanel(mainWidget);
  ui(IdWidgetType).setValue(type);
  ui(IdChangeWidget).setValue(index + 1 + ' / ' + widgets.length);
}

function onChangeWidget(next) {
  if (next) {
    currentWidgetIndex += 1;
  }
  else {
    currentWidgetIndex -= 1;
  }

  if (currentWidgetIndex < 0) {
    currentWidgetIndex = widgets.length - 1;
  }
  else if (currentWidgetIndex >= widgets.length) {
    currentWidgetIndex = 0;
  }

  setWidget(currentWidgetIndex);
}

function onWidgetAction(e) {
  if (e.WidgetId !== IdMainWidget) return;

  const now = new Date().getTime();
  const timeSinceLast = now - lastEventTime;
  const delay = timeSinceLast < 250 ? 250 : 0;
  lastEventTime = now;

  let msg = '';
  if (e.Type) msg += ` Type=${e.Type}`;
  if (e.Value) msg += ` Value=${e.Value}`;
  setTimeout(() => ui(IdTextEvent).setValue(msg), delay);
}

setWidget(0);
ui(IdChangeWidget).onSpinnerClicked(onChangeWidget);
xapi.Event.UserInterface.Extensions.Widget.Action.on(onWidgetAction);
// ui.debug();
