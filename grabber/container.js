export function texas () {
  //generate containers of given size
  let player = new Container('player', [800, 450]);
  let transcript = new Container('transcript', [200, 0]);
  let statsTable = new Container('statsTable', [0, 100]);
  let options = new Container('options', [0, 100], [true, false]);

  //making all containers visible
  [player, transcript, statsTable, options].forEach((container) => {
    container.setClass('lul-light');
  });
  
  //arranging containers
  options.setRoot('frame');
  player.moveTo('down', options);
  transcript.moveTo('right', options, player);
  statsTable.moveTo('down', player, transcript);

  fillContainers();
}

export function cherry () {
  //generate containers of given size
  let options = new Container('options', [0, 100], [true, false]);
  let player = new Container('player', [400, 450]);
  let transcript = new Container('transcript', [800, 100]);
  let statsTable = new Container('statsTable', [0, 100]);

  //making all containers visible
  [player, transcript, statsTable, options].forEach((container) => {
    container.setClass('lul-light');
  });
  
  //arranging containers
  options.setRoot('frame');
  player.moveTo('down', options);
  transcript.moveTo('right', options, player);
  statsTable.moveTo('down',  transcript);

  fillContainers();
}

export function nakamoto () {
  //generate containers of given size
  let options = new Container('options', [0, 100], [true, false]);
  let player = new Container('player', [400, 450]);
  let transcript = new Container('transcript', [400, 0]);
  let statsTable = new Container('statsTable', [400, 0]);

  //making all containers visible
  [player, transcript, statsTable, options].forEach((container) => {
    container.setClass('lul-light');
  });
  
  //arranging containers
  options.setRoot('frame');
  player.moveTo('up', options);
  transcript.moveTo('right', options, player);
  statsTable.moveTo('left', options, player);

  fillContainers();
}

export function redDragon () {
  //generate containers of given size
  let options = new Container('options', [0, 100], [true, false]);
  let player = new Container('player', [600, 450]);
  let transcript = new Container('transcript', [400, 0]);
  let statsTable = new Container('statsTable', [400, 550]);

  //making all containers visible
  [player, transcript, statsTable, options].forEach((container) => {
    container.setClass('lul-light');
  });
  
  //arranging containers
  options.setRoot('frame');
  player.moveTo('up', options);
  transcript.moveTo('right', options, player);

  transcript.setTab('Analysis');
  statsTable.setTab('Analysis');


      
  let tabButton = genButton({
    text: 'Tab'
  });
  let tabRadio = genSelection({
    button: [tabButton],
    options: {
      objects: [transcript, statsTable],
      textFunction: ((container) => (container.id)),
      valueFunction: ((container) => (container.name))
    },
    name: 'selectedTabContainer',
    oninput: function () {
      get(window['selectedTabContainer']).tabTo();
    }
  });
  
  fillContainers();
  add('options', tabRadio);
}



function fillContainers () {
  
  //filling options
  set('options',
    genDummy('sortSelectDummy'),
    genDummy('languageSelectDummy'),
    genDummy('idEnterDummy')
  );
  
  //filling player
  set('player',
    genDummy('playerDummy')
  );

  //filling transcript
  let textDummy = genDummy('textDummy');
  constrainDummy(textDummy, 'transcript');
  set('transcript', textDummy);



  //filling statsTable
  let statsTableDummy = genDummy('statsTableDummy');
  constrainDummy(statsTableDummy, 'statsTable');
  set('statsTable', statsTableDummy);
  console.log('Heyo');
}

function genDummy(dummyName) {
  let dummy = gen('span');
  dummy.id = dummyName;
  store(dummy, dummyName);
  return dummy;
}
function constrainDummy(dummy, containerName) {
  dummy.style.display = 'block';
  dummy.style.whiteSpace = 'normal';
  dummy.style.overflowY = 'auto';
  dummy.style.height = get(containerName + '.container').size[1] + 'px';
  dummy.style.width = get(containerName + '.container').size[0] + 'px';
}
