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


export function genOverflow(arg) {
  let parent = gen('div', 'lul-overflow-parent');
  let box = gen('div', 'lul-overflow');
  if(arg.direction == 'column')
    box.style.flexDirection = 'column';

  parent.appendChild(box);

  requestAnimationFrame(function () {
    setTimeout(function () {
      parent.style.height = window.getComputedStyle(box).height;
      parent.style.width = window.getComputedStyle(box).width;
      box.style.position = 'absolute';
    }, 10);
  });
  store(box, arg.innerId);
  return parent;

}

export function recalculateOverflowIndices () {
  let overflows = document.getElementsByClassName('lul-overflow'); 
  let overflowArray = [];
  for (let overflow of overflows) {
    overflowArray.push(overflow);
  }

  //  console.log(overflow);
  //  console.log(calculateElementPosition(overflow));
  //  console.log([overflow.scrollHeight, overflow.scrollWidth]);
  overflowArray.sort(overlapTest);
  let i = 1;
  overflowArray.forEach((overflow) => {
    overflow.style.zIndex = i;
    i++;
  });
}

// returns a positive value if overflow1 should overlap overflow2
function overlapTest (overflow1, overflow2) {
 
  //Calculate positions and sizes
  let position1 = calculateElementPosition(overflow1);
  let position2 = calculateElementPosition(overflow2);
  let size1 = calculateElementSize(overflow1);
  let size2 = calculateElementSize(overflow2);

  if(position2.top > position1.top + size1.height - 5 ||
  position2.left > position1.left + size1.width - 5 ) {
    return 1;
  }
  return 0;
} 

function calculateElementSize (element) {
  return {
    height: parseFloat(window.getComputedStyle(element.parentNode).height.slice(0, -2)),
    width: parseFloat(window.getComputedStyle(element.parentNode).width.slice(0, -2))
  }; 
}

function calculateElementPosition(element) {
  var top = 0, left = 0;
  do {
    top += element.offsetTop  || 0;
    left += element.offsetLeft || 0;
    element = element.offsetParent;
  } while(element);

  return {
    top: top,
    left: left
  };
}
