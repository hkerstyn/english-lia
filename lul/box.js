/**
 * returns a newly generated HTML-Box.  
 * Uses {@tutorial arg}.
 *
 * @param visible {'true'|'false'} - whether the [BOX_CLASS]{@link LulConfig#BOX_CLASS} parameter  
 * should be set as css class of the box
 * @param direction {'column'|'row'} - whether the children of the box  
 * should be positioned next to or above and below each other.
 * @see [BOX_CLASS]{@link LulConfig#BOX_CLASS}
 */

export function genBox(arg) {
  let box = gen('div', lulConfig.BOX_CLASS);
  if(arg.visible == 'false')
    box.className = '';

  box.style.display = 'inline-flex';
  box.style.flexDirection = arg.direction;
  if(arg.direction == 'column')
    box.style.width = '100%';
  else box.style.height = '100%';

  return box;
}
