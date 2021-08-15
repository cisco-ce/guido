/**
 * Thin wrapper for most xAPI user interface commands.
 *
 * This means you don't need to use the long xAPI commands yourself.
 *
 * @module
 */

declare type Xml = string;
declare type XapiResult = Promise<{ result: string }>;

/**
 * Removes all 'panels' on the device (that also includes web apps and action buttons) */
declare function panelRemoveAll() : XapiResult;

/**
 * Save a panel to the device. The panel is specified is used, any panel id inside the xml is ignored. Any existing panel with the same panel will be overriden, so this is also a method to edit panels dynamically.
 */
declare function panelSave(panelId: string, config: Xml) : XapiResult;

/**
 * Remove a panel (or web app or action button) with the given id from
 * the device
 * @param panelId
 */
declare function panelRemove(panelId: string) : XapiResult;

/**
 * Event listener for when a panel (or web app or action button) is clicked.
 * @param callback The callback will receive the click event
 * @param panelId
 */
declare function onPanelClicked(callback: Function, panelId?: string): void;

/**
 * Event listener for when a widget action occurs. This is typically
 * when a user interacts with a widget, such as pressing a button,
 * moving a slider, toggling a switch.
 *
 * This method may either be used as a firehose:
 *
 * ```
 * gui.onWidgetAction(e => console.log('any event:', e));
 * ```
 *
 * Or for a specific action for a specific widget:
 * ```
 * gui.onWidgetAction(resetClicked, 'click', 'resetButton')
 * ```
 *
 * @param callback Your callback will receive the widget event
 * @param action Specifhy the vent you are interested in. If falsy, any action will apply
 * @param widgetId Specify the widget you are interested in. If falsy, any widget will apply
 */
declare function onWidgetAction(callback: Function, action?: string, widgetId?: string) : void;

/**
 * Sets the value for a widget. This has different meanings for different widgets, eg for a slider it is the slider value, for a text widget its the text, and for a button it is ignored.
 */
declare function widgetSetValue(widgetId: string, value: string|number|boolean) : void;

declare interface CoordinateSystem {
  min: number;
  max: number;
}

declare function scale(from: CoordinateSystem, to: CoordinateSystem, value: number): number;
