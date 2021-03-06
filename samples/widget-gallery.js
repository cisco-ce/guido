const ui = require('./ui');
const builder = require('./ui-builder');

const IdChangeWidget = 'choose-widget';
const IdPanel = 'widget-gallery';
const IdWidgetType = 'widget-type';
const IdTextEvent = 'widget-event-text';

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
    options: { buttons: { first: 'Alt 1', second: 'Alt 2', third: 'Alt 3' }},
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
    Panel({ panelId: IdPanel, color: '#D541D8', name: 'Widget Gallery', icon: 'Blinds', order: -1 }, [
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
  const msg = mainWidget.attributes.Type === 'Text'
    ? '(No event for text widgets)'
    : '(Interact with widget to see events)';
  ui(IdTextEvent).setValue(msg);
}

function createWidget(type, props) {
  const attrs = Object.assign({ widgetId: 'Example' + type }, props);
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

function setEventText(type, value) {

  const now = new Date().getTime();
  const timeSinceLast = now - lastEventTime;
  const delay = timeSinceLast < 250 ? 250 : 0;
  lastEventTime = now;

  const msg = [type, value].filter(i => i).join(', ');
  setTimeout(() => ui(IdTextEvent).setValue(msg), delay);
}

function init() {
  setWidget(0);
  ui(IdChangeWidget).onSpinnerClicked(onChangeWidget);
  ui.panelOpen(IdPanel);

  // create event listener for each widget type
  ui('ExampleButton').onButtonPressed(() => setEventText('Button pressed'));
  ui('ExampleButton').onButtonReleased(() => setEventText('Button released'));
  ui('ExampleButton').onButtonClicked(() => setEventText('Button clicked'));

  ui('ExampleSpinner').onSpinnerClicked((up) => setEventText('Spinner clicked', up ? 'Up' : 'Down'));
  ui('ExampleSpinner').onSpinnerPressed((up) => setEventText('Spinner pressed', up ? 'Up' : 'Down'));
  ui('ExampleSpinner').onSpinnerReleased((up) => setEventText('Spinner released', up ? 'Up' : 'Down'));

  ui('ExampleGroupButton').onGroupButtonPressed((button) => setEventText('Group button pressed', 'Button: ' + button));
  ui('ExampleGroupButton').onGroupButtonReleased((button) => setEventText('Group button released', 'Button: ' + button));

  ui('ExampleToggleButton').onToggleButtonChanged((active) => setEventText('Toggle changed', active ? 'Active' : 'Inactive'));

  ui('ExampleSlider').onSliderChanged((val) => setEventText('Slider changed', val.toFixed(1) + '%'), 0, 100);

  ui('ExampleDirectionalPad').onDirectionalPadClicked(btn => setEventText('Directional pad clicked', 'Button: ' + btn));
  ui('ExampleDirectionalPad').onDirectionalPadPressed(btn => setEventText('Directional pad pressed', 'Button: ' + btn));
  ui('ExampleDirectionalPad').onDirectionalPadReleased(btn => setEventText('Directional pad released', 'Button: ' + btn));

  ui('ExampleIconButton').onButtonPressed(() => setEventText('Icon button pressed'));
  ui('ExampleIconButton').onButtonReleased(() => setEventText('Icon button released'));
  ui('ExampleIconButton').onButtonClicked(() => setEventText('Icon button clicked'));
}

init();
