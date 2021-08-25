class PocketHandler {

  static setConfig(config) {
    PocketHandler.config = config;
  }

  static initialize() {
    PocketHandler.itemNameWordGroups = new Set();
    let pocketWrapperBox = genBox({
      direction: 'column',
      visible: 'false'
    });
    pocketWrapperBox.className += PocketHandler.config.POCKET_WRAPPER_BOX_CLASS_NAME;
    pocketWrapperBox.style.height = PocketHandler.config.POCKET_WRAPPER_BOX_HEIGHT;
    pocketWrapperBox.style.width = PocketHandler.config.POCKET_WRAPPER_BOX_WIDTH;


    let pocketBox = genBox({
      direction: 'column',
      visible: 'false'
    });

    let pocketOptionBox = genBox({
      direction: 'column',
      visible: 'false'
    });

    let pocketOptions = PocketHandler.genPocketOptions({
      pocketCopyText: PocketHandler.config.POCKET_COPY_TEXT,
      pocketCopyFunction: PocketHandler.copyItemsInPocket,
      pocketClearText: PocketHandler.config.POCKET_CLEAR_TEXT,
      pocketClearFunction: PocketHandler.clearAllNameWordGroups
    });


    set(pocketWrapperBox, pocketBox, pocketOptionBox);
    set(PocketHandler.config.POCKET_PARENT, pocketWrapperBox);


    PocketHandler.pocketBox = pocketBox;
    PocketHandler.pocketOptions = pocketOptions;
    PocketHandler.pocketOptionBox = pocketOptionBox;
  }

  static genPocketOptions({pocketCopyText, pocketCopyFunction, pocketClearText, pocketClearFunction}) {
    let pocketCopyButton = genButton({
      text: PocketHandler.config.POCKET_COPY_TEXT,
      onclick: pocketCopyFunction
    });
    pocketCopyButton.className = PocketHandler.config.POCKET_OPTIONS_CLASS_NAME;

    let pocketClearButton = genButton({
      text: PocketHandler.config.POCKET_CLEAR_TEXT,
      onclick: pocketClearFunction
    });
    pocketClearButton.className = PocketHandler.config.POCKET_OPTIONS_CLASS_NAME;
    pocketClearButton.style.marginTop = '10px';   

    return [pocketCopyButton, pocketClearButton];
  }
  
  static copyItemsInPocket() {
    let copyStr = '';
    for(let nameWordGroup of PocketHandler.itemNameWordGroups) {
      copyStr += nameWordGroup.name + ', ';
    }
    copyStr = copyStr.slice(0, -2);

    navigator.clipboard.writeText(copyStr);
  }

  static saveNameWordGroup(nameWordGroup) {
    if(PocketHandler.itemNameWordGroups.has(nameWordGroup)) 
      return;
    let pocketItem = genButton({
      text: nameWordGroup.name,
      onclick: function() {
        PocketHandler.config.INSPECTOR_FUNCTION(nameWordGroup);
      }
    });
    pocketItem.className = PocketHandler.config.POCKET_ITEM_CLASS_NAME;
    nameWordGroup.pocketItem = pocketItem;

    PocketHandler.itemNameWordGroups.add(nameWordGroup);
    
    add(PocketHandler.pocketBox, pocketItem); 
    make(PocketHandler.pocketOptionBox, ...PocketHandler.pocketOptions);
  }

  static clearNameWordGroup(nameWordGroup) {
    if(nameWordGroup.pocketItem == undefined)
      return;
    nameWordGroup.pocketItem.remove();
    nameWordGroup.pocketItem = undefined;
    PocketHandler.itemNameWordGroups.delete(nameWordGroup);

    if(PocketHandler.itemNameWordGroups.size == 0)
      clear(PocketHandler.pocketOptionBox);
  }

  static clearAllNameWordGroups() {
    for(let nameWordGroup of PocketHandler.itemNameWordGroups) {
      PocketHandler.clearNameWordGroup(nameWordGroup);
    }
  }
}

const DEFINITION_LINK = 'https://www.merriam-webster.com/dictionary/';
class DefinitionHandler {
  


  static async getDefinitionSpans(word) {
    let definitionArray = await DefinitionHandler.getDefinitionArray(word);
    let definitionSpans = [];

    for(let i = 0; i < definitionArray.length; i++) {
      let definitionSpan = genText(definitionArray[i], 'lul-text');
      definitionSpans.push(definitionSpan);

      if(i + 1 < definitionArray.length) {
        definitionSpans.push(genText('~~~', 'lul-highlight-text'));
      }
    }
    return definitionSpans;

  }






  static async getDefinitionArray(word) {
    let definitionDocument;
    try {
     definitionDocument = await getXMLDocFromLink(DEFINITION_LINK + word, 'text/html');
    }
    catch {
      return [];
    }

    let rawDefinitionSpans = definitionDocument.getElementsByClassName('dtText');

    let definitionTextArray = [];
    for(let rawDefinitionSpan of rawDefinitionSpans) {
      definitionTextArray.push(rawDefinitionSpan.innerText);
    }

    return definitionTextArray;
  }

}

class InspectorInterfaceHandler {
  static genTitle({titleClass, titleText}) {
    return genText(titleText, titleClass);
  }

  static genDefinition({definitionHeight, definitionWidth, definitionSpans}) {
    let definitionBox = genBox({visible: 'false', direction: 'column'});
    definitionBox.className +=  ' lul-y-scroll';
    definitionBox.style.alignItems = 'initial';
    definitionBox.style.width = definitionWidth;
    definitionBox.style.height = definitionHeight;
    let definitionFrame = genBox({});
    definitionFrame.className +=  ' lul-margin lul-padding';

    for(let definitionSpan of definitionSpans) {
      definitionBox.appendChild(definitionSpan);
    }
    set(definitionFrame, definitionBox);
    return definitionFrame;
  }

  static genSavePocketButton({savePocketText, savePocketFuntion,
    clearPocketText, clearPocketFunction, alreadySaved}) {
    let parent = genBox({visible: 'false'});
    parent.className += ' lul-margin';

    function pocketButtonSaveMode() {
      let savePocketButton = genButton({
        text: savePocketText,
        onclick: function() {
          savePocketFuntion();
          pocketButtonClearMode();
        }
      });
      set(parent, savePocketButton);
    }

    function pocketButtonClearMode() {
      let savePocketButton = genButton({
        text: clearPocketText,
        onclick: function() {
          clearPocketFunction();
          pocketButtonSaveMode();
        }
      });
      set(parent, savePocketButton);
    }
    if(alreadySaved) 
      pocketButtonClearMode();
    else
      pocketButtonSaveMode();
    
    return parent;
  }

  static genShowInTranscriptButton({showInTranscriptText, onclick}) {
    let showInTranscriptButton = genButton({
      text: showInTranscriptText,
      onclick: onclick
    });
    showInTranscriptButton.style.marginLeft = '10px';
    return showInTranscriptButton;
  }

  static genCopyLinesButton({copyLinesText, copiedLinesText, onclick}) {
    let copyLinesButton = genButton({
      text: copyLinesText,
      onclick: onclick
    });
    copyLinesButton.addEventListener('click', function() {
      set(copyLinesButton, genText(copiedLinesText));
    });

    copyLinesButton.className += ' lul-margin';
    return copyLinesButton;
  }

  static genInspector({title, definition, savePocketButton, showInTranscriptButton, copyLinesButton}) {
    let table = gen('table');
    let tr = gen('tr');
    let left = gen('td', 'lul-margin');
    let right = gen('td');

    set(table, tr);
    set(tr, left, right);

    set(left, title, genHtml('<br>'), definition);
    set(right, savePocketButton, genHtml('<br>'), showInTranscriptButton, genHtml('<br>'), copyLinesButton);

    return table;
  }
}

class InspectorHandler {
  static setConfig(config) {
    this.config = config;
  }

  static async setWordGroup(nameWordGroup) {

    let word = nameWordGroup.name;

    let title = InspectorInterfaceHandler.genTitle({
      titleClass: InspectorHandler.config.TITLE_CLASS, 
      titleText: word
    }); 

    let definitionSpans = await DefinitionHandler.getDefinitionSpans(word);

    let definition = InspectorInterfaceHandler.genDefinition({
      definitionHeight: InspectorHandler.config.DEFINITION_HEIGHT, 
      definitionWidth: InspectorHandler.config.DEFINITION_WIDTH, 
      definitionSpans: definitionSpans
    }); 


    let savePocketText = InspectorHandler.config.SAVE_POCKET_TEXT.replace('word', word);
    let clearPocketText = InspectorHandler.config.CLEAR_POCKET_TEXT.replace('word', word);

    let savePocketButton = InspectorInterfaceHandler.genSavePocketButton({
      savePocketText: savePocketText,
      clearPocketText: clearPocketText,
      savePocketFuntion: function() {
        PocketHandler.saveNameWordGroup(nameWordGroup);
      },
      clearPocketFunction: function() {
        PocketHandler.clearNameWordGroup(nameWordGroup);
      },
      alreadySaved: (nameWordGroup.pocketItem != undefined)
    }); 

    let showInTranscriptText = InspectorHandler.config.SHOW_IN_TRANSCRIPT_TEXT.replace('word', word);
    let showInTranscriptButton = InspectorInterfaceHandler.genShowInTranscriptButton({
      showInTranscriptText: showInTranscriptText,
      onclick: function() {
        InspectorHandler.config.SHOW_IN_TRANSCRIPT_FUNCTION(nameWordGroup);
      }
    }); 

    let copyLinesText = InspectorHandler.config.COPY_LINES_TEXT.replace('word', word);
    let copiedLinesText = InspectorHandler.config.COPIED_LINES_TEXT.replace('word', word);
    let copyLinesButton = InspectorInterfaceHandler.genCopyLinesButton({
      copyLinesText: copyLinesText,
      copiedLinesText: copiedLinesText,
      onclick: function() {
        InspectorHandler.copyLines(nameWordGroup);
      }
    });

    return InspectorInterfaceHandler.genInspector({
      title: title, 
      definition: definition, 
      savePocketButton: savePocketButton, 
      showInTranscriptButton: showInTranscriptButton, 
      copyLinesButton: copyLinesButton,
    });
  }

  static copyLines(nameWordGroup) {
    let lines = '';
    let timeWordGroups = new Set();
    for(let wordInstance of nameWordGroup.wordInstances) {
      let line = '';
      for(let wordInstanceInTimeWordGroup of wordInstance.timeWordGroup.wordInstances) {
        line += wordInstanceInTimeWordGroup.text + ' ';
      }
      if(!timeWordGroups.has(wordInstance.timeWordGroup)) {
        timeWordGroups.add(wordInstance.timeWordGroup);
        lines += line + '\n';
      }
      navigator.clipboard.writeText(lines);
    }
  }

}

const defaultConfig = {
  QUERY_ENTER_TEXT: 'Enter Search Term',
  QUERY_FAIL_ALERT_TEXT: 'Please enter a Search Term',
  QUERY_ENTER_ENTRY_DIRECTION: 'row',

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

  SEARCH_TEXT: 'Search for:',
  SEARCH_WIDTH: 120,

  EXCLUDE_TEXT: 'Exclude small words',
  EXCLUDE_BOX_CLASS: ' lul-margin',

  DEFAULT_SPAN_CLASS: 'lul-text',
  HIGHLIGHT_SPAN_CLASS: 'lul-highlight-text',
  HIGHLIGHT_TEXT_INTERVAL: 1500,
  TRANSCRIPT_SCROLL_OFFSET: 70,

  TABLE_COLUMN_WIDTH: 120,
  TABLE_CLASS: 'lul-full-width',
  TABLE_ROW_CLASS: 'lul-light lul-medium-hover',
  TABLE_CELL_CLASS: ' lul-text lul-highlight-text-hover',
  TABLE_TEXT_CLASS: '',
  TABLE_SCROLL_OFFSET: 50,

  INSPECTOR_SAVE_POCKET_TEXT: 'Save "word" to pocket',
  INSPECTOR_CLEAR_POCKET_TEXT: 'Clear "word" from pocket',
  INSPECTOR_SHOW_IN_TRANSCRIPT_TEXT: 'Show "word" in transcript',
  INSPECTOR_COPY_LINES_TEXT: 'Copy lines with "word"',
  INSPECTOR_COPIED_LINES_TEXT: 'Copied lines with "word"',
  INSPECTOR_TITLE_CLASS: 'lul-title-text lul-mega-title-text-hover lul-margin',
  INSPECTOR_DEFINITION_HEIGHT: '100px',
  INSPECTOR_DEFINITION_WIDTH: '280px',

  POCKET_COPY_TEXT: 'Copy items in pocket',
  POCKET_CLEAR_TEXT: 'Clear all items from pocket',
  POCKET_ITEM_CLASS_NAME: 'lul-light lul-dark-hover lul-margin',
  POCKET_OPTIONS_CLASS_NAME: 'lul-dark lul-medium-hover',
  POCKET_WRAPPER_BOX_CLASS_NAME: ' lul-y-scroll lul-margin',
  POCKET_WRAPPER_BOX_HEIGHT: '180px',
  POCKET_WRAPPER_BOX_WIDTH: '260px'
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

const YOUTUBE_API_LINK = 'https://www.youtube.com/iframe_api';

class YoutubeHandler extends YoutubeTranscriptHandler {

  static async loadYTAPI() {
    if(window['YT'] != undefined) 
      return;

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
    console.log(get(playerDummyID).nodeName);
    if(get(playerDummyID).nodeName != 'SPAN') {
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

function genDummy(dummyName, className) {
  let dummy = gen('span');
  dummy.id = dummyName;
  if(className != undefined) 
    dummy.className = className;
  store(dummy, dummyName);
  return dummy;
}

function constrainDummy(dummy, containerName) {
  if(dummy == undefined) return;
  dummy.className = 'lul-y-scroll';
  dummy.style.height = get(containerName + '.container').size[1] + 'px';
  dummy.style.width = get(containerName + '.container').size[0] + 'px';
}

class ContainerLayoutHandler {

  static arrangeContainers(availableWidth) {
    let optionsContainer = get('options.container');
    let playerContainer = get('player.container');
    let transcriptContainer = get('transcript.container');
    let statsTableContainer = get('statsTable.container');
    let filterContainer = get('filter.container');
    let pocketContainer = get('pocket.container');
    let inspectorContainer = get('inspector.container');

    playerContainer.moveTo('down', optionsContainer);

    if(availableWidth >= 800) {
      //800 - inf
      playerContainer.minSize =  [600, 337.5];

      transcriptContainer.moveTo('right', optionsContainer, playerContainer);

      if (availableWidth >= 1080) {
        //1080 - inf
        let coupleWidth = (availableWidth - 600) / 2;

        inspectorContainer.minSize = [0, 230];
        inspectorContainer.moveTo('down', playerContainer);

        transcriptContainer.minSize = [coupleWidth, 437.5];
        pocketContainer.minSize = [0, 230];
        pocketContainer.moveTo('down', transcriptContainer);

        statsTableContainer.moveTo('right', playerContainer, transcriptContainer);
        statsTableContainer.minSize = [coupleWidth, 417.5];
        filterContainer.minSize = [0, 230];
        filterContainer.moveTo('up', statsTableContainer);

      } else {
        //800 - 1080
        transcriptContainer.minSize = [availableWidth - 600, 0];

        filterContainer.minSize = [240, 230];
        filterContainer.moveTo('down', playerContainer, transcriptContainer);

        statsTableContainer.minSize = [availableWidth - 240, 230];
        statsTableContainer.moveTo('right', filterContainer);

        inspectorContainer.minSize = [availableWidth - 240, 230];
        inspectorContainer.moveTo('down', statsTableContainer, pocketContainer);

        pocketContainer.minSize = [240, 230];
        pocketContainer.moveTo('right', inspectorContainer);

      }
    } else {
      //0 - 800
      playerContainer.minSize = ( [availableWidth, 337.5]);

      transcriptContainer.moveTo('down', optionsContainer, playerContainer);
      transcriptContainer.minSize = [0, 300];

      filterContainer.minSize = [240, 230];
      filterContainer.moveTo('down', playerContainer, transcriptContainer);

      statsTableContainer.minSize = [availableWidth - 240, 430];
      statsTableContainer.moveTo('right', filterContainer );

      pocketContainer.minSize = [240, 230];
      pocketContainer.moveTo('down', filterContainer);

      inspectorContainer.minSize = [0, 230];
      inspectorContainer.moveTo('down', statsTableContainer, pocketContainer);
    }

    Container.updateSizes();

    constrainDummy(get('transcriptDummy'), 'transcript');
    constrainDummy(get('statsTableDummy'), 'statsTable');
  }
}

class ContainerHandler extends ContainerLayoutHandler {

  static initializeContainers (divId) {
    let optionsContainer = new Container('options', [500, 100], [true, false]);
    new Container('player');
    new Container('transcript');
    new Container('statsTable');
    new Container('filter');
    new Container('pocket');
    new Container('inspector');

    optionsContainer.setRoot(divId);
    ContainerLayoutHandler.arrangeContainers(1200);
    for(let container of Container.all)
      container.setClass('lul-light');

    set('options',
      genDummy('languageSelectDummy', 'lul-margin'),
      genDummy('idEnterDummy', 'lul-margin'),
      genDummy('queryDummy', 'lul-margin')
    );

    set('filter',
      genDummy('sortSelectDummy', 'lul-margin'),
      genHtml('<br>'),
      genDummy('searchDummy', 'lul-margin'),
      genHtml('<br>'),
      genDummy('excludeDummy')
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
  static genEnterEntry({text, direction, onConfirm, name}) {
    let enter = genEnter({
      name: name
    });
    let button = genButton({
      text: text,
      onclick: function(){
        onConfirm(window[name]);
      }
    });
    let entry = genEntry({
      content: [ enter ],
      button: [ button ],
      direction: direction
    });
    return entry;
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

  static genSearch({width, text, onConfirm}) {
    let enter = genEnter({
      name: 'searchTerm',
      width: width,
      oninput: function() {
        onConfirm(window['searchTerm']);
      }
    });
    let textSpan = genText(text);
    let box = genBox({});
    set(box, textSpan, enter);
    return box;
  }

  static genExclude({text, boxClass, onConfirm}) {
    let span = gen('span');
    let textSpan = genText('Exclude small words');
    let check = genCheck({
      name: 'excludeBool',
      oninput: function() {
        onConfirm(window['excludeBool']);
      }
    });
    let box = genBox({});
    set(span, check, textSpan);
    set(box, span);
    box.className += ' lul-margin';
    return box;
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
    prettyWord = prettyWord.replaceAll(/\p{P}/gu, ' ');
    prettyWord = prettyWord.replaceAll(/\p{S}/gu, ' ');
    prettyWord = prettyWord.replaceAll(/\p{Z}/gu, ' ');
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
      killFunction: function() {
        if(YoutubeHandler.player == undefined)
          return true;
        return false;
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

const smallWordLength = 3;

class NameSorter {
  
  static sortNamedWordGroups(wordGroups, comparator) {
    let sortedArray = [...wordGroups];
    sortedArray.sort(COMPATATORS[comparator]);
    return sortedArray;
  }

  static excludeSmallWords(wordGroups) {
    let longWordGroups = [];
    for(let wordGroup of wordGroups) {
      if(wordGroup.name.length > smallWordLength) 
        longWordGroups.push(wordGroup);
    }
    return longWordGroups;
  }

  static searchForTerm(wordGroups, searchTerm) {
    let foundWordGroups = [];
    let unfoundWordGroups = [];
    
    for(let wordGroup of wordGroups) {
      if(wordGroup.name.toLowerCase().startsWith(searchTerm.toLowerCase())) 
        foundWordGroups.push(wordGroup);
      else
        unfoundWordGroups.push(wordGroup);
    }

    for(let wordGroup of unfoundWordGroups) {
      if(wordGroup.name.toLowerCase().includes(searchTerm.toLowerCase())) 
        foundWordGroups.push(wordGroup);
    }

    return foundWordGroups;
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
        if(!matchingWordGroupFound && currentName != '') {
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

class StatsTableHandler extends NameAnalyzer {

  static genStatsTable({
    tableClass, tableRowClass, tableCellClass, tableTextClass,
    columnWidth, clickFunction}) {

    let wordGroups = StatsTableHandler.getWordGroups();
    let wordGroupIndex = 0;

    let columnCount = Math.floor( get('statsTable.container').size[0] / columnWidth);
    if(columnCount == 0) throw new Error('columnCount is zero');
    let rowCount = Math.ceil(wordGroups.length / columnCount);

    let table = gen('table', tableClass);

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

  static getWordGroups() {
    let wordGroups = StatsTableHandler.nameWordGroups;

    if(StatsTableHandler.excludeBool == true) 
      wordGroups = NameSorter.excludeSmallWords(wordGroups);

    if(StatsTableHandler.comparator != undefined) 
      wordGroups = NameSorter.sortNamedWordGroups(wordGroups, StatsTableHandler.comparator);

    if(StatsTableHandler.searchTerm != undefined
    && StatsTableHandler.searchTerm != '') 
      wordGroups = NameSorter.searchForTerm(wordGroups, searchTerm);

    return wordGroups;
  }
}

class Grabber {

  static async start(arg, uid) {
    Grabber.uid = uid;
    Grabber.arg = arg;
    await YoutubeHandler.loadYTAPI();

    get(Grabber.uid).style.display = 'inline-flex';
    clear(Grabber.uid);
    ContainerHandler.initializeContainers(Grabber.uid);
    

    if(Grabber.arg.videoId == undefined) {
      Grabber.setVideoSelection();
    }
    else
      Grabber.setVideo(arg.videoId);

    

  }

  static setVideoSelection() {
    set('idEnterDummy', InterfaceHandler.genEnterEntry({
      name: 'enteredId',
      text: Grabber.config.ID_ENTER_TEXT,
      direction: Grabber.config.ID_ENTER_ENTRY_DIRECTION,
      onConfirm: Grabber.setVideo
    }));
    set('queryDummy', InterfaceHandler.genEnterEntry({
      name: 'enteredQuery',
      text: Grabber.config.QUERY_ENTER_TEXT,
      direction: Grabber.config.QUERY_ENTER_ENTRY_DIRECTION,
      onConfirm: function(enteredQuery) {
        if(enteredQuery != undefined) 
          window.open('https://www.youtube.com/results?search_query='+enteredQuery+'&sp=EgIoAQ%253D%253D', '_blank');
        else
          alert(Grabber.config.QUERY_FAIL_ALERT_TEXT);
        
      }
    }));
  }

  static async setVideo(videoLink) {
    clear('sortSelectDummy');
    clear('transcriptDummy');
    clear('statsTableDummy');
      
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
    StatsTableHandler.excludeBool = false;
    StatsTableHandler.searchTerm = undefined;
    StatsTableHandler.comparator = 'byFrequency';
    Grabber.setInspectorConfig();
    Grabber.setStatsTable();
    Grabber.setFilter();
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

  static setInspectorConfig() {
    InspectorHandler.setConfig({
      SAVE_POCKET_TEXT: Grabber.config.INSPECTOR_SAVE_POCKET_TEXT,
      CLEAR_POCKET_TEXT: Grabber.config.INSPECTOR_CLEAR_POCKET_TEXT,
      SHOW_IN_TRANSCRIPT_TEXT: Grabber.config.INSPECTOR_SHOW_IN_TRANSCRIPT_TEXT,
      COPY_LINES_TEXT: Grabber.config.INSPECTOR_COPY_LINES_TEXT,
      COPIED_LINES_TEXT: Grabber.config.INSPECTOR_COPIED_LINES_TEXT,
      TITLE_CLASS: Grabber.config.INSPECTOR_TITLE_CLASS,
      DEFINITION_HEIGHT: Grabber.config.INSPECTOR_DEFINITION_HEIGHT,
      DEFINITION_WIDTH:  Grabber.config.INSPECTOR_DEFINITION_WIDTH,

      SHOW_IN_TRANSCRIPT_FUNCTION: function(nameWordGroup) {
        HighlightHandler.highlightNameWordGroup(nameWordGroup);
        TranscriptHandler.scrollToGroup(nameWordGroup, Grabber.config.TABLE_SCROLL_OFFSET);
      }
    });

    PocketHandler.setConfig({
      POCKET_PARENT:  get('pocket'),
      INSPECTOR_FUNCTION: async function(nameWordGroup) {
        set('inspector', await InspectorHandler.setWordGroup(nameWordGroup));
      },
      POCKET_COPY_TEXT: Grabber.config.POCKET_COPY_TEXT,
      POCKET_CLEAR_TEXT: Grabber.config.POCKET_CLEAR_TEXT,
      POCKET_ITEM_CLASS_NAME: Grabber.config.POCKET_ITEM_CLASS_NAME,
      POCKET_OPTIONS_CLASS_NAME: Grabber.config.POCKET_OPTIONS_CLASS_NAME,
      POCKET_WRAPPER_BOX_CLASS_NAME: Grabber.config.POCKET_WRAPPER_BOX_CLASS_NAME,
      POCKET_WRAPPER_BOX_HEIGHT: Grabber.config.POCKET_WRAPPER_BOX_HEIGHT, 
      POCKET_WRAPPER_BOX_WIDTH: Grabber.config.POCKET_WRAPPER_BOX_WIDTH, 
    });
    PocketHandler.initialize();
  }

  static setStatsTable() {
    set('statsTableDummy', StatsTableHandler.genStatsTable({
      columnWidth: Grabber.config.TABLE_COLUMN_WIDTH,
      tableClass: Grabber.config.TABLE_CLASS,
      tableRowClass: Grabber.config.TABLE_ROW_CLASS,
      tableCellClass: Grabber.config.TABLE_CELL_CLASS,
      tableTextClass: Grabber.config.TABLE_TEXT_CLASS,
      clickFunction:  async function (nameWordGroup) {
        set('inspector', await InspectorHandler.setWordGroup(nameWordGroup));
      }
    }));

  }

  static async setFilter() {
    Grabber.setSortSelection();
    Grabber.setSearch();
    Grabber.setExclude();

  }

  static async setSearch() {
    set('searchDummy', InterfaceHandler.genSearch({
      width: Grabber.config.SEARCH_WIDTH,
      text: Grabber.config.SEARCH_TEXT,
      onConfirm: function(searchTerm) {
        StatsTableHandler.searchTerm = searchTerm;
        Grabber.setStatsTable();
      }
    }));
  }

  static async setExclude() {
    set('excludeDummy', InterfaceHandler.genExclude({
      text: Grabber.config.EXCLUDE_TEXT,
      boxClass: Grabber.config.EXCLUDE_BOX_CLASS, 
      onConfirm: function(excludeBool) {
        StatsTableHandler.excludeBool = excludeBool;
        Grabber.setStatsTable();
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
        StatsTableHandler.comparator = comparator;
        Grabber.setStatsTable(comparator);
      }
    }));
  }

  static adjustLayout(availableWidth) {
    ContainerHandler.arrangeContainers(availableWidth);
    if(get('statsTableDummy').innerHTML != '')
      Grabber.setStatsTable();
  }
}

Grabber.config = defaultConfig;
console.log(Grabber);
