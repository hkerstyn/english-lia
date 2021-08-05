const YOUTUBE_API_LINK = 'https://www.youtube.com/iframe_api';
import {YoutubeTranscriptHandler}
  from './transcript.js';

export class YoutubeHandler extends YoutubeTranscriptHandler {

  static async loadYTAPI() {
    if(window['YT'] != undefined) 
      return;

    let newScriptTag = document.createElement('script');
    newScriptTag.src = YOUTUBE_API_LINK;

    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(newScriptTag, firstScriptTag);

    await new Promise(function(resolve,reject) {
      window.onYouTubeIframeAPIReady = resolve; 
      setTimeout(() => {
        reject('Failed to load YT API');
      }, 100000);
    });
  }
  
  //ensures that the entered String is a proper Youtube id
  static castToId(enteredString, defaultId) {
    //return default in case of no submitted string
    if(enteredString == undefined || enteredString == null || enteredString == '')
      return defaultId;

    //converts links to ids
    if(enteredString.includes('youtube')) {
      let vIndex = enteredString.indexOf('v=');
      return enteredString.slice(vIndex + 2);
    }

    //return id as-is
    return enteredString;
  }

  static async setPlayerVideo(playerDummyID, videoId, width, height) {
    console.log(get(playerDummyID).nodeName);
    if(get(playerDummyID).nodeName != 'SPAN') {
      YoutubeHandler.player.loadVideoById(videoId);
      return;
    }

    await new Promise(function(resolve,reject) {
      YoutubeHandler.player = new YT.Player(playerDummyID, {
        width: width,
        height: height,
        videoId: videoId,
        events:{
          onReady:resolve,
        }
      });
    });
  }

  static async jumpInVideo(position) {
    YoutubeHandler.player.seekTo(position, true);
  }

  static getCurrentTime() {
    return YoutubeHandler.player.getCurrentTime();
  }
}
