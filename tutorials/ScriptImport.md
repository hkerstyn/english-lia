In order to use any of the functions described here,
you need to import them to your website.


## External Websites

Typically, this is done via script tags in the head of your HTML-Document:
```
<script src="https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia@latest/base.js"></script>
<script src="https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia@latest/consys.js"></script>
<script src="https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia@latest/lul.js"></script>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia@latest/lul.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia@latest/consys.css">
```
If you do not wish to use containers, you can omit importing ` consys.js ` and ` consys.css `.

## LiaScript

However, when working inside LiaScript,
it is convenient to also import ` lul-lia-bridge.js `, which
makes sure the colors match those of the LiaScript environment.

```
script: https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia@latest/base.js
script: https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia@latest/consys.js
script: https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia@latest/lul.js

script: https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia@latest/lul-lia-bridge.js

link: https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia@latest/lul.css
link: https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia@latest/consys.css
```
