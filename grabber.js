const YTAPI = 'https://www.youtube.com/iframe_api';
var videoId;
var player;


/*call this in the beginning*/
async function loadYTAPI() {
  var tag = document.createElement('script');
  tag.src = YTAPI;

  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  await new Promise(function(resolve,reject) {
    setTimeout(() => {
      reject('Failed to load YT API');
    }, 100000);
  });
}

async function setPlayerVideo(playerDummyID, newId, width, height) {
  videoId = newId;
  if(player === undefined)
    player = await createYTPlayer(playerDummyID, width, height);
  else
    await changeYTVideo();
}



/*returns a youtube player element*/
async function createYTPlayer(playerID, width, height) {
  let ret;
  let vidID = videoId;
  await new Promise(function(resolve,reject) {
    ret = new YT.Player(playerID, {
      width: width,
      height: height,
      videoId:vidID,
      events:{
        onReady:resolve,
        onStateChange: function(e) {ret.onPlayerStateChange(e);}
      }
    });
  });
  ret.onPlayerStateChange = function() {};
  return ret;
}

/*returns the transcript*/
const VIDEOLINK = 'https://video.google.com/timedtext?v=';
const VIDEOLANGUAGE = 'https://video.google.com/timedtext?type=list&v=';
const LANGUAGEADD = '&lang=';

async function loadTranscript(language){
  var request = new XMLHttpRequest();
  console.log(VIDEOLINK + videoId + LANGUAGEADD + language);
  request.open('GET', VIDEOLINK + videoId + LANGUAGEADD + language, true);
  request.responseType = 'document';
  request.overrideMimeType('text/xml');
  return new Promise(function(resolve, reject) {
    request.onload = function () {
      if (request.readyState === request.DONE) {
        if (request.status === 200) {
          resolve(request.responseXML);
        }
        else {
          reject(request.status);
        }
      }
    };
    request.send(null);
  });
}
async function getTranscript(language) {
  let xmldoc = await loadTranscript(language);
  let textList = xmldoc.childNodes[0];
  let TimeStamps = textList.childNodes;
  let newTranscript = [];
  for(let timeStamp of TimeStamps){
    newTranscript.push(
      {start: timeStamp.attributes.start.value * 1,
        duration: timeStamp.attributes.dur.value * 1,
        text: timeStamp.childNodes[0].data});
  }
  return newTranscript;
}
async function getLanguageList() {
  var request = new XMLHttpRequest();
  request.open('GET', VIDEOLANGUAGE + videoId, true);
  request.responseType = 'document';
  request.overrideMimeType('text/xml');
  return new Promise(function(resolve, reject) {
    request.onload = function () {
      if (request.readyState === request.DONE) {
        if (request.status === 200) {
          resolve(parseLanguageList(request.responseXML));
        }
        else {
          reject(request.status);
        }
      }
    };
    request.send(null);
  });
}
function parseLanguageList(xmldoc) {
  let transcriptList = xmldoc.childNodes[0];
  let XMLTracks = transcriptList.childNodes;

  let ret = [];
  for(let t of XMLTracks){
    ret.push({code: t.attributes.lang_code.value, languageName: t.attributes.lang_translated.value});
  }
  return ret;
}

/*interacts with the youtube player*/
async function changeYTVideo() {
  player.loadVideoById(videoId);
}

async function jumpInVideo(position) {
  player.seekTo(position, true);
}

function currentPosition() {
  return player.getCurrentTime();
}

var transcript;
var fullText;
var wordGroups;
var wordInstances;

function setTranscript(newTranscript) {transcript = newTranscript;}

const STATREPLACECHARACTERS = /[%,.;?!/"“”„/\\/\n-0123456789–¿…]/g;
const COMPARE_FUNKTIONS = {};
COMPARE_FUNKTIONS.sortAmountUp = function(a,b) {
  return a.amount - b.amount;
};
COMPARE_FUNKTIONS.sortAmountDown = function(a,b) {
  return b.amount - a.amount;
};
COMPARE_FUNKTIONS.sortLengthUp = function(a,b) {
  return a.name.length - b.name.length;
};
COMPARE_FUNKTIONS.sortLengthDown = function(a,b) {
  return b.name.length - a.name.length;
};
COMPARE_FUNKTIONS.alphabetAtoZ = function(a,b) {
  return a.name.localeCompare(b.name);
};
COMPARE_FUNKTIONS.alphabetZtoA = function(a,b) {
  return b.name.localeCompare(a.name);
};



function getFullText() {
  fullText = '';
  for(let transcriptEntry of transcript) {
    fullText += transcriptEntry.text + ' ';
  }
  //html zeug entfernen
  let textArea = document.createElement('textarea');
  textArea.innerHTML = fullText;
  fullText = textArea.value;
}

function getWordGroups() {
  //seperates string 'fullText' into array of strings 'wordInstances'
  fullText = fullText.replaceAll(STATREPLACECHARACTERS, ' ').toLowerCase();
  wordInstances = fullText.split(' ');
  for(let i = 0; i < wordInstances.length; i++){
    if(wordInstances[i] === '') {
      wordInstances.splice(i, 1);
      i--;
    }
  }
  //groups wordInstances into wordGroups
  wordGroups = [];
  for(wordInstance of wordInstances) {

    let matchingWordGroupFound = false;
    for(existingWordGroup of wordGroups) {
      if(existingWordGroup.name === wordInstance){
        existingWordGroup.amount++;
        matchingWordGroupFound = true;
        break;
      }
    }
    if(!matchingWordGroupFound) wordGroups.push({name: wordInstance, amount: 1});
  }
  return wordGroups;
}
function sortWordGroups(comparator) {
  wordGroups.sort(COMPARE_FUNKTIONS[comparator]);
}

var textDummy;
var statsTableDummy;
var sortSelectDummy;

var transcriptSpans;

function clearTextRemainders() {
  sortSelectDummy = document.getElementById('sortSelectDummy');
  sortSelectDummy.innerHTML = '';
  textDummy = document.getElementById('textDummy');
  textDummy.innerHTML = '';
  statsTableDummy = document.getElementById('statsTableDummy');
  statsTableDummy.innerHTML = '';
  setTranscript(undefined);
}




function highlightText() {
  if(transcript === undefined) {
    return;
  }
  for(let i = 0; i < transcript.length; i++) {
    let tsmp = transcript[i];
    let currentpos = currentPosition();
    if(tsmp.start < currentpos && tsmp.start + tsmp.duration > currentpos){
      transcriptSpans[i].style = 'background-color:#CC9CDF';
    }
    else {
      transcriptSpans[i].style = 'background-color:none';
    }
  }
}

function setText() {
  transcriptSpans = [];

  for(let transcriptEntry of transcript) {
    let span = gen('span');

    span.innerHTML = transcriptEntry.text;
    span.innerHTML += ' ';
    span.addEventListener('click', async function(e) {
      console.log(e);
      jumpInVideo(transcriptEntry.start);
    });
    textDummy.appendChild(span);
    transcriptSpans.push(span);
  }
}

function setSortSelection() {
  let selectedSortButton = genButton({
    text: 'Sort criterium'
  });
  selectedSortButton.className = 'lul-medium';

  let selectedSortRadio = genSelection({
    name: 'selectedSort',
    oninput: function () {
      setStatsTable(window['selectedSort']);
    },
    options: {
      texts: ['By frequency', 'By length', 'Alphabetically'],
      values: ['sortAmountDown', 'sortLengthDown', 'alphabetAtoZ']
    } ,
    button: [selectedSortButton]
  });
  get('sortSelect.container').moveTo('left', 'languageSelect.container');
  set('sortSelect', selectedSortRadio);


  getFullText();
  getWordGroups();
  setStatsTable('sortAmountDown');
}









function setStatsTable(comparator) {
  sortWordGroups(comparator);
  statsTableDummy.innerHTML = '';
  statsTableDummy.appendChild(genStatsTable());
}


function genStatsTable() {
  let array = wordGroups;
  let spaltn = 4;
  let zeilen = undefined;
  if(array%4==0){
    zeilen = Math.floor(array.length/4);
  }
  else {
    zeilen = Math.floor(array.length/4) + 1;
  }
  //console.log(zeilen);
  let displayArray = [];
  for(let entry of array) { // eintraege in die Tab. generieren...
    let block = document.createElement('table');
    block.style='width:100%';
    let blockItem = document.createElement('TR');
    let word = document.createElement('TD');
    word.style='width:50%';
    let amount = document.createElement('TD');
    amount.style='width:50%';
    word.appendChild(document.createTextNode(entry.name));
    amount.appendChild(document.createTextNode(entry.amount));
    blockItem.appendChild(word);
    blockItem.appendChild(amount);
    block.appendChild(blockItem);
    //console.log(amount, word);
    displayArray.push(block);

    block.onclick = function() {
      //console.log(entry.word);
      highlightWord(entry.name);
    };

  }
  //console.log(displayArray);
  let table = document.createElement('table');
  table.style='width:100%; border:2px solid black;';
  for(let zeile = 0; zeile < zeilen; zeile++) {
    let zeileItem = document.createElement('TR');
    for(let spalte = 0; spalte < spaltn; spalte++) {
      let spalteItem = document.createElement('TD');
      spalteItem.style='border:2px solid black;';
      //console.log(spalte + zeile * spaltn);
      if(displayArray[spalte + zeile * spaltn] === undefined){
        break;
      }
      spalteItem.appendChild(displayArray[spalte + zeile * spaltn]);
      zeileItem.appendChild(spalteItem);
    }
    table.appendChild(zeileItem);
  }
  //console.log(table);
  return table;
}

function highlightWord(suchword) {
  for(let i = 0; i < transcript.length; i++) {
    let textToCheck = transcript[i].text;
    let res = textToCheck.split(' ');
    transcriptSpans[i].innerHTML = '';
    for(let word of res) {
      let wordSpan = document.createElement('SPAN');
      wordSpan.innerHTML = word + ' ';
      if(word.toLowerCase().includes(suchword)){
        wordSpan.style = 'background-color:#33d7ff';
      }
      transcriptSpans[i].appendChild(wordSpan);
    }

  }
}

function initializeContainers () {
  new Container('player');
  new Container('transcript');
  new Container('statsTable');
  new Container('options');
}

const DEFAULT_ID = '8TUK-M41hGI';
const WIDTH = 1000;
const HEIGHT = 600;
const HIGHLIGHT_TEXT_INTERVAL = 500;

document.getElementById('languageSelectDummy');
const playerDummyID = 'playerDummy';

const ID_ENTER_TEXT = 'Select YTid';
const LANGUAGE_SELECT_TEXT = 'Select language';

//called by an inline script
function initalizeUI() {
  initializeContainers();
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
  set('idEnter', idEntry);
}



//handles the selection of a video id
async function setVideo(enteredString) {

  //clear possible remainders the previous video
  clearTextRemainders();

  let newId = castToId(enteredString);


  await setPlayerVideo(playerDummyID, newId, WIDTH, HEIGHT);
  document.getElementById(playerDummyID);

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
  get('languageSelect.container').moveTo('left', 'idEnter.container');
  set('languageSelect', languageSelectRadio);
}

console.log(initalizeUI, loadYTAPI);
