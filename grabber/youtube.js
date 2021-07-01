const YTAPI = 'https://www.youtube.com/iframe_api';
var videoId;
var player;


/*call this in the beginning*/
export async function loadYTAPI() {
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
  throw new Error('Overwriting "onYouTubeIframeAPIReady" variable has not worked properly...');
};

export async function setPlayerVideo(playerDummyID, newId, width, height) {
  videoId = newId;
  if(player === undefined)
    player = await createYTPlayer(playerDummyID, width, height);
  else
    await changeYTVideo();
}



/*returns a youtube player element*/
async function createYTPlayer(playerID, width, height) {
  let ret;
  let vidID = videoId;
  await new Promise(function(resolve,reject) {
    ret = new YT.Player(playerID, {
      width: width,
      height: height,
      videoId:vidID,
      events:{
        onReady:resolve,
        onStateChange: function(e) {ret.onPlayerStateChange(e);}
      }
    });
  });
  ret.onPlayerStateChange = function() {};
  return ret;
}

/*returns the transcript*/
const VIDEOLINK = 'https://video.google.com/timedtext?v=';
const VIDEOLANGUAGE = 'https://video.google.com/timedtext?type=list&v=';
const LANGUAGEADD = '&lang=';

async function loadTranscript(language){
  var request = new XMLHttpRequest();
  console.log(VIDEOLINK + videoId + LANGUAGEADD + language);
  request.open('GET', VIDEOLINK + videoId + LANGUAGEADD + language, true);
  request.responseType = 'document';
  request.overrideMimeType('text/xml');
  return new Promise(function(resolve, reject) {
    request.onload = function () {
      if (request.readyState === request.DONE) {
        if (request.status === 200) {
          resolve(request.responseXML);
        }
        else{
          reject(request.status);
        }
      }
    };
    request.send(null);
  });
}
export async function getTranscript(language) {
  let xmldoc = await loadTranscript(language);
  let textList = xmldoc.childNodes[0];
  let TimeStamps = textList.childNodes;
  let newTranscript = [];
  for(let timeStamp of TimeStamps){
    newTranscript.push(
      {start: timeStamp.attributes.start.value * 1,
        duration: timeStamp.attributes.dur.value * 1,
        text: timeStamp.childNodes[0].data});
  }
  return newTranscript;
}
export async function getLanguageList() {
  var request = new XMLHttpRequest();
  request.open('GET', VIDEOLANGUAGE + videoId, true);
  request.responseType = 'document';
  request.overrideMimeType('text/xml');
  return new Promise(function(resolve, reject) {
    request.onload = function () {
      if (request.readyState === request.DONE) {
        if (request.status === 200) {
          resolve(parseLanguageList(request.responseXML));
        }
        else{
          reject(request.status);
        }
      }
    };
    request.send(null);
  });
}
function parseLanguageList(xmldoc) {
  let transcriptList = xmldoc.childNodes[0];
  let XMLTracks = transcriptList.childNodes;

  let ret = [];
  for(let t of XMLTracks){
    ret.push({code: t.attributes.lang_code.value, languageName: t.attributes.lang_translated.value});
  }
  return ret;
}

/*interacts with the youtube player*/
async function changeYTVideo() {
  player.loadVideoById(videoId);
}

export async function jumpInVideo(position) {
  player.seekTo(position, true);
}

export function currentPosition() {
  return player.getCurrentTime();
}
