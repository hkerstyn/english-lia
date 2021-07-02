export function initializeContainers () {
  //generate containers of given size
  let player = new Container('player', [600, 337.5]);
  let transcript = new Container('transcript', [400, 0]);
  let statsTable = new Container('statsTable', [0, 212.5]);
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
