
function insertUI() {
  let button = genButton({
    onclick: function () {
      console.log(window['test']);
    },
    text: 'Select Favourite',
  });
  let selection = genSelection({
    name: 'test',
    type: 'btn',
    options: {
      texts: ["Hello,", "this", "is", "some", "nifty", "text", "!"]
    },
    button: [button]
  });

  set('frame', selection);
  add('frame', genFullTable(5,7));
}
