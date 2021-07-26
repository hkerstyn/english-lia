var highlightInterval;
var playerDummy;

import {setPlayerVideo, getTranscript, getLanguageList}
  from './youtube.js';
import {clearTextRemainders, highlightText, setText, setSortSelection}
  from './wordRenderer.js';
import {transcript, setTranscript}
  from './wordHandler.js';
import {initializeContainers}
  from './container.js';

//called by an inline script
export function initalizeUI() {
  get('frame').style.display = 'inline-block';
  initializeContainers();
  let idEnter = genEnter({
    name: 'enteredId'
  });
  let idButton = genButton({
    text: grabber.ID_ENTER_TEXT,
    onclick: function(){setVideo(window['enteredId']);}
  });
  let idEntry = genEntry({
    content: [ idEnter ],
    button: [ idButton ],
    direction: grabber.ID_ENTER_ENTRY_DIRECTION
  });
  set('idEnterDummy', idEntry);
}



//handles the selection of a video id
async function setVideo(enteredString) {

  //clear possible remainders the previous video
  clearTextRemainders();

  let newId = castToId(enteredString);

  let playerWidth = get('player.container').size[0];
  let playerHeight = get('player.container').size[1] - 7;
  await setPlayerVideo('playerDummy', newId, playerWidth, playerHeight);
  playerDummy = get('playerDummy');


  //sets Interval to frequently call highlightText()
  dispatchHighlightText();

  await setLanguageSelection();
}

function castToId(enteredString) {
  //ensures that the entered String is a proper Youtube id
  if(enteredString == undefined || enteredString == null || enteredString == '')
    return grabber.DEFAULT_ID;

  //converts links to ids
  if(enteredString.includes('youtube')) {
    let vIndex = enteredString.indexOf('v=');
    return enteredString.slice(vIndex + 2);
  }

  return enteredString;
}

function dispatchHighlightText() {
  if(highlightInterval != undefined) clearInterval(highlightInterval);
  highlightInterval = setInterval(function() {
    highlightText();
  }, grabber.HIGHLIGHT_TEXT_INTERVAL);
}

async function setLanguageSelection() {

  let onclick = async function() {
    newTranscript = await getTranscript(window['selectedLanguageCode']);
    setTranscript(newTranscript);
    setText();
    setSortSelection();
  };

  let languageList = await getLanguageList();

  let languageSelectButton = genButton({
    text: grabber.LANGUAGE_SELECT_TEXT,
    onclick: onclick
  });

  let languageSelectRadio = genSelection({
    name: 'selectedLanguageCode',
    options: {
      objects: languageList,
      textFunction: function(obj) {return obj.languageName;},
      valueFunction: function(obj) {return obj.code;}
    },
    button: [languageSelectButton],
    type: grabber.LANGUAGE_SELECT_RADIO_TYPE,
    direction: grabber.LANGUAGE_SELECT_ENTRY_DIRECTION
  });
  set('languageSelectDummy', languageSelectRadio);
}
