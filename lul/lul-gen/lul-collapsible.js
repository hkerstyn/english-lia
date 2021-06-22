import {store, get}
  from '../lul-insert.js';


var directionSizeAttributeMap = {
  row: 'width',
  column: 'height'
}

var scrollSizeAttributeMap = {
  width: 'scrollWidth',
  height: 'scrollHeight'
}
var classNameMap = {
  width: 'lul-collapsible-width',
  height: 'lul-collapsible-height'
}




export function genCollapsible(arg) {
  let sizeAttribute = arg.sizeAttribute;
  if(sizeAttribute == undefined)
  sizeAttribute = directionSizeAttributeMap[arg.direction];
  if(sizeAttribute == undefined)
  sizeAttribute = 'width';
  let className = classNameMap[sizeAttribute] + ' lul-light';
  let collapsible = gen("div", className);
  collapsible.setAttribute('sizeAttribute', sizeAttribute);

  if(arg.collapsed == undefined)
  arg.collapsed = 'true';
  collapsible.setAttribute('collapsed', arg.collapsed);
  if(arg.collapsed == 'true')
    collapsible.style[sizeAttribute] = 0;

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
      collapseElement(collapsible);
    });}

  let child = gen('div', 'lul-padding');
  collapsible.appendChild(child);
  store(child, arg.innerId);
  child.style.display = 'inline-block';
  return collapsible;
}

function toggleElement(collapsible) {
  let collapsed = collapsible.getAttribute('collapsed');
  if(collapsed == 'true') expandElement(collapsible);
  else collapseElement(collapsible);
}



function collapseElement(collapsible) {
  let sizeAttribute = collapsible.getAttribute('sizeAttribute');

  let scrollSizeAttribute = scrollSizeAttributeMap[sizeAttribute];
  let scrollSize = collapsible[scrollSizeAttribute];

  let collapsibleTransition = collapsible.style.transition;
  collapsible.style.transition = '';

  requestAnimationFrame(function() {
    //from auto to fixed
    collapsible.style[sizeAttribute] = scrollSize + 'px';
    collapsible.style.transition = collapsibleTransition;

    requestAnimationFrame(function() {
      //from fixed to zero
      collapsible.style[sizeAttribute] = 0 + 'px';
    });
  });

  collapsible.setAttribute('collapsed', 'true');
}

function expandElement(collapsible) {
  let sizeAttribute = collapsible.getAttribute('sizeAttribute');


  let scrollSizeAttribute = scrollSizeAttributeMap[sizeAttribute];
  let scrollSize = collapsible[scrollSizeAttribute];

  //transition
  collapsible.style[sizeAttribute] = scrollSize + 'px';

  collapsible.setAttribute('collapsed', 'false');
}
