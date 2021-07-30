import {ContainerLayoutHandler}
  from './layout.js';
import {genDummy, constrainDummy}
  from './dummy.js';


export class ContainerHandler extends ContainerLayoutHandler {

  static initializeContainers () {
    let optionsContainer = new Container('options', [500, 100], [true, false]);
    let playerContainer = new Container('player');
    let transcriptContainer = new Container('transcript');
    let statsTableContainer = new Container('statsTable');

    optionsContainer.setRoot('grabber-frame');
    ContainerLayoutHandler.arrangeContainers(813);
    for(let container of Container.all)
      container.setClass('lul-light');

    set('options',
      genDummy('sortSelectDummy'),
      genDummy('languageSelectDummy'),
      genDummy('idEnterDummy')
    );

    set('player',
      genDummy('playerDummy')
    );

    let transcriptDummy = genDummy('transcriptDummy');
    constrainDummy(transcriptDummy, 'transcript');
    set('transcript', transcriptDummy);

    let statsTableDummy = genDummy('statsTableDummy');
    constrainDummy(statsTableDummy, 'statsTable');
    set('statsTable', statsTableDummy);
  }

}


