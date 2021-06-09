import {genElementArray} from './lul-gen/lul-gen.js';
import {insertElement} from './lul-insert/lul-insert.js';
import {hideRaw, revealRaw} from './lul-display/lul-display.js';

export function genElement(arg) {
  let elementArray = genElementArray(arg);
  if(arg.insert != undefined)
  insertElementByTargetValue(elementArray, arg.insert);
  if(elementArray.length == 1) return elementArray[0];
  return elementArray;
}



function genOfType(arg, type) {
  arg.type = type;
  return genElement(arg);
}

export function genRadio(arg) {
  return genOfType(arg, "radio");
}

export function genEnter(arg) {
  return genOfType(arg, "enter");
}

export function genRange(arg) {
  return genOfType(arg, "range");
}
export function genCheck(arg) {
  return genOfType(arg, "check");
}
export function genButton(arg) {
  return genOfType(arg, "button");
}
export function genEntry(arg) {
  return genOfType(arg, "entry");
}
export function genContainer(arg) {
  return genOfType(arg, "container");
}
export function genCollapsible(arg) {
  return genOfType(arg, 'collapsible');
}


function insertElementByTargetValue(elementValue, insert) {
  let targetArray = genElementArray(insert.target);
  let newInsert = {target: targetArray, mode: insert.mode};
  insertElement(genElementArray(elementValue), newInsert);
}

export function set(targetValue, elementValue) {
  insertElementByTargetValue(elementValue, {target: targetValue, mode:"set"});
}
export function make(targetValue, elementValue) {
  insertElementByTargetValue(elementValue, {target: targetValue, mode:"make"});
}
export function add(targetValue, elementValue) {
  insertElementByTargetValue(elementValue, {target: targetValue, mode:"add"});
}


export function hide(targetValue) {

  hideRaw(genElementArray(targetValue));
}

export function reveal(targetValue) {
  revealRaw(genElementArray(targetValue));
}

//reveals element and hides all others of the same solo group
export function solo(targetValue, soloGroup) {
  if(soloGroup == undefined) var soloGroup = DEFAULT_SOLO_GROUP;
  if(soloGroup == null || !soloGroup.length > 0) return;
  hide(soloGroup)
  reveal(targetValue);
}

var DEFAULT_SOLO_GROUP;
export function setDefaultSoloGroup(soloGroup) {DEFAULT_SOLO_GROUP = soloGroup;}
