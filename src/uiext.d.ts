/**
 * Library for creating dynamic UI extensions for Cisco Webex Devices in a declarative fashion.
 *
 * This means the developer does need to know or use the xml syntax required by the xAPI commands
 * for adding / changing UI extensions.
 *
 * Example usage:
 * ```
 * const { Config, Panel } = require('uiext');
 * const config = Config({ version: '1.8' }, Panel());
 * ```
 * @module
 */

/**
 * General node for any UI element
 */
declare interface Node {
  type: string;
  attributes?: Object[];
  children?: Node[];
}

interface Widget {
  Type: string;
  WidgetId: string;
}

/** Creates a new UI extension config */
declare function Config(attributes: ConfigAttributes, panels?: Node | Node[]): Node;

declare function Panel(attributes: PanelAttributes, pages?: Node | Node[]): Node;

declare function ActionButton(attributes: PanelAttributes): Node;

declare function WebApp(attributes: WebAppAttributes): Node;

declare function Page(attributes: PageAttributes, rows: Node | Node[]): Node;

declare function Row(attributes: RowAttributes, widgets: Widget | Widget[]): Node;


declare interface ConfigAttributes {
  version?: string;
}

declare interface PanelAttributes {
  panelId?: string;
  type?: 'Home' | 'InCall' | 'StatusBar' | 'Never';
  color?: string;
  icon?: string;
  order?: number;
  name?: string;
}

declare interface WebAppAttributes {
  url: string;
  panelId?: string;
  type?: 'Home' | 'InCall' | 'StatusBar' | 'Never';
  color?: string;
  icon?: string;
  order?: number;
  name?: string;
}

declare interface PageAttributes {
  pageId?: string;
  name?: string;
  hideRowNames?: boolean;
}

declare interface RowAttributes {
  text?: string;
}

declare type WidgetSize = 1 | 2 | 3 | 4;

declare function Button(attributes: {
  widgetId: string;
  text?: string;
  size?: WidgetSize;
  icon?: string;
}): Widget;

declare function GroupButton(attributes: {
  widgetId: string;
  buttons: object;
}): Widget;

declare function Spinner(attributes: {
  widgetId: string;
  size?: WidgetSize;
  style?: 'vertical' | 'horizontal' | 'plusminus';
}): Widget;

declare function Slider(attributes: {
  widgetId: string;
  size?: WidgetSize;
}): Widget;

declare function Spacer(attributes: {
  widgetId: string;
  size?: WidgetSize;
}): Widget;

declare function DirectionalPad(attributes: {
  widgetId: string;
  text?: string;
}): Widget;

declare function Text(attributes: {
  widgetId: string;
  text?: string;
  size?: WidgetSize;
}): Widget;

declare function ToggleButton(attributes: {
  widgetId: string;
}): Widget;
