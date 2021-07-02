//imports all lul-functions. gets bundled by rollup into lul.js

import {Lul}
  from './embed.js';
import {genButton, genEnter, genRange, genCheck}
  from './input.js';
import {genRadioArray, genButtonRadioArray, genSelection}
  from './selection.js';
import {genCollapsible}
  from './collapsible.js';
import {genOverflow}
  from './overflow.js';
import {genEntry}
  from './entry.js';
import {genBox}
  from './box.js';


//tell rollup that all of these functions are in fact necessary
console.log(
  Lul,
  genButton, genEnter, genRange, genCheck,
  genRadioArray, genButtonRadioArray, genSelection,
  genCollapsible, genOverflow, genEntry, genBox
);
