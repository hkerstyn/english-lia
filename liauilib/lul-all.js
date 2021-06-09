//imports all lul-functions. gets bundled by rollup into lul.js

import{genElement, genRadio, genEnter, genRange, genCheck,
  genButton, genEntry, genContainer, genCollapsible,
  set, add, make,
  hide, reveal, solo, setDefaultSoloGroup}
  from './lul-elements/lul-elements.js';




//tell rollup that all of these functions are in fact necessary
console.log(genElement, genRadio, genEnter, genRange, genCheck,
  genButton, genEntry, genContainer, genCollapsible,
  set, add, make,
  hide, reveal, solo, setDefaultSoloGroup);
