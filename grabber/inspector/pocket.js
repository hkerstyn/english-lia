export class PocketHandler {

  static setConfig(config) {
    PocketHandler.config = config;
  }

  static initialize() {
    PocketHandler.itemNameWordGroups = new Set();
    let pocketWrapperBox = genBox({
      direction: 'column',
      visible: 'false'
    });
    pocketWrapperBox.className += PocketHandler.config.POCKET_WRAPPER_BOX_CLASS_NAME;
    pocketWrapperBox.style.height = PocketHandler.config.POCKET_WRAPPER_BOX_HEIGHT;
    pocketWrapperBox.style.width = PocketHandler.config.POCKET_WRAPPER_BOX_WIDTH;


    let pocketBox = genBox({
      direction: 'column',
      visible: 'false'
    });

    let pocketOptionBox = genBox({
      direction: 'column',
      visible: 'false'
    });

    let pocketOptions = PocketHandler.genPocketOptions({
      pocketCopyText: PocketHandler.config.POCKET_COPY_TEXT,
      pocketCopyFunction: PocketHandler.copyItemsInPocket,
      pocketClearText: PocketHandler.config.POCKET_CLEAR_TEXT,
      pocketClearFunction: PocketHandler.clearAllNameWordGroups
    });


    set(pocketWrapperBox, pocketBox, pocketOptionBox);
    set(PocketHandler.config.POCKET_PARENT, pocketWrapperBox);


    PocketHandler.pocketBox = pocketBox;
    PocketHandler.pocketOptions = pocketOptions;
    PocketHandler.pocketOptionBox = pocketOptionBox;
  }

  static genPocketOptions({pocketCopyText, pocketCopyFunction, pocketClearText, pocketClearFunction}) {
    let pocketCopyButton = genButton({
      text: PocketHandler.config.POCKET_COPY_TEXT,
      onclick: pocketCopyFunction
    });
    pocketCopyButton.className = PocketHandler.config.POCKET_OPTIONS_CLASS_NAME;

    let pocketClearButton = genButton({
      text: PocketHandler.config.POCKET_CLEAR_TEXT,
      onclick: pocketClearFunction
    });
    pocketClearButton.className = PocketHandler.config.POCKET_OPTIONS_CLASS_NAME;
    pocketClearButton.style.marginTop = '10px';   

    return [pocketCopyButton, pocketClearButton];
  }
  
  static copyItemsInPocket() {
    let copyStr = '';
    for(let nameWordGroup of PocketHandler.itemNameWordGroups) {
      copyStr += nameWordGroup.name + ', ';
    }
    copyStr = copyStr.slice(0, -2);

    navigator.clipboard.writeText(copyStr);
  }

  static saveNameWordGroup(nameWordGroup) {
    if(PocketHandler.itemNameWordGroups.has(nameWordGroup)) 
      return;
    let pocketItem = genButton({
      text: nameWordGroup.name,
      onclick: function() {
        PocketHandler.config.INSPECTOR_FUNCTION(nameWordGroup);
      }
    });
    pocketItem.className = PocketHandler.config.POCKET_ITEM_CLASS_NAME;
    nameWordGroup.pocketItem = pocketItem;

    PocketHandler.itemNameWordGroups.add(nameWordGroup);
    
    add(PocketHandler.pocketBox, pocketItem); 
    make(PocketHandler.pocketOptionBox, ...PocketHandler.pocketOptions);
  }

  static clearNameWordGroup(nameWordGroup) {
    if(nameWordGroup.pocketItem == undefined)
      return;
    nameWordGroup.pocketItem.remove();
    nameWordGroup.pocketItem = undefined;
    PocketHandler.itemNameWordGroups.delete(nameWordGroup);

    if(PocketHandler.itemNameWordGroups.size == 0)
      clear(PocketHandler.pocketOptionBox);
  }

  static clearAllNameWordGroups() {
    for(let nameWordGroup of PocketHandler.itemNameWordGroups) {
      PocketHandler.clearNameWordGroup(nameWordGroup);
    }
  }
}
