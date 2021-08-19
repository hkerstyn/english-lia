const VIDEOLINK = 'https://video.google.com/timedtext?v=';
const VIDEOLANGUAGE = 'https://video.google.com/timedtext?type=list&v=';
const LANGUAGEADD = '&lang=';

export class YoutubeTranscriptHandler {

  static async getLanguageList(videoId) {
    let xmlDoc = await getXMLDocFromLink(VIDEOLANGUAGE + videoId);
    let rawLanguageList = xmlDoc.childNodes[0].childNodes;

    let languageList = [];
    for(let rawLanguage of rawLanguageList)
      languageList.push({code: rawLanguage.attributes.lang_code.value, name: rawLanguage.attributes.lang_translated.value});
    return languageList;
  }

  static async getTranscript(videoId, languageCode) {
    let xmlDoc = await getXMLDocFromLink(VIDEOLINK + videoId + LANGUAGEADD + languageCode);
    let rawTranscript = xmlDoc.childNodes[0].childNodes;

    let transcript = [];
    for(let rawTranscriptEntry of rawTranscript)
      transcript.push({
        start: rawTranscriptEntry.attributes.start.value * 1,
        duration: rawTranscriptEntry.attributes.dur.value * 1,
        text: rawTranscriptEntry.childNodes[0].data
      });
    return transcript;
  }

} 

