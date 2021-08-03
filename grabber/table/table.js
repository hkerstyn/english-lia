import {NameSorter}
  from './sort.js';
import {NameAnalyzer}
  from './name-analyzer.js';

export class StatsTableHandler extends NameAnalyzer {

  static genStatsTable({
    tableClass, tableRowClass, tableCellClass, tableTextClass,
    columnWidth, clickFunction}) {

    let wordGroups = StatsTableHandler.getWordGroups();
    let wordGroupIndex = 0;

    let columnCount = Math.floor( get('statsTable.container').size[0] / columnWidth);
    if(columnCount == 0) throw new Error('columnCount is zero');
    let rowCount = Math.ceil(wordGroups.length / columnCount);

    let table = gen('table', tableClass);

    for(let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      let row = gen('tr', tableRowClass);

      for(let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
        if(wordGroupIndex >= wordGroups.length)
          break;
        let wordGroup = wordGroups[wordGroupIndex];
        wordGroupIndex++;

        let cell = gen('td', tableCellClass);
        cell.style.textAlign = 'center';
        cell.addEventListener('click', function () {
          clickFunction(wordGroup); 
        });

        let text = gen('a', tableTextClass);
        text.innerHTML = wordGroup.name;
        cell.appendChild(text);

        if(wordGroup.wordInstances.length > 1) {
          let number = genText('  ' + wordGroup.wordInstances.length);
          number.className = 'lul-background-text';
          cell.appendChild(number);
        }

        row.appendChild(cell);
      }
      table.appendChild(row);
    }
    return table;
  }

  static getWordGroups() {
    let wordGroups = StatsTableHandler.nameWordGroups;

    if(StatsTableHandler.excludeBool == true) 
      wordGroups = NameSorter.excludeSmallWords(wordGroups);

    if(StatsTableHandler.comparator != undefined) 
      wordGroups = NameSorter.sortNamedWordGroups(wordGroups, StatsTableHandler.comparator);

    if(StatsTableHandler.searchTerm != undefined
    && StatsTableHandler.searchTerm != '') 
      wordGroups = NameSorter.searchForTerm(wordGroups, searchTerm);

    return wordGroups;
  }
}
