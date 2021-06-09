


const DEFAULT_ID = '8TUK-M41hGI';
const WIDTH = 1000;
const HEIGHT = 600;
const HIGHLIGHT_TEXT_INTERVAL = 500;

const languageSelectDummy = document.getElementById("languageSelectDummy");
const playerDummyID = "playerDummy";
var playerDummy;


var highlightInterval;


import {setPlayerVideo, getTranscript, getLanguageList} from './youtube.js';
import {clearTextRemainders, highlightText, setText, setSortSelection} from './wordRenderer.js';
import {transcript, setTranscript} from './wordHandler.js';


//called by an inline script
export function initalizeUI() {
  let idEnterArg = {
    name: "enteredId",
    container: {
      alwaysOpen: true,
      target: {id: "idEnterDummy", mode: "make"},
      button: {
        text: "Confirm",
        onclick: function(){setVideo(window["enteredId"]);}
      }
    }
  }
  genEnter(idEnterArg);
}



//handles the selection of a video id
async function setVideo(enteredString) {

    //clear possible remainders the previous video
    clearTextRemainders();

    let newId = castToId(enteredString);


    await setPlayerVideo(playerDummyID, newId, WIDTH, HEIGHT);
    playerDummy = document.getElementById(playerDummyID);

    //sets Interval to frequently call highlightText()
    dispatchHighlightText();

    await setLanguageSelection();
}

function castToId(enteredString) {
    //ensures that the entered String is a proper Youtube id
    if(enteredString == undefined || enteredString == null || enteredString == "")
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


  let languageSelectArg = {
    name: "selectedLanguageCode",
    options: {
      objects: languageList,
      textFunction: function(obj) {return obj.languageName;},
      valueFunction: function(obj) {return obj.code;}
    },
    container: {
      button: {
        text: "Select language",
        onclick: onclick
      },
      target: {id: "languageSelectDummy"}
    }
  }
  genRadio(languageSelectArg);
}
