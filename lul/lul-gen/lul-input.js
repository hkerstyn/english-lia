const MIN_WIDTH_DICT = {
  ['lia-checkbox']: 0,
  ['lia-range']: 225,
  ['lia-input']: 225
}

export function genRadio(arg) {

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


export function genEnter(arg) {
  return genInput(arg, "text", "lia-input");
}

export function genRange(arg) {
   let range = genInput(arg, "range", "lia-range");
   range.min = arg.min;
   range.max = arg.max;
   range.step = arg.step;
   range.value = arg.min;
   return range;
}

export function genCheck(arg) {
  let check = genInput(arg, "checkbox", "lia-checkbox");
  check.addEventListener("input", function() {window[this.name] = this.checked});
  return check;
}

export function genButton(arg) {
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
  input.addEventListener("input", function() {window[this.name] = this.value});
  if(arg.oninput != undefined)
  input.addEventListener("input", arg.oninput);
  if(arg.minWidth == undefined) arg.minWidth = MIN_WIDTH_DICT[className];
  input.style.minWidth = arg.minWidth + 'px';
  return input;
}
