/**
 * Library for creaing UI extensions dynamically.
 *
 * Basically creates components with simple commands and transforms to XML
 *
 * TODO:
 * support for full bundle
 * document example
 */
 const LatestVersion = '1.8';

 class Node {
   constructor(type, attributes, children) {
     this.type = type;
     this.attributes = attributes || {};
     this.children = children || [];
   }
  }

//  validate() {
//   // todo may want to check attributes too
//   const { type, children } = this;
//   const allowed = validChildren[type];
//   const invalid = allowed && children.find(c => c.type !== validChildren[type]);

//   return !invalid;
// }

 const validChildren = {
   Extensions: 'Panel',
   Panel: 'Page',
   Page: 'Row',
   Row: 'Widget',
   Widget: '',
 };


 function node(type, attributes = {}, children = []) {
   const node = new Node(type, attributes, children);
   if (!node.validate()) {
     throw new Error(`Node '${type}' only accepts ${validChildren[type]} as children`);
   }

   return node;
 }

 function Extensions(attributes, panels) {
   return node('Extensions', attributes, panels);
 }

 function Panel(attributes = {}, pages) {
   if (!attributes.Type) {
     attributes.Type = 'Home';
   }
   attributes.ActivityType = 'Custom';

   return node('Panel', attributes, pages);
 }

 function ActionButton(attributes = {}) {
   if (!attributes.Type) {
     attributes.Type = 'Home';
   }
   attributes.ActivityType = 'Custom';

   return node('Panel', attributes);
 }

 function WebApp(attributes = {}, url) {
   attributes.ActivityType = 'WebApp';
   attributes.ActivityData = url;

   return node('Panel', attributes);
 }

 function Page(attributes, rows) {
   return node('Page', attributes, rows);
 }

 function Row(attributes, widgets) {
   return node('Row', attributes, widgets);
 }

 function Widget(type, attributes = {}, options) {
   attributes.Type = type;
   const opt = options && Object.keys(options).map(k => `${k}=${options[k]}`).join(';');
   if (opt) {
     attributes.Options = opt;
   }

   return node('Widget', attributes);
 }

 const ToggleButton = (attr, opt) => Widget('ToggleButton', attr, opt);
 const Slider = (attr, opt) => Widget('Slider', attr, opt);
 const Button = (attr, opt) => Widget('Button', attr, opt);
 const Spinner = (attr, opt) => Widget('Spinner', attr, opt);
 const Text = (attr, opt) => Widget('Text', attr, opt);
 const DirectionalPad = (attr, opt) => Widget('DirectionalPad', attr, opt);
 const Spacer = (attr, opt) => Widget('Spacer', attr, opt);
 const IconButton = (attr, icon) => Widget('Button', attr, { size: 1, icon });

 // treat this one especially
 const GroupButton = (attributes, buttons, columns = 4) => {
   const ValueSpace = Object.keys(buttons).map((Key) => {
     return tag('Value', tags({ Key, Name: buttons[Key] }));
   }).join('');
   attributes.ValueSpace = ValueSpace;

   return Widget('GroupButton', attributes, { columns });
 };

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


 module.exports = { toXml,
   Extensions, ActionButton, WebApp, Panel, Page, Row,
   ToggleButton, Slider, Button, Spinner, GroupButton, Text, DirectionalPad, Spacer, IconButton,
  };
