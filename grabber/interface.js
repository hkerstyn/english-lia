export class InterfaceHandler {
  static genIdEntry({text, direction, onConfirm}) {
    let idEnter = genEnter({
      name: 'enteredId'
    });
    let idButton = genButton({
      text: text,
      onclick: function(){
        onConfirm(window['enteredId']);
      }
    });
    let idEntry = genEntry({
      content: [ idEnter ],
      button: [ idButton ],
      direction: direction
    });
    return idEntry;
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
}
