import {WordAnalyzer}
  from './../word/word-analyzer.js';
import {WordInstance}
  from './../word/word-instance.js';
import {NameWordGroup}
  from './../word/name-word-group.js';

export class NameAnalyzer {

  static analyzeNameGroups(wordInstances) {
    let nameWordGroups = [];
  
    for(let currentWordInstance of wordInstances) {
      let currentNames = WordAnalyzer.prettify(currentWordInstance.text).split(/ +/g);

      for(let currentName of currentNames) {
        let matchingWordGroupFound = false;

        //look for matching existing WordGroup  
        for(let existingWordGroup of nameWordGroups) {
          if(existingWordGroup.name.toLowerCase() == currentName.toLowerCase()){
            existingWordGroup.wordInstances.push(currentWordInstance); 
            currentWordInstance.nameWordGroup = existingWordGroup;

            if(currentName == currentName.toLowerCase())
              existingWordGroup.name = currentName;
            matchingWordGroupFound = true;
            break;
          }
        }

        //create new WordGroup
        if(!matchingWordGroupFound && currentName != '') {
          let newWordGroup = new NameWordGroup(currentName);
          newWordGroup.wordInstances.push(currentWordInstance);
          currentWordInstance.nameWordGroup = newWordGroup;
          nameWordGroups.push(newWordGroup);
        }
      }
    }

    NameAnalyzer.nameWordGroups = nameWordGroups;
  }

}
