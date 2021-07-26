import {Orientable}
  from './orientable.js';

//sizeables have a rectangular size
export class Sizeable extends Orientable {

  //construct a sizeable with a name, size and grow-permission
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

  //returns the minimum size a sizeable needs to get,
  //including its predecessors
  getMinSize() {
    //without predecessors, trivially return own specified minSize
    if(this.children.length == 0)
      return this.minSize;
    
    //with predecessors, add their sizes together
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

  //gives resizes all children to fit this size
  setSize(size) {
    //calculate minimum size from children
    let minSize = this.getMinSize();

    //map width and height onto thickness and lenght
    let [thicknessIndex, lengthIndex]
      = getThicknessAndLengthIndex(this.direction);


    //determine the factor by which each child has to grow in length
    //(granted it allows it)
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
      console.error('Desired size of a sizeable is smaller than its minimum size');

    //adjust sizes of children
    this.children.forEach((child) => {
      //calculate child size:
      //* thickness is the same as in this 
      //* length gets maybe multiplied by our factor
      let childSize = [0, 0];
      childSize[thicknessIndex] = size[thicknessIndex];
      childSize[lengthIndex] = child.minSize[lengthIndex];
 
      if(child.allowLengthChange[lengthIndex])
        childSize[lengthIndex] *= changeLengthFactor;
 
      //apply
      child.setSize(childSize);
    });


    this.size = size;
  }

}

//adds two sizes considering a specific direction
function addSizes(direction, size1, size2) {
  //determine thickness and length
  let [thicknessIndex, lengthIndex]
      = getThicknessAndLengthIndex(direction);

  let compoundSize = [0, 0];

  //the greater thickness is the compound thickness
  compoundSize[thicknessIndex] = Math.max(
    size1[thicknessIndex],
    size2[thicknessIndex]
  );

  //the sum of lengths is the compound length
  compoundSize[lengthIndex] = 
      size1[lengthIndex]
    + size2[lengthIndex];

  return compoundSize;
}

//thickness and length correspond to width and height such that:
//*thickness is perpendicular to direction
//*length follows direction
//this function returns the indices necessary to retrieve the correct parameter
function getThicknessAndLengthIndex(direction) {
  //assume direction == 'row'
  let thicknessIndex = 1;
  let lengthIndex = 0;

  //correct if necessary
  if(direction == 'column') {
    thicknessIndex = 0;
    lengthIndex = 1;
  }

  //return both indices as array (for later destructuring)
  return [thicknessIndex, lengthIndex];
}


