<!--
author:   Daniel Hoffmann
version:  0.0.1
language: en
narrator: US English Female

online-link: https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia/
offline-link: http://localhost:3000/home/english-lia/

script: https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia/
script: https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia/
script: https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia/
script: https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia/
link: https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia/
link: https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia/

-->

# Youtube Script Grabber

<script input="hidden" defer>

  let grabber = new Grabber();
  window['grabber'] = grabber;

  let lul = new Lul();
  window['lul'] = lul;

  loadYTAPI();
  initalizeUI()

</script>

<div id='frame'></div>

# TODO

To Do next:
* support of youtube links
* clean up & prettify codebase


Bugs to fix:
* loading video does not work after hopping slides
* fix some languaes not working


To maybe Do at some point:
* implement message at top
* search for keywords
* jump to section
* exclude small words
* jump to occurences
* examine and select neighbors
* (definition dictionary?)
* select and save technical terms
* video controlling by lecturer




