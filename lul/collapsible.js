import {recalculateOverflowIndices}
  from './overflow.js';
import {genBox}
  from './box.js';


//map direction onto size attribute
var directionSizeAttributeMap = {
  row: 'width',
  column: 'height'
};
//map size onto scrollSize
var scrollSizeAttributeMap = {
  width: 'scrollWidth',
  height: 'scrollHeight'
};




/**
 * Generates a [box]{@link genBox}, that can be collapsed
 * and expanded via javascript.  
 * Uses {@tutorial arg}
 *
 * @param innerId {string} - the value specified here can be used  
 * as {@tutorial key} to insert other elements into the collapsible
 * @param direction {'row'|'column'} - whether the box should collapse  
 * horizontally or vertically
 * @param toggle {key} - (optional) a {@tutorial key} to an html-element that  
 * gets set to trigger an expansion or collapse of this box  
 * when clicked
 * @param hover {key} - (optional) a {@tutorial key} to an html-element that  
 * gets set to trigger an expansion or collapse of this box  
 * when hovered.
 * @param functions {Object} - (optional) some object that gets assigned three new properties:
 * * expandFunction: call this to expand this specific box
 * * collapseFunction: call to collapse
 * * toggleFunction: automatically expands or collapses the box
 * @see [COLLAPSIBLE_CLASS_MAP]{@link LulConfig#COLLAPSIBLE_CLASS_MAP}  
 * [HOVER_COLLAPSE_DELAY]{@link LulConfig#HOVER_COLLAPSE_DELAY}  
 * [HOVER_INITIAL_DELAY_MS]{@link LulConfig#HOVER_INITIAL_DELAY_MS}
 */

export function genCollapsible(arg) {
  
  //determine sizeAttribute from arg.direction
  sizeAttribute = directionSizeAttributeMap[arg.direction];
  if(sizeAttribute == undefined)
    sizeAttribute = 'width';

  //set the css class
  let className = lulConfig.COLLAPSIBLE_CLASS_MAP[sizeAttribute] + '';
  let collapsible = gen('div', className);

  collapsible.setAttribute('sizeAttribute', sizeAttribute);

  //initializes the collapsed-state
  if(arg.collapsed == undefined)
    arg.collapsed = 'true';
  collapsible.setAttribute('collapsed', arg.collapsed);
  if(arg.collapsed == 'true')
    collapsible.style[sizeAttribute] = 0;

  //sets toggle and hover (if present)
  //use a timeout to avoid some weird bugs
  setTimeout(function () {
    let toggle = get(arg.toggle);
    if(toggle != undefined)
      toggle.addEventListener('click', function () {
        toggleElement(collapsible);
      });

    let hover = get(arg.hover);
    if(hover != undefined) {
      hover.addEventListener('mouseenter', function () {
        expandElement(collapsible);
      });
      hover.addEventListener('mouseleave', function () {
        collapseElement(collapsible, lulConfig.HOVER_COLLAPSE_DELAY);
      });}
  }, lulConfig.HOVER_INITIAL_DELAY_MS);

  //sets functions
  if(arg.functions != undefined) {
    arg.functions['toggleFunction'] = function () {
      toggleElement(collapsible);
    };
    arg.functions['collapseFunction'] = function () {
      collapseElement(collapsible);
    };
    arg.functions['expandFunction'] = function () {
      expandElement(collapsible);
    };
  }

  //generates a dummy child for padding
  let child = genBox(arg);
  collapsible.appendChild(child);
  store(child, arg.innerId);

  return collapsible;
}

//calls collapseElement or expandElement depending on
//the collapsible's collapsed-state
function toggleElement(collapsible) {
  let collapsed = collapsible.getAttribute('collapsed');
  if(collapsed == 'true') expandElement(collapsible);
  else collapseElement(collapsible);
}



function collapseElement(collapsible, delay) {

  let sizeAttribute = collapsible.getAttribute('sizeAttribute');
  let scrollSizeAttribute = scrollSizeAttributeMap[sizeAttribute];
  let scrollSize = collapsible[scrollSizeAttribute];

  let currentSize = window.getComputedStyle(collapsible)
    .getPropertyValue(sizeAttribute)
    .slice(0, -2);

  if(currentSize == scrollSize)
    collapsible.style.transitionDelay = delay;


  requestAnimationFrame(function() {
    //from auto to fixed
    collapsible.style[sizeAttribute] = scrollSize + 'px';

    requestAnimationFrame(function() {
      //from fixed to zero
      collapsible.style[sizeAttribute] = 0 + 'px';
    });
  });

  collapsible.setAttribute('collapsed', 'true');
}

function expandElement(collapsible) {
  recalculateOverflowIndices();
  collapsible.style.transitionDelay = '0s';


  let sizeAttribute = collapsible.getAttribute('sizeAttribute');
  let scrollSizeAttribute = scrollSizeAttributeMap[sizeAttribute];
  let scrollSize = collapsible[scrollSizeAttribute];

  //transition
  collapsible.style[sizeAttribute] = scrollSize + 'px';

  collapsible.setAttribute('collapsed', 'false');
}
