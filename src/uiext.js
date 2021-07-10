const LatestVersion = '1.8';

const LegalChildren = {
  Extensions: 'Panel',
  Panel: 'Page',
  Page: 'Row',
  Row: 'Widget',
};

const LegalAttributes = {
  Config: ['version'],
  Panel: ['panelId', 'type', 'color', 'icon', 'order', 'name', 'url'],
  Page: ['pageId', 'hideRowNames', 'name'],
  Row: ['text'],
}

const LegalWidgetAttributes = {
  Button: ['size', 'text', 'icon'],
  Spinner: ['size', 'style'],
  Slider: ['size'],
  Spacer: ['size'],
  DirectionalPad: ['text'],
  ToggleButton: [],
  Text: ['text', 'size'],
  GroupButton: ['columns', 'buttons'],
};

// panel icons:
// ["video", "Blinds", "Briefing", "Camera", "Concierge", "Disc", "Handset", "Help", "Helpdesk", "Home", "Hvac", "Info", "Input", "Language", "Laptop", "Lightbulb", "Media", "Microphone", "Power", "Proximity", "Record", "Sliders", "Tv", "Spark", "Webex"]

// button icons:
// ["video", "home", "play_pause", "list", "end", "arrow_down", "arrow_up", "arrow_left", "arrow_right", "fast_bw", "skip_bw", "skip_fw", "fast_fw", "video", "video_muted", "mic", "mic_muted", "play", "pause", "stop", "record", "audio_minus", "audio_plus", "speaker", "speaker_muted", "red", "green", "blue", "yellow", "plus", "minus", "zoom_in", "zoom_out", "phone", "volume_muted", "back", "eject", "power", "help", "webex_meetings", "webex_teams"]



function Node(type, attributes, children = []) {
  const c = Array.isArray(children) ? children : [children];
  const invalid = c.find(i => i.type !== LegalChildren[type]);
  if (invalid) {
    throw new Error(`${type} cannot have child of type ${invalid.type}`);
  }
  return {
    type, attributes, children: c,
  }
}

function validate(type, options) {
  Object.keys(options).forEach(option => {
    if (!LegalAttributes[type].includes(option)) {
      throw new Error(`${type} does not support attribute ${option}`);
    }
  });
}

function Config(options, children) {
  validate('Config', options);
  const attributes = {
    Version: options.version || LatestVersion,
  };

  return Node('Extensions', attributes, children);
}

function Panel(options, pages) {
  validate('Panel', options);
  const attributes = {};
  const { panelId, name, color, order, icon, type } = options;

  attributes.Type = type || 'Home';
  if (panelId) {
    attributes.PanelId = panelId;
  }
  if (name) {
    attributes.Name = name;
  }
  if (order) {
    attributes.Order = order;
  }
  if (icon) {
    attributes.Icon = icon;
  }
  if (color) {
    attributes.Color = color;
  }

  return Node('Panel', attributes, pages);
}


function ActionButton(options = {}) {
  const panel = Panel(options);
  panel.attributes.ActivityType = 'Custom';

  return panel;
}

function WebApp(options) {
  const panel = Panel(options);
  panel.attributes.ActivityType = 'WebApp';
  panel.attributes.ActivityData = options.url;

  return panel;
}

function Page(options, pages) {
  validate('Page', options);
  const attributes = {};
  if (options.name) {
    attributes.Name = options.name;
  }
  if (options.hideRowNames) {
    attributes.Options = 'hideRowNames=1';
  }
  if (options.pageId) {
    attributes.PageId = options.pageId;
  }

  return Node('Page', attributes, pages);
}

function Row(options = {}, widgets = []) {
  validate('Row', options);
  const attributes = {};
  if (options.text) {
    attributes.Name = options.text;
  }

  return Node('Row', attributes, widgets);
}

function Widget(type, options) {
  const { widgetId, size, text, name, buttons, icon, columns, style, fontSize, align } = options;
  if (!widgetId) {
    throw Error('Missing widget id');
  }
  const attributes = {
    Type: type,
    WidgetId: widgetId,
  };

  const legal = LegalWidgetAttributes[type];
  Object.keys(options).forEach((key) => {
    if (key !== 'widgetId') {
      // console.log('check', type, key);
      if (!legal.includes(key)) {
        throw(new Error(`${type} does not support option '${key}'`));
      }
    }
  });

  if (text || name) {
    attributes.Name = text || name;
  }

  if (buttons) {
    const valueSpace = Object.keys(buttons).map((Key) => {
      return tag('Value', tags({ Key, Name: buttons[Key] }));
    }).join('');
    attributes.ValueSpace = valueSpace;
  }

  let opts = [];

  if (size) {
    opts.push('size=' + size);
  }

  if (columns) {
    opts.push('columns=' + columns);
  }

  if (icon) {
    opts.push('icon=' + icon);
  }

  if (style) {
    opts.push('style=' + style);
  }

  if (fontSize) {
    opts.push('fontSize=' + fontSize);
  }

  if (align) {
    opts.push('align=' + align);
  }

  if (opts.length) {
    attributes.Options = opts.join(';');
  }

  return Node('Widget', attributes);
}

const ToggleButton = (options) => Widget('ToggleButton', options);

const Slider = (options) => Widget('Slider', options);

const Button = (options) => Widget('Button', options);

const GroupButton = (options) => Widget('GroupButton', options);

const Spacer = (options) => Widget('Spacer', options);

const Spinner = (options) => Widget('Spinner', options);

const DirectionalPad = (options) => Widget('DirectionalPad', options);

const IconButton = (options) => Widget('Button', Object.assign(options, { size: 1 }));

const Text = (options) => Widget('Text', options);

function tag(name, content) {
  if (Array.isArray(content)) {
    return content.map(el => tag(name, el)).join('');
  }

  return `<${name}>${content}</${name}>`;
}

function tags(elements) {
  return Object.keys(elements).map(key => tag(key, elements[key])).join('');
}

function prettifyXml(xml, tab = '  ') {
  let formatted = '', indent= '';
  xml.split(/>\s*</).forEach(function(node) {
      if (node.match( /^\/\w/ )) {
        indent = indent.substring(tab.length); // decrease indent
      }
      formatted += indent + '<' + node + '>\r\n';
      if (node.match( /^<?\w[^>]*[^\/]$/ )) {
        indent += tab; // increase indent
      }
  });

  return formatted.substring(1, formatted.length - 3);
}

function toXml(json, prettify = true) {
  if (!json) {
    throw new Error('Empty document');
  }
  const content = tags(json.attributes);
  const children = json.children
    .map(child => toXml(child, false))
    .join('');

  const xml = tag(json.type, content + children);

  return prettify ? prettifyXml(xml) : xml;
}

module.exports = {
  Config,
  Panel,
  ActionButton,
  WebApp,
  Page,
  Row,
  Button,
  Slider,
  Spacer,
  IconButton,
  Spinner,
  DirectionalPad,
  Text,
  GroupButton,
  ToggleButton,
  toXml,
};
