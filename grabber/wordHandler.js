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

    let textArea = document.createElement('textarea');
    textArea.innerHTML = transcriptEntry.text;
    transcriptEntry.text = textArea.value;
    textArea.remove();
    fullText += transcriptEntry.text + ' ';
  }
  //html zeug entfernen
}

export function splitByWords(text) {
  //seperates string 'fullText' into array of strings 'wordInstances'
  text = text.replaceAll(/\d/g, ' ');
  text = text.replaceAll(/'/g, '0');
  text = text.replaceAll(/\W/g, ' ');
  text = text.replaceAll(/0+/g, "'");
  
  return text.trim().split(/ +/g);
}
export function getWordGroups() {
  
  wordInstances = splitByWords(fullText);
  //groups wordInstances into wordGroups
  wordGroups = [];
  for(wordInstance of wordInstances) {

    let matchingWordGroupFound = false;
    for(existingWordGroup of wordGroups) {
      if(existingWordGroup.name.toLowerCase() === wordInstance.toLowerCase()){
        existingWordGroup.amount++;
        if(wordInstance == wordInstance.toLowerCase())
          existingWordGroup.name = wordInstance;
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
