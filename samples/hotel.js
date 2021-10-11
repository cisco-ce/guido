const xapi = require('xapi');
const ui = require('./ui');

const ReceptionUri = 'erica.talking@ivr.vc';
const CheckinId = 'checkin';
const CheckoutId = 'checkout';
const PromptCallId = 'promptcall';

const checkinResult = {
  Title: 'Check-in complete!',
  Text: '', // fill in dynamically
  FeedbackId: 'checkin-complete',
};

function promptCall() {
  ui.promptShow({
    FeedbackId: PromptCallId,
    Title: 'Call Reception?',
    Text: 'If no-one answers, you can also try +47 984 323 32',
  }, ['Yes, call', 'Cancel']);
  xapi.Command.Video.Selfview.Set({ Mode: 'On' });
}


function callReception(choice) {
  if (choice === 0) {
    xapi.Command.Dial({ Number: ReceptionUri });
  }
  xapi.Command.Video.Selfview.Set({ Mode: 'Off' });
}

function onNameEntered(name) {
  ui.alert('Searching bookings...');
  setTimeout(() => {
    if (name.length < 10) {
      ui.alert('Try calling reception instead?', 'Sorry we didnt find your reservation');
    }
    else {
      const shortName = name.split(' ').pop();
      const code = parseInt(Math.random() * 10e4);
      checkinResult.Title = `Welcome ${shortName}`;
      checkinResult.Text = `Your door code is ${code}.<br>Please take a photo of this message.`;
      ui.promptShow(checkinResult, ['Ok I have the code']);
    }
  }, 2000);
}

function checkIn() {
  ui.textInputShow({
    Title: 'Check in',
    Text: 'Please enter the name you booked with:',
    InputText: 'Tore Torell',
    FeedbackId: CheckinId,
  });
}

function checkOut() {
  ui.textInputShow({
    Title: 'Check out',
    Text: 'Please enter the name you booked with:',
    InputText: 'Tore Torell',
    FeedbackId: CheckoutId,
  });
}

function onCheckoutDone() {
  ui.alert('Searching bookings...');
  setTimeout(() => {
    ui.alert('Have a safe trip back!', 'Checkout confirmed', 4);
  }, 2000);
}

function checkinDone(choice) {
  ui.promptHide();
}

let bgIndex = 0;
const wallpapers = [
  'https://kyberheimen.com/rondane/images/fugl.jpeg',
  'https://kyberheimen.com/rondane/images/host.jpeg',
  'https://kyberheimen.com/rondane/images/hytte.jpeg',
  'https://kyberheimen.com/rondane/images/myr.jpeg',
  'https://kyberheimen.com/rondane/images/rein.jpeg',
  'https://kyberheimen.com/rondane/images/rondane.jpeg',
  'https://kyberheimen.com/rondane/images/rondvassbu.jpeg',
];

function showInfo() {
  ui.webAppOpen('https://rondane.no');
}

function nextBg() {
  const bg = wallpapers[bgIndex % wallpapers.length];
  console.log('setting wallpaper', bg);
  ui.wallpaperSet(bg, false);
  bgIndex++;
  setTimeout(nextBg, 5000);
}

ui.onPanelClicked(promptCall, 'call-reception');
ui.onPanelClicked(checkIn, CheckinId);
ui.onPanelClicked(checkOut, CheckoutId);
ui.onPanelClicked(showInfo, 'info');
ui.onTextInputResponse(onNameEntered, CheckinId);
ui.onTextInputResponse(onCheckoutDone, CheckoutId);
ui.onPromptResponse(checkinDone, checkinResult.FeedbackId);
ui.onPromptResponse(callReception, PromptCallId);

nextBg();
