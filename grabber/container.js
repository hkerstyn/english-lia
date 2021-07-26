var player;
var transcript;
var statsTable;
var options;

export function initializeContainers () {
  //generate containers of given size
  player = new Container('player');
  transcript = new Container('transcript');
  statsTable = new Container('statsTable');
  options = new Container('options', [500, 100], [true, false]);


  options.setRoot('frame');
  arrangeContainers(813);
  for(let container of Container.all)
    container.setClass('lul-light');


  fillContainers();

}

export function arrangeContainers(availableWidth) {

  player.moveTo('down', options);

  if(availableWidth >= 1000) {
    transcript.moveTo('right', options, player);
    player.minSize =  [600, 337.5];
    transcript.minSize = [availableWidth - 600, 0];
  } else {
    transcript.moveTo('down', options, player);
    player.minSize = ( [availableWidth, 337.5]);
    transcript.minSize = [0, 400];
  }

  statsTable.moveTo('down', player, transcript);
  statsTable.minSize = [0, 212.5];
  Container.updateSizes();

  constrainDummy(get('textDummy'), 'transcript');
  constrainDummy(get('statsTableDummy'), 'statsTable');

  Container.printTree();
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
  if(dummy == undefined) return;
  dummy.style.display = 'block';
  dummy.style.whiteSpace = 'normal';
  dummy.style.overflowY = 'auto';
  dummy.style.height = get(containerName + '.container').size[1] + 'px';
  dummy.style.width = get(containerName + '.container').size[0] + 'px';
}
