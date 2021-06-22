import {store}
  from '../lul-insert.js';

export function genOverflow(arg) {
  let parent = gen('div', 'lul-overflow-parent');
  let box = gen('div', 'lul-overflow');
  if(arg.direction == 'column')
  box.style.flexDirection = 'column';

  parent.appendChild(box);

  requestAnimationFrame(function () {
    parent.style.height = window.getComputedStyle(parent).height;
    parent.style.width = window.getComputedStyle(parent).width;
    box.style.position = 'absolute'
  });
  store(box, arg.innerId);
  return parent;

}
