export class InspectorInterfaceHandler {
  static genTitle({titleClass, titleText}) {
    return genText(titleText, titleClass);
  }

  static genDefinition({definitionHeight, definitionWidth, definitionSpans}) {
    let definitionBox = genBox({visible: 'false', direction: 'column'});
    definitionBox.className +=  ' lul-y-scroll';
    definitionBox.style.alignItems = 'initial';
    definitionBox.style.width = definitionWidth;
    definitionBox.style.height = definitionHeight;
    let definitionFrame = genBox({});
    definitionFrame.className +=  ' lul-margin lul-padding';

    console.log(definitionSpans);
    for(let definitionSpan of definitionSpans) {
      definitionBox.appendChild(definitionSpan);
    }
    set(definitionFrame, definitionBox);
    return definitionFrame;
  }

  static genSavePocketButton({savePocketText}) {
    let savePocketButton = genButton({
      text: savePocketText
    });
    savePocketButton.className += ' lul-margin';
    return savePocketButton;
  }

  static genShowInTranscriptButton({showInTranscriptText, onclick}) {
    let showInTranscriptButton = genButton({
      text: showInTranscriptText,
      onclick: onclick
    });
    showInTranscriptButton.style.marginLeft = '10px';
    return showInTranscriptButton;
  }

  static genCopyLinesButton({copyLinesText}) {
    let copyLinesButton = genButton({
      text: copyLinesText
    });
    copyLinesButton.className += ' lul-margin';
    return copyLinesButton;
  }

  static genInspector({title, definition, savePocketButton, showInTranscriptButton, copyLinesButton}) {
    let table = gen('table');
    let tr = gen('tr');
    let left = gen('td', 'lul-margin');
    let right = gen('td');

    set(table, tr);
    set(tr, left, right);

    set(left, title, genHtml('<br>'), definition);
    set(right, savePocketButton, genHtml('<br>'), showInTranscriptButton, genHtml('<br>'), copyLinesButton);

    return table;
  }
}
