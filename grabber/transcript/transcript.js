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
