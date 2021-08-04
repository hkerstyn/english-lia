/**
 * generates an html element whose size always remains the same.  
 * when its content gets too large, it simply overflows  
 * Uses {@tutorial arg}
 *
 * @param innerId {string} - the value specified here can be used  
 * as {@tutorial key} to insert other elements into the collapsible
 * @param direction {'row'|'column'} - the direction the **overflow**'s child nodes are positioned
 */

export function genOverflow(arg) {
  //the parent always retains its size
  let parent = gen('div', lulConfig.DEFAULT_OVERFLOW_PARENT_CLASS);

  //the box changes its size (getting bigger than parent)
  let box = gen('div', lulConfig.DEFAULT_OVERFLOW_CLASS);
  if(arg.direction == 'column')
    box.style.flexDirection = 'column';

  parent.appendChild(box);

  //after placing the overflow, the parent should freeze its size using that of the box
  requestAnimationFrame(function () {
    setTimeout(function () {
      recalculateOverflowIndices();
      parent.style.height = window.getComputedStyle(box).height;
      parent.style.width = window.getComputedStyle(box).width;
      box.style.position = 'absolute';
    }, 10);
  });

  store(box, arg.innerId);
  return parent;

}

//call this every time you change any overflow's position
//this puts overflows on the left and on the top in front
export function recalculateOverflowIndices () {
  //store all overflows on the page into an array
  let overflows = document.getElementsByClassName(lulConfig.DEFAULT_OVERFLOW_CLASS); 
  let overflowArray = [];
  for (let overflow of overflows) {
    overflowArray.push(overflow);
  }

  //sort them to prioritize those on the left and on the top
  let sortedArray = [...overflowArray].sort(overlapTest);

  //set the z-Indices accordingly
  let i = 1;
  for(let overflow of sortedArray) {
    overflow.style.zIndex = i;
    i++;
  }
}

// returns a positive value if overflow1 should overlap overflow2
// this is the case if overflow1 could not possibly be inside overflow2's 'expand area'
// ie all points below or right of overflow2's top left corner
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
  return -1;
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
