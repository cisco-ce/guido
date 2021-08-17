/**
 * Example of how to create a panel, an action button and a web app.
 *
 * This can be run as a macro on the video device without modification.
 * Add ui.js and ui-builder.js as macro modules first, then add this file
 * and enable it. The example does not show to react to button presses etc,
 * you can find that for documentation for the ui module.
 */
const ui = require('./ui');
const {
  Config, Panel, ActionButton, WebApp, Page, Row, ToggleButton, Slider, GroupButton
} = require('./ui-builder');

// Create an action button for calling helpdesk
const actionButton = Config({}, [
  ActionButton({ name: 'HelpDesk', panelId: 'helpdesk', icon: 'Helpdesk', color: '#003399' })
]);
ui.panelSave('helpdesk', actionButton);

// Create a panel for controlling lights in the room
const panel = Config({}, [
  Panel({ name: 'Lights', icon: 'Lightbulb', color: 'orange' }, [
    Page({ name: 'Lights' }, [
      Row({ text: 'Main lights' }, [
        Slider({ widgetId: 'lights-toggle' }),
        ToggleButton({ widgetId: 'lights-slider' }),
      ]),
      Row({ text: 'Color' }, [
        GroupButton({
          widgetId: 'lights-colors',
          buttons: { warm: 'Warm', medium: 'Medium', cold: 'Cold' },
        })
      ])
    ]),
  ])
]);

ui.panelSave('lights', panel);

// Create a web app link to YouTube
const webApp = Config({}, WebApp({ name: 'YouTube', url: 'https://youtube.com' }));
ui.panelSave('youtube', webApp);
