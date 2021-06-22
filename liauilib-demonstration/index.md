<!--
author:   Daniel Hoffmann

version:  0.0.1

language: en

narrator: US English Female

offline-link: http://localhost:3000/home/english-lia/
online-link: https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia/

script: http://localhost:3000/home/english-lia/lul.js
link: http://localhost:3000/home/english-lia/lul.css
script: http://localhost:3000/home/english-lia/lul/lul-base.js
script: http://localhost:3000/home/english-lia/liauilib-demonstration/index.js


@github: [GitHub](https://github.com/kaptn-seebar/english-lia/tree/main/liauilib)

-->

# LiaUiLib
Click [here](#documentation) to get to the introductory documentation.

For further documentation, check the @github Repository


## Experimentation Zone

TODO:


* include collapsible hover
* rework css class handling (hover?)
* replace dusty old container with entry module
  * vertical/horizontal split
  * visible?
  * size
  * resizable? (much later)

### Container

<script input="hidden" defer>insertUI();</script>

<div id="frame" class="lul-frame"></div>




## Source Code

If you want to
*read the detailed descriptions of all available functions
*or change the code (because the old one might not work anymore)
you will have to check the source code.

Note that the script lul.js you need to source is not actually the true source code
but rather a bundle created using rollup.

The true source code can be found at the @github Repository under /liauilib/scripts/

If you want to change the source code, you will need to rebundle it locally using

``` /path/to/your/local/english-lia/
rollup /liauilib/scripts/lul-all.js -o lul.js -f es
```
