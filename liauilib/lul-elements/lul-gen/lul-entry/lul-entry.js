/*
  arg is a js object
  An '(o)' following an argument means its optional

 genBtn(arg): generates a button
  arg.text: The text to display (will not draw button if set to empty string)
  arg.onclick: onclick event (o)

 genContainer(arg): generates a container
  arg.alwaysOpen: should container remain open when not hovered,
    defaults to false (o)
  arg.innerId: set specific id for inner part of container (other elements
    can be put into the container using this as target) (o)
  arg.button: button next to container (o)
  arg.target: determines where and how container should be automatically
    inserted, (see insert() at lul-base.js).
    alternatively use set(), make(), add() to manually insert it (o)
*/




function genEntry(arg) {
  let entry = gen("span", "lul-entry");
  if(arg.alwaysOpen == true)
  entry.setAttribute("always-open", "");

  let cont = gen("span", "lul-medium lul-entry-area");

  let div = gen("div", "lul-entry-content");
  if(arg.innerId != undefined)
  div.id = arg.innerId;

  arg.entryContent.forEach((item) => {div.appendChild(item)});

  cont.appendChild(div);
  entry.appendChild(cont);

  if(arg.button != undefined)
  arg.button.forEach((item) => {entry.appendChild(item)});

  return entry;
}


function genBtn(arg) {
  let btn;
  if(arg.onclick == undefined) {
    btn = gen("button", "lul-medium");
  } else {
    btn = gen("button", "lul-dark");
    //btn.addEventListener("click", arg.onclick);
  }
  let text = genText(arg.text);
  btn.appendChild(text);
  return btn;
}





export var genModules = [
  {
    type: 'entry',
    genFunction: genEntry,
    hierarchyType: 'parent',
    parentAlias: 'entryContent'
  },
  {
    type: 'button',
    genFunction: genBtn
  }
]



/*
import{gen, genRaw, insert} from './lul-base.js';


export

function appendContent(content, optionalContent, div) {
  if(optionalContent != undefined)
  {
    if(content == undefined)
    content = optionalContent;
    else
    if (content.length == undefined)
    content = [content, optionalContent];
    else
    content.push(optionalContent);
  }
  if(content != undefined)
  {
    //check if array
    if(content.length == undefined)
    div.appendChild(content);
    else
    content.forEach((item) => {div.appendChild(item)});
  }
}




export function genBtn(arg) {
  let btn;
  if(arg.onclick == undefined) {
    btn = gen("button", "lul-medium");
  } else {
    btn = gen("button", "lul-dark");
    btn.addEventListener("click", arg.onclick);
  }
  let p = genText(arg.text);
  btn.appendChild(p);
  return btn;
}
//creates span containing text (possibly html)
export function genText(content) {
  let text = genRaw("span");
  text.innerHTML = content;
  return text;
}*/
