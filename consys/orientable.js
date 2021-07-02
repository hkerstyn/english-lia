import {TreeNode}
  from './tree.js';
import {Orientation}
  from './orientation.js';


export class Orientable extends TreeNode {

  constructor(name, direction) {
    super(name);
    if(direction != undefined)
      this.direction = direction;
    else
      this.direction = null;
  }
  

  split(direction, splitParent) {
    if(splitParent == undefined)
      splitParent = new Orientable(uid(), direction);

    splitParent.addAfter(this);
    this.setParent(splitParent);
  }

  addNextTo(orientationName, target) {
    let orientation = Orientation.ofName(orientationName);

    let targetParentDirection;
    if(target.parent != undefined)
      targetParentDirection = target.parent.direction;
    else
      targetParentDirection = 'none';

    if(orientation.direction != targetParentDirection)
      target.split(orientation.direction);


    let oldParent;
    if(this.parent != undefined)
      oldParent = this.parent;


    switch (orientation.factor) {
    case 'neg': this.addBefore(target); break;
    case 'pos': this.addAfter(target); break;
    }

    if(oldParent != undefined)
      if(oldParent.children.length == 1) {
        oldParent.children[0].addAfter(oldParent);
      }
  }
}
