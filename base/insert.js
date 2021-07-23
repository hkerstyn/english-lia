import {get, store}
  from './get-store.js';

/**
 * @class Insert
 * @classdesc A {@tutorial PseudoClass}. Resposible for inserting
 * Elements into the HTML-page
 * @borrows set
 * @borrows add
 * @borrows make
 * @borrows insert
 * @hideconstructor
 */



/**
 * Sets one or several **elements** as children
 * of some **parent** element.  
 * All previous children of **parent** get cleared.
 *
 *
 * @param {key} parentKey - the {@tutorial key} to the **parent** element
 * @param {...key} elementKeys - the [keys]{@tutorial key} to one or multiple **elements**
 * @tutorial key
 */

export function set(parentKey, ...elementKeys) {
  insert('set', parentKey, ...elementKeys);
}

/**
 * Sets one or several **elements** as children
 * of some **parent** element.  
 * All previous children of **parent** remain next to the new ones.
 *
 *
 * @param {key} parentKey - the {@tutorial key} to the **parent** element
 * @param {...key} elementKeys - the [keys]{@tutorial key} to one or multiple **elements**
 * @tutorial key
 */

export function add(parentKey, ...elementKeys) {
  insert('add', parentKey, ...elementKeys);
}

/**
 * Sets one or several **elements** as children
 * of some **parent** element.  
 * If **parent** already has children, the process gets aborted
 *
 *
 * @param {key} parentKey - the {@tutorial key} to the **parent** element
 * @param {...key} elementKeys - the [keys]{@tutorial key} to one or multiple **elements**
 * @tutorial key
 */

export function make(parentKey, ...elementKeys) {
  insert('make', parentKey, ...elementKeys);
}



/**
 * Sets one or several **elements** as children
 * of some **parent** element.  
 * The behaviour is like that of [set]{@link Insert.set}, [make]{@link Insert.make} or [add]{@link Insert.add},  
 * depending on the value of **mode**
 *
 * @param {string} mode - either "set", "make", or "add"
 * @param {key} parentKey - the {@tutorial key} to the **parent** element
 * @param {...key} elementKeys - the [keys]{@tutorial key} to one or multiple **elements**
 * @tutorial key
 */

export function insert(mode, parentKey, ...elementKeys) {
  let parent = get(parentKey);
  if(mode == undefined) mode = 'set';

  if(mode == 'make' && parent.childNodes.length > 0) return;
  if(mode == 'set') parent.childNodes
    .forEach((child) => {child.remove();});

  elementKeys.forEach((elementKey) => {
    parent.appendChild(get(elementKey));
  });
}
