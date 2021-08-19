export class InterfaceHandler {
  static genEnterEntry({text, direction, onConfirm, name}) {
    let enter = genEnter({
      name: name
    });
    let button = genButton({
      text: text,
      onclick: function(){
        onConfirm(window[name]);
      }
    });
    let entry = genEntry({
      content: [ enter ],
      button: [ button ],
      direction: direction
    });
    return entry;
  }

  static genLanguageSelection({text, direction, onConfirm, languageList, radioType}) {

    let languageSelectButton = genButton({
      text: text,
      onclick: function () {onConfirm(window['selectedLanguageCode']);}
    });

    let languageSelectRadio = genSelection({
      name: 'selectedLanguageCode',
      options: {
        objects: languageList,
        textFunction: (language) => (language.name),
        valueFunction: (language) => (language.code)
      },
      button: [languageSelectButton],
      type: radioType,
      direction: direction
    });
    return languageSelectRadio;
  }

  static genSortSelection({text, direction, onConfirm, options, buttonClass, radioType}) {
    let selectedSortButton = genButton({
      text: text
    });
    selectedSortButton.className = buttonClass;

    let selectedSortRadio = genSelection({
      name: 'selectedSort',
      oninput: function () {
        onConfirm(window['selectedSort']);
      },
      options: options,
      button: [selectedSortButton],
      direction: direction,
      type: radioType
    });
    return selectedSortRadio;
  }

  static genSearch({width, text, onConfirm}) {
    let enter = genEnter({
      name: 'searchTerm',
      width: width,
      oninput: function() {
        onConfirm(window['searchTerm']);
      }
    });
    let textSpan = genText(text);
    let box = genBox({});
    set(box, textSpan, enter);
    return box;
  }

  static genExclude({text, boxClass, onConfirm}) {
    let span = gen('span');
    let textSpan = genText('Exclude small words');
    let check = genCheck({
      name: 'excludeBool',
      oninput: function() {
        onConfirm(window['excludeBool']);
      }
    });
    let box = genBox({});
    set(span, check, textSpan);
    set(box, span);
    box.className += ' lul-margin';
    return box;
  }

}
