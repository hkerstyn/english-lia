/*
  genCollapsible({innerId, direction, toggle, hover, functions})

  genCollapsible(arg): generates a box
      that can be expanded and collapsed
      at your arbitrary whim
    arg.innerId:
      use this as key for inserting other elements into
      the collapsible
    arg.direction:
      'row' or 'column', defines
      whether the box should change its
      width or height
    arg.toggle:
      an html-element whose onclick-event
      is to expand or collapse our collapsible
    arg.hover:
      an html-elment whose onmouseleave and
      onmouseenter events are set to collapse and expand
    arg.functions:
      an object that gets assigned the properties
      'expandFunction', 'collapseFunction' and 'toggleFunction'
      with functions controlling the newly created collapsible.

*/

import {recalculateOverflowIndices}
  from './overflow.js';
import {genBox}
  from './box.js';

//dictionaries for equating values of different properties
var directionSizeAttributeMap = {
  row: 'width',
  column: 'height'
};
var scrollSizeAttributeMap = {
  width: 'scrollWidth',
  height: 'scrollHeight'
};




export function genCollapsible(arg) {
  recalculateOverflowIndices();
  //determine sizeAttribute from arg.direction
  sizeAttribute = directionSizeAttributeMap[arg.direction];
  if(sizeAttribute == undefined)
    sizeAttribute = 'width';

  //set the css class
  let className = lul.COLLAPSIBLE_CLASS_MAP[sizeAttribute] + '';
  let collapsible = gen('div', className);

  collapsible.setAttribute('sizeAttribute', sizeAttribute);

  //initializes the collapsed-state
  if(arg.collapsed == undefined)
    arg.collapsed = 'true';
  collapsible.setAttribute('collapsed', arg.collapsed);
  if(arg.collapsed == 'true')
    collapsible.style[sizeAttribute] = 0;

  //sets toggle, hover and functions (if present)
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
        collapseElement(collapsible, lul.HOVER_COLLAPSE_DELAY);
      });}
  }, lul.HOVER_INITIAL_DELAY_MS);

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
