import {defaultConfig}
  from './default-config.js';
import {YoutubeHandler}
  from './youtube/youtube.js';
import {ContainerHandler}
  from './container/container.js';
import {InterfaceHandler}
  from './interface.js';
import {TranscriptHandler}
  from './transcript/transcript.js';
import {StatsTableHandler}
  from './table/table.js';
import {TranscriptSpanHandler}
  from './transcript/transcript-span.js';
import {HighlightHandler}
  from './transcript/highlight.js';

class Grabber {
  
  static async start(arg) {
    Grabber.arg = arg;
    await YoutubeHandler.loadYTAPI();

    get('grabber-frame').style.display = 'inline-flex';
    ContainerHandler.initializeContainers();
    

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
    StatsTableHandler.excludeBool = false;
    StatsTableHandler.searchTerm = undefined;
    StatsTableHandler.comparator = 'byFrequency';
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

  static setStatsTable() {


    set('statsTableDummy', StatsTableHandler.genStatsTable({
      columnWidth: Grabber.config.TABLE_COLUMN_WIDTH,
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
        console.log(excludeBool);
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
