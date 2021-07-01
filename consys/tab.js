import {Group, Item}
  from './item.js';

class TabGroup extends Group {
  constructor(tabGroupName) {
    super();
    store(this, tabGroupName);
  }

}



export class Tab extends Item {

  constructor(tabGroupName) {
    let tabGroup = get(tabGroupName);
    if(tabGroup == undefined)
      tabGroup = new TabGroup(tabGroupName);


    let tabName = tabGroupName + tabGroup.items.length;
    super(tabName);

    this.addToGroup(tabGroup);
    if(tabGroup.activeTab == undefined)
      this.tabTo();
  }

  get isActiveTab() {
    return (this == this.group.activeTab);
  }

  tabTo() {
    this.group.activeTab = this;
  }
  tabToNext() {
    if(this.next == undefined)
      this.group.items[0].tabTo();
    else this.next.tabTo();
  }
  tabToPrevious() {
    if(this.previous == undefined)
      this.group.items.slice(-1)[0].tabTo();
    else this.previous.tabTo();
  }
  removeFromGroup() {
    if(this.group == undefined) return;
    if(this.isActiveTab)
      this.tabToPrevious();
    super.removeFromGroup();
  }
}
