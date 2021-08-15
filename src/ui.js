/**
 * Library for working with RoomOS custom UI.
 * Includes support for both the simple elements (alerts, prompts, etc)
 * and the UI extensions.
 *
 * The main idea is remove the need to know anything about the xAPI.
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

 function alert(text, title = '', duration = 0) {
   return xapi.Command.UserInterface.Message.Alert.Display
     ({ Duration: duration, Text: text, Title: title});
 }

 function alertHide() {
   return xapi.Command.UserInterface.Message.Alert.Clear();
 }

 /**
 * Transforms a value btw two coordinate systems. Typically useful for sliders
 *
 * Example:
 * scale({ min: 0, max: 100 }, { min: 0, max: 255 }, 10) => 25.5
 * */
  function scale(from, to, value) {
    if (typeof value !== 'number') {
      throw new Error('Scale value must be a number');
    }
    const norm = (value - from.min) / (from.max - from.min); // normalized 0-1
    return to.min + norm * (to.max - to.min);
  }

 module.exports = {
   alert,
   alertHide,
   panelRemoveAll,
   panelRemove,
   panelSave,
   widgetSetValue,
   onWidgetAction,
   onPanelClicked,
   scale,
 };