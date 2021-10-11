/**
 * Inspired by jquery and https://github.com/valgaze/sugar
 */
const xapi = require('xapi');

let debug = false;

/** List of all listeners, indexed by event path and relevant id */
let feedbackListeners = [];

/** Catch all ui event listener */
xapi.Event.UserInterface.on(onUiEvent);

function _addListener(path, conditions, listener) {
  if (typeof listener !== 'function') {
    throw new Error('Listener must be a callback function');
  }
  feedbackListeners.push({ path, conditions, func: listener });

  return () => _removeListener(path, conditions);
}

function _removeListener(path, conditions) {
  feedbackListeners = feedbackListeners.filter(listener => {
    const match = listener.path === path && eventMatchConditions(listener.conditions, conditions);
    return !match;
  })
}

function getNode(path, obj) {
  const first = path.shift();
  if (first && obj[first]) {
    // object matched whole path:
    if (!path.length) {
        return obj[first];
    }

    // match so far, parse further down:
    return getNode(path, obj[first]);
  }
}

function eventMatchConditions(event, conditions) {
  for (const key in conditions) {
    if (conditions[key] !== event[key]) {
      return false;
    }
  }
  return true;
}

function onUiEvent(event) {
  const isLegacyEvent = !!(event.Extensions && event.Extensions.Event);
  // (we dont want to show Extensions.Event.Pressed etc, they are duplicate events for
  // legacy control system such as Crestron)
  if (isLegacyEvent) return;

  if (debug) {
    console.log('UI event:', JSON.stringify(event));
  }

  for (const listener of feedbackListeners) {
    const node = getNode(listener.path.split(' '), event);
    if (node && eventMatchConditions(node, listener.conditions)) {
      listener.func(node);
      break;
    }
  }
}

function ui(id) {
  return {
    onPromptResponse: func => {
      return _addListener('Message Prompt Response', { FeedbackId: id }, e => func(parseInt(e.OptionId) - 1));
    },
    onTextResponse: func => {
      return _addListener('Message TextInput Response', { FeedbackId: id }, e => func(e.Text));
    },
    onPageOpened: func => {
      return _addListener('Extensions Page Action', { PageId: id, Type: 'Opened' }, func);
    },
    onPageClosed: func => {
      return _addListener('Extensions Page Action', { PageId: id, Type: 'Closed' }, func);
    },
    onPanelClicked: func => {
      return _addListener('Extensions Panel Clicked', { PanelId: id }, func);
    },
    onPanelOpened: func => {
      return _addListener('Extensions Panel Open', { PanelId: id }, func);
    },
    onPanelClosed: func => {
      return _addListener('Extensions Panel Close', { PanelId: id }, func);
    },


    // onWidgetClicked: func => {
    //   return _addListener('Extensions Widget Action', { WidgetId: id, Type: 'clicked' }, func);
    // },
    // onWidgetPressed: func => {
    //  return  _addListener('Extensions Widget Action', { WidgetId: id, Type: 'pressed' }, func);
    // },
    // onWidgetReleased: func => {
    //   return _addListener('Extensions Widget Action', { WidgetId: id, Type: 'released' }, func);
    // },
    // onWidgetChanged: func => {
    //  return  _addListener('Extensions Widget Action', { WidgetId: id, Type: 'changed' }, func);
    // },

    onButtonClicked: callback => {
      _addListener('Extensions Widget Action', { WidgetId: id, Type: 'clicked' }, callback);
    },
    onButtonPressed: callback => {
      _addListener('Extensions Widget Action', { WidgetId: id, Type: 'pressed' }, callback);
    },
    onButtonReleased: callback => {
      _addListener('Extensions Widget Action', { WidgetId: id, Type: 'released' }, callback);
    },
    onGroupButtonPressed: callback => {
      _addListener('Extensions Widget Action', { WidgetId: id, Type: 'pressed' },
        e => callback(e.Value));
    },
    onGroupButtonReleased: callback => {
      _addListener('Extensions Widget Action', { WidgetId: id, Type: 'released' },
        e => callback(e.Value));
    },
    onToggleButtonChanged: callback => {
      _addListener('Extensions Widget Action', { WidgetId: id, Type: 'changed' },
        e => callback(e.Value === 'on'));
    },
    onSpinnerClicked: callback => {
      _addListener('Extensions Widget Action', { WidgetId: id, Type: 'clicked' },
        e => callback(e.Value === 'increment'));
    },
    onSpinnerPressed: callback => {
      _addListener('Extensions Widget Action', { WidgetId: id, Type: 'pressed' },
        e => callback(e.Value === 'increment'));
    },
    onSpinnerReleased: callback => {
      _addListener('Extensions Widget Action', { WidgetId: id, Type: 'released' },
        e => callback(e.Value === 'increment'));
    },
    onDirectionalPadClicked: callback => {
      _addListener('Extensions Widget Action', { WidgetId: id, Type: 'clicked' },
        e => callback(e.Value));
    },
    onDirectionalPadPressed: callback => {
      _addListener('Extensions Widget Action', { WidgetId: id, Type: 'pressed' },
        e => callback(e.Value));
    },
    onDirectionalPadReleased: callback => {
      _addListener('Extensions Widget Action', { WidgetId: id, Type: 'released' },
        e => callback(e.Value));
    },

    onSliderChanged: (func, min = 0, max = 255) => {
      return _addListener('Extensions Widget Action', { WidgetId: id, Type: 'changed' }, e => {

        const scaledValue = ui.scale({ min: 0, max: 255 }, { min, max }, e.Value);
        func(scaledValue);
      });
    },

    setValue(Value) {
      return xapi.Command.UserInterface.Extensions.Widget.SetValue({ Value, WidgetId: id });
    },
  };
}

ui.debug = (on = true) => {
  debug = on;
};

ui.webViewOpen = (url, name = '') => {
  return xapi.Command.UserInterface.WebView.Display({ Url: url, Title: name });
};

ui.webViewClose = ()  => {
  return xapi.Command.UserInterface.WebView.Clear();
};

ui.alert = (optionsOrText) => {
  const opts = typeof optionsOrText === 'string'
    ? { Text: optionsOrText, Duration: 10 }
    : optionsOrText;
  return xapi.Command.UserInterface.Message.Alert.Display(opts);
};

ui.alertHide = () => {
  return xapi.Command.UserInterface.Message.Alert.Clear();
};

ui.textInput = (props, callback = null) => {
  if (callback) {
    if (props.FeedbackId)
      ui(props.FeedbackId).onTextResponse(callback);
    else
      throw new Error('You need to provide FeedbackId');
  }
  return xapi.Command.UserInterface.Message.TextInput.Display(props);
};

ui.textInputHide = () => {
  return xapi.Command.UseriInterface.Message.TextInput.Clear();
};

ui.prompt = (props, options, callback = null) => {
  const max = 5;
  if (options.length > max) {
    throw new Error(`Prompt can have max ${max} options`);
  }

  options.forEach((text, i) => {
    props[`Option.${i + 1}`] = text;
  });

  if (callback) {
    if (props.FeedbackId)
      ui(props.FeedbackId).onPromptResponse(callback);
    else
      throw new Error('You need to provide FeedbackId for the prompt');
  }

  return xapi.Command.UserInterface.Message.Prompt.Display(props);
};

ui.promptHide = () => {
  return xapi.Command.UserInterface.Message.Prompt.Clear();
};

ui.textLine = (props) => {
  return xapi.Command.UserInterface.Message.TextLine.Display(props);
};

ui.textLineHide = () => {
  return xapi.Command.UserInterface.Message.TextLine.Clear();
};

ui.panelSave = (PanelId, config) => {
  const xml = config.toString(); // can send string or object with toString repr
  return xapi.Command.UserInterface.Extensions.Panel.Save({ PanelId }, xml);
};

ui.panelRemove = (PanelId) => {
  return xapi.Command.UserInterface.Extensions.Panel.Remove({ PanelId });
};

ui.panelOpen = (PanelId, PageId = '') => {
  return xapi.Command.UserInterface.Extensions.Panel.Open({ PanelId, PageId });
};

ui.panelClose = () => {
  return xapi.Command.UserInterface.Extensions.Panel.Close();
};

ui.webAppOpen = (url, name = '') => {
  return xapi.Command.UserInterface.WebView.Display({ Url: url, Title: name });
};

ui.webAppClose = () => {
  return xapi.Command.UserInterface.WebView.Clear();
};

ui.onUsbKeyPressed = (func) => {
  return _addListener('InputDevice Key Action', { Type: 'Pressed' }, e => func(e.Key, e.Code));
},

ui.onUsbKeyReleased = (func) => {
  return _addListener('InputDevice Key Action', { Type: 'Released' }, e => func(e.Key, e.Code));
},

ui.scale = (from, to, value) => {
  value = Number(value);
  if (isNaN(value)) {
    throw new Error('Scale value must be a number');
  }
  const norm = (value - from.min) / (from.max - from.min); // normalized 0-1
  return to.min + norm * (to.max - to.min);
};

module.exports = ui;
