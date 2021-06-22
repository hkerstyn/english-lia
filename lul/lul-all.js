//imports all lul-functions. gets bundled by rollup into lul.js
import {get, store, set, add, make, insert}
from './lul-insert.js';
import {genRadio, genButton, genEnter, genRange, genCheck}
from './lul-gen/lul-input.js';
import {genCollapsible}
  from './lul-gen/lul-collapsible.js';
import {genOverflow}
  from './lul-gen/lul-overflow.js';
import {genEntry}
  from './lul-gen/lul-entry.js';



//tell rollup that all of these functions are in fact necessary
console.log(
  get, store, set, add, make, insert,
  genRadio, genButton, genEnter, genRange, genCheck,
  genCollapsible, genOverflow, genEntry
);
