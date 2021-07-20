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


import {genInput, genButton}
  from './input.js';
import {genEntry}
  from './entry.js';


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
export function genButtonRadioArray(arg) {

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
