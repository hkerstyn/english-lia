import {Orientable}
  from './orientable.js';


export class Sizeable extends Orientable {

  constructor(name, minSize, allowLengthChange) {
    super(name);
    if(minSize == undefined)
      this.minSize = [0,0];
    else
      this.minSize = minSize;
    this.size = minSize;

    if(allowLengthChange == undefined)
      this.allowLengthChange = [true, true];
    else
      this.allowLengthChange = allowLengthChange;
  }

  setSize(size) {
    let minSize = this.getMinSize();

    let [thicknessIndex, lengthIndex]
      = getThicknessAndLengthIndex(this.direction);


    let lengthToGain = size[lengthIndex] - minSize[lengthIndex];
    let changeableLength = 0;
    this.children.forEach((child) => {
      if (child.allowLengthChange[lengthIndex]) {
        changeableLength += child.minSize[lengthIndex];
      }
    });

    let changeLengthFactor = (
      ( changeableLength + lengthToGain )
      / changeableLength
    );
    if(changeLengthFactor < 1)
      console.error('Too small factor');

    this.children.forEach((child) => {
      let childSize = [0, 0];
      childSize[thicknessIndex] = size[thicknessIndex];
      childSize[lengthIndex] = child.minSize[lengthIndex];

      if(child.allowLengthChange[lengthIndex])
        childSize[lengthIndex] *= changeLengthFactor;

      child.setSize(childSize);
    });
    this.size = size;
  }
  
  getMinSize() {
    if(this.children.length == 0)
      return this.minSize;
    
    let minSize = [0, 0];
    this.children.forEach((child) => {
      minSize = addSizes(
        this.direction,
        minSize,
        child.getMinSize()
      ); 
    });
    this.minSize = minSize;
    return minSize;
  }
}

function addSizes(direction, size1, size2) {
  let [thicknessIndex, lengthIndex]
      = getThicknessAndLengthIndex(direction);
  let compoundSize = [0, 0];

  compoundSize[thicknessIndex] = Math.max(
    size1[thicknessIndex],
    size2[thicknessIndex]
  );
  compoundSize[lengthIndex] = 
      size1[lengthIndex]
    + size2[lengthIndex];

  return compoundSize;
}

function getThicknessAndLengthIndex(direction) {
  let thicknessIndex = 1;
  let lengthIndex = 0;
  if(direction == 'column') {
    thicknessIndex = 0;
    lengthIndex = 1;
  }
  return [thicknessIndex, lengthIndex];
}


