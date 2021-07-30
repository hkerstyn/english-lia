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
  },
  byOccurrence: function(nameWordGroupA, nameWordGroupB) {
    return 0;
  }
};

export class NameSorter extends NameAnalyzer {
  
  static sortNamedWordGroups(comparator) {
    let sortedArray = [...NameSorter.nameWordGroups];
    sortedArray.sort(COMPATATORS[comparator]);
    return sortedArray;
  }

}
