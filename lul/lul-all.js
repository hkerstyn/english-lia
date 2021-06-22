//imports all lul-functions. gets bundled by rollup into lul.js
import {get, store, set, add, make, insert}
  from './lul-insert.js';
import {genTable, genFullTable}
from './lul-gen/lul-table.js'
import {genButton, genEnter, genRange, genCheck}
  from './lul-gen/lul-input.js';
import {genRadioArray, genButtonRadioArray, genSelection}
  from './lul-gen/lul-selection.js';
import {genCollapsible}
  from './lul-gen/lul-collapsible.js';
import {genOverflow}
  from './lul-gen/lul-overflow.js';
import {genEntry}
  from './lul-gen/lul-entry.js';
import {genBox}
  from './lul-gen/lul-box.js';



//tell rollup that all of these functions are in fact necessary
console.log(
  get, store, set, add, make, insert,
  genButton, genEnter, genRange, genCheck,
  genRadioArray, genButtonRadioArray, genSelection,
  genCollapsible, genOverflow, genEntry, genBox,
  genTable, genFullTable
);
