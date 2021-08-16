# Guido - JavaScript library for Webex Device UIs

Guido is a JavaScript library to develop and use the custom Webex Device user interfaces
programatically from integrations such as macros or Node integrations. Users do not need to understand the xAPI commands,
nor the XML for the UI extensions.

The library contains two independent components:

* UI - lib for running the xAPI commands that manipulates the UI in runtime

* UI Builder - lib for creating dynamic user interface extensions

The two libraries can be used completely independently or together. You can install them as macro modules on the video device,
by importing the two files `src/ui.js` and `src/ui-builder.js` in the macro editor.