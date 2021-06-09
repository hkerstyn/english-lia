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



export var genModules = [
  {
    type: "collapsible",
    genFunction: genCollapsible
  },
  {
    type: "toggle"
  },
  {
    type: "hover"
  }
];

function genCollapsible(arg) {
  let sizeAttribute = arg.sizeAttribute;
  if(sizeAttribute == undefined)
  sizeAttribute = directionSizeAttributeMap[arg.direction];
  let className = classNameMap[sizeAttribute] + " lul-light";
  let collapsible = gen("div", className);
  collapsible.setAttribute('sizeAttribute', sizeAttribute);

  if(arg.collapsed == undefined)
  arg.collapsed = 'true';
  collapsible.setAttribute('collapsed', arg.collapsed);
  if(arg.collapsed == 'true')
    collapsible.style[sizeAttribute] = 0;

  if(arg.toggle != undefined)
    arg.toggle.forEach((toggleItem) => {
      toggleItem.addEventListener('click', function () {
        toggleElement(collapsible);
      })
    });

  if(arg.hover != undefined)
    arg.hover.forEach((hoverItem) => {
      hoverItem.addEventListener('mouseenter', function () {
        expandElement(collapsible);
      })
      hoverItem.addEventListener('mouseleave', function () {
        collapseElement(collapsible);
      })
    });

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
