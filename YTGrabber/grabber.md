<!--
author:   Daniel Hoffmann

version:  0.0.1

language: en

narrator: US English Female




script: http://localhost:3000/home/Lia/YTGrabber/index.js
script: http://localhost:3000/home/Lia/YTGrabber/YTAPIScript.js
script: http://localhost:3000/home/Lia/test.js

@onload
startProg();
@end



-->

# Test-Kurs zum Ausprobieren
TZ5IULqYRDo
<input type="radio" id="male" name="gender" value="male">
<label for="male">Male</label><br>
<input type="radio" id="female" name="gender" value="female">
<label for="female">Female</label><br>
<input type="radio" id="other" name="gender" value="other">
<label for="other">Other</label>


<div id="target">
<script input="radio" value="1" options="1|2|3|Hello World|true" input-always-active>
"Selected option: @input"
</script>
</div>


## Video Grabber

Bitte Geben Sie eine YouTube-ID ein

<script input="text" input-always-active modify="false">
window.enteredID = "@input";
" "
</script>
<script input="button" modify="false">
if(window.enteredID == "" || window.enteredID == undefined) "Bestätigen"
else
{
//Aktion
setVideo(window.enteredID);
"Erfolg"
}
</script>
<span id="platzfuerselect"></span>
<span id="placefuerselectzwo"></span>

<div id = "MyPlayer"></div>
<div style="height:600px; overflow:auto;">
<p id="platzhalterfuerTextBox"></p>
</div>

<div id="spacefuerStats"></div>
