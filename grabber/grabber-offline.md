<!--
author:   Daniel Hoffmann
version:  0.0.1
language: en
narrator: US English Female

script: http://localhost:3000/home/english-lia/base.js
script: http://localhost:3000/home/english-lia/consys.js
script: http://localhost:3000/home/english-lia/grabber.js
script: http://localhost:3000/home/english-lia/grabber-lia-bridge.js
script: http://localhost:3000/home/english-lia/lul.js
link: http://localhost:3000/home/english-lia/lul.css
link: http://localhost:3000/home/english-lia/consys.css

@gr: @grabber({})
@grabber
Please select a <a href="https://www.youtube.com/results?search_query=science&sp=EgIoAQ%253D%253D" target="_blank">youtube video with captions!</a> 

<script input="hidden" defer>
  startGrabber(@0);
</script>

<div id='grabber-frame'></div>
@end

-->

# Youtube Script Grabber 

```json @grabber
{
  "videoId": "fDek6cYijxI",
  "languageCode": "en",
  "minTime": 10,
  "maxTime": 105
}
```

# New Features
* minTime and maxTime as macro arguments
* fix language reselection
* By Appearance

# TODO

To Do next:
* clean up & prettify codebase

------
Bugs to fix:
* loading video does not work after hopping slides
* fix some languaes not working


To maybe Do at some point:
* config
  * video id
  * language
  * start point
* search for keywords
* jump to section
* exclude small words
* jump to occurences
* examine and select neighbors
* (definition dictionary?)
* select and save technical terms




