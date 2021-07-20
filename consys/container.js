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
 *
 * 
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
  
