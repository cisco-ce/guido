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
 * General node in the ui tree, eg panel, page, widget, ...
 *
 * Should be considered abstract, use the helper funtions (Panel(), Page(), ...) to create actual
 * nodes. Upon creation, the node verifies that it only contains valid attributes and children
 * for its given type.
 */
declare interface Node {
  /** Panel, Page, ... */
  type: string;
  attributes?: Object[];
  children?: Node[];
}

/**
 * Specific node type that is parent of all widgets. Like Node, should be considered abstract. Use
 * helper functions (ToggleButton(), Slider(), ...) to create actual widget nodes.
 * A widget id is required for all widgets
 */
declare interface Widget extends Node {
  type: string;
  widgetId: string;
}

/**
 * Converts any node (and all children) to the XML format that the xAPI commands expect
 * Typically you always want to do this on the config object only.
 */
declare function toXml(node: Node): string;

/**
 * Creates a new UI extension config. This is the top level node, and the one that you
 * must use when saving an extension to the video device
 */
declare function Config(attributes?: ConfigAttributes, panels?: Node | Node[]): Node;

/**
 * A can contain custom userinterfaces with pages, rows and widgets.
 */
declare function Panel(attributes: PanelAttributes, pages?: Node | Node[]): Node;

/**
 * An action button is located on the home screen and can be programmed to do an action when the user presses it. Unlike a panel (button), it does not open anything when pressed.
 */
declare function ActionButton(attributes: PanelAttributes): Node;

/**
 * A web app is basically a url shortcut that can open a full screen web page on the device.
 *
 * The web page is opened when the user presses the shortcut.
 */
declare function WebApp(attributes: WebAppAttributes): Node;

/**
 * A page is contained in a panel and can contain multiple rows.
 */
declare function Page(attributes: PageAttributes, rows: Node | Node[]): Node;

/**
 * A row is contained in a page, and can contain multiple widgets. The widgets are laid of horizontally. Each row contains 4 columns, if the widgets take up more than that they will wrap to the next line (but same row).
 */
declare function Row(attributes: RowAttributes, widgets: Widget | Widget[]): Node;

declare interface ConfigAttributes {
  /** The ux extensions version (1.4, 1.6. etc). Omit it and the lib will pick the newest one */
  version?: string;
}

declare type Availability = 'Home' | 'InCall' | 'StatusBar' | 'Never';

declare interface PanelAttributes {
  panelId?: string;
  /**
   * Where the button for opening the panel is available
   * * Home screen only
   * * InCall: in-call only
   * * StatusBar: Both
   * * Never: hidden (open programatically only)
   */
  type?: Availability;
  color?: string;
  icon?: PanelIcon;
  order?: number;
  name?: string;
}

/**
 * Color can be specified as name (blue, pink, ...), on hexidecimal format (#aa00cc) or alpha hex (#33ffffff, transparent white)
 */
declare type Color = string;

declare interface WebAppAttributes {
  /** The url (internal or external) that you want to show. If no icon is specified, the web page's favicon is used as icon */
  url: string;
  panelId?: string;
  type?: Availability
  /** Icon URL to an external image/icon to show on the home page instead of the favicon */
  icon?: string;
  order?: number;
  /** The button name that appears on home screen etc */
  name?: string;
}

// list = Array.from(document.querySelectorAll('.icon-button'))
// list.map(b => b.classList[1].replace('icon-', '')).sort((i1, i2) => i1 < i2 ? -1 : 1).join('|')
declare type PanelIcon = 'Blinds|Briefing|Camera|Concierge|Disc|Handset|Help|Helpdesk|Home|Hvac|Info|Input|Language|Laptop|Lightbulb|Media|Microphone|Power|Proximity|Record|Sliders|Tv';

declare type ButtonIcon = 'arrow_down|arrow_left|arrow_right|arrow_up|audio_minus|audio_plus|back|blue|eject|end|fast_bw|fast_fw|green|help|home|list|mic|mic_muted|minus|pause|phone|play|play_pause|plus|plus|power|record|red|skip_bw|skip_fw|speaker|speaker_muted|stop|video|video_muted|volume_muted|yellow|zoom_in|zoom_out';

/**
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

/** Number of columns that the widget taks up. Each row has maximum 4 columns. */
declare type WidgetSize = 1 | 2 | 3 | 4;

/** A simple push button. */
declare function Button(attributes: {
  widgetId: string;
  text?: string;
  size?: WidgetSize;
  icon?: ButtonIcon;
}): Widget;

/**
 * Create group button, where the user can select one of several choices
 * You can programatically select which button is selected by setting the widget value.
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

/** A widget that lefts the user select next/previous or up/down. You can programatically update the text in the middle of the spinner by setting the widget value */
declare function Spinner(attributes: {
  widgetId: string;
  size?: WidgetSize;
  style?: 'vertical' | 'horizontal' | 'plusminus';
}): Widget;

/** A slider / scrollbar. The range is fixed from 0-255, you might need to map this to your own scale. See the ui lib for a handy scale function. You can programatically set the scroll position by setting the widget value. */
declare function Slider(attributes: {
  widgetId: string;
  size?: WidgetSize;
}): Widget;

/** An invisible widget that takes up space, so you can create custom layouts with gaps if you need it. */
declare function Spacer(attributes: {
  widgetId: string;
  size?: WidgetSize;
}): Widget;

/**
 * A 4-way directional pad + center button. The text of the center button can be specified.
 */
declare function DirectionalPad(attributes: {
  widgetId: string;
  text?: string;
}): Widget;

/** A simple text label. Change the text by setting the value of the widget. */
declare function Text(attributes: {
  widgetId: string;
  text?: string;
  size?: WidgetSize;
  fontSize?: 'small' | 'normal';
  align?: '' | '' | '';
}): Widget;

/**
 * An on/off mode button. You can programatically set the mode by setting widget value to 'on' or 'off'.
 */
declare function ToggleButton(attributes: {
  widgetId: string;
}): Widget;
