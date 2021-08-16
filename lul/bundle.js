/**
 * @class LulFunctions
 * @classdesc A {@tutorial PseudoClass}. Provides genFunctions
 * to create beautiful UI.  
 * Before you can use any though, initialize the Library using
 * the {@link LulConfig} class first.
 *
 * **ATTENTION:** Most functions here use the [arg input scheme]{@tutorial arg}
 * @borrows genBox
 * @borrows genCollapsible
 * @borrows genOverflow
 * @borrows genButton
 * @borrows genEnter
 * @borrows genEntry
 * @borrows genRange
 * @borrows genCheck
 * @borrows genRadioArray
 * @borrows genButtonRadioArray
 * @borrows genSelection
 * @hideconstructor
 */

//import all api-functions
import {LulConfig}
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


//log them so that rollup will include them
//these functions will now be globally available
console.log(
  LulConfig,
  genButton, genEnter, genRange, genCheck,
  genRadioArray, genButtonRadioArray, genSelection,
  genCollapsible, genOverflow, genEntry, genBox
);

//use the default config
let lulConfig = new LulConfig();
lulConfig.apply();
