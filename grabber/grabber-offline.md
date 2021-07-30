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

-->

# Youtube Script Grabber 

<script input="hidden" defer>
  startGrabber();
</script>

<div id='grabber-frame'></div>

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
* implement message at top
* search for keywords
* jump to section
* exclude small words
* jump to occurences
* examine and select neighbors
* (definition dictionary?)
* select and save technical terms
* video controlling by lecturer




