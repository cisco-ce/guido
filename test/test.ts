export {};

const samples = require('./samples.json');

const assert = require('assert');

const { Config, Panel, Page, Row } = require('../src/uiext');
const { GroupButton, Button, toXml } = require('../src/uiext');

function compareXml(xml1: string, xml2: string) {
  return xml1.replace(/\s/g, '') === xml2.replace(/\s/g, '');
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
      assert(compareXml(xml, samples.button));
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
      assert(compareXml(xml, samples.groupButton));
    });
  });

  describe('Row config', function() {
    it('Creates a row with widget', function() {
      const row = Row({ text: 'My row' }, [
        Button({ widgetId: 'mybutton' }),
      ]);
      const xml = toXml(row, false);
      assert(compareXml(xml, samples.row));
    });
  });

  describe('Page, panel, extensions', function() {
    it('Creates a page with a row with widget', function() {
      const row = Row({ text: 'My row' }, [
        Button({ widgetId: 'mybutton' }),
      ]);
      const page = Page({ pageId: 'mypage', name: 'My page' }, row);
      const xml = toXml(page, false);
      assert(compareXml(xml, samples.page));
    });

    it('Creates a panel with pages', function() {
      const page1 = Page({ pageId: 'page1' });
      const page2 = Page({ pageId: 'page2' });
      const panel = Panel({ panelId: 'my-panel' }, [page1, page2]);
      const xml = toXml(panel, false);
      assert(compareXml(xml, samples.panel));
    });

    it('Creates a config with a panel', function() {
      const panel = Panel({ panelId: 'my-panel' });
      const config = Config({ version: '1.7' }, panel);
      const xml = toXml(config, false);
      assert(compareXml(xml, samples.config));
    });

  });
});
