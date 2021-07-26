import {TreeNode}
  from './tree.js';
import {Orientation}
  from './orientation.js';

//orientables can position their children either horizontally or vertically
export class Orientable extends TreeNode {

  //creates an orientable of a given name and direction
  constructor(name, direction) {
    super(name);
    if(direction != undefined)
      this.direction = direction;
    else
      this.direction = null;
  }

  //splitParent dazwischenklemmen
  split(direction, splitParent) {
    if(splitParent == undefined)
      splitParent = new Orientable(uid(), direction);

    splitParent.addAfter(this);
    this.setParent(splitParent);
  }

  //adds an orientable above, below, or next to some target orientable
  addNextTo(orientationName, target) {
    //turn orientationName into an Orientation
    let orientation = Orientation.ofName(orientationName);

    //get direction of target's parent
    let targetParentDirection;
    if(target.parent != undefined)
      targetParentDirection = target.parent.direction;
    else
      targetParentDirection = 'none';

    //split target if necessary
    if(orientation.direction != targetParentDirection)
      target.split(orientation.direction);

    //remember old parent
    let oldParent;
    if(this.parent != undefined)
      oldParent = this.parent;

    //add this next to target
    switch (orientation.factor) {
    case 'neg': this.addBefore(target); break;
    case 'pos': this.addAfter(target); break;
    }

    if(oldParent != undefined) {
      //if former sibling is single child,
      //move it up a generation
      if(oldParent.children.length == 1) {
        oldParent.children[0].addAfter(oldParent);
        oldParent.setParent();
      }

      //if this was a single child,
      //oldParent.removeIfChildless();
    }
  }

  removeIfChildless() {
    if(this.children.length > 0)
      return;

    let parent = this.parent;
    this.setParent();
    if(parent != undefined)
      parent.removeIfChildless();
  }
}
