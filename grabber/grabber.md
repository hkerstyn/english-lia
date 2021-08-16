<!--
author:   Daniel Hoffmann
version:  0.2.0
language: en
narrator: US English Female

script: https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia@latest/base.js
script: https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia@latest/consys.js
script: https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia@latest/grabber.js
script: https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia@latest/grabber-lia-bridge.js
script: https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia@latest/lul-lia-bridge.js
script: https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia@latest/lul.js
link: https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia@latest/lul.css
link: https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia@latest/consys.css

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

@gr
