export var transcript;
export var fullText;
export var wordGroups;
export var wordInstances;

export function setTranscript(newTranscript) {transcript = newTranscript;}

const STATREPLACECHARACTERS = /[%,.;?!/"“”„/\\/\n-0123456789–¿…]/g;
const COMPARE_FUNKTIONS = {};
COMPARE_FUNKTIONS.sortAmountUp = function(a,b) {
  return a.amount - b.amount;
};
COMPARE_FUNKTIONS.sortAmountDown = function(a,b) {
  return b.amount - a.amount;
};
COMPARE_FUNKTIONS.sortLengthUp = function(a,b) {
  return a.name.length - b.name.length;
};
COMPARE_FUNKTIONS.sortLengthDown = function(a,b) {
  return b.name.length - a.name.length;
};
COMPARE_FUNKTIONS.alphabetAtoZ = function(a,b) {
  return a.name.localeCompare(b.name);
};
COMPARE_FUNKTIONS.alphabetZtoA = function(a,b) {
  return b.name.localeCompare(a.name);
};



export function getFullText() {
  fullText = '';
  for(let transcriptEntry of transcript) {
    fullText += transcriptEntry.text + ' ';
  }
  //html zeug entfernen
  let textArea = document.createElement('textarea');
  textArea.innerHTML = fullText;
  fullText = textArea.value;
}

export function getWordGroups() {
  //seperates string 'fullText' into array of strings 'wordInstances'
  fullText = fullText.replaceAll(STATREPLACECHARACTERS, ' ').toLowerCase();
  wordInstances = fullText.split(' ');
  for(let i = 0; i < wordInstances.length; i++){
    if(wordInstances[i] === '') {
      wordInstances.splice(i, 1);
      i--;
    }
  }
  //groups wordInstances into wordGroups
  wordGroups = [];
  for(wordInstance of wordInstances) {

    let matchingWordGroupFound = false;
    for(existingWordGroup of wordGroups) {
      if(existingWordGroup.name === wordInstance){
        existingWordGroup.amount++;
        matchingWordGroupFound = true;
        break;
      }
    }
    if(!matchingWordGroupFound) wordGroups.push({name: wordInstance, amount: 1});
  }
  return wordGroups;
}
export function sortWordGroups(comparator) {
  wordGroups.sort(COMPARE_FUNKTIONS[comparator]);
}
