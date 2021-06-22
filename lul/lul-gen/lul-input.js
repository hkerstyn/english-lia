/*
  genButton({text, onclick})
  genEnter({name, oninput, minWidth})
  genRange({name, oninput, minWidth, min, max, step})
  genCheck({name, oninput})

  The above functions generate input elements which store
  the selected value in a global variable named 'name'.
  'minWidth' can be used to alter the width of the elements 


*/
export function genButton(arg) {
  let button;
  button = gen("button", "lul-dark lul-medium-hover");

  if(arg.onclick != undefined)
  button.addEventListener("click", arg.onclick);

  let text = genText(arg.text);
  button.appendChild(text);
  return button;
}

const MIN_WIDTH_DICT = {
  ['lia-radio']: 0,
  ['lia-checkbox']: 0,
  ['lia-range']: 225,
  ['lia-input']: 225
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


export function genInput(arg, type, className) {
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
