var textDummy;
var statsTableDummy;
var sortSelectDummy;

var transcriptSpans;

import {transcript, setTranscript, wordGroups, wordInstances, sortWordGroups,
  getFullText, splitByWords, getWordGroups} from './wordHandler.js';
import {jumpInVideo, currentPosition} from './youtube.js';

export function clearTextRemainders() {
  get('sortSelectDummy').innerHTML = '';
  get('textDummy').innerHTML = '';
  get('statsTableDummy').innerHTML = '';
  setTranscript(undefined);
}



var previousIndex = -1;
export function highlightText() {
  if(transcript === undefined) 
    return;

  let newIndex;
  for(let i = 0; i < transcript.length; i++) {
    let tsmp = transcript[i];
    let currentpos = currentPosition();

    if(tsmp.start < currentpos && tsmp.start + tsmp.duration > currentpos){
      newIndex = i;
      break;
    }
  }
  if(newIndex == undefined)
    newIndex = 0;
  if(newIndex != previousIndex) {
    if(previousIndex != -1)
      transcriptSpans[previousIndex].className = grabber.DEFAULT_SPAN_CLASS;

    transcriptSpans[newIndex].className = grabber.HIGHLIGHT_SPAN_CLASS;
    previousIndex = newIndex;
  }
}

export function setText() {
  transcriptSpans = [];

  for(let transcriptEntry of transcript) {
    let span = genText(transcriptEntry.text + ' ');

    span.addEventListener('click', async function(e) {
      console.log(e);
      jumpInVideo(transcriptEntry.start);
    });

    add('textDummy', span);
    transcriptSpans.push(span);
  }
}

export function setSortSelection() {
  let selectedSortButton = genButton({
    text: grabber.SORT_SELECT_TEXT
  });
  selectedSortButton.className = grabber.SORT_SELECT_BUTTON_CLASS; 

  let selectedSortRadio = genSelection({
    name: 'selectedSort',
    oninput: function () {
      setStatsTable(window['selectedSort']);
    },
    options: {
      texts: grabber.SORT_SELECT_OPTION_TEXTS,
      values: ['sortAmountDown', 'sortLengthDown', 'alphabetAtoZ']
    },
    button: [selectedSortButton],
    direction: grabber.SORT_SELECT_ENTRY_DIRECTION,
    type: grabber.SORT_SELECT_RADIO_TYPE
  });
  set('sortSelectDummy', selectedSortRadio);


  getFullText();
  getWordGroups();
  setStatsTable('sortAmountDown');
}









function setStatsTable(comparator) {

  sortWordGroups(comparator);
  let wordGroupIndex = 0;

  let columnCount = Math.floor( get('statsTable.container').size[0] / grabber.TABLE_COLUMN_WIDTH);
  console.log(columnCount);
  let rowCount = Math.ceil(wordGroups.length / columnCount);

  let table = gen('table', grabber.TABLE_CLASS);
  for(let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    let row = gen('tr', grabber.TABLE_ROW_CLASS);
    for(let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
      if(wordGroupIndex >= wordGroups.length)
        break;
      let wordGroup = wordGroups[wordGroupIndex];
      wordGroupIndex++;

      let text = gen('a', grabber.TABLE_TEXT_CLASS);
      text.innerHTML = wordGroup.name;

      let cell = gen('td', grabber.TABLE_CELL_CLASS);
      cell.style.textAlign = 'center';
      cell.addEventListener('click', function () {
        highlightWord(wordGroup.name);
      });
      cell.appendChild(text);
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
  set('statsTableDummy', table);
}

function highlightWord(suchword) {
  for(let i = 0; i < transcript.length; i++) {
    let textToCheck = transcript[i].text;
    let words = textToCheck.split(/[ \n]/g);
    transcriptSpans[i].innerHTML = '';
    for(let word of words) {
      console.log('word: ', word);
      let wordSpan = gen('span');
      wordSpan.innerHTML = word + ' ';

      let match = false;
      let wordNames = splitByWords(word);
      for (let wordName of wordNames) {
        console.log('wordName: ', wordName);
        if(wordName.toLowerCase() != suchword.toLowerCase()) 
          continue;

        match = true;
        break;
      }

      if(match){
        wordSpan.className = grabber.HIGHLIGHT_SPAN_CLASS;
      } else {
        wordSpan.className = grabber.DEFAULT_SPAN_CLASS;
      }
      transcriptSpans[i].appendChild(wordSpan);
    }

  }
}
