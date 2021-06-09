
function insertUI() {
  genContainer({
    direction: "column",
    insert: {target: 'frame'},
    content: [
      {
        id: "leftBox",
        style: "width: 50%"
      },
      {
        direction: "row",
        content : [
          {id: "upperBox"},
          {
            direction: "column",
            content: [{id: "firstBox"}, {id: " secondBox"}, {id: "thirdBox"}]
          }
          ]
        }
    ]
  });
  genContainer({
    direction: 'column',
    content: [{id:'upperPart'},{id: 'lowerPart'}],
    insert: {target: 'leftBox'}
  });
  set('lowerPart', {type: 'overflow', innerId:'overflow', direction: 'column'})

  let button = genButton({text: "Click me!", id: 'button', className:'lul-dark lul-medium-hover'});
  console.log(button);
  let collapsible = genCollapsible({
    direction: 'column',
    collapsed: 'false',
    children: genText("Hello this is some<br> text to be hidden!")
  });
  set('overflow', [collapsible, button]);


}
