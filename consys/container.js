import {Sizeable}
  from './sizeable.js';
import {TreeNode}
  from './tree.js';

/**
 * The **Container** class provides a small set of functions,  
 * allowing you to easily tile your Webpage without the need to  
 * have the HTML-shape of the container system in mind all the time.
 *
 * Furthermore, the functions have been written to be able to
 * eventually support resizing and moving of containers via some UI
 * (which would of course still have to be programmed).
 */

export class Container extends Sizeable {

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
  
