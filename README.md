# Guido - JavaScript library for Webex Device UIs

Guido is a JavaScript SDK for user interfaces on Webex Devices. It is designed for integrations such as macros or Node integrations.

The library contains two independent components **(see links in right sidebar)**

* UI - for running the xAPI commands that manipulates the UI in runtime and listen to events

* UI Builder - for creating dynamic user interface extensions

The two libraries can be used completely independently or together. You can install them as macro modules on the video device, by importing the two files `src/ui.js` and `src/ui-builder.js` in the macro editor.

## Installation

* Download the files **src/ui.js** and **src/ui-builder.js**
* Import these into the macro editor on your Webex Device. They will now be available as macro modules for you own macros.
* Follow the documentation and examples on https://cisco-ce.github.io/guido/

## Examples

You can find a couple of examples in the `samples/` folder. Just install and enable the macros in your macro editor. The macros will create the UI extension panels automatically.

**Proximity toggle**: Puts a button on the home screen button to toggle on/off proximity pairing. Changes the name of the button to tell whether mode is currently on or off.

**Widget gallery*: Shows a panel where you can browse through all the widgets of the UI Extensions, and interact with the widgets and see the events. This example shows how to build and edit UI extensions panels dynamically with *ui-builder* library, as well as listen to ui events with the *ui* library.

## Reference documentation

* See Guido API reference docs at [Github Pages](https://cisco-ce.github.io/guido/)

## See also

* See full xAPI reference documentation at [roomos.cisco.com](https://roomos.cisco.com/xapi)

* See the official RoomOS Customisation guide (PDF) at [cisco.com](https://www.cisco.com/c/en/us/support/collaboration-endpoints/telepresence-quick-set-series/products-installation-and-configuration-guides-list.html)