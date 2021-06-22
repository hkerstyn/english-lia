/*
   Provides gen() and genRaw() as shorthands for document.createElement()

   Provides get() as shorthand for document.getElementById()
*/

function truetypeof(value) {
  let deepType = Object.prototype.toString.call(value);
  if(deepType == '[object Object]') return 'object';
  if(deepType == '[object Array]') return 'array';
  if(deepType.includes('HTML')) return 'html';
  if(deepType == '[object String]') return 'string';

  console.warn("No valid type identified.");
  console.warn("value: ", value);
  console.warn("deepType: ", deepType);
}

//creates element named name
function genRaw(name) {return document.createElement(name);}

//creates an element and sets its css-class
function gen(name, className) {
  let obj = genRaw(name);
  obj.className = className;
  return obj;
}
function genText(content) {
  let text = genRaw("span");
  text.innerHTML = content;
  return text;
}

// //appends multiple children at once
// function appendChildren(element, children) {
//   if(children == undefined) return;
//   children.forEach((child) => {
//     element.appendChild(child);
//   });
//
// }
var idCount = 0;
function uid() {
  idCount++;
  return 'uid' + idCount;
}
