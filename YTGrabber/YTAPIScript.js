const YTAPI = 'https://www.youtube.com/iframe_api';

async function loadYTAPI() {
  var tag = document.createElement('script');
  tag.src = YTAPI;

  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  await new Promise(function(resolve,reject) {
    onYouTubeIframeAPIReady = resolve; //!!! THIS IS AN EVENT  - empty function can be altered!!!
    setTimeout(() => {
      reject('Failed to load YT API');
    }, 100000);
  });
  onYouTubeIframeAPIReady = function() {throw new Error('You cant just override this... again! Evil maggit!');};
}

var onYouTubeIframeAPIReady = function() {
  throw new Error('Overwriting "onYouTubeIframeAPIReady" variable has not worked propperly...');
};

async function createYTPlayer(playerID, width, height, videoID) {
  let ret;
  await new Promise(function(resolve,reject) {
    ret = new YT.Player(playerID, {
      width:width,
      height:height,
      videoId:videoID,
      events:{
        onReady:resolve,
        onStateChange: function(e) {ret.onPlayerStateChange(e);}
      }
    });
  });
  ret.onPlayerStateChange = function() {};
  return ret;
}

async function changeYTVideo(YTPlayer, newVideo) {
  YTPlayer.loadVideoById(newVideo);
}

async function jumpInVideo(YTPlayer, position) {
  YTPlayer.seekTo(position, true);
}

function currentPosition(YTPlayer) {
  return YTPlayer.getCurrentTime();
}
