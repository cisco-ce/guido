declare interface Node {}
declare type Config = Node;
declare type Panel = Node;
declare type Page = Node;
declare type Row = Node;
declare type Widget = Node;

declare function Config(attributes: ConfigAttributes, children?: Panel | Panel[]): Config;

declare function Panel(attributes: PanelAttributes, children?: Page | Page[]): Panel;

declare function Page(attributes: PageAttributes, children: Row | Row[]): Page;

declare function Row(attributes: RowAttributes, children: Widget | Widget[]): Row;


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
