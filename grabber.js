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

    let textArea = document.createElement('textarea');
    textArea.innerHTML = transcriptEntry.text;
    transcriptEntry.text = textArea.value;
    textArea.remove();
    fullText += transcriptEntry.text + ' ';
  }
  //html zeug entfernen
}

function splitByWords(text) {
  //seperates string 'fullText' into array of strings 'wordInstances'
  text = text.replaceAll(/\d/g, ' ');
  text = text.replaceAll(/'/g, '0');
  text = text.replaceAll(/\W/g, ' ');
  text = text.replaceAll(/0+/g, "'");
  
  return text.trim().split(/ +/g);
}
function getWordGroups() {
  
  wordInstances = splitByWords(fullText);
  //groups wordInstances into wordGroups
  wordGroups = [];
  for(wordInstance of wordInstances) {

    let matchingWordGroupFound = false;
    for(existingWordGroup of wordGroups) {
      if(existingWordGroup.name.toLowerCase() === wordInstance.toLowerCase()){
        existingWordGroup.amount++;
        if(wordInstance == wordInstance.toLowerCase())
          existingWordGroup.name = wordInstance;
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

var transcriptSpans;

function clearTextRemainders() {
  get('sortSelectDummy').innerHTML = '';
  get('textDummy').innerHTML = '';
  get('statsTableDummy').innerHTML = '';
  setTranscript(undefined);
}



var previousIndex = -1;
function highlightText() {
  if(transcript === undefined) 
    return;

  let newIndex;
  for(let i = 0; i < transcript.length; i++) {
    let tsmp = transcript[i];
    let currentpos = currentPosition();

    if(tsmp.start < currentpos && tsmp.start + tsmp.duration > currentpos){
      newIndex = i;
      break;
    }
  }
  if(newIndex == undefined)
    newIndex = 0;
  if(newIndex != previousIndex) {
    if(previousIndex != -1)
      transcriptSpans[previousIndex].className = grabber.DEFAULT_SPAN_CLASS;

    transcriptSpans[newIndex].className = grabber.HIGHLIGHT_SPAN_CLASS;
    previousIndex = newIndex;
  }
}

function setText() {
  transcriptSpans = [];

  for(let transcriptEntry of transcript) {
    let span = genText(transcriptEntry.text + ' ');

    span.addEventListener('click', async function(e) {
      console.log(e);
      jumpInVideo(transcriptEntry.start);
    });

    add('textDummy', span);
    transcriptSpans.push(span);
  }
}

function setSortSelection() {
  let selectedSortButton = genButton({
    text: grabber.SORT_SELECT_TEXT
  });
  selectedSortButton.className = grabber.SORT_SELECT_BUTTON_CLASS; 

  let selectedSortRadio = genSelection({
    name: 'selectedSort',
    oninput: function () {
      setStatsTable(window['selectedSort']);
    },
    options: {
      texts: grabber.SORT_SELECT_OPTION_TEXTS,
      values: ['sortAmountDown', 'sortLengthDown', 'alphabetAtoZ']
    },
    button: [selectedSortButton],
    direction: grabber.SORT_SELECT_ENTRY_DIRECTION,
    type: grabber.SORT_SELECT_RADIO_TYPE
  });
  set('sortSelectDummy', selectedSortRadio);


  getFullText();
  getWordGroups();
  setStatsTable('sortAmountDown');
}









function setStatsTable(comparator) {

  sortWordGroups(comparator);
  let wordGroupIndex = 0;

  let columnCount = Math.floor( get('statsTable.container').size[0] / grabber.TABLE_COLUMN_WIDTH);
  console.log(columnCount);
  let rowCount = Math.ceil(wordGroups.length / columnCount);

  let table = gen('table', grabber.TABLE_CLASS);
  for(let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    let row = gen('tr', grabber.TABLE_ROW_CLASS);
    for(let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
      if(wordGroupIndex >= wordGroups.length)
        break;
      let wordGroup = wordGroups[wordGroupIndex];
      wordGroupIndex++;

      let text = gen('a', grabber.TABLE_TEXT_CLASS);
      text.innerHTML = wordGroup.name;

      let cell = gen('td', grabber.TABLE_CELL_CLASS);
      cell.style.textAlign = 'center';
      cell.addEventListener('click', function () {
        highlightWord(wordGroup.name);
      });
      cell.appendChild(text);
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
  set('statsTableDummy', table);
}

function highlightWord(suchword) {
  for(let i = 0; i < transcript.length; i++) {
    let textToCheck = transcript[i].text;
    let words = textToCheck.split(/[ \n]/g);
    transcriptSpans[i].innerHTML = '';
    for(let word of words) {
      console.log('word: ', word);
      let wordSpan = gen('span');
      wordSpan.innerHTML = word + ' ';

      let match = false;
      let wordNames = splitByWords(word);
      for (let wordName of wordNames) {
        console.log('wordName: ', wordName);
        if(wordName.toLowerCase() != suchword.toLowerCase()) 
          continue;

        match = true;
        break;
      }

      if(match){
        wordSpan.className = grabber.HIGHLIGHT_SPAN_CLASS;
      } else {
        wordSpan.className = grabber.DEFAULT_SPAN_CLASS;
      }
      transcriptSpans[i].appendChild(wordSpan);
    }

  }
}

function initializeContainers () {
  //generate containers of given size
  let player = new Container('player', [600, 337.5]);
  let transcript = new Container('transcript', [400, 0]);
  let statsTable = new Container('statsTable', [0, 212.5]);
  let options = new Container('options', [0, 100], [true, false]);



  //arranging containers
  options.setRoot('frame');
  player.moveTo('down', options);
  transcript.moveTo('right', options, player);
  statsTable.moveTo('down', player, transcript);
  for(let container of Container.all)
    container.setClass('lul-light');


  fillContainers();

}



function fillContainers () {
  
  //filling options
  set('options',
    genDummy('sortSelectDummy'),
    genDummy('languageSelectDummy'),
    genDummy('idEnterDummy')
  );
  
  //filling player
  set('player',
    genDummy('playerDummy')
  );

  //filling transcript
  let textDummy = genDummy('textDummy');
  constrainDummy(textDummy, 'transcript');
  set('transcript', textDummy);



  //filling statsTable
  let statsTableDummy = genDummy('statsTableDummy');
  constrainDummy(statsTableDummy, 'statsTable');
  set('statsTable', statsTableDummy);
}

function genDummy(dummyName) {
  let dummy = gen('span');
  dummy.id = dummyName;
  store(dummy, dummyName);
  return dummy;
}
function constrainDummy(dummy, containerName) {
  dummy.style.display = 'block';
  dummy.style.whiteSpace = 'normal';
  dummy.style.overflowY = 'auto';
  dummy.style.height = get(containerName + '.container').size[1] + 'px';
  dummy.style.width = get(containerName + '.container').size[0] + 'px';
}

var highlightInterval;

//called by an inline script
function initalizeUI() {
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
  get('playerDummy');


  //sets Interval to frequently call highlightText()
  dispatchHighlightText();

  await setLanguageSelection();
}

function castToId(enteredString) {
  //ensures that the entered String is a proper Youtube id
  if(enteredString == undefined || enteredString == null || enteredString == '')
    return grabber.DEFAULT_ID;

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

class Grabber {

  constructor() {
    this.ID_ENTER_TEXT = 'Select YTid';
    this.ID_ENTER_ENTRY_DIRECTION = 'row';

    this.DEFAULT_ID = '8TUK-M41hGI';

    this.LANGUAGE_SELECT_TEXT = 'Select language';
    this.LANGUAGE_SELECT_ENTRY_DIRECTION = 'column';
    this.LANGUAGE_SELECT_RADIO_TYPE = 'radio';

    this.SORT_SELECT_BUTTON_CLASS = 'lul-dark lul-norm-height';
    this.SORT_SELECT_TEXT = 'Sort criterium';
    this.SORT_SELECT_OPTION_TEXTS = ['By frequency', 'By length', 'Alphabetically'];
    this.SORT_SELECT_ENTRY_DIRECTION = 'column';
    this.SORT_SELECT_RADIO_TYPE = 'radio';

    this.DEFAULT_SPAN_CLASS = 'lul-text';
    this.HIGHLIGHT_SPAN_CLASS = 'lul-highlight-text';
    this.HIGHLIGHT_TEXT_INTERVAL = 500;

    this.TABLE_COLUMN_WIDTH = 130;
    this.TABLE_CLASS = 'lul-full-width';
    this.TABLE_ROW_CLASS = 'lul-light lul-medium-hover';
    this.TABLE_CELL_CLASS = ' lul-text lul-highlight-text-hover';
    this.TABLE_TEXT_CLASS = '';
  }

  start() {
    window['grabber'] = this;
    loadYTAPI();
    initalizeUI();
  }

}

console.log(initalizeUI, loadYTAPI, Grabber);
