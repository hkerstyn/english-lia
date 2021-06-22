/*
    genFullTable(rowCount, columnCount, containsHeads) generates a table of given
    size with or without table heads, where the cells are filled with text elements
    (see CELL_NAME, HEAD_NAME)

    genTable(cells, heads) generates a table where 'cells' is an array of arrays of
    nodes to be put into the table cells. 'head' is a single array (omit this argument to avoid
    a table head alltogether)

*/



//names of elements in full Table
const CELL_NAME = "Zelle ";
const HEAD_NAME = "Kopf ";

const CELL_CLASSNAME = "lul-light lul-medium-hover lul-padding";
const HEAD_CLASSNAME = "lul-dark lul-medium-hover lul-padding";

/*table functions*/

export function genFullTable(rowCount, columnCount, containsHeads) {
  if(containsHead == undefined) var containsHead = true;
  let cells = genCells(rowCount,columnCount);

  if(!containsHead)
  return genTable(cells, null);     //only cells

  //both heads and cells
  let heads = genHeads(columnCount);
  return genTable(cells, heads);
}

export function genTable(cells, heads)
{
  let table = gen("table", "lul-table");

  if(heads != null && heads != undefined && heads.length > 0)
  addCells(table, heads, "TH", HEAD_CLASSNAME);

  if(cells != null && cells != undefined && cells.length > 0)
  addCells(table , cells, "TD", CELL_CLASSNAME);

  return table;
}



//adds elements (cells or heads) of HTML type to table
function addCells(table, cells, type, className)
{

  for(let i = 0; i < cells.length; i++) { //loop through rows
      let row = gen("TR");
      for(let j = 0; j < cells[i].length; j++) { //loop through columns
          let cellContainer = gen(type, className);
          cellContainer.appendChild(cells[i][j]);
          row.appendChild(cellContainer);
      }
      table.appendChild(row);
    }
}

//generates Nodes that can be put into a table
//mainly for testing, you would want to generate your cells manually
function genHeads(columnCount) {return genElements(1, columnCount, HEAD_NAME);}
function genCells(rowCount, columnCount) {return genElements(rowCount, columnCount, CELL_NAME);}
function genElements(rowCount, columnCount, name)
{
   let cells = [];
   for (var i = 0; i < rowCount; i++) {
     let row = [];
     for (var j = 0; j < columnCount; j++)
     row.push(document.createTextNode(name + (j + i*columnCount)));
     cells.push(row);
   }
   return cells;
}
