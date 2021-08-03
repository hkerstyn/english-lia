const defaultConfig = {
  ID_ENTER_TEXT: 'Enter Link',
  ID_ENTER_ENTRY_DIRECTION: 'row',

  DEFAULT_ID: 'fDek6cYijxI',

  LANGUAGE_SELECT_TEXT: 'Select language',
  LANGUAGE_SELECT_ENTRY_DIRECTION: 'column',
  LANGUAGE_SELECT_RADIO_TYPE: 'radio',

  SORT_SELECT_BUTTON_CLASS: 'lul-dark lul-norm-height',
  SORT_SELECT_TEXT: 'Sort criterium',
  SORT_SELECT_OPTION_TEXTS: ['By frequency', 'By length', 'Alphabetically', 'By Appearance'],
  SORT_SELECT_ENTRY_DIRECTION: 'column',
  SORT_SELECT_RADIO_TYPE: 'radio',

  DEFAULT_SPAN_CLASS: 'lul-text',
  HIGHLIGHT_SPAN_CLASS: 'lul-highlight-text',
  HIGHLIGHT_TEXT_INTERVAL: 500,
  TRANSCRIPT_SCROLL_OFFSET: 70,

  TABLE_COLUMN_WIDTH: 130,
  TABLE_CLASS: 'lul-full-width',
  TABLE_ROW_CLASS: 'lul-light lul-medium-hover',
  TABLE_CELL_CLASS: ' lul-text lul-highlight-text-hover',
  TABLE_TEXT_CLASS: '',
  TABLE_SCROLL_OFFSET: 50
};

const VIDEOLINK = 'https://video.google.com/timedtext?v=';
const VIDEOLANGUAGE = 'https://video.google.com/timedtext?type=list&v=';
const LANGUAGEADD = '&lang=';

class YoutubeTranscriptHandler {

  static async getLanguageList(videoId) {
    let xmlDoc = await getXMLDocFromLink(VIDEOLANGUAGE + videoId);
    let rawLanguageList = xmlDoc.childNodes[0].childNodes;

    let languageList = [];
    for(let rawLanguage of rawLanguageList)
      languageList.push({code: rawLanguage.attributes.lang_code.value, name: rawLanguage.attributes.lang_translated.value});
    return languageList;
  }

  static async getTranscript(videoId, languageCode) {
    let xmlDoc = await getXMLDocFromLink(VIDEOLINK + videoId + LANGUAGEADD + languageCode);
    let rawTranscript = xmlDoc.childNodes[0].childNodes;

    let transcript = [];
    for(let rawTranscriptEntry of rawTranscript)
      transcript.push({
        start: rawTranscriptEntry.attributes.start.value * 1,
        duration: rawTranscriptEntry.attributes.dur.value * 1,
        text: rawTranscriptEntry.childNodes[0].data
      });
    return transcript;
  }

} 

async function getXMLDocFromLink(link) {
  var request = new XMLHttpRequest();
  request.open('GET', link, true);
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

const YOUTUBE_API_LINK = 'https://www.youtube.com/iframe_api';

class YoutubeHandler extends YoutubeTranscriptHandler {

  static async loadYTAPI() {
    let newScriptTag = document.createElement('script');
    newScriptTag.src = YOUTUBE_API_LINK;

    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(newScriptTag, firstScriptTag);

    await new Promise(function(resolve,reject) {
      window.onYouTubeIframeAPIReady = resolve; 
      setTimeout(() => {
        reject('Failed to load YT API');
      }, 100000);
    });
  }
  
  //ensures that the entered String is a proper Youtube id
  static castToId(enteredString, defaultId) {
    //return default in case of no submitted string
    if(enteredString == undefined || enteredString == null || enteredString == '')
      return defaultId;

    //converts links to ids
    if(enteredString.includes('youtube')) {
      let vIndex = enteredString.indexOf('v=');
      return enteredString.slice(vIndex + 2);
    }

    //return id as-is
    return enteredString;
  }

  static async setPlayerVideo(playerDummyID, videoId, width, height) {
    if(YoutubeHandler.player != undefined) {
      YoutubeHandler.player.loadVideoById(videoId);
      return;
    }

    await new Promise(function(resolve,reject) {
      YoutubeHandler.player = new YT.Player(playerDummyID, {
        width: width,
        height: height,
        videoId: videoId,
        events:{
          onReady:resolve,
        }
      });
    });
  }

  static async jumpInVideo(position) {
    YoutubeHandler.player.seekTo(position, true);
  }

  static getCurrentTime() {
    return YoutubeHandler.player.getCurrentTime();
  }
}

function genDummy(dummyName) {
  let dummy = gen('span');
  dummy.id = dummyName;
  store(dummy, dummyName);
  return dummy;
}

function constrainDummy(dummy, containerName) {
  if(dummy == undefined) return;
  dummy.style.display = 'block';
  dummy.style.whiteSpace = 'normal';
  dummy.style.overflowY = 'auto';
  dummy.style.height = get(containerName + '.container').size[1] + 'px';
  dummy.style.width = get(containerName + '.container').size[0] + 'px';
}

class ContainerLayoutHandler {

  static arrangeContainers(availableWidth) {
    let optionsContainer = get('options.container');
    let playerContainer = get('player.container');
    let transcriptContainer = get('transcript.container');
    let statsTableContainer = get('statsTable.container');

    playerContainer.moveTo('down', optionsContainer);

    if(availableWidth >= 800) {
      //800 - inf
      playerContainer.minSize =  [600, 337.5];

      transcriptContainer.moveTo('right', optionsContainer, playerContainer);

      if (availableWidth >= 1000) {
        //1000 - inf
        let coupleWidth = (availableWidth - 600) / 2;
        transcriptContainer.minSize = [coupleWidth, 0];

        statsTableContainer.moveTo('right', playerContainer, transcriptContainer);
        statsTableContainer.minSize = [coupleWidth, 0];
      } else {
        //800 - 1000
        transcriptContainer.minSize = [availableWidth - 600, 0];

        statsTableContainer.moveTo('down', playerContainer, transcriptContainer);
        statsTableContainer.minSize = [0, 170];
      }
    } else {
      //0 - 800
      playerContainer.minSize = ( [availableWidth, 337.5]);

      transcriptContainer.moveTo('down', optionsContainer, playerContainer);
      transcriptContainer.minSize = [0, 300];

      statsTableContainer.moveTo('down', playerContainer, transcriptContainer);
      statsTableContainer.minSize = [0, 170];
    }

    Container.updateSizes();

    constrainDummy(get('transcriptDummy'), 'transcript');
    constrainDummy(get('statsTableDummy'), 'statsTable');
  }
}

class ContainerHandler extends ContainerLayoutHandler {

  static initializeContainers () {
    let optionsContainer = new Container('options', [500, 100], [true, false]);
    new Container('player');
    new Container('transcript');
    new Container('statsTable');

    optionsContainer.setRoot('grabber-frame');
    ContainerLayoutHandler.arrangeContainers(813);
    for(let container of Container.all)
      container.setClass('lul-light');

    set('options',
      genDummy('sortSelectDummy'),
      genDummy('languageSelectDummy'),
      genDummy('idEnterDummy')
    );

    set('player',
      genDummy('playerDummy')
    );

    let transcriptDummy = genDummy('transcriptDummy');
    constrainDummy(transcriptDummy, 'transcript');
    set('transcript', transcriptDummy);

    let statsTableDummy = genDummy('statsTableDummy');
    constrainDummy(statsTableDummy, 'statsTable');
    set('statsTable', statsTableDummy);
  }

}

class InterfaceHandler {
  static genIdEntry({text, direction, onConfirm}) {
    let idEnter = genEnter({
      name: 'enteredId'
    });
    let idButton = genButton({
      text: text,
      onclick: function(){
        onConfirm(window['enteredId']);
      }
    });
    let idEntry = genEntry({
      content: [ idEnter ],
      button: [ idButton ],
      direction: direction
    });
    return idEntry;
  }

  static genLanguageSelection({text, direction, onConfirm, languageList, radioType}) {

    let languageSelectButton = genButton({
      text: text,
      onclick: function () {onConfirm(window['selectedLanguageCode']);}
    });

    let languageSelectRadio = genSelection({
      name: 'selectedLanguageCode',
      options: {
        objects: languageList,
        textFunction: (language) => (language.name),
        valueFunction: (language) => (language.code)
      },
      button: [languageSelectButton],
      type: radioType,
      direction: direction
    });
    return languageSelectRadio;
  }

  static genSortSelection({text, direction, onConfirm, options, buttonClass, radioType}) {
    let selectedSortButton = genButton({
      text: text
    });
    selectedSortButton.className = buttonClass;

    let selectedSortRadio = genSelection({
      name: 'selectedSort',
      oninput: function () {
        onConfirm(window['selectedSort']);
      },
      options: options,
      button: [selectedSortButton],
      direction: direction,
      type: radioType
    });
    return selectedSortRadio;
  }
}

class TranscriptSpanHandler {
  static createSpan(wordInstance) {
    let span = gen('span', TranscriptSpanHandler.config.defaultSpanClass);
    span.innerHTML = wordInstance.text + ' ';
    wordInstance.span = span;

    add(TranscriptSpanHandler.config.transcriptDummy, span);
  }

  static highlightSpan(wordInstance) {
    let span = wordInstance.span;
    span.className = TranscriptSpanHandler.config.highlightSpanClass;
  }

  static unHighlightSpan(wordInstance) {
    let span = wordInstance.span;
    span.className = TranscriptSpanHandler.config.defaultSpanClass;
  }
}

class HighlightHandler {

  static highlightTimeWordGroup(timeWordGroup) {
    let oldTimeSet = HighlightHandler.timeSet;
    let nameSet = HighlightHandler.nameSet;
    let newTimeSet = new Set(timeWordGroup.wordInstances);

    HighlightHandler.highlightGenericSet({
      newSet: newTimeSet,
      oldSet: oldTimeSet,
      persistingSet: nameSet
    });

    HighlightHandler.timeSet = newTimeSet;
  }

  static highlightNameWordGroup(nameWordGroup) {
    let oldNameSet = HighlightHandler.nameSet;
    let timeSet = HighlightHandler.timeSet;
    let newNameSet = new Set(nameWordGroup.wordInstances);

    HighlightHandler.highlightGenericSet({
      newSet: newNameSet,
      oldSet: oldNameSet,
      persistingSet: timeSet
    });

    HighlightHandler.nameSet = newNameSet;
  }

  static highlightGenericSet({newSet, oldSet, persistingSet}) {
    let oldUnionSet = union(oldSet, persistingSet);
    let newUnionSet = union(newSet, persistingSet);

    let addedWordInstances = difference(newSet, oldUnionSet);
    let removedWordInstances = difference(oldSet, newUnionSet);

    for(let addedWordInstance of addedWordInstances)
      TranscriptSpanHandler.highlightSpan(addedWordInstance);

    for(let removedWordInstance of removedWordInstances)
      TranscriptSpanHandler.unHighlightSpan(removedWordInstance);
  }
}

HighlightHandler.timeSet = new Set();
HighlightHandler.nameSet = new Set();

function union(setA, setB) {
  let unionSet = new Set(setA);
  for(let item of setB)
    unionSet.add(item);
  return unionSet;
}

function difference(setA, setB) {
  let differenceSet = new Set(setA);
  for(let item of setB)
    differenceSet.delete(item);
  return differenceSet;
}

class WordAnalyzer {

  static splitIntoRawWords(text) {
    let shitlessText = WordAnalyzer.removeHtmlShit(text);
    let words = shitlessText.split(/[ \n]/g);
    for (let word of words)
      word.trim();

    return words;
  }

  static removeHtmlShit(text) {
    let textArea = gen('textarea');
    textArea.innerHTML = text;
    let shitlessText = textArea.value;
    textArea.remove();
    return shitlessText;
  }

  static prettify(word) {
    let prettyWord = word.replaceAll(/\d/g, ' ');
    prettyWord = prettyWord.replaceAll(/'/g, '0');
    prettyWord = prettyWord.replaceAll(/\W/g, ' ');
    prettyWord = prettyWord.replaceAll(/0+/g, "'");
    
    return prettyWord.trim();
  }
}

class WordInstance {

  constructor(text) {
    this.text = text;
    this.span = undefined;
    this.timeWordGroup = undefined;
    this.nameWordGroup = undefined;
  }
}

class WordGroup {
  constructor() {
    this.wordInstances = [];
  }

}

class TimeWordGroup extends WordGroup {
  constructor() {
    super();
    this.start = undefined;
    this.duration = undefined;
  }
}

class TranscriptAnalyzer {

  //converts transcript into timeWordGroups
  static analyzeTranscript(transcript, minTime, maxTime) {
    TranscriptAnalyzer.timeWordGroups = [];

    for(let transcriptEntry of transcript) {
      let words = WordAnalyzer.splitIntoRawWords(transcriptEntry.text);

      let timeWordGroup = new TimeWordGroup();
      timeWordGroup.start = transcriptEntry.start;
      timeWordGroup.duration = transcriptEntry.duration;

      if(timeWordGroup.start + timeWordGroup.duration < minTime
      || timeWordGroup.start > maxTime) 
        continue;

      for (let word of words) {
        let wordInstance = new WordInstance(word);
        wordInstance.timeWordGroup = timeWordGroup;
        timeWordGroup.wordInstances.push(wordInstance);
      }

      TranscriptAnalyzer.timeWordGroups.push(timeWordGroup);
    }
  }

  static *allWordInstances() {
    for (let timeWordGroup of TranscriptAnalyzer.timeWordGroups)
      yield* timeWordGroup.wordInstances;
  }



}

class TranscriptScrollHandler extends TranscriptAnalyzer {

  static scrollToInstance(wordInstance, scrollOffset) {
    let scrollPosition = wordInstance.span.offsetTop;
    let scrollParent = get(TranscriptScrollHandler.config.transcriptDummy);
    scrollParent.scrollTop = scrollPosition - scrollOffset;
  }

  static scrollToGroup(wordGroup, scrollOffset) {
    let scrollNumber;
    function position(indexNumber) {
      if(indexNumber >= wordGroup.wordInstances.length) return 1000000;
      let scrollPosition = wordGroup.wordInstances[indexNumber].span.offsetTop;
      if(scrollPosition < scrollOffset)
        scrollPosition = scrollOffset;
      return scrollPosition;
    }

    if(wordGroup != get('scrollGroup')) {
      store(wordGroup, 'scrollGroup');
      store(0, 'scrollNumber');
      scrollNumber = 0;
    } else {
      scrollNumber = get('scrollNumber');

      let currentPosition = position(scrollNumber);
      while(position(scrollNumber + 1) - currentPosition < scrollOffset) {
        scrollNumber++;
      }

      scrollNumber++;
      if(scrollNumber >= wordGroup.wordInstances.length)
        scrollNumber = 0;

      store(scrollNumber, 'scrollNumber');
    }

    TranscriptScrollHandler.scrollToInstance(wordGroup.wordInstances[scrollNumber], scrollOffset);
  }
}

class TranscriptHandler extends TranscriptScrollHandler {

  static setConfig(config) {
    TranscriptHandler.config = config;
    TranscriptScrollHandler.config = config;
    TranscriptSpanHandler.config = config;
    get(config.transcriptDummy).style.scrollBehavior = 'smooth';
  }

  static createTranscript(transcript, minTime, maxTime) {
    TranscriptHandler.analyzeTranscript(transcript, minTime, maxTime);

    for (let wordInstance of TranscriptHandler.allWordInstances()) {
      TranscriptSpanHandler.createSpan(wordInstance);
      wordInstance.span.addEventListener('click', function () {
        HighlightHandler.highlightTimeWordGroup(wordInstance.timeWordGroup);
        YoutubeHandler.jumpInVideo(wordInstance.timeWordGroup.start);
      });
    }

    HighlightHandler.highlightTimeWordGroup(TranscriptHandler.timeWordGroups[0]);

    watch({
      watchFunction: function () {
        let currentTime = YoutubeHandler.getCurrentTime();
        return TranscriptHandler.getCurrentTimeWordGroup(currentTime);
      },
      reactFunction: function (currentTimeWordGroup) {
        if(currentTimeWordGroup == undefined)
          return;
        HighlightHandler.highlightTimeWordGroup(currentTimeWordGroup);
        TranscriptHandler.scrollToInstance(currentTimeWordGroup.wordInstances[0], TranscriptHandler.config.scrollOffset);
      },
      interval: TranscriptHandler.config.highlightInterval
    });
  }

  static getCurrentTimeWordGroup(currentTime) {
    for(let timeWordGroup of TranscriptHandler.timeWordGroups) {
      if(currentTime >= timeWordGroup.start
      && currentTime < timeWordGroup.start + timeWordGroup.duration) {
        return timeWordGroup;
      }
    }
  }
}

class NameWordGroup extends WordGroup {
  constructor(name) {
    super();
    this.name = name;
  }
}

class NameAnalyzer {

  static analyzeNameGroups(wordInstances) {
    let nameWordGroups = [];
  
    for(let currentWordInstance of wordInstances) {
      let currentNames = WordAnalyzer.prettify(currentWordInstance.text).split(/ +/g);

      for(let currentName of currentNames) {
        let matchingWordGroupFound = false;

        //look for matching existing WordGroup  
        for(let existingWordGroup of nameWordGroups) {
          if(existingWordGroup.name.toLowerCase() == currentName.toLowerCase()){
            existingWordGroup.wordInstances.push(currentWordInstance); 
            currentWordInstance.nameWordGroup = existingWordGroup;

            if(currentName == currentName.toLowerCase())
              existingWordGroup.name = currentName;
            matchingWordGroupFound = true;
            break;
          }
        }

        //create new WordGroup
        if(!matchingWordGroupFound) {
          let newWordGroup = new NameWordGroup(currentName);
          newWordGroup.wordInstances.push(currentWordInstance);
          currentWordInstance.nameWordGroup = newWordGroup;
          nameWordGroups.push(newWordGroup);
        }
      }
    }

    NameAnalyzer.nameWordGroups = nameWordGroups;
  }

}

const COMPATATORS = {
  byFrequency: function(nameWordGroupA, nameWordGroupB) {
    return nameWordGroupB.wordInstances.length - nameWordGroupA.wordInstances.length;
  },
  byLength: function(nameWordGroupA, nameWordGroupB) {
    return nameWordGroupB.name.length - nameWordGroupA.name.length;
  },
  alphabetically: function(nameWordGroupA, nameWordGroupB) {
    return nameWordGroupA.name.localeCompare(nameWordGroupB.name);
  },
  byOccurrence: function(nameWordGroupA, nameWordGroupB) {
    return 0;
  }
};

class NameSorter extends NameAnalyzer {
  
  static sortNamedWordGroups(comparator) {
    let sortedArray = [...NameSorter.nameWordGroups];
    sortedArray.sort(COMPATATORS[comparator]);
    return sortedArray;
  }

}

class StatsTableHandler extends NameSorter {

  static genStatsTable({
    tableClass, tableRowClass, tableCellClass, tableTextClass,
    rowCount, columnCount,
    clickFunction, wordGroups}) {

    let table = gen('table', tableClass);

    let wordGroupIndex = 0;

    for(let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      let row = gen('tr', tableRowClass);

      for(let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
        if(wordGroupIndex >= wordGroups.length)
          break;
        let wordGroup = wordGroups[wordGroupIndex];
        wordGroupIndex++;

        let cell = gen('td', tableCellClass);
        cell.style.textAlign = 'center';
        cell.addEventListener('click', function () {
          clickFunction(wordGroup); 
        });

        let text = gen('a', tableTextClass);
        text.innerHTML = wordGroup.name;
        cell.appendChild(text);

        if(wordGroup.wordInstances.length > 1) {
          let number = genText('  ' + wordGroup.wordInstances.length);
          number.className = 'lul-background-text';
          cell.appendChild(number);
        }

        row.appendChild(cell);
      }
      table.appendChild(row);
    }
    return table;
  }

}

class Grabber {
  
  static async start(arg) {
    Grabber.arg = arg;
    await YoutubeHandler.loadYTAPI();

    get('grabber-frame').style.display = 'inline-flex';
    ContainerHandler.initializeContainers();
    

    if(Grabber.arg.videoId == undefined)
      Grabber.setIdEntry();
    else
      Grabber.setVideo(arg.videoId);
  }

  static setIdEntry() {
    set('idEnterDummy', InterfaceHandler.genIdEntry({
      text: Grabber.config.ID_ENTER_TEXT,
      direction: Grabber.config.ID_ENTER_ENTRY_DIRECTION,
      onConfirm: Grabber.setVideo
    }));
  }

  static async setVideo(videoLink) {
    get('sortSelectDummy').innerHTML = '';
    get('transcriptDummy').innerHTML = '';
    get('statsTableDummy').innerHTML = '';
      
    let videoId = YoutubeHandler.castToId(videoLink, Grabber.config.DEFAULT_ID);

    let playerSize = get('player.container').size;
    playerSize = [playerSize[0], playerSize[1] - 7];
    await YoutubeHandler.setPlayerVideo('playerDummy', videoId, ...playerSize);

    if(Grabber.arg.languageCode == undefined)
      Grabber.setLanguageSelection(videoId);
    else
      Grabber.setLanguage(videoId, Grabber.arg.languageCode);
  }

  static async setLanguageSelection(videoId) {
    let languageList = await YoutubeHandler.getLanguageList(videoId);
    set('languageSelectDummy', InterfaceHandler.genLanguageSelection({
      text: Grabber.config.LANGUAGE_SELECT_TEXT,
      radioType: Grabber.config.LANGUAGE_SELECT_RADIO_TYPE,
      direction: Grabber.config.LANGUAGE_SELECT_ENTRY_DIRECTION,
      languageList: languageList, 
      onConfirm: function(languageCode) {Grabber.setLanguage(videoId, languageCode);}
    }));
  }

  static async setLanguage(videoId, languageCode) {
    if(Grabber.arg.tellLanguageCode != undefined)
      alert('Selected languageCode: ' + languageCode);

    let transcript = await YoutubeHandler.getTranscript(videoId, languageCode);
    Grabber.setTranscript(transcript);
    StatsTableHandler.analyzeNameGroups([...TranscriptHandler.allWordInstances()]);
    Grabber.setStatsTable('byFrequency');
    window['selectedSort'] = 'byFrequency';
    Grabber.setSortSelection();
  }

  static setTranscript(transcript) {
    TranscriptHandler.setConfig({
      defaultSpanClass: Grabber.config.DEFAULT_SPAN_CLASS,
      highlightSpanClass: Grabber.config.HIGHLIGHT_SPAN_CLASS,
      transcriptDummy: 'transcriptDummy',
      highlightInterval: Grabber.config.HIGHLIGHT_TEXT_INTERVAL,
      scrollOffset: Grabber.config.TRANSCRIPT_SCROLL_OFFSET
    });

    get('transcriptDummy').innerHTML = '';

    if(Grabber.arg.minTime == undefined) Grabber.arg.minTime = 0;
    if(Grabber.arg.maxTime == undefined) Grabber.arg.maxTime = Infinity;
    TranscriptHandler.createTranscript(transcript, Grabber.arg.minTime,  Grabber.arg.maxTime);
  }

  static setStatsTable(comparator) {
    let wordGroups = StatsTableHandler.sortNamedWordGroups(comparator);


    let columnCount = Math.floor( get('statsTable.container').size[0] / Grabber.config.TABLE_COLUMN_WIDTH);
    if(columnCount == 0) throw new Error('columnCount is zero');
    let rowCount = Math.ceil(wordGroups.length / columnCount);

    set('statsTableDummy', StatsTableHandler.genStatsTable({
      wordGroups: wordGroups,
      columnCount: columnCount,
      rowCount: rowCount,
      tableClass: Grabber.config.TABLE_CLASS,
      tableRowClass: Grabber.config.TABLE_ROW_CLASS,
      tableCellClass: Grabber.config.TABLE_CELL_CLASS,
      tableTextClass: Grabber.config.TABLE_TEXT_CLASS,
      clickFunction:  function (nameWordGroup) {
        HighlightHandler.highlightNameWordGroup(nameWordGroup);
        TranscriptHandler.scrollToGroup(nameWordGroup, Grabber.config.TABLE_SCROLL_OFFSET);
      }
    }));

  }

  static setSortSelection() {

    set('sortSelectDummy', InterfaceHandler.genSortSelection({
      text: Grabber.config.SORT_SELECT_TEXT,
      direction: Grabber.config.SORT_SELECT_ENTRY_DIRECTION,
      buttonClass: Grabber.config.SORT_SELECT_BUTTON_CLASS,
      radioType: Grabber.config.SORT_SELECT_RADIO_TYPE,
      options: {
        texts: Grabber.config.SORT_SELECT_OPTION_TEXTS, 
        values: ['byFrequency', 'byLength', 'alphabetically', 'byOccurrence']
      },
      onConfirm: function (comparator) {
        Grabber.setStatsTable(comparator);
      }
    }));
  }

  static adjustLayout(availableWidth) {
    ContainerHandler.arrangeContainers(availableWidth);
    if(get('statsTableDummy').innerHTML != '')
      Grabber.setStatsTable(window['selectedSort']);
  }
}

Grabber.config = defaultConfig;
console.log(Grabber);
