import {WordAnalyzer}
  from './../word/word-analyzer.js';
import {WordInstance}
  from './../word/word-instance.js';
import {TimeWordGroup}
  from './../word/time-word-group.js';

export class TranscriptAnalyzer {

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
