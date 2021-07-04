const LatestVersion = '1.8';

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
  if (options.panelId) {
    attributes.PanelId = options.panelId;
  }
  if (options.name) {
    attributes.Name = options.name;
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
  const { widgetId, size, text, buttons, columns } = options;
  if (!widgetId) {
    throw Error('Missing widget id');
  }
  const attributes = {
    Type: type,
    WidgetId: widgetId,
  };

  if (options.size) {
    attributes.Options = 'size=' + size;
  }

  if (options.text) {
    attributes.Name = options.text;
  }

  if (columns) {
    attributes.Options = 'columns=' + columns; // TODO support multiple Options
  }

  if (options.buttons) {
    const valueSpace = Object.keys(buttons).map((Key) => {
      return tag('Value', tags({ Key, Name: buttons[Key] }));
    }).join('');
    attributes.ValueSpace = valueSpace;
  }

  return Node('Widget', attributes);
}

function ToggleButton(options) {
  return Widget('ToggleButton', options);
}

function Slider(options) {
  return Widget('Slider', options);
}

function Button(options) {
  return Widget('Button', options);
}

function GroupButton(options) {
  return Widget('GroupButton', options);
}

function tag(name, content) {
  if (Array.isArray(content)) {
    return content.map(el => tag(name, el)).join('');
  }

  return `<${name}>${content}</${name}>`;
}

function tags(elements) {
  return Object.keys(elements).map(key => tag(key, elements[key])).join('');
}

function formatXml(xml, tab = '  ') {
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

function toXml(json, format = true) {
  if (!json) {
    throw new Error('Empty document');
  }
  const content = tags(json.attributes);
  const children = json.children
    .map(child => toXml(child, false))
    .join('');

  const xml = tag(json.type, content + children);

  return format ? formatXml(xml) : xml;
}

module.exports = {
  Config,
  Panel,
  Page,
  Row,
  Button,
  Slider,
  GroupButton,
  ToggleButton,
  toXml,
};
