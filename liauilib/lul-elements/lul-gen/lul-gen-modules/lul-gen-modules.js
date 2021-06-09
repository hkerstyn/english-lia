import {genModules as entryGenModules}
  from '../lul-entry/lul-entry.js';
import {genModules as inputGenModules}
  from '../lul-input/lul-input.js';
import {genModules as collapsibleGenModules}
  from '../lul-collapsible/lul-collapsible.js';
import {genModules as containerGenModules}
  from '../lul-container/lul-container.js';
import {genModules as overflowGenModules}
    from '../lul-collapsible/lul-overflow.js';

export var genModules = [];


genModules = genModules.concat(entryGenModules);
genModules = genModules.concat(inputGenModules);
genModules = genModules.concat(collapsibleGenModules);
genModules = genModules.concat(containerGenModules);
genModules = genModules.concat(overflowGenModules);



genModules.push({type: "children"});
genModules.push({
  type: "parent",
  hierarchyType: "parent",
  parentAlias: "children"
})
