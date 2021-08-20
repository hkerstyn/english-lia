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

    for(let definitionSpan of definitionSpans) {
      definitionBox.appendChild(definitionSpan);
    }
    set(definitionFrame, definitionBox);
    return definitionFrame;
  }

  static genSavePocketButton({savePocketText, savePocketFuntion,
    clearPocketText, clearPocketFunction, alreadySaved}) {
    let parent = genBox({visible: 'false'});
    parent.className += ' lul-margin';

    function pocketButtonSaveMode() {
      let savePocketButton = genButton({
        text: savePocketText,
        onclick: function() {
          savePocketFuntion();
          pocketButtonClearMode();
        }
      });
      set(parent, savePocketButton);
    }

    function pocketButtonClearMode() {
      let savePocketButton = genButton({
        text: clearPocketText,
        onclick: function() {
          clearPocketFunction();
          pocketButtonSaveMode();
        }
      });
      set(parent, savePocketButton);
    }
    if(alreadySaved) 
      pocketButtonClearMode();
    else
      pocketButtonSaveMode();
    
    return parent;
  }

  static genShowInTranscriptButton({showInTranscriptText, onclick}) {
    let showInTranscriptButton = genButton({
      text: showInTranscriptText,
      onclick: onclick
    });
    showInTranscriptButton.style.marginLeft = '10px';
    return showInTranscriptButton;
  }

  static genCopyLinesButton({copyLinesText, copiedLinesText, onclick}) {
    let copyLinesButton = genButton({
      text: copyLinesText,
      onclick: onclick
    });
    copyLinesButton.addEventListener('click', function() {
      set(copyLinesButton, genText(copiedLinesText));
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


