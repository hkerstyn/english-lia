import {NameAnalyzer}
  from './name-analyzer.js';

const COMPATATORS = {
  byFrequency: function(nameWordGroupA, nameWordGroupB) {
    return nameWordGroupB.wordInstances.length - nameWordGroupA.wordInstances.length;
  },
  byLength: function(nameWordGroupA, nameWordGroupB) {
    return nameWordGroupB.name.length - nameWordGroupA.name.length;
  },
  alphabetically: function(nameWordGroupA, nameWordGroupB) {
    return nameWordGroupA.name.localeCompare(nameWordGroupB.name);
  }
};

export class NameSorter extends NameAnalyzer {
  
  static sortNamedWordGroups(comparator) {
    NameAnalyzer.nameWordGroups.sort(COMPATATORS[comparator]);
  }

}
