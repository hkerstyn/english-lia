class Group {
  constructor() {
    this.items = [];
  }

  recalculateIndices() {
    this.items.forEach((item, i) => {
      item.index = i;
    });

  }
}

class Item {
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

class TreeGroup extends Group {
  constructor(parent) {
    super();
    this.parent = parent;
  }
}

class TreeItem extends Item {
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

class TabGroup extends Group {
  constructor(tabGroupName) {
    super();
    store(this, tabGroupName);
  }

}



class Tab extends Item {

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

class Orientable extends TreeItem {

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
      = Sizeable.getThicknessAndLengthIndex(this.direction);


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
      minSize = Sizeable.addSizes(
        this.direction,
        minSize,
        child.getMinSize()
      ); 
    });
    this.minSize = minSize;
    return minSize;
  }

  static addSizes(direction, size1, size2) {
    let [thicknessIndex, lengthIndex]
      = Sizeable.getThicknessAndLengthIndex(direction);
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


  static getThicknessAndLengthIndex(direction) {
    let thicknessIndex = 1;
    let lengthIndex = 0;
    if(direction == 'column') {
      thicknessIndex = 0;
      lengthIndex = 1;
    }
    return [thicknessIndex, lengthIndex];
  }

}

class Container extends Sizeable {

  constructor(id, size, allowLengthChange) {
    super(id + '.container', size, allowLengthChange);
    this.id = id;
  }

  setTab(tabGroupName) {
    this.tab = new Tab(tabGroupName);
    this.tab.container = this;
    this.element;
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
    }
    this.internalElement = table;
    if(oldElement != undefined) {
      parentElement.insertBefore(table, oldElement);
      oldElement.remove();
    }
    return table;
  }

  addToGroup(group, index) {
    super.addToGroup(group, index);
    this.parent.render();
    Container.updateSizes();
  }

  removeFromGroup() {
    if(this.group == undefined) return;
    let parent = this.group.parent;
    super.removeFromGroup();
    parent.render();
    Container.updateSizes();
  }

  setRoot(key) {
    let root = new Container('Root');
    this.parent = root;
    set(key, root.element);
    get(key).className += ' lul-light';
  }

  static updateSizes() {
    let root = get('Root.container');
    if(root == undefined)
      return;

    root.setSize(root.minSize);
  }
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

  setClass(newClass) {
    this.className = newClass;
    if (this.parent != undefined) {
      this.parent.render(); 
    }
  }

  tabTo() {
    if(this.tab == undefined) return;
    if(this.tab.isActiveTab) return;
    let activeContainer = this.tab.group.activeTab.container;
    this.parent = activeContainer.parent; 
    activeContainer.removeFromGroup();
    this.tab.tabTo();
  }

  moveTo(orientationName, ...targetKeys) {
    let targets = [];
    targetKeys.forEach((targetKey) => {
      targets.push(get(targetKey));
    });

    let commonParent = TreeItem.commonParent(...targets);
    this.addNextTo(orientationName, commonParent);
  }

}

console.log(TreeItem, Tab, Orientation, Orientable, Container);
