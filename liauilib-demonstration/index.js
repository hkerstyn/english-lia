
function insertUI() {
  let input = genEnter({
    name: 'test',
  });
  let button = genButton({
    onclick: function () {
      console.log(test);
    },
    text: 'button',
  });
  let overflow = genOverflow({
    direction: 'column',
    innerId: 'overflow'
  });
  let collapsible = genCollapsible({
    direction: 'column',
    innerId: 'collapsible',
    hover: 'overflow'
  });
  set('collapsible', input);
  set('overflow', collapsible, button);
  set('frame', overflow);
}
