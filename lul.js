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




function genEntry$1(arg) {
  let entry = gen("span", "lul-entry");
  if(arg.alwaysOpen == true)
  entry.setAttribute("always-open", "");

  let cont = gen("span", "lul-medium lul-entry-area");

  let div = gen("div", "lul-entry-content");
  if(arg.innerId != undefined)
  div.id = arg.innerId;

  arg.entryContent.forEach((item) => {div.appendChild(item);});

  cont.appendChild(div);
  entry.appendChild(cont);

  if(arg.button != undefined)
  arg.button.forEach((item) => {entry.appendChild(item);});

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





var genModules$5 = [
  {
    type: 'entry',
    genFunction: genEntry$1,
    hierarchyType: 'parent',
    parentAlias: 'entryContent'
  },
  {
    type: 'button',
    genFunction: genBtn
  }
];



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

/*
  arg is a js object
  An '(o)' following an argument means its optional


 genRadio(arg): generates multiple radios inside a span
  arg.name: name of the global variable the selected value should be stored in
  arg.oninput: self-explanatory (o)
  arg.options: see below
  arg.container: the container to automatically
   put the radio in (see lul-container.js) (o)

 genEnter(arg): generates an input field
  arg.name: see genRadio
  arg.oninput: see genRadio (o)
  arg.container: see genRadio (o)

 genRange(arg): generates a slider
  arg.name: see genRadio
  arg.oninput: see genRadio (o)
  arg.container: see genRadio (o)
  arg.min, arg.max, arg.step: determine range of the slider

 genCheck(arg): generates a checkbox
  arg.name: see genRadio
  arg.oninput: see genRadio (o)
  arg.container: see genRadio (o)

 arg.options: a js object of either form:
  options = {
    texts: array of names of input options
    values: array of values of input options,
      only if different from texts (o)
  }
  options = {
    objects: array of arbitrary js objects
    textFunction(object): determines the text to
      associate with a given object
    valueFunction(object): same for values
  }
*/


var genModules$4 = [
  {
    type: "enter",
    genFunction: genEnter$1
  },
  {
    type: "radio",
    genFunction: genRadio$1
  },
  {
    type: "range",
    genFunction: genRange$1
  },
  {
    type: "check",
    genFunction: genCheck$1
  }
];


/*input functions*/

function genRadio$1(arg) {

  //cast diverse options into uniform optionArray
  if(arg.options == undefined)
  console.warn("Arg of Radio %s has no options", arg.name);
  let optionArray = genOptionArray(arg.options);


  let span = genRaw("span");
  for (var i = 0; i < optionArray[0].length; i++) {
    let radio = genInput(arg, "radio", "lia-radio");

    radio.value = optionArray[1][i];
    span.appendChild(radio);

    span.appendChild(genText(optionArray[0][i]));
  }

  return span;
}

function genOptionArray(options)
{
  //assume objects, textFunction and valueFunction are provided
  if(options.texts == undefined) {
    let optionArray = [[], []];
    options.objects.forEach((object) => {
      optionArray[0].push(options.textFunction(object));
      optionArray[1].push(options.valueFunction(object));
    });
    return optionArray;
  }
  //assume texts and values are provided
  if(options.values != undefined) {
    return [options.texts, options.values];
  }
  //assume only texts are provided
  return [options.texts, options.texts];
}


function genEnter$1(arg) {
  return genInput(arg, "text", "lia-input");
}

function genRange$1(arg) {
   let range = genInput(arg, "range", "lia-range");
   range.min = arg.min;
   range.max = arg.max;
   range.step = arg.step;
   range.value = arg.min;
   return range;
}

function genCheck$1(arg) {
  let check = genInput(arg, "checkbox", "lia-checkbox");
  check.addEventListener("input", function() {window[this.name] = this.checked;});
  return check;
}

/*utility functions*/
//generic function for making an <input class="className" type="type" name="name">
function genInput(arg, type, className) {
  let input = gen("input", className);
  input.type = type;
  input.name = arg.name;
  input.addEventListener("input", function() {window[this.name] = this.value;});
  if(arg.oninput != undefined)
  input.addEventListener("input", arg.oninput);
  return input;
}

var directionSizeAttributeMap = {
  row: 'width',
  column: 'height'
};

var scrollSizeAttributeMap = {
  width: 'scrollWidth',
  height: 'scrollHeight'
};
var classNameMap = {
  width: 'lul-collapsible-width',
  height: 'lul-collapsible-height'
};



var genModules$3 = [
  {
    type: "collapsible",
    genFunction: genCollapsible$1
  },
  {
    type: "toggle"
  },
  {
    type: "hover"
  }
];

function genCollapsible$1(arg) {
  let sizeAttribute = arg.sizeAttribute;
  if(sizeAttribute == undefined)
  sizeAttribute = directionSizeAttributeMap[arg.direction];
  let className = classNameMap[sizeAttribute] + " lul-light";
  let collapsible = gen("div", className);
  collapsible.setAttribute('sizeAttribute', sizeAttribute);

  if(arg.collapsed == undefined)
  arg.collapsed = 'true';
  collapsible.setAttribute('collapsed', arg.collapsed);
  if(arg.collapsed == 'true')
    collapsible.style[sizeAttribute] = 0;

  if(arg.toggle != undefined)
    arg.toggle.forEach((toggleItem) => {
      toggleItem.addEventListener('click', function () {
        toggleElement(collapsible);
      });
    });

  if(arg.hover != undefined)
    arg.hover.forEach((hoverItem) => {
      hoverItem.addEventListener('mouseenter', function () {
        expandElement(collapsible);
      });
      hoverItem.addEventListener('mouseleave', function () {
        collapseElement(collapsible);
      });
    });

  return collapsible;
}

function toggleElement(collapsible) {
  let collapsed = collapsible.getAttribute('collapsed');
  if(collapsed == 'true') expandElement(collapsible);
  else collapseElement(collapsible);
}



function collapseElement(collapsible) {
  let sizeAttribute = collapsible.getAttribute('sizeAttribute');

  let scrollSizeAttribute = scrollSizeAttributeMap[sizeAttribute];
  let scrollSize = collapsible[scrollSizeAttribute];

  let collapsibleTransition = collapsible.style.transition;
  collapsible.style.transition = '';

  requestAnimationFrame(function() {
    //from auto to fixed
    collapsible.style[sizeAttribute] = scrollSize + 'px';
    collapsible.style.transition = collapsibleTransition;

    requestAnimationFrame(function() {
      //from fixed to zero
      collapsible.style[sizeAttribute] = 0 + 'px';
    });
  });

  collapsible.setAttribute('collapsed', 'true');
}

function expandElement(collapsible) {
  let sizeAttribute = collapsible.getAttribute('sizeAttribute');


  let scrollSizeAttribute = scrollSizeAttributeMap[sizeAttribute];
  let scrollSize = collapsible[scrollSizeAttribute];

  //transition
  collapsible.style[sizeAttribute] = scrollSize + 'px';

  collapsible.setAttribute('collapsed', 'false');
}

var genModules$2 = [
  {
    type: "container",
    genFunction: genContainer$1
  },
  {
    type: "content",
    genFunction: examineContent
  }
];
const DEFAULT_BOX_PADDING = '20px';
const DEFAULT_BOX_CLASSNAME = 'lul-light';

function genContainer$1(arg) {
  console.log("Generating container with arg: ", arg);
  let table = gen("table", "lul-container");
  let row = gen("tr", "lul-container");
  arg.content.forEach((contentItem) => {
    let cell = gen('td', "lul-container");
    if(contentItem.type == 'box') {
      cell.className += ' ' + DEFAULT_BOX_CLASSNAME;
      cell = Object.assign(cell, contentItem);
      if(cell.style.padding == '')
      cell.style.padding = DEFAULT_BOX_PADDING;
    }
    else
      cell.appendChild(contentItem);
    row.appendChild(cell);
    table.appendChild(row);

    if(arg.direction == 'column')
    row = gen("tr", "lul-container") ;
  });
  return table;
}

function examineContent(arg) {
  if(arg.content == undefined)
    arg.type = 'box';
  else
    arg.type = 'container';
    return arg;
}

var genModules$1 = [
  {
    type: "overflow",
    genFunction: genOverflow
  }
];

function genOverflow(arg) {
  let parent = gen('div', 'lul-overflow-parent');
  let box = gen('div', 'lul-overflow');
  box.id = arg.innerId;
  if(arg.content != undefined)
  appendChildren(box, arg.content);
  if(arg.direction == 'column')
  box.style.flexDirection = 'column';

  parent.appendChild(box);

  requestAnimationFrame(function () {
    parent.style.height = window.getComputedStyle(parent).height;
    parent.style.width = window.getComputedStyle(parent).width;
    box.style.position = 'absolute';
  });
  return parent;

}

var genModules = [];


genModules = genModules.concat(genModules$5);
genModules = genModules.concat(genModules$4);
genModules = genModules.concat(genModules$3);
genModules = genModules.concat(genModules$2);
genModules = genModules.concat(genModules$1);



genModules.push({type: "children"});
genModules.push({
  type: "parent",
  hierarchyType: "parent",
  parentAlias: "children"
});

console.log("Gen modules:", genModules);

const HTML_PROPERTIES = ['id', 'className', 'style'];

function genElementArray(arg) {
  let trueType = truetypeof(arg);
  console.log("Called genElementArray. trueType: ", trueType);
  switch (trueType) {
    case 'html': return [arg];
    case 'string': return [get(arg)];
    case 'object': return genElementArrayFromObject(arg);
    case 'array':
      let result = [];
      arg.forEach((item) => {
        result = result.concat(genElementArray(item));
      });
      return result;
    default: console.warn("genElementArray: No proper type found for: ", arg);
      return;
  }
}


function genElementArrayFromObject(arg) {
  console.log("Generating element with arg: ", arg);
  let childModules = [];
  let parentModules = [];
  let ownGenModule;

  console.log("Considering all modules...");
  for (var i = 0; i < genModules.length; i++) {
    let genModule = genModules[i];
    let property = genModule.type;

    //check if module is own module
    if(arg.type == property) ownGenModule = genModule;

    //check if module applies
    if(arg[property] == undefined) continue;

    //cast to array
    arg[property] = castToArray(arg[property]);

    //add type
    arg[property].forEach((item) => {
      if(item.type == undefined)
      item.type = property;
    });

    //add to property list
    if(genModule.hierarchyType == 'parent')
    parentModules.push(genModule);
    else
    childModules.push(genModule);
  }
  console.log("childModules: ", childModules);
  console.log("parentModules: ", parentModules);
  console.log("ownGenModule: ", ownGenModule);


  childModules.forEach((childModule) => {
    let childProperty = childModule.type;
    console.log("Applying Child module ", childProperty);
    arg[childProperty] = genElementArray(arg[childProperty]);
  });

  console.log("Applying Own module: ", arg.type);
  if(ownGenModule == undefined) return [arg];
  if(ownGenModule.genFunction == undefined) return [arg];
  let selfArray = genElementArray(ownGenModule.genFunction(arg));
  if(truetypeof(selfArray[0]) == 'html')
  {
    //appending children
    if(arg.children != undefined)
    appendChildren(selfArray[0], arg.children);
    //setting html properties
    HTML_PROPERTIES.forEach((htmlProperty) => {
      if(arg[htmlProperty] != undefined)
      selfArray[0][htmlProperty] = arg[htmlProperty];
    });
    //setting events
    let argProperties = Object.getOwnPropertyNames(arg);
    console.log("argProperties: ", argProperties);
    argProperties.forEach((property) => {
      if(property.startsWith('on'))
      selfArray[0].addEventListener(property.slice(2), arg[property]);
    });
  }





  console.log("Applying Parent modules...");
  parentModules.forEach((parentModule) => {
    let parentProperty = parentModule.type;
    let parentAlias = parentModule.parentAlias;
    let parentArray = arg[parentProperty];
    delete arg[parentProperty];
    parentArray.forEach((parent) => {
      if(parent[parentAlias] == undefined) parent[parentAlias] = [];
      parent[parentAlias] = parent[parentAlias].concat(selfArray);
      selfArray = genElementArray(parent);
    });
  });
  console.log("Applied all modules. Result:");
  console.log("selfArray: ", selfArray);
  console.log("arg:", arg);
  return selfArray;
}


function castToArray(value) {
  let trueType = truetypeof(value);
  if(trueType == 'array') return value;
  return [value];
}

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

function insertElement(element, insert) {
  console.log("Inserting element ", element, " with insert argument: ", insert);
  insert.target.forEach((target) => {
    if(insert == undefined) return;
    if(insert.mode == undefined) insert.mode = "set";

    if(insert.mode == "make" && target.innerHTML != "") return;
    if(insert.mode == "set") target.innerHTML = "";
    appendChildren(target, element);
  });


}

/*
  hide() and reveal() change the visibility (the display) of an element
  solo() hides all but one element of a given solo group (array of ids)
*/


//which type of display should a revealed element without a set fallback receive?
const DEFAULT_DISPLAY = "inline-block";


//sets the display of an element to "none" and stores its original display
function hideRaw(targetArray) {
  targetArray.forEach((target) => {
    console.log("Hiding ", target);
    let definedDisplay = target.getAttribute("definedDisplay");
    if(definedDisplay == "none") return;   //avoid duplicate hiding

    let trueDisplay = window.getComputedStyle(target).getPropertyValue("display");

    target.setAttribute("originalDisplay", trueDisplay);
    target.setAttribute("definedDisplay", "none");
    target.style.display = "none";
  });

}

//if present, restores original display of an element, otherwise defaults to DEFAULT_DISPLAY
function revealRaw(targetArray) {
  targetArray.forEach((target) => {
    console.log("Revealing ", target);

    let definedDisplay = target.getAttribute("definedDisplay");
    let trueDisplay = window.getComputedStyle(target).getPropertyValue("display");
    let originalDisplay = target.getAttribute("originalDisplay");

    if(trueDisplay != definedDisplay && definedDisplay != null)
    console.warn("Defined display (%s) and true display (%s) are different",
    definedDisplay, trueDisplay);
    if(trueDisplay != "none") return;
    if(originalDisplay == "none") console.warn("Original display is none");


    if(originalDisplay == undefined || originalDisplay == null) {
      target.style.display = DEFAULT_DISPLAY;
      target.setAttribute("definedDisplay", DEFAULT_DISPLAY);
    } else {
      target.style.display = originalDisplay;
      target.setAttribute("definedDisplay", originalDisplay);
    }
  });
}

function genElement(arg) {
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

function genRadio(arg) {
  return genOfType(arg, "radio");
}

function genEnter(arg) {
  return genOfType(arg, "enter");
}

function genRange(arg) {
  return genOfType(arg, "range");
}
function genCheck(arg) {
  return genOfType(arg, "check");
}
function genButton(arg) {
  return genOfType(arg, "button");
}
function genEntry(arg) {
  return genOfType(arg, "entry");
}
function genContainer(arg) {
  return genOfType(arg, "container");
}
function genCollapsible(arg) {
  return genOfType(arg, 'collapsible');
}


function insertElementByTargetValue(elementValue, insert) {
  let targetArray = genElementArray(insert.target);
  let newInsert = {target: targetArray, mode: insert.mode};
  insertElement(genElementArray(elementValue), newInsert);
}

function set(targetValue, elementValue) {
  insertElementByTargetValue(elementValue, {target: targetValue, mode:"set"});
}
function make(targetValue, elementValue) {
  insertElementByTargetValue(elementValue, {target: targetValue, mode:"make"});
}
function add(targetValue, elementValue) {
  insertElementByTargetValue(elementValue, {target: targetValue, mode:"add"});
}


function hide(targetValue) {

  hideRaw(genElementArray(targetValue));
}

function reveal(targetValue) {
  revealRaw(genElementArray(targetValue));
}

//reveals element and hides all others of the same solo group
function solo(targetValue, soloGroup) {
  if(soloGroup == undefined) var soloGroup = DEFAULT_SOLO_GROUP;
  if(soloGroup == null || !soloGroup.length > 0) return;
  hide(soloGroup);
  reveal(targetValue);
}

var DEFAULT_SOLO_GROUP;
function setDefaultSoloGroup(soloGroup) {DEFAULT_SOLO_GROUP = soloGroup;}

//imports all lul-functions. gets bundled by rollup into lul.js




//tell rollup that all of these functions are in fact necessary
console.log(genElement, genRadio, genEnter, genRange, genCheck,
  genButton, genEntry, genContainer, genCollapsible,
  set, add, make,
  hide, reveal, solo, setDefaultSoloGroup);
