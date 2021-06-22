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
const SELECTED_BUTTON_RADIO_CLASSNAME = "lul-dark";
const UNSELECTED_BUTTON_RADIO_CLASSNAME = "lul-light lul-medium-hover";
const MAX_SELECTION_WIDTH = 300;


import {genInput, genButton}
  from './lul-input.js';
import {genEntry}
  from './lul-entry.js';


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
    dummy.appendChild(option)
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




export function genRadioArray(arg) {

  if(arg.options == undefined)
  console.warn("Arg of Radio %s has no options", arg.name);
  let [texts, values] = genOptionArray(arg.options);


  let radioArray = [];
  for (var i = 0; i < texts.length; i++) {
    let couple = gen('span');
    let radio = genInput(arg, "radio", "lia-radio");

    radio.value = values[i];
    couple.appendChild(radio);
    couple.appendChild(genText(texts[i]));

    radioArray.push(couple);
  }

  return radioArray;
}




export function genButtonRadioArray(arg) {

  if(arg.options == undefined)
  console.warn("Arg of ButtonRadio %s has no options", arg.name);
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
