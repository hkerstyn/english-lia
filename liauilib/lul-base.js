/*
   Provides gen() and genRaw() as shorthands for document.createElement()

   Provides get() as shorthand for document.getElementById()
*/


//returns element of id
function get(id) {return document.getElementById(id);}


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

//appends multiple children at once
function appendChildren(element, children) {
  if(children == undefined) return;
  children.forEach((child) => {
    element.appendChild(child);
  });

}
