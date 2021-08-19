<!--
author:   Daniel Hoffmann
version:  0.0.1
language: en
narrator: US English Female

script: http://localhost:3000/home/english-lia/base.js
script: http://localhost:3000/home/english-lia/consys.js
script: http://localhost:3000/home/english-lia/grabber.js
script: http://localhost:3000/home/english-lia/grabber-lia-bridge.js
script: http://localhost:3000/home/english-lia/lul-lia-bridge.js
script: http://localhost:3000/home/english-lia/lul.js
link: http://localhost:3000/home/english-lia/lul.css
link: http://localhost:3000/home/english-lia/consys.css

@gr: @grabber({})

@grabber
<script id="script_@uid" input="hidden">
  window['grabberArg'] = @0;
</script>
@startgrabber(@uid)
@end

@startgrabber
<script id="script_@uid" input="hidden">
  window['grabberUid'] = 'id_@0';
  setTimeout(function() {
    startGrabber();
  }, 100);
</script>
<div id='id_@0'></div>
@end

-->

# Youtube Script Grabber

```json @grabber
{
  "videoId": "fDek6cYijxI",
  "languageCode": "es-419",
  "minTime": 10,
  "maxTime": 105
}
```

# Youtube Script Grabber 

```json @grabber
{
  "videoId": "9tbxDgcv74c",
  "languageCode": "en",
}
```




# TODO

To Do next:
* clean up & prettify codebase
* expand documentation
  * Maintenance !!!!
  * Grabber macro args
  * consys
  * lul oddities

---------

To maybe Do at some point:
* examine and select neighbors
* (definition dictionary?)
* select and save technical terms
* copy sentences of word in inspector
* copy words in pocket
* disable features (blanking)



