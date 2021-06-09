export var genModules = [
  {
    type: "container",
    genFunction: genContainer
  },
  {
    type: "content",
    genFunction: examineContent
  }
]
const DEFAULT_BOX_PADDING = '20px';
const DEFAULT_BOX_CLASSNAME = 'lul-light';

function genContainer(arg) {
  console.log("Generating container with arg: ", arg);
  let table = gen("table", "lul-container");
  let row = gen("tr", "lul-container");
  arg.content.forEach((contentItem) => {
    let cell = gen('td', "lul-container");
    if(contentItem.type == 'box') {
      cell.className += ' ' + DEFAULT_BOX_CLASSNAME;
      cell = Object.assign(cell, contentItem);
      if(cell.style.padding == '')
      cell.style.padding = DEFAULT_BOX_PADDING;
    }
    else
      cell.appendChild(contentItem);
    row.appendChild(cell);
    table.appendChild(row);

    if(arg.direction == 'column')
    row = gen("tr", "lul-container") ;
  });
  return table;
}

function examineContent(arg) {
  if(arg.content == undefined)
    arg.type = 'box';
  else
    arg.type = 'container';
    return arg;
}
