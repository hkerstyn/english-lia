const DEFINITION_LINK = 'https://www.merriam-webster.com/dictionary/';
export class DefinitionHandler {
  


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



