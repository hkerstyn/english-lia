/*
  genEntry({direction, content, button})


  genEntry(arg):
      Creates a collapsible inside an overflow
    arg.direction: 'row' or 'column'
      the direction of the overflow
    arg.content:
      array of HTML-Elements to be put
      inside the collapsible
    arg.button:
      array of HTML-Elements to be put
      inside the overflow, after the collapsible
*/

import {genOverflow}
  from './overflow.js';
import {genCollapsible}
  from './collapsible.js';


export function genEntry(arg) {
  let overflowId = uid();
  let overflow = genOverflow({
    innerId: overflowId,
    ...arg
  });

  let contentId = uid();
  let collapsible = genCollapsible({
    hover: overflowId,
    innerId: contentId,
    ...arg
  });

  set(contentId, ...(arg.content));
  set(overflowId, collapsible, ...(arg.button));
  return overflow;
}
