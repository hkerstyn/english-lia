import {TranscriptSpanHandler}
  from './transcript-span.js';


export class HighlightHandler {

  static highlightTimeWordGroup(timeWordGroup) {
    let oldTimeSet = HighlightHandler.timeSet;
    let nameSet = HighlightHandler.nameSet;
    let newTimeSet = new Set(timeWordGroup.wordInstances);

    HighlightHandler.highlightGenericSet({
      newSet: newTimeSet,
      oldSet: oldTimeSet,
      persistingSet: nameSet
    });

    HighlightHandler.timeSet = newTimeSet;
  }

  static highlightNameWordGroup(nameWordGroup) {
    let oldNameSet = HighlightHandler.nameSet;
    let timeSet = HighlightHandler.timeSet;
    let newNameSet = new Set(nameWordGroup.wordInstances);

    HighlightHandler.highlightGenericSet({
      newSet: newNameSet,
      oldSet: oldNameSet,
      persistingSet: timeSet
    });

    HighlightHandler.nameSet = newNameSet;
  }

  static highlightGenericSet({newSet, oldSet, persistingSet}) {
    let oldUnionSet = union(oldSet, persistingSet);
    let newUnionSet = union(newSet, persistingSet);

    let addedWordInstances = difference(newSet, oldUnionSet);
    let removedWordInstances = difference(oldSet, newUnionSet);

    for(let addedWordInstance of addedWordInstances)
      TranscriptSpanHandler.highlightSpan(addedWordInstance);

    for(let removedWordInstance of removedWordInstances)
      TranscriptSpanHandler.unHighlightSpan(removedWordInstance);
  }
}

HighlightHandler.timeSet = new Set();
HighlightHandler.nameSet = new Set();

function union(setA, setB) {
  let unionSet = new Set(setA);
  for(let item of setB)
    unionSet.add(item);
  return unionSet;
}

function difference(setA, setB) {
  let differenceSet = new Set(setA);
  for(let item of setB)
    differenceSet.delete(item);
  return differenceSet;
}
