const sizeIndicatorElementClassName = 'lia-slide__content';

async function startGrabber() {
  let lulConfig = new LulConfig();
  lulConfig.apply();

  await Grabber.start(window['grabberArg'], window['grabberUid']);

  //adjust the container layout
  watch({
    watchFunction: function () {
      let referenceNode = get(window['grabberUid']);
      while(referenceNode.className != sizeIndicatorElementClassName) {
        referenceNode = referenceNode.parentNode;
      }
      let computedStyle = getComputedStyle(referenceNode);
      //returns the space available to the grabber
      return asNumber(computedStyle.width) - asNumber(computedStyle.paddingLeft) - asNumber(computedStyle.paddingRight) - 18;
    },
    reactFunction: Grabber.adjustLayout,
    killFunction: function() {
      if(get(window['grabberUid']) == undefined) 
        return true;
      return false;
    },

    interval: 1000
  });

  bridgeLulToLia(); 
}
