/**
 * This class is only for initializing the Lia UI Library.
 * It does not hold any [functions]{@link LulFunctions}.
 *
 */
class LulConfig {


  /**
   * Initializes the library with the default values.
   * @constructor
   */
  constructor() {
    /** The default css-classname to apply to a
     * [box]{@link LulFunctions.genBox}
     * @default
     */
    this.BOX_CLASS = 'lul-padding lul-light';

    /** Let **collapsible** be a [collapsible]{@link LulFunctions.genCollapsible} generated  
     * with a **hover** controlling its expansion/collapse.
     *
     * Now, when the cursor leaves the **hover** element,  
     * the **collapsible** gets collapsed.  
     * For better UX however, there is a delay,  
     * which is specified here.
     * @default
     */
    this.HOVER_COLLAPSE_DELAY = '0.45s';

    /** When a [collapsible]{@link LulFunctions.genCollapsible} gets created,  
     * there is a delay before the specified
     * **hover** and/or **toggle** element gets activated.
     *
     * Its length in milliseconds is specified here
     * @default
     */
    this.HOVER_INITIAL_DELAY_MS = 80;

    /** An Object with two properties:
     * * **width**: css classname for horizontal collapsibles
     * * **height**: css classname for vertical collapsibles
     *
     * Whether a [collapsible]{@link LulFunctions.genCollapsible}  
     * is horizontal or vertical  
     * depends on its **direction** parameter  
     * (set when creating the collapsible via genCollapsible).
     * @default
     */
    this.COLLAPSIBLE_CLASS_MAP = {
      width: 'lul-collapsible-width',
      height: 'lul-collapsible-height'
    };
  
    //it's best to leave these two as they are
    this.DEFAULT_OVERFLOW_CLASS = 'lul-overflow';
    this.DEFAULT_OVERFLOW_PARENT_CLASS = 'lul-overflow-parent lul-margin';

    /** The css class [buttons]{@link LulFunctions.genButton} have by default.
     * @default
     */
    this.DEFAULT_BUTTON_CLASS = 'lul-dark lul-medium-hover lul-norm-height';

    /** An Object with 4 properties (**radio**, **check**, **range**, **enter**).  
     * Each describes one type of input element  
     * and specifies the following:
     * * **className**: the css-classname to apply to the input-element
     * * **minWidth**: the minimum width in px. Can be overriden when  
     * creating a [range]{LulFunctions.genRange} or a [text enter area]{LulFunctions.genEnter}
     * * **inputType**: defines the **type** attribute of the html input-element
     *
     * *see source code for default value*
     */
    this.INPUT_ELEMENTS = {
      radio: {
        className: 'lia-radio',
        minWidth: 0,
        inputType: 'radio'
      },
      check: {
        className: 'lia-checkbox',
        minWidth: 0,
        inputType: 'checkbox'
      },
      range: {
        className: 'lia-range',
        minWidth: 225,
        inputType: 'range'
      },
      enter: {
        className: 'lia-input',
        minWidth: 225,
        inputType: 'text'
      }
    }; 

    /**the default css class of a selected [buttonRadio-Element]{@link LulFunctions.genButtonRadioArray} 
     */
    this.SELECTED_BUTTON_RADIO_CLASSNAME = 'lul-dark';
    /**the default css class of an unselected [buttonRadio-Element]{@link LulFunctions.genButtonRadioArray} 
     */
    this.UNSELECTED_BUTTON_RADIO_CLASSNAME = 'lul-light lul-medium-hover';

    /** when creating a [buttonRadioArray]{@link LulFunctions.genButtonRadioArray},  
     * the **direction** is determined by whether or not the sum of the *widths*  
     * of all the options exceeds this value.
     * @default
     */
    this.MAX_SELECTION_WIDTH = 500;

    



  }

}

/**
 * Generates a button.  
 * Uses {@tutorial arg}
 *
 * @param {string} text - the text of the button
 * @param {afn} onclick - (optional) an anonymous function to be fired  
 * when clicking the button.
 * @see [DEFAULT_BUTTON_CLASS]{@link LulConfig#DEFAULT_BUTTON_CLASS}
 */

function genButton(arg) {
  let button;
  button = gen('button', lulConfig.DEFAULT_BUTTON_CLASS );

  if(arg.onclick != undefined)
    button.addEventListener('click', arg.onclick);

  let text = genText(arg.text);
  button.appendChild(text);
  return button;
}





/**
 * generates an input area for text.  
 * Uses {@tutorial arg}
 *
 * @param {string} name - the name of the global variable  
 * that the entered text should always be stored in
 * @param {afn} oninput - (optional) the anonymous function that
 * should be executed while typing
 * @param {number} minWidth - (optional) sets the width of the enter area  
 * omit to use a [default value]{@link LulConfig#INPUT_ELEMENTS}
 * @see [INPUT_ELEMENTS]{@link LulConfig#INPUT_ELEMENTS}
 */
function genEnter(arg) {
  return genInput(arg, 'enter');
}

/**
 * generates a draggable slider representing numbers of a given range  
 * Uses {@tutorial arg}
 *
 * @param {string} name - the name of the global variable  
 * that the selected number should always be stored in
 * @param {afn} oninput - (optional) the anonymous function that
 * should be executed when dragging the slider
 * @param {number} minWidth - (optional) sets the width of the slide range (in pixels).  
 * omit to use a [default value]{@link LulConfig#INPUT_ELEMENTS}
 * @param {number} min - the smallest possible number  
 * the slider can select
 * @param {number} max - the biggest one
 * @param {number} step - the step between two possible selections
 * @see [INPUT_ELEMENTS]{@link LulConfig#INPUT_ELEMENTS}
 */
function genRange(arg) {
  let range = genInput(arg, 'range');
  range.min = arg.min;
  range.max = arg.max;
  range.step = arg.step;
  range.value = arg.min;
  return range;
}

/**
 * generates a checkbox that can be (un)ticked to change a boolean value  
 * Uses {@tutorial arg}
 *
 * @param {string} name - the name of the global variable  
 * that the boolean should always be stored in
 * @param {afn} oninput - (optional) the anonymous function that
 * should be executed when (un)ticking
 * @see [INPUT_ELEMENTS]{@link LulConfig#INPUT_ELEMENTS}
 */
function genCheck(arg) {
  let check = genInput(arg, 'check');
  check.addEventListener('input', function() {window[this.name] = this.checked;});
  return check;
}

// generates an input element based on INPUT_ELEMENTS
function genInput(arg, inputName) {
  let input = gen('input', lulConfig.INPUT_ELEMENTS[inputName].className);
  input.type = lulConfig.INPUT_ELEMENTS[inputName].inputType;
  input.name = arg.name;
  input.addEventListener('input', function() {window[this.name] = this.value;});
  if(arg.oninput != undefined)
    input.addEventListener('input', arg.oninput);
  if(arg.minWidth == undefined) arg.minWidth = lulConfig.INPUT_ELEMENTS[inputName].minWidth;
  input.style.minWidth = arg.minWidth + 'px';
  return input;
}

/**
 * generates an html element whose size always remains the same.  
 * when its content gets too large, it simply overflows  
 * Uses {@tutorial arg}
 *
 * @param innerId {string} - the value specified here can be used  
 * as {@tutorial key} to insert other elements into the collapsible
 * @param direction {'row'|'column'} - the direction the **overflow**'s child nodes are positioned
 */

function genOverflow(arg) {
  let parent = gen('div', lulConfig.DEFAULT_OVERFLOW_PARENT_CLASS);
  let box = gen('div', lulConfig.DEFAULT_OVERFLOW_CLASS);
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
  let overflows = document.getElementsByClassName(lulConfig.DEFAULT_OVERFLOW_CLASS); 
  let overflowArray = [];
  for (let overflow of overflows) {
    overflowArray.push(overflow);
  }

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

/**
 * returns a newly generated HTML-Box.  
 * Uses {@tutorial arg}.
 *
 * @param visible {'true'|'false'} - whether the [BOX_CLASS]{@link LulConfig#BOX_CLASS} parameter  
 * should be set as css class of the box
 * @param direction {'column'|'row'} - whether the children of the box  
 * should be positioned next to or above and below each other.
 * @see [BOX_CLASS]{@link LulConfig#BOX_CLASS}
 */

function genBox(arg) {
  let box = gen('div', lulConfig.BOX_CLASS);
  if(arg.visible == 'false')
    box.className = '';

  box.style.display = 'inline-flex';
  box.style.flexDirection = arg.direction;
  if(arg.direction == 'column')
    box.style.width = '100%';
  else box.style.height = '100%';

  return box;
}

//dictionaries for equating values of different properties
var directionSizeAttributeMap = {
  row: 'width',
  column: 'height'
};
var scrollSizeAttributeMap = {
  width: 'scrollWidth',
  height: 'scrollHeight'
};




/**
 * Generates a [box]{@link genBox}, that can be collapsed
 * and expanded via javascript.  
 * Uses {@tutorial arg}
 *
 * @param innerId {string} - the value specified here can be used  
 * as {@tutorial key} to insert other elements into the collapsible
 * @param direction {'row'|'column'} - whether the box should collapse  
 * horizontally or vertically
 * @param toggle {key} - (optional) a {@tutorial key} to an html-element that  
 * gets set to trigger an expansion or collapse of this box  
 * when clicked
 * @param hover {key} - (optional) a {@tutorial key} to an html-element that  
 * gets set to trigger an expansion or collapse of this box  
 * when hovered.
 * @param functions {Object} - (optional) some object that gets assigned three new properties:
 * * expandFunction: call this to expand this specific box
 * * collapseFunction: call to collapse
 * * toggleFunction: automatically expands or collapses the box
 * @see [COLLAPSIBLE_CLASS_MAP]{@link LulConfig#COLLAPSIBLE_CLASS_MAP}  
 * [HOVER_COLLAPSE_DELAY]{@link LulConfig#HOVER_COLLAPSE_DELAY}  
 * [HOVER_INITIAL_DELAY_MS]{@link LulConfig#HOVER_INITIAL_DELAY_MS}
 */
function genCollapsible(arg) {
  recalculateOverflowIndices();
  //determine sizeAttribute from arg.direction
  sizeAttribute = directionSizeAttributeMap[arg.direction];
  if(sizeAttribute == undefined)
    sizeAttribute = 'width';

  //set the css class
  let className = lulConfig.COLLAPSIBLE_CLASS_MAP[sizeAttribute] + '';
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
        collapseElement(collapsible, lulConfig.HOVER_COLLAPSE_DELAY);
      });}
  }, lulConfig.HOVER_INITIAL_DELAY_MS);

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


/**
 * generates a [collapsible]{@link LulFunctions.genCollapsible} next to a
 * [button]{@link LulFunctions.genButton} inside an
 * [overflow]{@link LulFunctions.genOverflow}.  
 * Uses {@tutorial arg}
 *
 * @param {'row'|'column'} direction - specifies whether the **collapsible**  
 * and the **button(s)** should be next to or on top of one another
 * @param {Array} content - array of HTML-Elements to be put inside the **collapsible** 
 * @param {Array} button - array of HTML-Elements to be used as **buttons** 
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


/**
 * generates an [entry]{@link LulFunctions.genEntry} containing either a  
 * * [radio]{@link LulFunctions.genRadioArray} or a
 * * [buttonRadio]{@link LulFunctions.genButtonRadioArray}
 *
 * @param {'radio'|'button-radio'} type - specifies whether a
 * **radio** or a **buttonRadio** should be used
 * @param {Array} button - the [button(s)]{@link LulFunctions.genButton} for the **entry**
 * @param {string} name - the name of the global variable  
 * that the selected value should always be stored in
 * @param {afn} oninput - (optional) the anonymous function that
 * should be executed when selecting a value
 * @param {Options} options - the {@tutorial Options} the radio should have
 * @param {'row'|'column'} direction - specifies the direction of the **entry**.  
 * when omitted, direction is set to 'row'  
 * if the width of that exceeds [MAX_SELECTION_WIDTH]{@link LulConfig#MAX_SELECTION_WIDTH} however,
 * it is set to 'column'
 * @see [MAX_SELECTION_WIDTH]{@link LulConfig#MAX_SELECTION_WIDTH }
 */
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
  if(width > lulConfig.MAX_SELECTION_WIDTH)
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



/**
 * generates an array of spans each containing
 * an html-radio-element and some text.  
 * Uses {@tutorial arg}
 *
 * @param {string} name - the name of the global variable  
 * that the selected value should always be stored in
 * @param {afn} oninput - (optional) the anonymous function that
 * should be executed when selecting a value
 * @param {Options} options - the {@tutorial Options} the radio should have
 * @see [INPUT_ELEMENTS]{@link LulConfig#INPUT_ELEMENTS}
 */

function genRadioArray(arg) {

  if(arg.options == undefined)
    console.warn('Arg of Radio %s has no options', arg.name);
  let [texts, values] = genOptionArray(arg.options);


  let radioArray = [];
  for (var i = 0; i < texts.length; i++) {
    let couple = gen('span');
    let radio = genInput(arg, 'radio');

    radio.value = values[i];
    couple.appendChild(radio);
    couple.appendChild(genText(texts[i]));

    radioArray.push(couple);
  }

  return radioArray;
}


/**
 * generates an array of [buttons]{@link LulFunctions.genButton}  behaving like a
 * [radioArray]{@link LulFunctions.genRadioArray}.   
 * Uses {@tutorial arg}
 *
 * @param {string} name - the name of the global variable  
 * that the selected value should always be stored in
 * @param {afn} oninput - (optional) the anonymous function that
 * should be executed when selecting a value
 * @param {Options} options - the {@tutorial Options} the button-radio should have
 * @see [SELECTED_BUTTON_RADIO_CLASSNAME]{@link LulConfig#SELECTED_BUTTON_RADIO_CLASSNAME}  
 * [UNSELECTED_BUTTON_RADIO_CLASSNAME]{@link LulConfig#UNSELECTED_BUTTON_RADIO_CLASSNAME}
*/
function genButtonRadioArray(arg) {

  if(arg.options == undefined)
    console.warn('Arg of ButtonRadio %s has no options', arg.name);
  let [texts, values] = genOptionArray(arg.options);

  //creating an array of radioButtons
  let buttonRadioArray = [];
  for (var i = 0; i < texts.length; i++) {
    let buttonRadio = genButton({text: texts[i]});
    buttonRadio.className = lulConfig.UNSELECTED_BUTTON_RADIO_CLASSNAME;
    buttonRadioArray.push(buttonRadio);
  }

  //applying selection behaviour on them
  buttonRadioArray.forEach((buttonRadio, i) => {
    buttonRadio.addEventListener('click', function () {
      window[arg.name] = values[i];

      buttonRadioArray.forEach((otherButtonRadio) => {
        otherButtonRadio.className = lulConfig.UNSELECTED_BUTTON_RADIO_CLASSNAME;
      });
      buttonRadio.className = lulConfig.SELECTED_BUTTON_RADIO_CLASSNAME;

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

/**
 * @class LulFunctions
 * @classdesc A {@tutorial PseudoClass}. Provides genFunctions
 * to create beautiful UI.  
 * Before you can use any though, initialize the Library using
 * the {@link LulConfig} class first.
 *
 * **ATTENTION:** Most functions here use the [arg input scheme]{@tutorial arg}
 * @borrows genBox
 * @borrows genCollapsible
 * @borrows genOverflow
 * @borrows genButton
 * @borrows genEnter
 * @borrows genEntry
 * @borrows genRange
 * @borrows genCheck
 * @borrows genRadioArray
 * @borrows genButtonRadioArray
 * @borrows genSelection
 * @hideconstructor
 */


//tell rollup that all of these functions are in fact necessary
console.log(
  LulConfig,
  genButton, genEnter, genRange, genCheck,
  genRadioArray, genButtonRadioArray, genSelection,
  genCollapsible, genOverflow, genEntry, genBox
);
