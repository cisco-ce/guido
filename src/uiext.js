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

function Widget(attributes, children) {
  if (!attributes.WidgetId) {
    throw Error('Missing widget id');
  }

  return Node('Widget', attributes, children);
}

function Button(options) {
  const attributes = {
    WidgetId: options.widgetId,
    Type: 'Button',
  };

  if (options.size) {
    attributes.Options = 'size=' + options.size;
  }
  if (options.text) {
    attributes.Name = options.text;
  }

  return Widget(attributes);
}

function GroupButton(options) {
  const { widgetId, buttons, columns } = options;
  const attributes = {
    WidgetId: widgetId,
    Type: 'GroupButton',
  };

  if (columns) {
    attributes.Options = 'columns=' + columns;
  }
  const valueSpace = Object.keys(buttons).map((Key) => {
    return tag('Value', tags({ Key, Name: buttons[Key] }));
  }).join('');
  attributes.ValueSpace = valueSpace;

  return Widget(attributes);
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
  Config, Panel, Page, Row, Button, GroupButton, toXml,
};
