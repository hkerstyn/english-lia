/**
 * Generates a button.  
 * Uses {@tutorial arg}
 *
 * @param {string} text - the text of the button
 * @param {afn} onclick - (optional) an anonymous function to be fired  
 * when clicking the button.
 * @see [DEFAULT_BUTTON_CLASS]{@link LulConfig#DEFAULT_BUTTON_CLASS}
 */

export function genButton(arg) {
  let button = gen('button', lulConfig.DEFAULT_BUTTON_CLASS );

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
 * @param {number} width - (optional) sets the width of the enter area  
 * omit to use a [default value]{@link LulConfig#INPUT_ELEMENTS}
 * @see [INPUT_ELEMENTS]{@link LulConfig#INPUT_ELEMENTS}
 */

export function genEnter(arg) {
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
 * @param {number} width - (optional) sets the width of the slide range (in pixels).  
 * omit to use a [default value]{@link LulConfig#INPUT_ELEMENTS}
 * @param {number} min - the smallest possible number  
 * the slider can select
 * @param {number} max - the biggest one
 * @param {number} step - the step between two possible selections
 * @see [INPUT_ELEMENTS]{@link LulConfig#INPUT_ELEMENTS}
 */

export function genRange(arg) {
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

export function genCheck(arg) {
  let check = genInput(arg, 'check');
  return check;
}


// generates an input element based on INPUT_ELEMENTS
export function genInput(arg, inputName) {
  //generate <input> with css class
  let input = gen('input', lulConfig.INPUT_ELEMENTS[inputName].className);

  //assign type and name
  input.type = lulConfig.INPUT_ELEMENTS[inputName].inputType;
  input.name = arg.name;

  //set the width property
  if(arg.width == undefined) arg.width = lulConfig.INPUT_ELEMENTS[inputName].width;
  input.style[lulConfig.INPUT_ELEMENTS[inputName].widthProperty] = arg.width + 'px';


  //add eventListeners for updating the [name]-variable
  //(and possibly the provided oninput)
  if(inputName == 'check') 
    input.addEventListener('input', function() {window[arg.name] = this.checked;});
  else
    input.addEventListener('input', function() {window[arg.name] = this.value;});

  if(arg.oninput != undefined)
    input.addEventListener('input', arg.oninput);
  return input;
}
