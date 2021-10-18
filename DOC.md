# Guido - JavaScript library for Webex Device UIs

Guido is a JavaScript SDK for user interfaces on Webex Devices. It is designed for integrations such as macros or Node integrations.

The library contains two independent components **(see links in right sidebar)**

* [UI - for running the xAPI commands that manipulates the UI in runtime and listen to events](./modules/ui.html)

* [UI Builder - for creating dynamic user interface extensions](./modules/ui_builder.html)

The two libraries can be used completely independently or together. You can install them as macro modules on the video device, by importing the two files `src/ui.js` and `src/ui-builder.js` in the macro editor.

## Running in node.js

The included example macro can also run from node.js instead of the Webex device, without any change to the macro code.
To see how this is done, see *run-macro* and *universal-adapter.js* in the *samples/* folder

## Source code

* See Guido source code at https://github.com/cisco-ce/guido

## See also

* See full xAPI reference documentation at [roomos.cisco.com](https://roomos.cisco.com/xapi)

* See the official RoomOS Customisation guide (PDF) at [cisco.com](https://www.cisco.com/c/en/us/support/collaboration-endpoints/telepresence-quick-set-series/products-installation-and-configuration-guides-list.html)

