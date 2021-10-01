const samples = require('./samples.json');

const assert = require('assert');

const {
  Config,
  Panel,
  ActionButton,
  WebApp,
  Page,
  Row,
  GroupButton,
  ToggleButton,
  Button,
  Slider,
  IconButton,
  DirectionalPad,
  Text,
  Spinner,
  Spacer,
} = require('../src/ui-builder');

function toXml(el) {
  return el.toString();
}

describe('XML creation', function() {

  describe('Widget config', function() {

    it('Creates valid button xml', function() {
      const button = Button({
        widgetId: 'my-button',
        text: '#4',
        size: 4,
      });
      const xml = toXml(button, false);
      assert.equal(xml, samples.button);
    });

    it('Creates valid toggle button xml', function() {
      const button = ToggleButton({
        widgetId: 'my-button',
      });
      const xml = toXml(button, false);
      assert.equal(xml, samples.toggleButton);
    });

    it('Creates valid spinner xml', function() {
      const button = Spinner({
        widgetId: 'my-spinner',
        style: 'plusminus',
        size: 3,
      });
      const xml = toXml(button, false);
      assert.equal(xml, samples.spinner);
    });

    it('Creates valid slider xml', function() {
      const button = Slider({
        widgetId: 'my-slider',
        size: 3,
      });
      const xml = toXml(button, false);
      assert.equal(xml, samples.slider);
    });

    it('Creates valid spacer xml', function() {
      const button = Spacer({
        widgetId: 'my-spacer',
        size: 3,
      });
      const xml = toXml(button, false);
      assert.equal(xml, samples.spacer);
    });

    it('Creates valid icon button xml', function() {
      const button = IconButton({
        widgetId: 'my-iconbutton',
        icon: 'mic',
      });
      const xml = toXml(button, false);
      assert.equal(xml, samples.iconButton);
    });

    it('Creates valid text xml', function() {
      const button = Text({
        widgetId: 'my-text',
        text: "My text",
        size: 3,
      });
      const xml = toXml(button, false);
      assert.equal(xml, samples.text);
    });

    it('Creates valid directional pad xml', function() {
      const button = DirectionalPad({
        widgetId: 'my-directionalpad',
        text: 'Fire!',
      });
      const xml = toXml(button, false);
      assert.equal(xml, samples.directionalPad);
    });

    it('Creates valid groupbutton xml', function() {
      const button = GroupButton({
        widgetId: 'my-groupbutton',
        buttons: {
          drinks: 'Drinks',
          food: 'Food',
          snacks: 'Snacks',
        },
        columns: 3,
       });
      const xml = toXml(button, false);
      assert(xml, samples.groupButton);
    });

    it('Checks for valid attributes', function() {
      try {
        const button = Button({ widgetId: 'widget', jalla: 'jalla' });
        assert(false);
      }
      catch(e) {}
    });

    it('Throws error if widget id is missing', function() {
      try {
        const button = Button({});
        assert(false);
      }
      catch(e) {}
    });
  });

  describe('Row config', function() {

    it('Creates a row with widget', function() {
      const row = Row({ text: 'My row' }, [
        Button({ widgetId: 'mybutton' }),
      ]);
      const xml = toXml(row, false);
      assert.equal(xml, samples.row);
    });
  });

  describe('Page, panel, extensions', function() {
    it('Creates a page with a row with widget', function() {
      const row = Row({ text: 'My row' }, [
        Button({ widgetId: 'mybutton' }),
      ]);
      const page = Page({ pageId: 'mypage', name: 'My page' }, row);
      const xml = toXml(page, false);
      assert.equal(xml, samples.page);
    });

    it('Creates a panel with pages', function() {
      const page1 = Page({ pageId: 'page1' });
      const page2 = Page({ pageId: 'page2' });
      const panel = Panel({ panelId: 'my-panel' }, [page1, page2]);
      const xml = toXml(panel, false);
      assert.equal(xml, samples.panel);
    });

    it('Creates a config with a panel', function() {
      const panel = Panel({ panelId: 'my-panel' });
      const config = Config({ version: '1.7' }, panel);
      const xml = toXml(config, false);
      assert.equal(xml, samples.config);
    });

    it('Checks valid child types', function() {
      const row = Row();
      try {
        const panel = Panel({ panelId: 'my-panel' }, row);
        assert(false);
      }
      catch(e) {}
    });

    it('Checks for legal attributes', function() {
      try {
        const row = Row({ jalla: 'jalla' });
        assert(false);
      }
      catch(e) {}
    });

  });

  describe('ActionButton, WebApp', function() {
    it('Creates a valid web app', function() {
      const webApp = WebApp({
        name: 'YR',
        url: 'http://yr.no',
        color: '#334455',
        icon: 'Hvac',
      });
      const xml = toXml(webApp, false);
      assert.equal(xml, samples.webApp);
    });

    it('Creates a valid action button', function() {
      const webApp = ActionButton({
        panelId: 'action-button',
        icon: 'Handset',
      });
      const xml = toXml(webApp, false);
      assert.equal(xml, samples.actionButton);
    });

  });
});
