export class Group {
  constructor() {
    this.items = [];
  }

  recalculateIndices() {
    this.items.forEach((item, i) => {
      item.index = i;
    });

  }
}

export class Item {
  constructor(name) {
    this.name = name;
    store(this, name);
  }


  addToGroup(group, index) {
    this.removeFromGroup();

    if(index == undefined)
      group.items.push(this);
    else
      group.items.splice(index, 0, this);

    this.group = group;
    this.group.recalculateIndices();
  }
  addToGroupOf(item, index) {
    this.addToGroup(item.group, index);
  }
  addToGroupAfter(item) {
    this.addToGroupOf(item, item.index + 1);
  }
  addToGroupBefore(item) {
    this.addToGroupOf(item, item.index);
  }

  removeFromGroup() {
    if(this.group == undefined) return;
    this.group.items.splice(this.index, 1);

    this.group.recalculateIndices();
    this.group = undefined;
    this.index = undefined;
  }

  get next() {
    return this.group.items[this.index + 1];
  }

  get previous() {
    return this.group.items[this.index - 1];
  }
}
