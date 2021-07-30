export class TranscriptSpanHandler {
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
