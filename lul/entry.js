import {genOverflow}
  from './overflow.js';
import {genCollapsible}
  from './collapsible.js';


/**
 * generates a [collapsible]{@link LulFunctions.genCollapsible} next to a
 * [button]{@link LulFunctions.genButton} inside an
 * [overflow]{@link LulFunctions.genOverflow}.  
 * Uses {@tutorial arg}
 *
 * @param {'row'|'column'} direction - specifies whether the **collapsible**  
 * and the **button(s)** should be next to or on top of one another
 * @param {Array} content - array of HTML-Elements to be put inside the **collapsible** 
 * @param {Array} button - array of HTML-Elements to be used as **buttons** 
 */

export function genEntry(arg) {
  //generate an overflow with some inner id
  let overflowId = uid();
  let overflow = genOverflow({
    innerId: overflowId,
    ...arg
  });

  //generate a collapsible with some inner id
  let contentId = uid();
  let collapsible = genCollapsible({
    hover: overflowId,
    innerId: contentId,
    ...arg
  });

  //put everything together using the ids
  set(contentId, ...(arg.content));
  set(overflowId, collapsible, ...(arg.button));
  return overflow;
}
