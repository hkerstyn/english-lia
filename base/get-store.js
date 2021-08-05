import {truetypeof, uid}
  from './misc.js';

/**
 * @class GetStore
 * @classdesc A {@tutorial PseudoClass}. Responsible for retrieving and
 * storing elements under some {@tutorial key}
 * 
 * @borrows get
 * @borrows store
 * @borrows clear
 * @hideconstructor
 */

//a global object containing all stored elements
var STORED_ELEMENTS = {};



/**
 * Returns the object associated with a {@tutorial key}.
 *
 * @param {key} key - the {@tutorial key} pointing to some object
 * @returns{Object}
 * @tutorial key
 */

export function get(key) {
  if(key == undefined) return undefined;


  let trueType = truetypeof(key);
  if(trueType != 'string') return key;

  if(STORED_ELEMENTS[key] != undefined)
    return STORED_ELEMENTS[key];

  let result =  document.getElementById(key);
  return result;
}


/**
 * Stores an **element** that can now be accessed using [get(**element**)]{@link GetStore.get}
 *
 * If no **key** is provided, [generate one]{@link Misc.uid} and return it.
 *
 * @param {Object} element - an arbitrary object you  
 * want to retrieve later
 * @param {string} key - (optional) use this key to
 * retrieve your **element**
 * @tutorial key
 */

export function store(element, key) {
  if(STORED_ELEMENTS[key] != undefined) {
    console.warn('store: key', key, 'is already taken by', STORED_ELEMENTS[key], 'element:', element, 'Override...');
  }
  if(key == undefined) {
    key = uid();
    console.warn('Defaulting to uid:', key, element);
  }
  STORED_ELEMENTS[key] = element;
  return key;
}

/**
 * Removes the innerHtml of all the provided elements
 *
 * @param {...key} keys - a {@tutorial key} array of elements
 *
  */

export function clear(...keys) {
  for(let key of keys) {
    get(key).innerHTML = '';
  }
}
