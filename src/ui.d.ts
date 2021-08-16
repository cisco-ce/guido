/**
 * Thin wrapper for most xAPI user interface commands.
 *
 * This means you don't need to use the long xAPI commands yourself, eg:
 *
 * ```
 * import ui from './ui';
 * ui.alert('Hello World!');
 *
 * // instead of
 * xapi.Command.UserInterface.Message.Alert.Display({ Text: 'Hello World!' });
 * ```
 *
 * @module
 */

/**
 * UI extension xml string. Device expects something looking like:
 *
 * ```
 * <Extensions>
 *   <Version>1.8</Version>
 *   <Panel>
 *   <PanelId>end-call</PanelId>
 *     <Type>InCall</Type>
 *     <Icon>Handset</Icon>
 *     <Color>#FF503C</Color>
 *     <Name>End call</Name>
 *     <Page>
 *       <Name>End call</Name>
 *       <Row>
 *       ...
 * ```
 */
declare type Xml = string;

/**
 * Most api calls return a promise (except when you register for feedback)
 */
declare type XapiResult = Promise<{ result: string }>;

/**
 * Removes all 'panels' on the device (that also includes web apps and action buttons)
 */
declare function panelRemoveAll() : XapiResult;

/**
 * Save a panel to the device. The panel specified is used, any panel id inside the xml is ignored. Any existing panel with the same panel will be overriden, so this is also a method to edit panels dynamically.
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
 * @return function that can be used to unsubscribe again
 */
declare function onWidgetAction(callback: Function, action?: string, widgetId?: string) : Function;

/**
 * Sets the value for a widget. This has different meanings for different widgets, eg for a slider it is the slider value, for a text widget its the text, and for a button it is ignored.
 */
declare function widgetSetValue(widgetId: string, value: string|number|boolean) : void;

/**
 * Same as subscribing to an API, but also calls get() on the api immediately, so sync happens on start.
 * This is a recommended best practise when syncing any value with a config or status in the xAPI.
 * Its basically similar to doing the following, but in one call instead of two:
 * ```
 * xapi.Status.Audio.Volume.on(volumeChanged);
 * xapi.Status.Audio.Volume.get().then(volumeChanged);
 * // =>
 * ui.subscribe(xapi.Status.Audio.Volume, volumeChanged);
 * ```
 *
 * @param api The xapi you want to sync with, eg xapi.Status.Audio.Volume
 * @param onChanged The callback when the value changes (also called initially)
 * @return Function to unsubscribe again
 */
declare function subscribe(api: object, onChanged: Function): Function;


/**
 * Min-max range for eg sliders
 */
interface Range {
  min: number;
  max: number;
}

/**
 * Transforms (linearly) a value btw two range systems.
 *
 * Typically useful for sliders, eg you are converting values from a ui slider (0,255) to a
 * volume setting (0-100)
 * scale({ min: 0, max: 255 }, { min: 0, max: 100 }, 128) => 50
 *
 * @param from The range you are converting from
 * @param to  The range you are converting to
 * @param value The value you are converting
 */
declare function scale(from: Range, to: Range, value: number): number;
