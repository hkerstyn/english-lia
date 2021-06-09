export var genModules = [
  {
    type: "overflow",
    genFunction: genOverflow
  }
];

function genOverflow(arg) {
  let parent = gen('div', 'lul-overflow-parent');
  let box = gen('div', 'lul-overflow');
  box.id = arg.innerId;
  if(arg.content != undefined)
  appendChildren(box, arg.content);
  if(arg.direction == 'column')
  box.style.flexDirection = 'column';

  parent.appendChild(box);

  requestAnimationFrame(function () {
    parent.style.height = window.getComputedStyle(parent).height;
    parent.style.width = window.getComputedStyle(parent).width;
    box.style.position = 'absolute'
  })
  return parent;

}
