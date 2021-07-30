import {NameSorter}
  from './sort.js';

export class StatsTableHandler extends NameSorter {

  static genStatsTable({
    tableClass, tableRowClass, tableCellClass, tableTextClass,
    rowCount, columnCount,
    clickFunction, wordGroups}) {

    let table = gen('table', tableClass);

    let wordGroupIndex = 0;

    for(let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      let row = gen('tr', tableRowClass);

      for(let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
        if(wordGroupIndex >= wordGroups.length)
          break;
        let wordGroup = wordGroups[wordGroupIndex];
        wordGroupIndex++;

        let text = gen('a', tableTextClass);
        text.innerHTML = wordGroup.name;

        let cell = gen('td', tableCellClass);
        cell.style.textAlign = 'center';
        cell.addEventListener('click', function () {
          clickFunction(wordGroup); 
        });
        cell.appendChild(text);
        row.appendChild(cell);
      }
      table.appendChild(row);
    }
    return table;
  }
}
