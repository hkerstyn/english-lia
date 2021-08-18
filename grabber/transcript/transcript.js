import {TranscriptSpanHandler}
  from './transcript-span.js';
import {HighlightHandler}
  from './highlight.js';
import {YoutubeHandler}
  from './../youtube/youtube.js';
import {TranscriptScrollHandler}
  from './transcript-scroll.js';

export class TranscriptHandler extends TranscriptScrollHandler {

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


