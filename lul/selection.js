import {genInput, genButton}
  from './input.js';
import {genEntry}
  from './entry.js';


/**
 * generates an [entry]{@link LulFunctions.genEntry} containing either a  
 * * [radio]{@link LulFunctions.genRadioArray} or a
 * * [buttonRadio]{@link LulFunctions.genButtonRadioArray}
 *
 * @param {'radio'|'button-radio'} type - (optional) specifies whether a
 * **radio** or a **buttonRadio** should be used.  
 * 'radio' by default.
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

export function genSelection(arg) {
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

export function genRadioArray(arg) {

  //getting texts and values out of arg.options
  if(arg.options == undefined)
    console.warn('Arg of Radio %s has no options', arg.name);
  let [texts, values] = genOptionArray(arg.options);


  //generating the arrray
  let radioArray = [];
  for (var i = 0; i < texts.length; i++) {
    //a span of a radio and a describing text
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
export function genButtonRadioArray(arg) {

  //getting texts and values out of arg.options
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
      //store this value in the global variable
      window[arg.name] = values[i];

      //making this visible as the selected one
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
  //determine texts
  let texts;
  if (options.texts != undefined)
    texts = options.texts;

  if (options.objects != undefined && options.textFunction != undefined) {
    texts = [];
    options.objects.forEach((object) => {
      texts.push(options.textFunction(object));
    });
  }

  if (texts == undefined) 
    console.warn('Options: no texts could be found');

  //determine values
  let values;
  if (options.values != undefined)
    values = options.values;

  if (options.objects != undefined && options.valueFunction != undefined) {
    values = [];
    options.objects.forEach((object) => {
      values.push(options.valueFunction(object));
    });
  }

  if(values == undefined)
    values = texts;

  //return both
  return [texts, values];
}
