/**
 * Thin wrapper library for general ui operations, and easy ways to add event listeners to specific elements.
 *
 * Basically this means you don't need to use the xAPI commands yourself, eg:
 *
 * ```
 * import ui from './ui';
 * ui.alert('Hello World!');
 *
 * // instead of
 * xapi.Command.UserInterface.Message.Alert.Display({ Text: 'Hello World!' });
 * ```
 *
 * Also, event handling is made easier with dedicated methods, in a jquery-like fashion:
 *
 * ```
 * ui('my-button').onButtonClicked(() => console.log('button clicked'));
 *
 * // instead of
 * xapi.Event.UserInterface.Extensions.Widget.Action.on((e) => {
 *   if (e.WidgetId === 'my-button' && e.Type === 'clicked') {
 *     console.log('button clicked');
 *   }
 * });
 * ```
 *
 * An added benefit with the event handling is that behind the scenes, only *one* single catch-all event listener is registered for the library. This means you don't need to worry about getting close to the system's max number of listeners.
 *
 * ## Don't miss
 *
 * * [The available ui methods](./ui.ui-1.html)
 * * [The available event listeners ](../interfaces/ui.uiElement.html)
 *
 * This library is inspired by jQuery and https://github.com/valgaze/sugar
 */


/**
 * UI extension xml string. Can either be a string or an object with a toString() method
 *
 * Device expects something looking like:
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
 declare type Xml = string | { toString: () => void };

/**
 * Most api calls return a promise (except when you register for feedback)
 */
declare type XapiResult = Promise<{ result: string }>;

/**
 * Element that provides event listeners.
 * It's the user's responsibility to ensure that the id is correct and
 * appropriate for the given event.
 */
export declare interface uiElement {
  onPromptResponse: (callback: (choiceId: number) => void) => XapiResult;
  onTextResponse: (callback: (text: string) => void) => XapiResult;
  onPageOpened: (callback: Function) => XapiResult;
  onPageClosed: (callback: Function) => XapiResult;
  onPanelClicked: (callback: Function) => XapiResult;
  onPanelOpened: (callback: Function) => XapiResult;
  onPanelClosed: (callback: Function) => XapiResult;
  onButtonClicked: (callback: Function) => XapiResult;
  onButtonPressed: (callback: Function) => XapiResult;
  onButtonReleased: (callback: Function) => XapiResult;
  onGroupButtonPressed: (callback: (groupButtonId: string) => void) => XapiResult;
  onGroupButtonReleased: (callback: (groupButtonId: string) => void) => XapiResult;
  onToggleButtonChanged: (callback: (isOn: boolean) => void) => XapiResult;
  onSpinnerClicked: (callback: (increment: boolean) => void) => XapiResult;
  onSpinnerPressed: (callback: (increment: boolean) => void) => XapiResult;
  onSpinnerReleased: (callback: (increment: boolean) => void) => XapiResult;
  onDirectionalPadClicked: (callback: (buttonId: string) => void) => XapiResult;  onDirectionalPadPressed: (callback: (buttonId: string) => void) => XapiResult;  onDirectionalPadReleased: (callback: (buttonId: string) => void) => XapiResult;
  /**
   * Feedback when a slider changes value <0, 255>. If you specify min/max, the value will be automatically scaled to your chosen range (typically 0-100 or 0-1).
   */
  onSliderChanged: (callback: (value: number) => void, min: number, max: number) => XapiResult;

  setValue(widgetValue: string): XapiResult;
}

/** Slider type scale */
export declare interface Range {
  min: number;
  max: number;
}

/**
 * Instantiates an element that can provide event listener, eg:
 * ```
 * const ui = require('./ui');
 * ui('my-toggle').onButtonClicked(() => console.log('clicked my button));
 * ```
 *
 * @param id Id (widget id, panel id, page id, etc) whichever id is relevant for
 * the event you want to listen for.
 */
export declare function ui(id: string): uiElement;

/**
 * Static convenience ui functions
 *
 * ```
 * const { alert } = require('./ui');
 * ui.alert('Hello world');
 * ```
 */
export declare namespace ui {
  /**
   * Enable/disable debugging. This will print out any ui events in console.log
   * @param on
   */
  function debug(on?: boolean): void;

  /**
   * Shows a text messsage on screen. See https://roomos.cisco.com/xapi/Command.UserInterface.Message.Alert.Display for details.
   * @param optionsOrText If text is specifed, duration is set to 10 s.
   */
  function alert(optionsOrText: Object | string) : XapiResult;

  /** Hide the text message */
  function alertHide() : XapiResult;

  /**
   * Open a web view on main screen. See https://roomos.cisco.com/xapi/Command.UserInterface.WebView.Display for details.
   * @param url The URL you want to open
   * @param name Shown while page is loading
   */
  function webViewOpen(url: string, name?: string) : XapiResult;

  /**
   * Close any currently open web view.
   */
  function webViewClose() : XapiResult;

  /**
   * Shows an input dialog that prompts users for text. An event is genereated when user submits the dialog. See https://roomos.cisco.com/xapi/Command.UserInterface.Message.TextInput.Display for details
   * @param props
   * @param callback Optional callback when user submits text
   */
  function textInput(props: Object, callback: (text: string) => void) : XapiResult;

  function textInputHide() : XapiResult;

  /**
   * Promps users with a multiple choice dialog. When user selects an option, an event is generated.
   *
   * Note: You can use the `options` parameter to enter options more conveniently.
   *
   * Also, you can add an optional callback for when the user chooses an option. This is similar to using ui(...).onPromptResponse(...)
   *
   * Example:
   * ```
   * const options = ['Under 18', 'Over 18', 'Dinosaur'];
   * ui.prompt({
   *  Title: 'Age Check',
   *  Text: 'How old are you?',
   *  FeedbackId: 'age-check',
   * }, options, idx => console.log('You chose:' + options[idx]));
   * ```
   *
   * See https://roomos.cisco.com/xapi/Command.UserInterface.Message.Prompt.Display for details.
   *
   * @param props
   * @param options
   */
  function prompt(props: Object, options: Array<string>) : XapiResult;

  function promptHide() : XapiResult;

  /**
   * Shows a single-line text dialog at a chosen location on screen.
   * See https://roomos.cisco.com/xapi/Command.UserInterface.Message.TextLine.Display
   * @param props
   */
  function textLine(props: Object) : XapiResult;

  /**
   * Hides any text line currently showing.
   * See https://roomos.cisco.com/xapi/Command.UserInterface.Message.TextLine.Clear/
   */
  function textLineHide() : XapiResult;

  /**
   * Saves a panel (can be a ui panel, ann action button or a web app)
   * Any existing element with the same id will be replaced
   * See https://roomos.cisco.com/xapi/Command.UserInterface.Extensions.Panel.Save
   * @param PanelId
   * @param config
   */
  function panelSave(PanelId: string, config: Xml) : XapiResult;

  /**
   * Removes the given panel (panel can be a panel, an action button or a web app). See https://roomos.cisco.com/xapi/Command.UserInterface.Extensions.Panel.Remove
   * @param PanelId
   */
  function panelRemove(PanelId: string) : XapiResult;

  /**
   * Opens a panel. See https://roomos.cisco.com/xapi/Command.UserInterface.Extensions.Panel.Open.
   * @param PanelId
   * @param PageId - If not specified, then first page is opened
   */
  function panelOpen(PanelId: string, PageId?: string) : XapiResult;

  /**
   * Closes the currently open panel. See https://roomos.cisco.com/xapi/Command.UserInterface.Extensions.Panel.Close
   */
  function panelClose() : XapiResult;

  /**
   * Transforms (linearly) a value btw two range systems.
   *
   * Typically useful for sliders, eg you are converting values from a ui slider (0,255) to a volume setting (0-100)
   *
   * ```
   * const v = scale(
   *   { min: 0, max: 255 },
   *   { min: 0, max: 100 },
   *   128
   * ); // => 50
   * ```
   *
   * @param from - The range you are converting from
   * @param to -  The range you are converting to
   * @param value - The value you are converting
   */

  function scale(from: Range, to: Range, value: number): number;

  function onUsbKeyPressed(callback: (key: string, code: number) => void): XapiResult;
  function onUsbKeyReleased(callback: (key: string, code: number) => void): XapiResult;

}

