<!--
author:   Daniel Hoffmann

version:  0.0.1

language: en

narrator: US English Female




script: http://localhost:3000/home/english-lia/base.js
script: http://localhost:3000/home/english-lia/consys.js
script: http://localhost:3000/home/english-lia/grabber.js
script: http://localhost:3000/home/english-lia/lul.js
link: http://localhost:3000/home/english-lia/lul.css
link: http://localhost:3000/home/english-lia/consys.css





-->

# Youtube Script Grabber

To Do immediatly:

Bugs to fix:

* loading video does not work after hopping slides
* rework word detection (don instead of don't)
* fix being unable to properly select words
* fix some languaes not working

To Do next:
* build a lul-dropdown
* support of youtube links
* implement message at top
* make table and highlights into lia-colors
* clean up & prettify codebase
* show highlighted text immediatly

To Do later:

* restructure layout




To maybe Do at some point:

* search for keywords
* jump to section
* exclude small words
* jump to occurences
* examine and select neighbors
* (definition dictionary?)
* select and save technical terms
* video controlling by lecturer

8TUK-M41hGI
document.getElementById('myTextfield').value




## New version (unfinished)
<script input="hidden" defer> loadYTAPI(); initalizeUI();</script>

Please enter a Youtube ID


<div id='frame'></div>

<span id="sortSelectDummy"></span>
<span id="languageSelectDummy"></span>
<span id="idEnterDummy"></span>
<br>

<div id = "playerDummy"></div>
<div style="height:600px; overflow:auto;">
<p id="textDummy"></p>
</div>

<div id="statsTableDummy"></div>
