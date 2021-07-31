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

    TranscriptHandler.createTranscript(transcript);
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
