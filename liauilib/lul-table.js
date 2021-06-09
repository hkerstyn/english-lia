function genFullTable(z, s) {
  return genTable(mca(z,s), mha(s));
}
function genTable(zellen, koepfe)
{
  let table = genRaw("table");
  table.className = "lul-table";
  if(koepfe != null) addCells("TH", koepfe, table);
  addCells("TD", zellen, table);
  return table;
}
function addCells(type, zellen, table)
{
  table.className = "lul-table";

  for(let i = 0; i < zellen.length; i++) {
      let zeileItem = genRaw("TR");
      for(let j = 0; j < zellen[i].length; j++) {
          let spalteItem = genRaw(type);
          let zelle = document.createTextNode("Zelle " + (j + i*zellen[i].length));
          spalteItem.appendChild(zelle);
          zeileItem.appendChild(spalteItem)
      }
      table.appendChild(zeileItem);
    }
}
function mha(s) {return makeArray(1, s, "Kopf");}
function mca(z, s) {return makeArray(z, s, "Zelle");}
function makeArray(z, s, name)
{
   let zellen = [];
   for (var i = 0; i < z; i++) {
     let zeile = [];
     for (var j = 0; j < s; j++)
     zeile.push(document.createTextNode(name + " " + (j + i*s)));
     zellen.push(zeile);
   }
   return zellen;
}
