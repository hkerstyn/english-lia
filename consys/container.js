import {Sizeable}
  from './sizeable.js';
import {TreeNode}
  from './tree.js';


export class Container extends Sizeable {

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


  setRoot(key) {
    let root = new Container('Root');
    this.setParent(root);
    set(key, root.element);
    get(key).className += ' lul-light';
  }

  static updateSizes() {
    let root = get('Root.container');
    if(root == undefined)
      return;

    root.setSize(root.getMinSize());
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

  moveTo(orientationName, ...targetKeys) {
    let targets = [];
    targetKeys.forEach((targetKey) => {
      targets.push(get(targetKey));
    });

    let commonAncestor = TreeNode.commonAncestor(...targets);

    this.addNextTo(orientationName, commonAncestor);
  }

}
  
