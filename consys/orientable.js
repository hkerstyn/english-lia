import {TreeItem}
  from './tree.js';
import {Orientation}
  from './orientation.js';


export class Orientable extends TreeItem {

  constructor(name, direction) {
    super(name);
    if(direction != undefined)
      this.direction = direction;
  }
  

  split(direction, splitParent) {
    if(splitParent == undefined)
      splitParent = new Orientable(uid(), direction);

    splitParent.addToGroupAfter(this);
    this.parent = splitParent;
  }
  addNextTo(orientationName, target) {
    let orientation = Orientation.ofName(orientationName);

    if(orientation.direction != target.parent.direction)
      target.split(orientation.direction);


    let oldParent = this.parent;
    switch (orientation.factor) {
    case 'neg': this.addToGroupBefore(target); break;
    case 'pos': this.addToGroupAfter(target); break;
    }

    if(oldParent != undefined)
      if(oldParent.children.length == 1) {
        oldParent.children[0].addToGroupAfter(oldParent);
        oldParent.removeFromGroup();
      }
  }
}
