const ui = require('./ui');

ui.textInput({
  Title: 'Ca va', Text: 'How you feel?', FeedbackId: 'feel',
  Placeholder: 'Gooood', SubmitText: 'Tell us'
});

ui.debug();
ui('feel').onTextResponse(e => console.log(e));

