const gui = require('./gui');
const uiext = require('./uiext');

const IdChangeWidget = 'choose-widget';
const IdPanel = 'widget-gallery';

let currentWidgetIndex = 0;

// action button: quick dial, go to half wake, toggle self view.
const widgets = [
  {
    type: 'Button',
    options: { size: 3, text: 'Simple push button' },
    info: 'For simple state-less actions',
  },
  {
    type: 'Spinner',
    options: { size: 3 },
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
    type: 'Text',
    options: { text: 'Pure text widget' },
    info: 'Display info text, or show dynamic values',
  },
  {
    type: 'IconButton',
    options: { icon: 'power' },
    info: 'Small toggle-able icon button for menus etc',
  },
];

function createDemoPanel(mainWidget) {
  const { Config, Panel, Page, Row, Spinner } = uiext;
  const config = Config({ version: '1.7' },
    Panel({ panelId: IdPanel, color: '#D541D8', name: 'Widget Gallery', icon: 'Blinds' }, [
      Page({ pageId: 'widget-gallery', name: 'Widget gallery', hideRowNames: true }, [
        Row({}, Spinner({ widgetId: IdChangeWidget, size: 4, style: 'horizontal' })),
        Row({}, mainWidget),
      ]),
    ])
  );

  const xml = uiext.toXml(config);
  // console.log(xml);

  // TODO
  gui.panelSave(IdPanel, xml);
}

function createWidget(type, props) {
  const attrs = Object.assign({ widgetId: 'main-widget' }, props);
  return uiext[type](attrs);
}

function setWidget(index) {
  const { type, options } = widgets[index];
  const mainWidget = createWidget(type, options);
  createDemoPanel(mainWidget);

  // TODO
  gui.widgetSetValue(IdChangeWidget, `Widget: ${type}`);
}

function onChangeWidget(e) {
  if (e.Value === 'increment') {
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

setWidget(0);
gui.onWidgetAction(onChangeWidget, 'clicked', IdChangeWidget);

