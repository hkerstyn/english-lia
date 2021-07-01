/*
  genBox({direction, visible})
*/

export function genBox(arg) {
  let box = gen('div', 'lul-padding lul-light');
  if(arg.visible == 'false')
    box.className = '';

  box.style.display = 'inline-flex';
  box.style.flexDirection = arg.direction;
  if(arg.direction == 'column')
    box.style.width = '100%';
  else box.style.height = '100%';

  return box;
}
