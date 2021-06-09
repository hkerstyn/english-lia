var textDummy;
var statsTableDummy;
var sortSelectDummy;

var transcriptSpans;

import {transcript, setTranscript, wordGroups, wordInstances, sortWordGroups,
   getFullText, getWordGroups} from './wordHandler.js';
import {jumpInVideo, currentPosition} from './youtube.js';

export function clearTextRemainders() {
  sortSelectDummy = document.getElementById('sortSelectDummy');
  sortSelectDummy.innerHTML = "";
  textDummy = document.getElementById('textDummy');
  textDummy.innerHTML = "";
  statsTableDummy = document.getElementById('statsTableDummy');
  statsTableDummy.innerHTML = "";
  setTranscript(undefined);
}




export function highlightText() {
    if(transcript === undefined) {
        return;
    }
    for(let i = 0; i < transcript.length; i++) {
        let tsmp = transcript[i];
        let currentpos = currentPosition();
        if(tsmp.start < currentpos && tsmp.start + tsmp.duration > currentpos){
            transcriptSpans[i].style = "background-color:#CC9CDF";
        }
        else{
            transcriptSpans[i].style = "background-color:none";
        }
    }
}

export function setText() {
    transcriptSpans = [];

    for(let transcriptEntry of transcript) {
        let span = genRaw("span");

        span.innerHTML = transcriptEntry.text;
        span.innerHTML += " "
        span.addEventListener("click", async function(e) {
            console.log(e);
            jumpInVideo(transcriptEntry.start);
        });
        textDummy.appendChild(span);
        transcriptSpans.push(span);
    }
  }

  export function setSortSelection() {
      let selectedSortArg = {
        name: "selectedSort",
        oninput: function () {
          setStatsTable(window["selectedSort"])
        },
        options: {
          texts: ["By frequency", "By length", "Alphabetically"],
          values: ["sortAmountDown", "sortLengthDown", "alphabetAtoZ"]
        },
        container: {
          target: {id: "sortSelectDummy"},
          button: {text: "Sort criterium"}
        }
      }
      genRadio(selectedSortArg);


      getFullText();
      getWordGroups();
      setStatsTable("sortAmountDown");
  }









function setStatsTable(comparator) {
  sortWordGroups(comparator);
  statsTableDummy.innerHTML = "";
  statsTableDummy.appendChild(genStatsTable());
}


function genStatsTable() {
  let array = wordGroups;
  let spaltn = 4;
  let zeilen = undefined
  if(array%4==0){
      zeilen = Math.floor(array.length/4);
  }
  else{
      zeilen = Math.floor(array.length/4) + 1;
  }
  //console.log(zeilen);
  let displayArray = [];
  for(let entry of array) { // eintraege in die Tab. generieren...
      let block = document.createElement("table");
      block.style="width:100%";
      let blockItem = document.createElement("TR");
      let word = document.createElement("TD");
      word.style="width:50%";
      let amount = document.createElement("TD");
      amount.style="width:50%";
      word.appendChild(document.createTextNode(entry.name));
      amount.appendChild(document.createTextNode(entry.amount));
      blockItem.appendChild(word);
      blockItem.appendChild(amount);
      block.appendChild(blockItem);
      //console.log(amount, word);
      displayArray.push(block);

      block.onclick = function() {
          //console.log(entry.word);
          highlightWord(entry.name);
      }

  }
  //console.log(displayArray);
  let table = document.createElement("table");
  table.style="width:100%; border:2px solid black;"
  for(let zeile = 0; zeile < zeilen; zeile++) {
      let zeileItem = document.createElement("TR");
      for(let spalte = 0; spalte < spaltn; spalte++) {
          let spalteItem = document.createElement("TD");
          spalteItem.style="border:2px solid black;"
          //console.log(spalte + zeile * spaltn);
          if(displayArray[spalte + zeile * spaltn] === undefined){
              break;
          }
          spalteItem.appendChild(displayArray[spalte + zeile * spaltn]);
          zeileItem.appendChild(spalteItem)
      }
      table.appendChild(zeileItem);
  }
  //console.log(table);
  return table;
}

function highlightWord(suchword) {
    for(let i = 0; i < transcript.length; i++) {
        let textToCheck = transcript[i].text;
        let res = textToCheck.split(" ");
        transcriptSpans[i].innerHTML = "";
        for(let word of res) {
            let wordSpan = document.createElement("SPAN");
            wordSpan.innerHTML = word + " ";
            if(word.toLowerCase().includes(suchword)){
                wordSpan.style = "background-color:#33d7ff";
            }
            transcriptSpans[i].appendChild(wordSpan);
        }

    }
}
