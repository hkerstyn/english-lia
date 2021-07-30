
export function watch(watcher) {
  let previousValue;
  setInterval(function () {
    let newValue = watcher.watchFunction();
    if(newValue == previousValue)
      return;

    previousValue = newValue;
    watcher.reactFunction(newValue);
  }, watcher.interval);
  watcher.reactFunction(watcher.watchFunction());
} 

