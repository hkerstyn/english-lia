import {DefinitionHandler}
  from './definition.js';
import {InspectorInterfaceHandler}
  from './interface.js';

export class InspectorHandler {
  static setConfig(config) {
    this.config = config;
  }

  static async setWordGroup(nameWordGroup) {

    let word = nameWordGroup.name;

    let title = InspectorInterfaceHandler.genTitle({
      titleClass: InspectorHandler.config.TITLE_CLASS, 
      titleText: word
    }); 

    let definitionSpans = await DefinitionHandler.getDefinitionSpans(word);

    let definition = InspectorInterfaceHandler.genDefinition({
      definitionHeight: InspectorHandler.config.DEFINITION_HEIGHT, 
      definitionWidth: InspectorHandler.config.DEFINITION_WIDTH, 
      definitionSpans: definitionSpans
    }); 


    let savePocketText = InspectorHandler.config.SAVE_POCKET_TEXT.replace('word', word);
    let savePocketButton = InspectorInterfaceHandler.genSavePocketButton({
      savePocketText: savePocketText 
    }); 
    
    let showInTranscriptText = InspectorHandler.config.SHOW_IN_TRANSCRIPT_TEXT.replace('word', word);
    let showInTranscriptButton = InspectorInterfaceHandler.genShowInTranscriptButton({
      showInTranscriptText: showInTranscriptText,
      onclick: function() {
        InspectorHandler.config.SHOW_IN_TRANSCRIPT_FUNCTION(nameWordGroup);
      }
    }); 

    let copyLinesText = InspectorHandler.config.COPY_LINES_TEXT.replace('word', word);
    let copyLinesButton = InspectorInterfaceHandler.genCopyLinesButton({
      copyLinesText: copyLinesText
    });

    return InspectorInterfaceHandler.genInspector({
      title: title, 
      definition: definition, 
      savePocketButton: savePocketButton, 
      showInTranscriptButton: showInTranscriptButton, 
      copyLinesButton: copyLinesButton,
    });


  }

  

}
