var main = function() {
  make("Tabelle", genFullTable(7, 5));

  //purer container
  let content = genRaw("P");
  content.innerHTML = "This is content";
  make("Container", genCont("c0", "Click me!", function(){alert("You clicked!");}))
  make("c0", content);

  //radio
  make("Radio", genCont("c1", "Sprache auswählen", function(){alert(window.Sprache);}))
  make("c1", genRadio("Sprache", ["Deutsch", "Englisch", "Französisch"]));

  //enter some text
  make("Enter", genCont("c2", "Eingeben", function(){alert(window.Eingabe);}))
  make("c2", genEnter("Eingabe"));

  //range
  make("Range", genCont("c3", "Drag", function(){alert(window.range);}))
  make("c3", genRange("range", 0, 100, 1));

  //check
  make("Check", genCont("c4", "Ja oder Nein?", function(){alert(window.check);}))
  make("c4", genCheck("check"));
};

function makeTestContainer(name, id) {
  make(name, genCont(id, "Click me!", ));
}

function setUI() {
  pathLib = 'http://localhost:3000/home/Lia/liauilib/';
  loadLibs(['lul-base.js','lul-table.js', 'lul-container.js'], main);
}
