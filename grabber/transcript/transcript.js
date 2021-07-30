import {TranscriptAnalyzer}
  from './transcript-analyzer.js';
import {TranscriptSpanHandler}
  from './transcript-span.js';
import {HighlightHandler}
  from './highlight.js';
import {YoutubeHandler}
  from './../youtube/youtube.js';

export class TranscriptHandler extends TranscriptAnalyzer {

  static setConfig(config) {
    TranscriptHandler.config = config;
    TranscriptSpanHandler.config = config;
    get(config.transcriptDummy).style.scrollBehavior = 'smooth';
  }

  static createTranscript(transcript) {
    TranscriptHandler.analyzeTranscript(transcript);

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

  static scrollToInstance(wordInstance, scrollOffset) {
    let scrollPosition = wordInstance.span.offsetTop;
    let scrollParent = get(TranscriptHandler.config.transcriptDummy);
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

    TranscriptHandler.scrollToInstance(wordGroup.wordInstances[scrollNumber], scrollOffset);
  }
}


