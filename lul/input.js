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
  button = gen('button', lul.DEFAULT_BUTTON_CLASS );

  if(arg.onclick != undefined)
    button.addEventListener('click', arg.onclick);

  let text = genText(arg.text);
  button.appendChild(text);
  return button;
}





export function genEnter(arg) {
  return genInput(arg, 'enter');
}

export function genRange(arg) {
  let range = genInput(arg, 'range');
  range.min = arg.min;
  range.max = arg.max;
  range.step = arg.step;
  range.value = arg.min;
  return range;
}

export function genCheck(arg) {
  let check = genInput(arg, 'check');
  check.addEventListener('input', function() {window[this.name] = this.checked;});
  return check;
}


export function genInput(arg, inputName) {
  let input = gen('input', lul.INPUT_ELEMENTS[inputName].className);
  input.type = lul.INPUT_ELEMENTS[inputName].inputType;
  input.name = arg.name;
  input.addEventListener('input', function() {window[this.name] = this.value;});
  if(arg.oninput != undefined)
    input.addEventListener('input', arg.oninput);
  if(arg.minWidth == undefined) arg.minWidth = lul.INPUT_ELEMENTS[inputName].minWidth;
  input.style.minWidth = arg.minWidth + 'px';
  return input;
}
