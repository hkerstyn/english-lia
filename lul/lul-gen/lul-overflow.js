/*
  genOverflow({innerId, direction})

  genOverflow(arg):
      generates an html element whose size remains the same.
      when its content gets too large, it simply overflows
    arg.innerId:
      use this as key for inserting other elements into
      the collapsible
    arg.direction: 'row' or 'column'
      the direction the overflow's child nodes are positioned
*/
import {store}
  from '../lul-insert.js';

export function genOverflow(arg) {
  let parent = gen('div', 'lul-overflow-parent');
  let box = gen('div', 'lul-overflow lul-light');
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
