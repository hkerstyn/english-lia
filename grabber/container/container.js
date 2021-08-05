import {ContainerLayoutHandler}
  from './layout.js';
import {genDummy, constrainDummy}
  from './dummy.js';


export class ContainerHandler extends ContainerLayoutHandler {

  static initializeContainers (divId) {
    let optionsContainer = new Container('options', [500, 100], [true, false]);
    let playerContainer = new Container('player');
    let transcriptContainer = new Container('transcript');
    let statsTableContainer = new Container('statsTable');
    let filterContainer = new Container('filter');
    let pocketContainer = new Container('pocket');
    let inspectorContainer = new Container('inspector');

    optionsContainer.setRoot(divId);
    ContainerLayoutHandler.arrangeContainers(1200);
    for(let container of Container.all)
      container.setClass('lul-light');

    set('options',
      genDummy('languageSelectDummy', 'lul-margin'),
      genDummy('idEnterDummy', 'lul-margin'),
      genDummy('queryDummy', 'lul-margin')
    );

    set('filter',
      genDummy('sortSelectDummy', 'lul-margin'),
      genHtml('<br>'),
      genDummy('searchDummy', 'lul-margin'),
      genHtml('<br>'),
      genDummy('excludeDummy')
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


