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

const smallWordLength = 3;

export class NameSorter {
  
  static sortNamedWordGroups(wordGroups, comparator) {
    let sortedArray = [...wordGroups];
    sortedArray.sort(COMPATATORS[comparator]);
    return sortedArray;
  }

  static excludeSmallWords(wordGroups) {
    let longWordGroups = [];
    for(let wordGroup of wordGroups) {
      if(wordGroup.name.length > smallWordLength) 
        longWordGroups.push(wordGroup);
    }
    return longWordGroups;
  }

  static searchForTerm(wordGroups, searchTerm) {
    let foundWordGroups = [];
    let unfoundWordGroups = [];
    
    for(let wordGroup of wordGroups) {
      if(wordGroup.name.toLowerCase().startsWith(searchTerm.toLowerCase())) 
        foundWordGroups.push(wordGroup);
      else
        unfoundWordGroups.push(wordGroup);
    }

    for(let wordGroup of unfoundWordGroups) {
      if(wordGroup.name.toLowerCase().includes(searchTerm.toLowerCase())) 
        foundWordGroups.push(wordGroup);
    }

    return foundWordGroups;
  }
}
