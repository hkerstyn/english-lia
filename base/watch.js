
export function watch(watcher) {
  let previousValue;
  setInterval(function () {
    let newValue = watcher.watchFunction().toString();
    if(newValue == previousValue)
      return;

    previousValue = newValue;
    watcher.reactFunction(newValue);
  }, watcher.interval);
  watcher.reactFunction(watcher.watchFunction());
} 

