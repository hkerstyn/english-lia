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


export var genModules = [
  {
    type: "enter",
    genFunction: genEnter
  },
  {
    type: "radio",
    genFunction: genRadio
  },
  {
    type: "range",
    genFunction: genRange
  },
  {
    type: "check",
    genFunction: genCheck
  }
];


/*input functions*/

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
  check.addEventListener("input", function() {window[this.name] = this.checked});
  return check;
}

/*utility functions*/
//generic function for making an <input class="className" type="type" name="name">
function genInput(arg, type, className) {
  let input = gen("input", className);
  input.type = type;
  input.name = arg.name;
  input.addEventListener("input", function() {window[this.name] = this.value});
  if(arg.oninput != undefined)
  input.addEventListener("input", arg.oninput);
  return input;
}
