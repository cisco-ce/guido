const LatestVersion = '1.8';

const LegalWidgetAttributes = {
  Button: ['size', 'text', 'icon'],
  GroupButton: ['buttons'],
  Text: ['text'],
  Slider: ['size'],
  Spacer: ['size'],
  Text: ['text', 'size'],
  GroupButton: ['columns', 'buttons'],
};

function Node(type, attributes, children = []) {
  const c = Array.isArray(children) ? children : [children];
  return {
    type, attributes, children: c,
  }
}

function Config(options, children) {
  const attributes = {
    Version: options.version || LatestVersion,
  };

  return Node('Extensions', attributes, children);
}

function Panel(options, pages) {
  const attributes = {};
  const { panelId, name, color } = options;
  if (panelId) {
    attributes.PanelId = panelId;
  }
  if (name) {
    attributes.Name = name;
  }
  if (color) {
    attributes.Color = color;
  }

  return Node('Panel', attributes, pages);
}

function Page(options, pages) {
  const attributes = {};
  if (options.name) {
    attributes.Name = options.name;
  }
  if (options.hideRowNames) {
    attributes.HideRowNames = 1; // TODO verify
  }
  if (options.pageId) {
    attributes.PageId = options.pageId;
  }

  return Node('Page', attributes, pages);
}

function Row(options, widgets) {
  const attributes = {};
  if (options.text) {
    attributes.Name = options.text;
  }

  return Node('Row', attributes, widgets);
}

function Widget(type, options) {
  const { widgetId, size, text, buttons, icon, columns } = options;
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

  let options = [];

  if (text) {
    attributes.Name = text;
  }

  if (buttons) {
    const valueSpace = Object.keys(buttons).map((Key) => {
      return tag('Value', tags({ Key, Name: buttons[Key] }));
    }).join('');
    attributes.ValueSpace = valueSpace;
  }

  if (size) {
    options.push('size=' + size);
  }

  if (columns) {
    options.push('columns=' + columns);
  }

  if (icon) {
    options.push('icon=' + icon);
  }

  if (options.length) {
    attributes.Options = options.join(';');
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
