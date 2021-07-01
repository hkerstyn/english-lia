/*
    genFullTable(rowCount, columnCount, containsHeads) generates a table of given
    size with or without table heads, where the cells are filled with text elements
    (see CELL_NAME, HEAD_NAME)

    genTable(cells, heads) generates a table where 'cells' is an array of arrays of
    nodes to be put into the table cells. 'head' is a single array (omit this argument to avoid
    a table head alltogether)

*/



//names of elements in full Table
const CELL_NAME = 'Zelle ';
const HEAD_NAME = 'Kopf ';

const CELL_CLASSNAME = 'lul-light lul-medium-hover lul-padding';
const HEAD_CLASSNAME = 'lul-dark lul-medium-hover lul-padding';

/*table functions*/

function genFullTable(rowCount, columnCount, containsHeads) {
  let cells = genCells(rowCount,columnCount);

  //both heads and cells
  let heads = genHeads(columnCount);
  return genTable(cells, heads);
}

function genTable(cells, heads)
{
  let table = gen('table', 'lul-table');

  if(heads != null && heads != undefined && heads.length > 0)
    addCells(table, heads, 'TH', HEAD_CLASSNAME);

  if(cells != null && cells != undefined && cells.length > 0)
    addCells(table , cells, 'TD', CELL_CLASSNAME);

  return table;
}



//adds elements (cells or heads) of HTML type to table
function addCells(table, cells, type, className)
{

  for(let i = 0; i < cells.length; i++) { //loop through rows
    let row = gen('TR');
    for(let j = 0; j < cells[i].length; j++) { //loop through columns
      let cellContainer = gen(type, className);
      cellContainer.appendChild(cells[i][j]);
      row.appendChild(cellContainer);
    }
    table.appendChild(row);
  }
}

//generates Nodes that can be put into a table
//mainly for testing, you would want to generate your cells manually
function genHeads(columnCount) {return genElements(1, columnCount, HEAD_NAME);}
function genCells(rowCount, columnCount) {return genElements(rowCount, columnCount, CELL_NAME);}
function genElements(rowCount, columnCount, name)
{
  let cells = [];
  for (var i = 0; i < rowCount; i++) {
    let row = [];
    for (var j = 0; j < columnCount; j++)
      row.push(document.createTextNode(name + (j + i*columnCount)));
    cells.push(row);
  }
  return cells;
}

/*
  genButton({text, onclick})
  genEnter({name, oninput, minWidth})
  genRange({name, oninput, minWidth, min, max, step})
  genCheck({name, oninput})

  The above functions generate input elements which store
  the selected value in a global variable named 'name'.
  'minWidth' can be used to alter the width of the elements 


*/
function genButton(arg) {
  let button;
  button = gen('button', 'lul-dark lul-medium-hover');

  if(arg.onclick != undefined)
    button.addEventListener('click', arg.onclick);

  let text = genText(arg.text);
  button.appendChild(text);
  return button;
}

const MIN_WIDTH_DICT = {
  ['lia-radio']: 0,
  ['lia-checkbox']: 0,
  ['lia-range']: 225,
  ['lia-input']: 225
};



function genEnter(arg) {
  return genInput(arg, 'text', 'lia-input');
}

function genRange(arg) {
  let range = genInput(arg, 'range', 'lia-range');
  range.min = arg.min;
  range.max = arg.max;
  range.step = arg.step;
  range.value = arg.min;
  return range;
}

function genCheck(arg) {
  let check = genInput(arg, 'checkbox', 'lia-checkbox');
  check.addEventListener('input', function() {window[this.name] = this.checked;});
  return check;
}


function genInput(arg, type, className) {
  let input = gen('input', className);
  input.type = type;
  input.name = arg.name;
  input.addEventListener('input', function() {window[this.name] = this.value;});
  if(arg.oninput != undefined)
    input.addEventListener('input', arg.oninput);
  if(arg.minWidth == undefined) arg.minWidth = MIN_WIDTH_DICT[className];
  input.style.minWidth = arg.minWidth + 'px';
  return input;
}

/*
  genOverflow({innerId, direction})

  genOverflow(arg):
      generates an html element whose size remains the same.
      when its content gets too large, it simply overflows
    arg.innerId:
      use this as key for inserting other elements into
      the collapsible
    arg.direction: 'row' or 'column'
      the direction the overflow's child nodes are positioned
*/


function genOverflow(arg) {
  let parent = gen('div', 'lul-overflow-parent');
  let box = gen('div', 'lul-overflow');
  if(arg.direction == 'column')
    box.style.flexDirection = 'column';

  parent.appendChild(box);

  requestAnimationFrame(function () {
    setTimeout(function () {
      parent.style.height = window.getComputedStyle(box).height;
      parent.style.width = window.getComputedStyle(box).width;
      box.style.position = 'absolute';
    }, 10);
  });
  store(box, arg.innerId);
  return parent;

}

function recalculateOverflowIndices () {
  let overflows = document.getElementsByClassName('lul-overflow'); 
  let overflowArray = [];
  for (let overflow of overflows) {
    overflowArray.push(overflow);
  }

  //  console.log(overflow);
  //  console.log(calculateElementPosition(overflow));
  //  console.log([overflow.scrollHeight, overflow.scrollWidth]);
  overflowArray.sort(overlapTest);
  let i = 1;
  overflowArray.forEach((overflow) => {
    overflow.style.zIndex = i;
    i++;
  });
}

// returns a positive value if overflow1 should overlap overflow2
function overlapTest (overflow1, overflow2) {
 
  //Calculate positions and sizes
  let position1 = calculateElementPosition(overflow1);
  let position2 = calculateElementPosition(overflow2);
  let size1 = calculateElementSize(overflow1);
  calculateElementSize(overflow2);

  if(position2.top > position1.top + size1.height - 5 ||
  position2.left > position1.left + size1.width - 5 ) {
    return 1;
  }
  return 0;
} 

function calculateElementSize (element) {
  return {
    height: parseFloat(window.getComputedStyle(element.parentNode).height.slice(0, -2)),
    width: parseFloat(window.getComputedStyle(element.parentNode).width.slice(0, -2))
  }; 
}

function calculateElementPosition(element) {
  var top = 0, left = 0;
  do {
    top += element.offsetTop  || 0;
    left += element.offsetLeft || 0;
    element = element.offsetParent;
  } while(element);

  return {
    top: top,
    left: left
  };
}

/*
  genBox({direction, visible})
*/

function genBox(arg) {
  let box = gen('div', 'lul-padding lul-light');
  if(arg.visible == 'false')
    box.className = '';

  box.style.display = 'inline-flex';
  box.style.flexDirection = arg.direction;
  if(arg.direction == 'column')
    box.style.width = '100%';
  else box.style.height = '100%';

  return box;
}

/*
  genCollapsible({innerId, direction, toggle, hover, functions})

  genCollapsible(arg): generates a box
      that can be expanded and collapsed
      at your arbitrary whim
    arg.innerId:
      use this as key for inserting other elements into
      the collapsible
    arg.direction:
      'row' or 'column', defines
      whether the box should change its
      width or height
    arg.toggle:
      an html-element whose onclick-event
      is to expand or collapse our collapsible
    arg.hover:
      an html-elment whose onmouseleave and
      onmouseenter events are set to collapse and expand
    arg.functions:
      an object that gets assigned the properties
      'expandFunction', 'collapseFunction' and 'toggleFunction'
      with functions controlling the newly created collapsible.

*/

//dictionaries for equating values of different properties
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

const HOVER_COLLAPSE_DELAY = '0.45s';


function genCollapsible(arg) {
  recalculateOverflowIndices();
  //determine sizeAttribute from arg.direction
  sizeAttribute = directionSizeAttributeMap[arg.direction];
  if(sizeAttribute == undefined)
    sizeAttribute = 'width';

  //set the css class
  let className = classNameMap[sizeAttribute] + '';
  let collapsible = gen('div', className);

  collapsible.setAttribute('sizeAttribute', sizeAttribute);

  //initializes the collapsed-state
  if(arg.collapsed == undefined)
    arg.collapsed = 'true';
  collapsible.setAttribute('collapsed', arg.collapsed);
  if(arg.collapsed == 'true')
    collapsible.style[sizeAttribute] = 0;

  //sets toggle, hover and functions (if present)
  setTimeout(function () {
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
        collapseElement(collapsible, HOVER_COLLAPSE_DELAY);
      });}
  }, 80);

  if(arg.functions != undefined) {
    arg.functions['toggleFunction'] = function () {
      toggleElement(collapsible);
    };
    arg.functions['collapseFunction'] = function () {
      collapseElement(collapsible);
    };
    arg.functions['expandFunction'] = function () {
      expandElement(collapsible);
    };
  }

  //generates a dummy child for padding
  let child = genBox(arg);
  collapsible.appendChild(child);
  store(child, arg.innerId);

  return collapsible;
}

//calls collapseElement or expandElement depending on
//the collapsible's collapsed-state
function toggleElement(collapsible) {
  let collapsed = collapsible.getAttribute('collapsed');
  if(collapsed == 'true') expandElement(collapsible);
  else collapseElement(collapsible);
}



function collapseElement(collapsible, delay) {

  let sizeAttribute = collapsible.getAttribute('sizeAttribute');
  let scrollSizeAttribute = scrollSizeAttributeMap[sizeAttribute];
  let scrollSize = collapsible[scrollSizeAttribute];

  let currentSize = window.getComputedStyle(collapsible)
    .getPropertyValue(sizeAttribute)
    .slice(0, -2);

  if(currentSize == scrollSize)
    collapsible.style.transitionDelay = delay;


  requestAnimationFrame(function() {
    //from auto to fixed
    collapsible.style[sizeAttribute] = scrollSize + 'px';

    requestAnimationFrame(function() {
      //from fixed to zero
      collapsible.style[sizeAttribute] = 0 + 'px';
    });
  });

  collapsible.setAttribute('collapsed', 'true');
}

function expandElement(collapsible) {
  recalculateOverflowIndices();
  collapsible.style.transitionDelay = '0s';


  let sizeAttribute = collapsible.getAttribute('sizeAttribute');
  let scrollSizeAttribute = scrollSizeAttributeMap[sizeAttribute];
  let scrollSize = collapsible[scrollSizeAttribute];

  //transition
  collapsible.style[sizeAttribute] = scrollSize + 'px';

  collapsible.setAttribute('collapsed', 'false');
}

/*
  genEntry({direction, content, button})


  genEntry(arg):
      Creates a collapsible inside an overflow
    arg.direction: 'row' or 'column'
      the direction of the overflow
    arg.content:
      array of HTML-Elements to be put
      inside the collapsible
    arg.button:
      array of HTML-Elements to be put
      inside the overflow, after the collapsible
*/


function genEntry(arg) {
  let overflowId = uid();
  let overflow = genOverflow({
    innerId: overflowId,
    ...arg
  });

  let contentId = uid();
  let collapsible = genCollapsible({
    hover: overflowId,
    innerId: contentId,
    ...arg
  });

  set(contentId, ...(arg.content));
  set(overflowId, collapsible, ...(arg.button));
  return overflow;
}

/*
  genRadioArray({name, options, oninput})
  genButtonRadioArray({name, options, oninput})
  genSelection({type, button, name, options, oninput})

  genRadioArray(arg):
    generates an array of spans each containing
    a radio and some text.
    the selected value is stored in a global variable named 'name'
    'options' can have the following forms:

      options = {
        texts: ["some", "descriptions"]
      }
        in this case, the texts represent both the descriptions
        as well as the values of the radio options

      options = {
        texts: ["Spanish", "German"],
        values: ["es", "de"]
      }
        here, the texts and the values are different

      options = {
        objects: [{a: 4, b: 2}, {a: 2, b: 8}],
        textFunction: function (object) {
          return "Point (" + object.a + "," + object.b + ")";
        }
        valueFunction: function (object) {
          return [a, b];
        }
          the result here would be texts "Point(4,2)" and "Point(2,8)"
          and values [4,2] and [2,8]
          (for example)
      }


  genButtonRadioArray(arg)
    same with buttons instead of radios

  genSelection(arg)
    generates an entry (see genEntry at ./lul-entry.js)
      containing a radio or buttonRadio,
      depending on whether 'arg.type' is set to 'radio' or 'buttonRadio'
    the direction is set to 'row',
      unless the width exceeds MAX_SELECTION_WIDTH
      (not including the button)
    'arg.button' is used for genEntry



*/
const SELECTED_BUTTON_RADIO_CLASSNAME = 'lul-dark';
const UNSELECTED_BUTTON_RADIO_CLASSNAME = 'lul-light lul-medium-hover';
const MAX_SELECTION_WIDTH = 500;


function genSelection(arg) {
  //retrieving genFunction and boxVisible depending on arg.type
  let genFunction;
  let boxVisible;
  if(arg.type == undefined || arg.type == 'radio') {
    genFunction = genRadioArray;
    boxVisible = 'true';
  }
  else {
    genFunction = genButtonRadioArray;
    boxVisible = 'false';
  }


  //trying out the width of the selection
  let array = genFunction(arg);

  let dummy = gen('span');
  dummy.style.visibility = 'hidden';
  document.body.appendChild(dummy);
  array.forEach((option) => {
    dummy.appendChild(option);
  });
  let width = dummy.scrollWidth;
  dummy.remove();


  //deciding direction
  let direction;
  if(width > MAX_SELECTION_WIDTH)
    direction = 'column';
  else direction = 'row';

  //generating result
  return genEntry({
    content: array,
    visible: boxVisible,
    direction: direction,
    ...arg
  });
}




function genRadioArray(arg) {

  if(arg.options == undefined)
    console.warn('Arg of Radio %s has no options', arg.name);
  let [texts, values] = genOptionArray(arg.options);


  let radioArray = [];
  for (var i = 0; i < texts.length; i++) {
    let couple = gen('span');
    let radio = genInput(arg, 'radio', 'lia-radio');

    radio.value = values[i];
    couple.appendChild(radio);
    couple.appendChild(genText(texts[i]));

    radioArray.push(couple);
  }

  return radioArray;
}




function genButtonRadioArray(arg) {

  if(arg.options == undefined)
    console.warn('Arg of ButtonRadio %s has no options', arg.name);
  let [texts, values] = genOptionArray(arg.options);

  //creating an array of radioButtons
  let buttonRadioArray = [];
  for (var i = 0; i < texts.length; i++) {
    let buttonRadio = genButton({text: texts[i]});
    buttonRadio.className = UNSELECTED_BUTTON_RADIO_CLASSNAME;
    buttonRadioArray.push(buttonRadio);
  }

  //applying selection behaviour on them
  buttonRadioArray.forEach((buttonRadio, i) => {
    buttonRadio.addEventListener('click', function () {
      window[arg.name] = values[i];

      buttonRadioArray.forEach((otherButtonRadio) => {
        otherButtonRadio.className = UNSELECTED_BUTTON_RADIO_CLASSNAME;
      });
      buttonRadio.className = SELECTED_BUTTON_RADIO_CLASSNAME;

    });
  });


  return buttonRadioArray;
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

//imports all lul-functions. gets bundled by rollup into lul.js



//tell rollup that all of these functions are in fact necessary
console.log(
  genButton, genEnter, genRange, genCheck,
  genRadioArray, genButtonRadioArray, genSelection,
  genCollapsible, genOverflow, genEntry, genBox,
  genTable, genFullTable, 
);
