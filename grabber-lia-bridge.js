//this script adjusts the grabber to a liascript environment

async function startGrabber() {
  let lulConfig = new LulConfig();
  lulConfig.apply();

  await Grabber.start(window['grabberArg'], window['grabberUid']);

  //adjust the container layout
  watch({
    watchFunction: function () {
      let referenceNode = get(window['grabberUid']).parentNode;
      let computedStyle = getComputedStyle(referenceNode);
      return asNumber(computedStyle.width) - asNumber(computedStyle.paddingLeft) - asNumber(computedStyle.paddingRight) - 18;
    },
    reactFunction: Grabber.adjustLayout,
    interval: 1000
  });

  bridgeLulToLia(); 
}
