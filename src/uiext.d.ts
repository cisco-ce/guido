declare interface Extensions {
  attributes: ExtensionsAttributes;
  children: Panel[];
}

declare interface ExtensionsAttributes {
  version?: string;
}

declare interface Panel {
  attributes: PanelAttributes;
  children: Page[];
}

declare interface PanelAttributes {
  panelId?: string;
  order?: number;
  type?: 'Home' | 'InCall' | 'StatusBar' | 'Never';
  icon?: string;
  color?: string;
  name?: string;
}

declare interface Page {
  attributes: PageAttributes;
  children: Row[];
}

declare interface PageAttributes {
  pageId?: string;
  name?: string;
  compact?: boolean;
}

declare interface Row {
  attributes: RowAttributes;
  children: Widget[];
}

declare interface RowAttributes {
  text?: string;
}

declare interface Attributes {}

declare interface Widget {
  attributes: Attributes;
}

declare interface WidgetAttributes extends Attributes {
  widgetId: string;
}

declare type WidgetSize = 1 | 2 | 3 | 4;

declare interface ButtonAttributes extends WidgetAttributes {
  text?: string;
  size?: WidgetSize;
}

declare function Extensions(attributes: ExtensionsAttributes, children: Panel | Panel[]) : Extensions;

declare function Panel(attributes: PanelAttributes, children: Page | Page[]) : Panel;

declare function Page(attributes: PageAttributes, children: Row | Row[]) : Page;

declare function Row(attributes: RowAttributes, children: Widget | Widget[]) : Row;

declare function Button(attributes: ButtonAttributes) : Widget;

declare function toXml(extensions: Extensions): string;



