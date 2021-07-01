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


export function gen(name, className) {
  let obj = document.createElement(name);

  if(className != undefined)
    obj.className = className;

  return obj;
}
export function genText(content) {
  let text = gen('span');
  text.innerHTML = content;

  return text;
}


var idCount = 0;
export function uid() {
  idCount++;
  return 'uid' + idCount;
}


export function truetypeof(value) {
  let deepType = Object.prototype.toString.call(value);
  if(deepType == '[object Object]') return 'object';
  if(deepType == '[object Array]') return 'array';
  if(deepType.includes('HTML')) return 'html';
  if(deepType == '[object String]') return 'string';

  console.warn('No valid type identified.');
  console.warn('value: ', value);
  console.warn('deepType: ', deepType);
}
