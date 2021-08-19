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

      if (availableWidth >= 1080) {
        //1080 - inf
        let coupleWidth = (availableWidth - 600) / 2;

        inspectorContainer.minSize = [0, 230];
        inspectorContainer.moveTo('down', playerContainer);

        transcriptContainer.minSize = [coupleWidth, 437.5];
        pocketContainer.minSize = [0, 230];
        pocketContainer.moveTo('down', transcriptContainer);

        statsTableContainer.moveTo('right', playerContainer, transcriptContainer);
        statsTableContainer.minSize = [coupleWidth, 417.5];
        filterContainer.minSize = [0, 230];
        filterContainer.moveTo('up', statsTableContainer);

      } else {
        //800 - 1080
        transcriptContainer.minSize = [availableWidth - 600, 0];

        filterContainer.minSize = [240, 230];
        filterContainer.moveTo('down', playerContainer, transcriptContainer);

        statsTableContainer.minSize = [availableWidth - 240, 230];
        statsTableContainer.moveTo('right', filterContainer);

        inspectorContainer.minSize = [availableWidth - 240, 230];
        inspectorContainer.moveTo('down', statsTableContainer, pocketContainer);

        pocketContainer.minSize = [240, 230];
        pocketContainer.moveTo('right', inspectorContainer);

      }
    } else {
      //0 - 800
      playerContainer.minSize = ( [availableWidth, 337.5]);

      transcriptContainer.moveTo('down', optionsContainer, playerContainer);
      transcriptContainer.minSize = [0, 300];

      filterContainer.minSize = [240, 230];
      filterContainer.moveTo('down', playerContainer, transcriptContainer);

      statsTableContainer.minSize = [availableWidth - 240, 430];
      statsTableContainer.moveTo('right', filterContainer );

      pocketContainer.minSize = [240, 230];
      pocketContainer.moveTo('down', filterContainer);

      inspectorContainer.minSize = [0, 230];
      inspectorContainer.moveTo('down', statsTableContainer, pocketContainer);
    }

    Container.updateSizes();

    constrainDummy(get('transcriptDummy'), 'transcript');
    constrainDummy(get('statsTableDummy'), 'statsTable');
  }
}
