
export class WordAnalyzer {

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
