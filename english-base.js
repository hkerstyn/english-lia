var pathLib;
function makeScript(url, callback) {
  var script = document.createElement("script");
  script.src = pathLib + url;
  script.type = 'text/javascript';

  script.onreadystatechange = callback;
  script.onload = callback;
  return script;
}

function loadLib(url, callback) {
  var script = makeScript(url, callback);
  document.head.appendChild(script);
}

var loadRemaining = function() {
  //executed by script
  let callback = this.callback;
  let urls = this.urls;
  if(urls.length > 1)
  loadLibs(urls, callback);
  else loadLib(urls[0], callback);
  this.removeAttribute("callback");
  this.removeAttribute("urls");
}

function loadLibs(urls, callback) {
  if(urls.length == 1) {loadLib(urls[0], callback); return;}
  let nextUrl = urls[0];
  urls.shift();
  var firstScript = makeScript(nextUrl, loadRemaining);
  firstScript.urls = urls;
  firstScript.callback = callback;
  document.head.appendChild(firstScript);

}
