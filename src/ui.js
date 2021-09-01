/**
 * Library for working with RoomOS custom UI.
 * Includes support for both the simple elements (alerts, prompts, etc)
 * and the UI extensions.
 *
 * The main idea is remove the need to know anything about the xAPI.
 * For documentation, see the corresponding typescript file (d.ts) file,
 * or https://github.com/cisco-ce/guido
 */
const xapi = require('xapi');

function panelRemoveAll() {
  return xapi.Command.UserInterface.Extensions.Clear();
}

function panelSave(PanelId, config) {
  const xml = config.toString(); // can send string or object with toString repr
  return xapi.Command.UserInterface.Extensions.Panel.Save({ PanelId }, xml);
}

function panelRemove(PanelId) {
  return xapi.Command.UserInterface.Extensions.Panel.Remove({ PanelId });
}

function panelOpen(PanelId, PageId = '') {
  return xapi.Command.UserInterface.Extensions.Panel.Open({ PanelId, PageId });
}

function panelClose() {
  return xapi.Command.UserInterface.Extensions.Panel.Close();
}

function webAppOpen(url, name = '') {
  return xapi.Command.UserInterface.WebView.Display({ Url: url, Title: name });
}

function webAppClose() {
  return xapi.Command.UserInterface.WebView.Clear();
}

function onPanelClicked(callback, panelId = '') {
  if (typeof callback !== 'function') {
    throw new Error('onWidgetAction: first param needs to be a function');
  }
  xapi.Event.UserInterface.Extensions.Panel.Clicked.on(e => {
    if (panelId && e.PanelId !== panelId) return;
    callback(e);
  });
}

function widgetSetValue(WidgetId, Value) {
  return xapi.Command.UserInterface.Extensions.Widget.SetValue({ Value, WidgetId });
}

function onWidgetAction(callback, action = '', widgetId = '') {
  if (typeof callback !== 'function') {
    throw new Error('onWidgetAction: first param needs to be a function');
  }
  // todo: just one listener in total
  return xapi.Event.UserInterface.Extensions.Widget.Action.on(e => {
    if (action && e.Type !== action) return;
    if (widgetId && e.WidgetId !== widgetId) return;
    callback(e);
})};

const onButtonClicked = (widgetId, callback) => onWidgetAction(callback, 'clicked', widgetId);
const onButtonPressed = (widgetId, callback) => onWidgetAction(callback, 'pressed', widgetId);
const onButtonReleased = (widgetId, callback) => onWidgetAction(callback, 'released', widgetId);
const onToggleButtonChanged = (widgetId, callback) => onWidgetAction(callback, 'changed', widgetId);
const onSliderChanged = onToggleButtonChanged;
const onSliderPressed = onButtonPressed;
const onSliderReleased = onButtonReleased;
const onGroupButtonPressed = onButtonPressed;
const onGroupButtonReleased = onButtonPressed;
const onSpinnerPressed = onButtonPressed;
const onSpinnerReleased = onButtonReleased;
const onSpinnerClicked = onButtonClicked;
const onDirectionalPadPressed = onButtonPressed;
const onDirectionalPadReleased = onButtonReleased;
const onDirectionalPadClicked = onButtonClicked;

function onTextInputResponse(callback, id) {
  xapi.Event.UserInterface.Message.TextInput.Response.on((e) => {
    if (e.FeedbackId === id) {
      callback(e.Text);
    }
  })
}

function onPromptResponse(callback, id) {
  xapi.Event.UserInterface.Message.Prompt.Response.on((e) => {
    if (e.FeedbackId === id) {
      callback(Number(e.OptionId) - 1);
    }
  })
}

function alert(text, title = '', duration = 0) {
  return xapi.Command.UserInterface.Message.Alert.Display
    ({ Duration: duration, Text: text, Title: title});
}

function alertHide() {
  return xapi.Command.UserInterface.Message.Alert.Clear();
}

function textInputShow(props) {
  return xapi.Command.UserInterface.Message.TextInput.Display(props);
}

function textInputHide() {
  return xapi.Command.UseriInterface.Message.TextInput.Clear();
}

function promptShow(props, options) {
  const max = 5;
  if (options.length > max) {
    throw new Error(`Prompt can have max ${max} options`);
  }

  const namedOptions = options.forEach((text, i) => {
    props[`Option.${i + 1}`] = text;
  });

  return xapi.Command.UserInterface.Message.Prompt.Display(props);
}

function promptHide() {
  return xapi.Command.UserInterface.Message.Prompt.Clear();
}

function wallpaperSet(url, halfwakeOnly = true) {
  const type = halfwakeOnly ? 'HalfwakeBackground' : 'Background';
  return xapi.Command.UserInterface.Branding.Fetch({ Type: type, URL: url});
}

function scale(from, to, value) {
if (typeof value !== 'number') {
  throw new Error('Scale value must be a number');
}
const norm = (value - from.min) / (from.max - from.min); // normalized 0-1
return to.min + norm * (to.max - to.min);
}

function subscribe(api, onChanged) {
  api.get().then(onChanged);
  api.on(onChanged);
}

module.exports = {
  alert,
  alertHide,
  textInputShow,
  textInputHide,
  promptShow,
  promptHide,
  wallpaperSet,

  panelRemoveAll,
  panelRemove,
  panelSave,
  panelOpen,
  panelClose,
  widgetSetValue,
  scale,
  subscribe,
  webAppOpen,
  webAppClose,

  onPanelClicked,
  onWidgetAction,
  onButtonClicked,
  onButtonPressed,
  onButtonReleased,
  onToggleButtonChanged,
  onSliderChanged,
  onSliderPressed,
  onSliderReleased,
  onGroupButtonPressed,
  onGroupButtonReleased,
  onSpinnerPressed,
  onSpinnerReleased,
  onSpinnerClicked,
  onDirectionalPadPressed,
  onDirectionalPadReleased,
  onDirectionalPadClicked,
  onTextInputResponse,
  onPromptResponse,
};