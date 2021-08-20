//import all api functions
import {get, store, clear}
  from './get-store.js';
import {set, add, make, insert}
  from './insert.js';
import {gen, genText, genHtml, uid, truetypeof, getXMLDocFromLink}
  from './misc.js';
import {getCssProperty, setCssProperty, listingStringToArray, arrayToListingString}
  from './css-control.js';
import {watch}
  from './watch.js';

//log them so that rollup will include them
//these functions will now be globally available
console.log(
  get, store, clear, set, add, make, insert,
  gen, genText, genHtml, uid, truetypeof, getXMLDocFromLink,
  getCssProperty, setCssProperty, listingStringToArray, arrayToListingString,
  watch
);


