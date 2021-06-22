import {set}
  from '../lul-insert.js';
import {genOverflow}
  from './lul-overflow.js';
import {genCollapsible}
  from './lul-collapsible.js';

export function genEntry(arg) {
  let overflowId = uid();
  let overflow = genOverflow({
    innerId: overflowId,
    direction: arg.direction
  });
  let contentId = uid();
  let collapsible = genCollapsible({
    direction: arg.direction,
    hover: overflowId,
    innerId: contentId
  });
  set(contentId, ...(arg.content));
  set(overflowId, collapsible, ...(arg.button));
  return overflow;
}
