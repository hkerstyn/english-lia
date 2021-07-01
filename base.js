/*
  gen(name, className)
  genText(content)
  uid()
  truetypeof(value)

  This script provides a handful of utility functions
  used by many different scripts of the lul.
  None of its functions are being imported via rollup.
  Therefore, this script needs to be sourced
  just like lul.js

  gen(name, className): Creates an HTML-Element with
    a given type (name) and
    optionally a css class attribute

  genText(content): generates an HTML-span where
    'content' is a string representing its innerHTML

  uid(): returns a different string on each invocation

  truetypeof(value): determines a string
    based on the object type of value.
    The possible return values are:
      'object'
      'array'
      'html'
      'string'
      undefined
*/


function gen(name, className) {
  let obj = document.createElement(name);

  if(className != undefined)
    obj.className = className;

  return obj;
}
function genText(content) {
  let text = gen('span');
  text.innerHTML = content;

  return text;
}


var idCount = 0;
function uid() {
  idCount++;
  return 'uid' + idCount;
}


function truetypeof(value) {
  let deepType = Object.prototype.toString.call(value);
  if(deepType == '[object Object]') return 'object';
  if(deepType == '[object Array]') return 'array';
  if(deepType.includes('HTML')) return 'html';
  if(deepType == '[object String]') return 'string';

  console.warn('No valid type identified.');
  console.warn('value: ', value);
  console.warn('deepType: ', deepType);
}

/*
  store(element, id)
  get(key)
  insert(mode, parentKey, ...elementKeys)
  set(parentKey, ...elementKeys)
  make(parentKey, ...elementKeys)
  add(parentKey, ...elementKeys)
  
  This script is responsible for placing (and returning)
  HTML-Elements in the document or the STORED_ELEMENTS object

  store(element, id): stores the element under 'id'
    inside STORED_ELEMENTS
    if no id is given, a unique new one is used
    and returned

  get(key): if 'key' is
    an HTML-Element:
      returns 'key'
    a string:
      returns (if present) the element stored under 'key'
      inside STORED_ELEMENTS
      otherwise, searches the HTML-DOM for an element
      with id 'key'

  insert(mode, parentKey, ...elementKeys):
    'parentKey' and 'elementKeys' are references
      to some HTML-Elements (see get())
    sets the elements as children of the parent
    if 'mode' is equal to
    "set":
      the parent is being cleared of previous children
    "make":
      the process gets aborted
      if parent already has children
    "add":
      the new children are simply added to the existing ones


  set(parentKey, ...elementKeys)
  make(parentKey, ...elementKeys)
  add(parentKey, ...elementKeys):
    shorthands for insert()
*/

var STORED_ELEMENTS = {};

function store(element, id) {
  if(STORED_ELEMENTS[id] != undefined) {
    console.warn('store: id', id, 'is already taken by', STORED_ELEMENTS[id], 'element:', element);
    id = undefined;
  }
  if(id == undefined) {
    id = uid();
    console.warn('Defaulting to uid:', id, element);
  }

  STORED_ELEMENTS[id] = element;
  return id;
}

function get(key) {
  if(key == undefined) return undefined;

  let trueType = truetypeof(key);
  if(trueType == 'html') return key;

  if(STORED_ELEMENTS[key] != undefined)
    return STORED_ELEMENTS[key];

  return document.getElementById(key);
}



function set(parentKey, ...elementKeys) {
  insert('set', parentKey, ...elementKeys);
}
function add(parentKey, ...elementKeys) {
  insert('add', parentKey, ...elementKeys);
}
function make(parentKey, ...elementKeys) {
  insert('make', parentKey, ...elementKeys);
}



function insert(mode, parentKey, ...elementKeys) {
  let parent = get(parentKey);
  if(mode == undefined) mode = 'set';

  if(mode == 'make' && parent.childNodes.length > 0) return;
  if(mode == 'set') parent.childNodes
    .forEach((child) => {child.remove();});

  elementKeys.forEach((elementKey) => {
    parent.appendChild(get(elementKey));
  });
}

console.log(
  get, store, set, add, make, insert,
  gen, genText, uid, truetypeof
);
