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
  //create box as inline-flex div
  let box = gen('div', lulConfig.BOX_CLASS);
  box.style.display = 'inline-flex';
  
  //set classname according to arg.visible
  if(arg.visible == 'false')
    box.className = '';

  //sets flexDirection and size according to arg.direction
  box.style.flexDirection = arg.direction;
  if(arg.direction == 'column')
    box.style.width = '100%';
  else {
    box.style.alignItems = 'center';
  }

  return box;
}
