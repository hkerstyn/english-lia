const DEFAULT_ID = '8TUK-M41hGI';
const WIDTH = 1000;
const HEIGHT = 600;
const HIGHLIGHT_TEXT_INTERVAL = 500;

const languageSelectDummy = document.getElementById('languageSelectDummy');
const playerDummyID = 'playerDummy';
var playerDummy;


var highlightInterval;

const ID_ENTER_TEXT = 'Select YTid';
const LANGUAGE_SELECT_TEXT = 'Select language';

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
  let idEnter = genEnter({
    name: 'enteredId'
  });
  let idButton = genButton({
    text: ID_ENTER_TEXT,
    onclick: function(){setVideo(window['enteredId']);}
  });
  let idEntry = genEntry({
    content: [ idEnter ],
    button: [ idButton ],
    direction: 'row'
  });
  set('idEnterDummy', idEntry);
}



//handles the selection of a video id
async function setVideo(enteredString) {

  //clear possible remainders the previous video
  clearTextRemainders();

  let newId = castToId(enteredString);

  let playerWidth = get('player.container').size[0] - 5;
  let playerHeight = get('player.container').size[1] - 5;
  await setPlayerVideo('playerDummy', newId, playerWidth, playerHeight);
  playerDummy = get('playerDummy');


  //sets Interval to frequently call highlightText()
  dispatchHighlightText();

  await setLanguageSelection();
}

function castToId(enteredString) {
  //ensures that the entered String is a proper Youtube id
  if(enteredString == undefined || enteredString == null || enteredString == '')
    return DEFAULT_ID;

  return enteredString;
}

function dispatchHighlightText() {
  if(highlightInterval != undefined) clearInterval(highlightInterval);
  var highlightInterval = setInterval(function() {
    highlightText();
  }, HIGHLIGHT_TEXT_INTERVAL);
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
    text: LANGUAGE_SELECT_TEXT,
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
    type: 'radio',
  });
  set('languageSelectDummy', languageSelectRadio);
}
