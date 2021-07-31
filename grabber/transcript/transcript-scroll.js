import {TranscriptAnalyzer}
  from './transcript-analyzer.js';

export class TranscriptScrollHandler extends TranscriptAnalyzer {

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
