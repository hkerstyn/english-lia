import {constrainDummy}
  from './dummy.js';

export class ContainerLayoutHandler {

  static arrangeContainers(availableWidth) {
    let optionsContainer = get('options.container');
    let playerContainer = get('player.container');
    let transcriptContainer = get('transcript.container');
    let statsTableContainer = get('statsTable.container');
    let filterContainer = get('filter.container');
    let pocketContainer = get('pocket.container');
    let inspectorContainer = get('inspector.container');

    playerContainer.moveTo('down', optionsContainer);

    if(availableWidth >= 800) {
      //800 - inf
      playerContainer.minSize =  [600, 337.5];

      transcriptContainer.moveTo('right', optionsContainer, playerContainer);

      if (availableWidth >= 1000) {
        //1000 - inf
        let coupleWidth = (availableWidth - 600) / 2;

        inspectorContainer.minSize = [0, 200];
        inspectorContainer.moveTo('down', playerContainer);

        transcriptContainer.minSize = [coupleWidth, 437.5];
        pocketContainer.minSize = [0, 200];
        pocketContainer.moveTo('down', transcriptContainer);

        statsTableContainer.moveTo('right', playerContainer, transcriptContainer);
        statsTableContainer.minSize = [coupleWidth, 417.5];
        filterContainer.minSize = [0, 230];
        filterContainer.moveTo('up', statsTableContainer);

      } else {
        //800 - 1000
        transcriptContainer.minSize = [availableWidth - 600, 0];

        statsTableContainer.moveTo('down', playerContainer, transcriptContainer);
        statsTableContainer.minSize = [0, 170];
      }
    } else {
      //0 - 800
      playerContainer.minSize = ( [availableWidth, 337.5]);

      transcriptContainer.moveTo('down', optionsContainer, playerContainer);
      transcriptContainer.minSize = [0, 300];

      statsTableContainer.moveTo('down', playerContainer, transcriptContainer);
      statsTableContainer.minSize = [0, 170];
    }

    Container.updateSizes();

    constrainDummy(get('transcriptDummy'), 'transcript');
    constrainDummy(get('statsTableDummy'), 'statsTable');
  }
}
