import {Group, Item}
  from './item.js';

export class TreeGroup extends Group {
  constructor(parent) {
    super();
    this.parent = parent;
  }
}

export class TreeItem extends Item {
  constructor(name) {
    super(name);
    this.childGroup = new TreeGroup(this);
  }

  get children() {
    return this.childGroup.items;
  }

  *[Symbol.iterator]() {
    yield this;
    for(let child of this.children)
      yield* child;
  }



  get parent() {
    if(this.group == undefined)
      return undefined;
    return this.group.parent;
  }
  set parent(newParent) {
    this.setParent(newParent);
  }
  setParent(newParent, index) {
    this.addToGroup(newParent.childGroup, index);
  }

  get parents() {return [...this.parentGenerator()];}

  *parentGenerator() {
    yield this;
    if(this.parent != undefined)
      yield* this.parent.parentGenerator();
  }

  commonParent(...treeItems) {
    return TreeItem.commonParent(...treeItems);
  }
  static commonParent(...treeItems) {
    if (treeItems.length == 1) {
      return treeItems[0]; 
    }
    return getCommonParent(this, ...treeItems);
  }



}


//returns the smallest common Parent of a number of treeItems

function getCommonParent(...treeItems) {
  if(treeItems.length > 2)
    return getCommonParent(treeItems[0],
      getCommonParent(...treeItems.slice(1)));

  let comparatorGenerator = treeItems[1].parentGenerator();

  for(let comparatorItem of comparatorGenerator) {
    let referenceGenerator = treeItems[0].parentGenerator();
    for(let referenceItem of referenceGenerator) {
      if(referenceItem == comparatorItem)
        return referenceItem;
    }
  }
  return undefined;
}
