/**
 * Creates an interval that checks for a variable,
 * and if it changes, executes arbitrary code
 *
 * @param {watcher} watcher - an object defining the above values
 *
 */

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

