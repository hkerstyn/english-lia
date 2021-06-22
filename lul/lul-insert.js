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


export function store(element, id) {
  if(STORED_ELEMENTS[id] != undefined) {
    console.warn("store: id", id, "is already taken by", STORED_ELEMENTS[id], "element:", element);
    id = undefined;
  }
  if(id == undefined) {
    id = uid();
    console.warn("Defaulting to uid:", id, element);
  }

  STORED_ELEMENTS[id] = element;
  return id;
}

export function get(key) {
  if(key == undefined) return undefined;

  let trueType = truetypeof(key);
  if(trueType == 'html') return key;

  if(STORED_ELEMENTS[key] != undefined)
  return STORED_ELEMENTS[key];

  return document.getElementById(key);
}



export function set(parentKey, ...elementKeys) {
  insert('set', parentKey, ...elementKeys);
}
export function add(parentKey, ...elementKeys) {
  insert('add', parentKey, ...elementKeys);
}
export function make(parentKey, ...elementKeys) {
  insert('make', parentKey, ...elementKeys);
}



export function insert(mode, parentKey, ...elementKeys) {
  let parent = get(parentKey);
  if(mode == undefined) mode = "set";

  if(mode == "make" && parent.childNodes.length > 0) return;
  if(mode == "set") parent.childNodes = [];
  elementKeys.forEach((elementKey) => {
    parent.appendChild(get(elementKey));
  });
}
