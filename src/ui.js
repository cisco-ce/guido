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
  return xapi.Command.UserInterface.Extensions.Panel.Save({ PanelId }, config);
}

function panelRemove(PanelId) {
  return xapi.Command.UserInterface.Extensions.Panel.Remove({ PanelId });
}

function onPanelClicked(callback, panelId = '') {
  xapi.UserInterface.Extensions.Panel.Clicked.on(e => {
    if (panelId && e.PanelId !== panelId) return;
    callback(e);
  });
}

function widgetSetValue(WidgetId, Value) {
  return xapi.Command.UserInterface.Extensions.Widget.SetValue({ Value, WidgetId });
}

function onWidgetAction(callback, action = '', widgetId = '') {
  // todo: just one listener in total
return xapi.Event.UserInterface.Extensions.Widget.Action.on(e => {
    if (action && e.Type !== action) return;
    if (widgetId && e.WidgetId !== widgetId) return;
    callback(e);
  });
 }

const onButtonClicked = (widgetId, callback) => onWidget(callback, 'Clicked', widgetId);
const onButtonPressed = (widgetId, callback) => onWidget(callback, 'Pressed', widgetId);
const onButtonReleased = (widgetId, callback) => onWidget(callback, 'Released', widgetId);


function alert(text, title = '', duration = 0) {
  return xapi.Command.UserInterface.Message.Alert.Display
    ({ Duration: duration, Text: text, Title: title});
}

function alertHide() {
  return xapi.Command.UserInterface.Message.Alert.Clear();
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
  panelRemoveAll,
  panelRemove,
  panelSave,
  widgetSetValue,
  scale,
  subscribe,
  onWidgetAction,
  onPanelClicked,
  onButtonClicked,
  onButtonPressed,
  onButtonReleased,
};