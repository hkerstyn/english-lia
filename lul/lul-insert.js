
var STORED_ELEMENTS = {};


export function store(element, id) {
  // check if id is already taken
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



export function set(key, ...elements) {
  insert('set', key, ...elements);
}
export function add(key, ...elements) {
  insert('add', key, ...elements);
}
export function make(key, ...elements) {
  insert('make', key, ...elements);
}



export function insert(mode, key, ...elements) {
  let target = get(key);
  if(mode == undefined) mode = "set";

  if(mode == "make" && target.childNodes.length > 0) return;
  if(mode == "set") target.childNodes = [];
  elements.forEach((element) => {
    target.appendChild(get(element));
  });
}
