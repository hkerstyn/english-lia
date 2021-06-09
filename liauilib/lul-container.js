
function genCont(id, text, onclick) {
  let entry = gen("span", "lul-entry");
  let cont = gen("span", "lia-script lia-script--with-border lul-entry-area lul-container");
  let div = gen("div", "lul-entry-content");
  div.id = id;
  let btn = genBtn(text, onclick);
  cont.appendChild(div);
  entry.appendChild(cont);
  entry.appendChild(btn);
  return entry;
}

function genBtn(text, onclick) {
  let btn = gen("button", "lia-script lia-script--with-border lul-btn");
  btn.onclick = onclick;
  let p = genText(text);
  btn.appendChild(p);
  return btn;
}

function genRadio(name, options) {
  let span = genRaw("span");
  for (var i = 0; i < options.length; i++) {
    let radio = genInput(name, "radio", "lia-radio");
    radio.value = options[i];
    span.appendChild(radio);

    let text = genText(options[i]);
    span.appendChild(text);
  }
  return span;
}

function genEnter(name) {
  return genInput(name, "text", "lia-input");
}

function genRange(name, min, max, step) {
   let range = genInput(name, "range", "lia-range");
   range.min = min;
   range.max = max;
   range.step = step;
   range.value = min;
   return range;
}

function genCheck(name) {
  let check = genInput(name, "checkbox", "lia-checkbox");
  check.oninput = function() {window[this.name] = this.checked;};
  return check;
}

function genInput(name, type, className) {
  let input = gen("input", className);
  input.type = type;
  input.name = name;
  input.oninput = function() {window[this.name] = this.value};
  return input;
}

function genText(content) {
  let text = genRaw("span");
  text.innerHTML = content;
  return text;
}
