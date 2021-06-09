<!--
author:   Daniel Hoffmann

version:  0.0.1

language: en

narrator: US English Female

script: http://localhost:3000/home/Lia/english-base.js
script: http://localhost:3000/home/Lia/liauilib/index.js
link: http://localhost:3000/home/Lia/liauilib/style.css


-->

# LiaUiLib

## Scriptify
<script defer> setUI();</script>

Lul-Container:

<span id="Container"></span>


Lul-Radio

<span id="Radio"></span>

Lul-Enter

<span id="Enter"></span>

Lul-Range

<span id="Range"></span>

Lul-Check

<span id="Check"></span>

Lul-Tabelle:

<div id="Tabelle"></div>



## Ergebnis

Lul-Container:

<span class="lia-script lia-script--with-border lul-container">
<p>Hallihallo das hier ist Text</p>
</span>

Lul-Button:

<button class="lia-script lia-script--with-border lul-btn" onclick="">
Button
</button>

Lul-Data:

<span class="lul-entry">
<span class="lia-script lia-script--with-border lul-entry-area lul-container">
<div class="lul-entry-content">
<p>Hier steht ein Text</p>
</div></span>
<button class="lia-script lia-script--with-border lul-btn" onclick="">
<p>Button Text</p>
</button>
</span>

Lul-Radio

<input type="radio" name="Test" value="1" autofocus="" class="lia-radio">
<span>Deutsch</span>
<input type="radio" name="Test" value="1" autofocus="" class="lia-radio"><span>Englisch</span>


Lul-Text

<input type="text" class="lia-input"  input="text">


Lul-Range

<span class="lul-entry">
<span class="lia-script lia-script--with-border lul-entry-area lul-container">
<div class="lul-entry-content">

<input type="range" class="lia-range" input="range" value="1" min="0" max="1000" step="0.1">

</div></span>
<button class="lia-script lia-script--with-border lul-btn" onclick="">
<p>Helligkeit ändern</p>
</button>
</span>

Lul-Checkbox


<span class="lul-entry">
<span class="lia-script lia-script--with-border lul-entry-area lul-container">
<div class="lul-entry-content">

<input class="lia-checkbox" type="checkbox" id="lia-focus">

</div></span>
<button class="lia-script lia-script--with-border lul-btn" onclick="">
<p>Helligkeit ändern</p>
</button>
</span>





## Vorlage

Radio:

<script input="radio" options="Hello World|1|2|true" input-always-active>
"Select"
</script>

Text:

<script input="text" input-always-active>
"Select"
</script>

Range:

<script input="range" value="1" min="0" max="1000" step="0.1" input-always-active>
"Select"
</script>

Checkbox:

<script input="checkbox" value="true" input-always-active>
"Select"
</script>

Tabelle:

| Tables |      Are      |  Cool |
| ------------------------------------------ |:-------------:| -----:|
| *** col 3 is ***                           | right-aligned | $1600 |
| ** col 2 is **                             |   centered    |   $12 |
| * zebra stripes *                          |   are neat    |    $1 |
