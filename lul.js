var STORED_ELEMENTS = {};


function store(element, id) {
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

function get(key) {
  if(key == undefined) return undefined;
  let trueType = truetypeof(key);
  if(trueType == 'html') return key;

  if(STORED_ELEMENTS[key] != undefined)
  return STORED_ELEMENTS[key];

  return document.getElementById(key);
}



function set(key, ...elements) {
  insert('set', key, ...elements);
}
function add(key, ...elements) {
  insert('add', key, ...elements);
}
function make(key, ...elements) {
  insert('make', key, ...elements);
}



function insert(mode, key, ...elements) {
  let target = get(key);
  if(mode == undefined) mode = "set";

  if(mode == "make" && target.childNodes.length > 0) return;
  if(mode == "set") target.childNodes = [];
  elements.forEach((element) => {
    target.appendChild(get(element));
  });
}

const MIN_WIDTH_DICT = {
  ['lia-checkbox']: 0,
  ['lia-range']: 225,
  ['lia-input']: 225
};

function genRadio(arg) {

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


function genEnter(arg) {
  return genInput(arg, "text", "lia-input");
}

function genRange(arg) {
   let range = genInput(arg, "range", "lia-range");
   range.min = arg.min;
   range.max = arg.max;
   range.step = arg.step;
   range.value = arg.min;
   return range;
}

function genCheck(arg) {
  let check = genInput(arg, "checkbox", "lia-checkbox");
  check.addEventListener("input", function() {window[this.name] = this.checked;});
  return check;
}

function genButton(arg) {
  let button;
  button = gen("button", "lul-dark");

  if(arg.onclick != undefined)
  button.addEventListener("click", arg.onclick);

  let text = genText(arg.text);
  button.appendChild(text);
  return button;
}


function genInput(arg, type, className) {
  let input = gen("input", className);
  input.type = type;
  input.name = arg.name;
  input.addEventListener("input", function() {window[this.name] = this.value;});
  if(arg.oninput != undefined)
  input.addEventListener("input", arg.oninput);
  if(arg.minWidth == undefined) arg.minWidth = MIN_WIDTH_DICT[className];
  input.style.minWidth = arg.minWidth + 'px';
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




function genCollapsible(arg) {
  let sizeAttribute = arg.sizeAttribute;
  if(sizeAttribute == undefined)
  sizeAttribute = directionSizeAttributeMap[arg.direction];
  if(sizeAttribute == undefined)
  sizeAttribute = 'width';
  let className = classNameMap[sizeAttribute] + ' lul-light';
  let collapsible = gen("div", className);
  collapsible.setAttribute('sizeAttribute', sizeAttribute);

  if(arg.collapsed == undefined)
  arg.collapsed = 'true';
  collapsible.setAttribute('collapsed', arg.collapsed);
  if(arg.collapsed == 'true')
    collapsible.style[sizeAttribute] = 0;

  let toggle = get(arg.toggle);
  if(toggle != undefined)
    toggle.addEventListener('click', function () {
      toggleElement(collapsible);
    });

  let hover = get(arg.hover);
  if(hover != undefined) {
    hover.addEventListener('mouseenter', function () {
      expandElement(collapsible);
    });
    hover.addEventListener('mouseleave', function () {
      collapseElement(collapsible);
    });}

  let child = gen('div', 'lul-padding');
  collapsible.appendChild(child);
  store(child, arg.innerId);
  child.style.display = 'inline-block';
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

function genOverflow(arg) {
  let parent = gen('div', 'lul-overflow-parent');
  let box = gen('div', 'lul-overflow');
  if(arg.direction == 'column')
  box.style.flexDirection = 'column';

  parent.appendChild(box);

  requestAnimationFrame(function () {
    parent.style.height = window.getComputedStyle(parent).height;
    parent.style.width = window.getComputedStyle(parent).width;
    box.style.position = 'absolute';
  });
  store(box, arg.innerId);
  return parent;

}

function genEntry(arg) {
  let overflowId = uid();
  let overflow = genOverflow({
    innerId: overflowId,
    direction: arg.direction
  });
  let contentId = uid();
  let collapsible = genCollapsible({
    direction: arg.direction,
    hover: overflowId,
    innerId: contentId
  });
  set(contentId, ...(arg.content));
  set(overflowId, collapsible, ...(arg.button));
  return overflow;
}

//imports all lul-functions. gets bundled by rollup into lul.js



//tell rollup that all of these functions are in fact necessary
console.log(
  get, store, set, add, make, insert,
  genRadio, genButton, genEnter, genRange, genCheck,
  genCollapsible, genOverflow, genEntry
);
