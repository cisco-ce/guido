/**
 * Library for creating dynamic UI extensions for Cisco Webex Devices.
 *
 * This means you don't need to know or deal with the XML syntax for UI extensions.
 *
 * An extension (ui panel, action button or web app) is typically constructed by creating a
 * tree of nodes. A node can be a panel, a page, a row, a slider etc. A node has attributes
 * (type, name, color, text, ...), and most nodes types can also have child nodes.
 *
 * The library will validate the attributes (a slider cannot have a name) and the children type
 * (eg a row can only be added to a page, not a panel).
 *
 * Each node type has, for convenience, a method that creates this node. Eg this is how we construct
 * a page with two empty rows:
 * ```
 * const { Page, Row } = require('./ui-builder');
 * const attributes = { name: 'My page', pageId: 'mypage' };
 * const children = [Row(), Row()];
 * const page = Page(attributes, children);
 *
 * // or for short:
 * const page = Page({ name: 'My page', pageId: 'mypage' }, [Row(), Row()]);
 * ```
 *
 * To save an extension to the video device, a panel / action button / web app must also be wrapped in a Config object. Here are 3 full examples:
 *
 * <img src="media://homescreen.png">
 * <i>The 3 extensions supported: Action button, panel and web app</i>
 *
 * ## Example - Create an action button:
 *
 * ```
 * const ui = require('./ui');
 * const { Config, ActionButton } = require('./ui-builder');
 *
 * // Create an action button for calling helpdesk
 * const actionButton = Config({}, [
 *   ActionButton({
 *    name: 'HelpDesk', panelId: 'helpdesk', icon: 'Helpdesk', color: '#003399',
 *   })
 * ]);
 * ui.panelSave('helpdesk', actionButton);
 * ```
 *
 * ## Example - Create a panel:
 *
 * ```
 * const ui = require('./ui');
 * const {
 *   Config, Panel, Page, Row, ToggleButton, Slider, GroupButton
 * } = require('./ui-builder');
 *
 * // Create a panel for controlling lights in the room
 * const panel = Config({}, [
 *   Panel({ name: 'Lights', icon: 'Lightbulb', color: 'orange' }, [
 *     Page({ name: 'Lights' }, [
 *       Row({ text: 'Main lights' }, [
 *         Slider({ widgetId: 'lights-toggle' }),
 *         ToggleButton({ widgetId: 'lights-slider' }),
 *      ]),
 *      Row({ text: 'Color' }, [
 *        GroupButton({
 *          widgetId: 'lights-colors',
 *          buttons: { warm: 'Warm', medium: 'Medium', cold: 'Cold' },
 *        })
 *      ])
 *    ]),
 *  ])
 *]);
 *
 *  ui.panelSave('lights', panel);
 *
 * // The node structure:
 * // Config
 * //   Panel
 * //     Page
 * //       Row
 * //         Slider
 * //         ToggleButton
 * //       Row
 * //         GroupButton
 * ```
 *
 * <img src="media://panel.png">
 * <i>Result of running the code above</i>
 *
 * ## Example - create a web app:
 *
 * ```
 * const ui = require('./ui');
 * const { Config, WebApp } = require('./ui-builder');
 *
 * // Create a web app link to YouTube
 * const webApp = Config({}, WebApp({ name: 'YouTube', url: 'https://youtube.com' }));
 * ui.panelSave('youtube', webApp);
 *
 * ```
 *
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

declare interface Widget extends Node {
  Type: string;
  WidgetId: string;
}

/**
 * Converts any node (and all children) to the XML format that the xAPI commands expect
 * Typically you always want to do this on the config object only.
 */
declare function toXml(node: Node): string;

/** Creates a new UI extension config */
declare function Config(attributes?: ConfigAttributes, panels?: Node | Node[]): Node;

declare function Panel(attributes: PanelAttributes, pages?: Node | Node[]): Node;

declare function ActionButton(attributes: PanelAttributes): Node;

declare function WebApp(attributes: WebAppAttributes): Node;

declare function Page(attributes: PageAttributes, rows: Node | Node[]): Node;

declare function Row(attributes: RowAttributes, widgets: Widget | Widget[]): Node;

declare interface ConfigAttributes {
  /** 1.4, 1.6. etc. Omit it and the lib will pick the newest one */
  version?: string;
}

declare interface PanelAttributes {
  panelId?: string;
  /**
   * Where the button for opening the panel is available
   * * Home screen only
   * * InCall: in-call only
   * * StatusBar: Both
   * * Never: hidden (open with xAPI)
   */
  type?: 'Home' | 'InCall' | 'StatusBar' | 'Never';
  color?: string;
  icon?: PanelIcon;
  order?: number;
  name?: string;
}

/**
 * Color can be specified as name (blue, pink, ...), on hexidecimal format (#aa00cc) or RGB (rgb(128, 132, 199))
 */
declare type Color = string;

declare interface WebAppAttributes {
  url: string;
  panelId?: string;
  type?: 'Home' | 'InCall' | 'StatusBar' | 'Never';
  color?: Color;
  icon?: string;
  order?: number;
  name?: string;
}

// list = Array.from(document.querySelectorAll('.icon-button'))
// list.map(b => b.classList[1].replace('icon-', '')).sort((i1, i2) => i1 < i2 ? -1 : 1).join('|')
declare type PanelIcon = 'Blinds|Briefing|Camera|Concierge|Disc|Handset|Help|Helpdesk|Home|Hvac|Info|Input|Language|Laptop|Lightbulb|Media|Microphone|Power|Proximity|Record|Sliders|Tv';

declare type ButtonIcon = 'arrow_down|arrow_left|arrow_right|arrow_up|audio_minus|audio_plus|back|blue|eject|end|fast_bw|fast_fw|green|help|home|list|mic|mic_muted|minus|pause|phone|play|play_pause|plus|plus|power|record|red|skip_bw|skip_fw|speaker|speaker_muted|stop|video|video_muted|volume_muted|yellow|zoom_in|zoom_out';

/**
 * Pages can be inside panels.
 * @param hideRowNames Hide the name rows on the left if you want to make the page more compact
 */
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
  icon?: ButtonIcon;
}): Widget;

/**
 * Create group button, where the user can select one of several choices
 * Example:
 * ```
 * const group = GroupButton({
 *   widgetId: 'my-colors',
 *   button: {
 *     green: 'Green',
 *     red: 'Red',
 *     blue: 'Blue',
 *   }
 * })
 * ```
 */
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
  fontSize?: 'small' | 'normal';
  align?: '' | '' | '';
}): Widget;

declare function ToggleButton(attributes: {
  widgetId: string;
}): Widget;
