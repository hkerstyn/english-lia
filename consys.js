class TreeNode {

  constructor(name) {
    this.name = name;
    store(this, name);
    this.children = [];
  }

  recalculateIndices() {
    this.children.forEach((child, i) => {
      child.index = i;
    });
  }

  *[Symbol.iterator]() {
    yield this;
    for(let child of this.children)
      yield* child;
  }

  *youngestPredecessorGenerator() {
    if(this.children.length == 0)
      yield this;
    else
      for(let child of this.children)
        yield* child.youngestPredecessorGenerator();
  }


  setParent(parent, index) {
    if(this.parent != undefined) {
      this.parent.children.splice(this.index, 1);
      this.parent.recalculateIndices();
    }

    if(index == undefined)
      parent.children.push(this);
    else
      parent.children.splice(index, 0, this);

    this.parent = parent;
    parent.recalculateIndices();
  }

  addAsSiblingOf(sibling, index) {
    this.setParent(sibling.parent, index);
  }
  addAfter(sibling) {
    this.addAsSiblingOf(sibling, sibling.index + 1);
  }
  addBefore(sibling) {
    this.addAsSiblingOf(sibling, sibling.index);
  }

  get ancestors() {return [...this.ancestorGenerator()];}

  *ancestorGenerator() {
    yield this;
    if(this.parent != undefined)
      yield* this.parent.ancestorGenerator();
  }

  commonAncestor(...treeNodes) {
    return TreeNode.commonAncestor(this, ...treeNodes);
  }
  static commonAncestor(...treeNodes) {
    if (treeNodes.length == 1) {
      return treeNodes[0]; 
    }
    return getCommonAncestor(...treeNodes);
  }

}


//returns the smallest common Parent of a number of treeNodes

function getCommonAncestor(...treeNodes) {
  if(treeNodes.length > 2)
    return getCommonAncestor(treeNodes[0],
      getCommonAncestor(...treeNodes.slice(1)));

  let comparatorGenerator = treeNodes[1].ancestorGenerator();

  for(let comparatorNode of comparatorGenerator) {
    let referenceGenerator = treeNodes[0].ancestorGenerator();
    for(let referenceNode of referenceGenerator) {
      if(referenceNode == comparatorNode)
        return referenceNode;
    }
  }
  return undefined;
}

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

class Orientation {
  constructor(direction, factor) {
    this.direction = direction;
    this.factor = factor;
  }
  static ofName(name) {
    let correctEntry = NAME_DICT
      .find(entry => (entry.name == name))
      .orientation;
    return new Orientation(correctEntry.direction, correctEntry.factor);
  }
  get name() {
    return NAME_DICT
      .find(entry => (
        (entry.orientation.direction == this.direction)&&
      (entry.orientation.factor == this.factor)))
      .name;
  }
}

class Orientable extends TreeNode {

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

class Sizeable extends Orientable {

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

/**
 * The **Container** class provides a small set of functions,  
 * allowing you to easily tile your Webpage without the need to  
 * have the HTML-shape of the container system in mind all the time.
 *
 * Furthermore, the functions have been written to be able to
 * eventually support resizing and moving of containers via some UI
 * (which would of course still have to be programmed).
 *
 * 
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


  
  get element() {
    if(this.internalElement == undefined) return this.render();
    else return this.internalElement;
  }


  render() {
    let oldElement;
    let parentElement;
    if(this.internalElement != undefined) {
      oldElement = this.internalElement;
      parentElement = this.internalElement.parentNode;
    }

    let table = gen('table', 'consys-container');
    let row = gen('tr', 'consys-container');
    if(this.children.length > 0) {
      for(let child of this.children) {
        let cell = gen('td', 'consys-container');
        if (child.className != undefined) {
          cell.className += ' ' + child.className;
        }

        cell.appendChild(child.element);
        row.appendChild(cell);
        table.appendChild(row);

        if(this.direction == 'column')
          row = gen('tr', 'consys-container') ;
      }
    } else {
      let cell = gen('td', 'consys-container');
      if(this.id != undefined)
        cell.setAttribute('id', this.id);
      cell.appendChild(genText(this.id));
      row.appendChild(cell);
      table.appendChild(row);
      store(cell, this.id);
    }
    this.internalElement = table;
    if(oldElement != undefined) {
      parentElement.insertBefore(table, oldElement);
      oldElement.remove();
    }
    return table;
  }

  setParent(parent, index) {
    let oldParent;
    if(this.parent != undefined)
      oldParent = this.parent;

    super.setParent(parent, index);
    parent.render();
    
    if(oldParent != undefined)
      oldParent.render();

    Container.updateSizes();
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
   * use this to loop over all containers that were already placed using  
   * [Container.setRoot]{@link Container#setRoot} or
   * [Container.moveTo]{@link Container#moveTo}  
   * like in
    * ```
   * for(let container of Container.all)
   * container.setClass('lul-light');
   *
   * ```
   * To get an array of all manually placed containers,  
   * use
   * ```
   * let myArray = [...Container.all];
   *
   * ```
   *
   *
   */
  static get all() {
    return get('Root.container').youngestPredecessorGenerator();
  }

  static updateSizes() {
    let root = get('Root.container');
    if(root == undefined)
      return;

    root.setSize(root.getMinSize());
  }

  /**
   * Use this to change the size of a container (don't modify the **size** property directly).
   * @param {Array} size - two numbers describing minimum **width** and **height** 
   */
  setSize(size) {
    super.setSize(size);
    this.element.style.width = size[0] + 'px';
    this.element.style.height = size[1] + 'px';
  }

  split(direction) {
    let splitParent = new Container(uid());
    splitParent.direction = direction;
    super.split(direction, splitParent);
  }


  /**
   * this function allows you to change the look of a container,  
   * simply change the css-class to something new
   *
   * **TIP:** to make all (already placed) containers visible, use:
   * ```
   * for(let container of Container.all)
   * container.setClass('lul-light');
   *
   * ```
   *
   *
   * @param {string} newClass - a css class name.
   */
  setClass(newClass) {
    this.className = newClass;
    if (this.parent != undefined) {
      this.parent.render(); 
    }
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

}

console.log(Container);
