// a simple class allowing familiy trees
// ie parents and children
class TreeNode {

  //create a new TreeNode of a given name
  constructor(name) {
    this.name = name;
    store(this, name);
    this.children = [];
  }

  //take care of children
  recalculateIndices() {
    this.children.forEach((child, i) => {
      child.index = i;
    });
  }

  //set a node's parent
  setParent(parent, index) {
    //remove from old parent
    if(this.parent != undefined) {
      this.parent.children.splice(this.index, 1);
      this.parent.recalculateIndices();
    }
    if(parent == undefined) return;

    //add to new parent
    if(index == undefined)
      parent.children.push(this);
    else
      parent.children.splice(index, 0, this);

    this.parent = parent;
    parent.recalculateIndices();
  }

  //set a node's parent via its sibling
  addAsSiblingOf(sibling, index) {
    this.setParent(sibling.parent, index);
  }
  addAfter(sibling) {
    this.addAsSiblingOf(sibling, sibling.index + 1);
  }
  addBefore(sibling) {
    this.addAsSiblingOf(sibling, sibling.index);
  }

  


  //yields this and all predecessors
  *[Symbol.iterator]() {
    yield this;
    for(let child of this.children)
      yield* child;
  }

  //yields all childless predecessors
  *youngestPredecessorGenerator() {
    if(this.children.length == 0)
      yield this;
    else
      for(let child of this.children)
        yield* child.youngestPredecessorGenerator();
  }

  //yields all ancestors
  *ancestorGenerator() {
    yield this;
    if(this.parent != undefined)
      yield* this.parent.ancestorGenerator();
  }

  //returns all ancestors in an array
  get ancestors() {return [...this.ancestorGenerator()];}

  //returns the smallest common ancestor of a number of tree-nodes
  static commonAncestor(...treeNodes) {
    //if only one is provided, return it
    if (treeNodes.length == 1) 
      return treeNodes[0]; 
    //if more than two are provided, recurse
    if(treeNodes.length > 2)
      return TreeNode.commonAncestor(treeNodes[0], TreeNode.commonAncestor(...treeNodes.slice(1)));

    //exactly two
    //compare their ancestors
    let comparatorGenerator = treeNodes[1].ancestorGenerator();
    for(let comparatorNode of comparatorGenerator) {
      let referenceGenerator = treeNodes[0].ancestorGenerator();
      for(let referenceNode of referenceGenerator) {
        if(referenceNode == comparatorNode)
          return referenceNode;
      }
    }

    //if no common ancestor is found, return undefined
    console.warn('No common ancestor found');
    return undefined;
  }

}

//the name dictionary maps together the
//* name
//* direction and factor
//of an Orientation
const NAME_DICT = [
  {
    name: 'up',
    orientation: {direction: 'column', factor: 'neg'}
  },
  {
    name: 'down',
    orientation: {direction: 'column', factor: 'pos'}
  },
  {
    name: 'left',
    orientation: {direction: 'row', factor: 'neg'}
  },
  {
    name: 'right',
    orientation: {direction: 'row', factor: 'pos'}
  }
];

// an orientation holds the following properties:
// * direction {'row'|'column'}
// * factor {'pos'|'neg'}
class Orientation {

  //creates a new Orientation by direction and factor
  constructor(direction, factor) {
    this.direction = direction;
    this.factor = factor;
  }

  //creates a new Orientation by name {'up'|'left'|'down'|'right'}
  static ofName(name) {
    //searches the name dictionary
    let correctEntry = NAME_DICT
      .find(entry => (entry.name == name))
      .orientation;

    //creates a matching Orientation
    return new Orientation(correctEntry.direction, correctEntry.factor);
  }

  //returns the matching name of an Orientation
  get name() {
    //search the name dictionary for a matching Orientation and return its name
    return NAME_DICT
      .find(entry => (
        (entry.orientation.direction == this.direction)&&
      (entry.orientation.factor == this.factor)))
      .name;
  }
}

//orientables can position their children either horizontally or vertically
class Orientable extends TreeNode {

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

//sizeables have a rectangular size
class Sizeable extends Orientable {

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

/**
 * The **Container** class provides a small set of functions,  
 * allowing you to easily tile your Webpage without the need to  
 * have the HTML-shape of the container system in mind all the time.
 *
 * Furthermore, the functions have been written to be able to
 * eventually support resizing and moving of containers via some UI
 * (which would of course still have to be programmed).
 */

class Container extends Sizeable {

  /**
   * Creates a new Container.
   *
   * @param {string} id - the {@tutorial key} for this **Container**
   * @param {Array} size - two numbers describing minimum **width** and **height** 
   * @param {Array} allowLengthChange - (optional) two bools describing whether **widht**  and **height**  may get expanded
   */

  constructor(id, size, allowLengthChange) {
    super(id + '.container', size, allowLengthChange);
    this.id = id;
  }

  /**
   * returns an array of all containers that were already placed using  
   * [Container.setRoot]{@link Container#setRoot} or
   * [Container.moveTo]{@link Container#moveTo}  
   */

  static get all() {
    return [...get('Root.container').youngestPredecessorGenerator()];
  }

  /**
   * Use this to place the first container into the webpage.
   * All future containers should be added using [Container.moveTo]{@link Container#moveTo} 
   *
   * @param {key} key - the {@tutorial key} referring to some HTML-Element, in this case  
   * probably the id of some empty **div** on your page
   */

  setRoot(key) {
    let root = new Container('Root');
    this.setParent(root);
    set(key, root.element);
    get(key).className += ' lul-light';
  }

  /**
   * Moves this **Container**  next to another container.  
   * This (and [Container.setRoot]{@link Container#setRoot}) is the preferred way of
   * placing a **Container**  somewhere (or moving it somewhere else)
   *
   * @param {'left'|'right'|'up'|'down'} orientationName - where to place this **Container** relative to the
   * new one
   * @param {...key} targetKeys - a {@tutorial key} to another Container.  
   * If multiple are provided, it takes their smallest common Parent.
   */

  moveTo(orientationName, ...targetKeys) {
    let targets = [];
    targetKeys.forEach((targetKey) => {
      targets.push(get(targetKey));
    });

    let commonAncestor = TreeNode.commonAncestor(...targets);

    this.addNextTo(orientationName, commonAncestor);
  }


  /**
   * this function allows you to change the look of a container,  
   * simply change the css-class to something new
   *
   * @param {string} newClass - a css class name.
   */

  setClass(newClass) {
    this.className = newClass;
    if (this.parent != undefined) {
      this.parent.render(); 
    }
  }




  //nifty getter to avoid unnecessary recomputation
  get element() {
    if(this.internalElement == undefined) return this.render();
    else return this.internalElement;
  }

  //(re-)draw the html-element
  render() {
    //remember the old element
    let oldElement;
    let parentElement;
    if(this.internalElement != undefined) {
      oldElement = this.internalElement;
      parentElement = this.internalElement.parentNode;
    }

    //create table 
    let table = gen('table', 'consys-container');
    let row = gen('tr', 'consys-container');
    if(this.children.length > 0) {

      //for every child, put its table inside a <td>
      for(let child of this.children) {
 
        let cell = gen('td', 'consys-container');
        if (child.className != undefined) {
          cell.className += ' ' + child.className;
        }
 
        cell.appendChild(child.element);
        row.appendChild(cell);
        table.appendChild(row);
 
        //1 or n rows depending on direction
        if(this.direction == 'column')
          row = gen('tr', 'consys-container') ;
      }
    } else {

      //just a table with only one <td>
      let cell = gen('td', 'consys-container');
      if(this.id != undefined)
        cell.setAttribute('id', this.id);
      if (oldElement != undefined) {
        let oldContent = oldElement.firstChild.firstChild.firstChild;
        if(oldContent != undefined)
          cell.appendChild(oldContent);
      }
      row.appendChild(cell);
      table.appendChild(row);
      store(cell, this.id);
    }

    //put the new element where the remembered old one was
    if(oldElement != undefined) {
      parentElement.insertBefore(table, oldElement);
      oldElement.remove();
    }

    this.internalElement = table;
    return table;
  }

  //set size (internal)
  setSize(size) {
    super.setSize(size);
    this.element.style.width = size[0] - 1 + 'px';
    this.element.style.height = size[1] - 1 + 'px';
  }


  //(internal) set container parent
  //redraw
  setParent(parent, index) {
    let oldParent;
    if(this.parent != undefined)
      oldParent = this.parent;

    super.setParent(parent, index);

    if(parent !=undefined)
      parent.render();
    
    if(oldParent != undefined)
      oldParent.render();

    Container.updateSizes();
  }


  // recalculate container sizes
  static updateSizes() {
    let root = get('Root.container');
    if(root == undefined)
      return;

    root.setSize(root.getMinSize());
  }

  split(direction) {
    let splitParent = new Container(uid());
    splitParent.direction = direction;
    super.split(direction, splitParent);
  }

  static printTree() {
    let treeLines = get('Root.container').getTreeLines();
    let resultString = '';
    treeLines.forEach((treeLine) => {
      resultString += treeLine + '\n';
    });
    console.log(resultString);
  }
  getTreeLines() {
    let treeLines = [];
    let prefix = '  ';
    
    //adding own node to tree
    treeLines.push(prefix + this.id);
    
    this.children.forEach((child) => {
      let childTreeLines = child.getTreeLines();
      for(let i = 0; i < childTreeLines.length; i++)
        childTreeLines[i] = prefix + childTreeLines[i];

      treeLines = treeLines.concat(childTreeLines);
    });

    return treeLines;
  }
}

console.log(Container);
