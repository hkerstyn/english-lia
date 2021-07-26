//this script adjusts the grabber to a liascript environment
const liaColorBackground = '--color-background';
const liaColorHighlight = '--color-highlight';
const liaColorText = '--color-text';
const mediumTransparency = 0.2;


function startGrabber () {
  let lulConfig = new LulConfig();
  lulConfig.apply();

  let grabber = new Grabber();
  grabber.start();
 

  //when background or highlight color change, the color palette should change accordingly
  watch({
    watchFunction: function () {
      return getCssProperty(liaColorHighlight)
      + getCssProperty(liaColorBackground);
    },
    reactFunction: function () {
      updateColorPalette();
    },
    interval: 300
  });

  //another one for text color
  watch({
    watchFunction: function () {
      return getCssProperty(liaColorText);
    },
    reactFunction: function (newTextColor) {
      setCssProperty('--text-color', newTextColor);
    },
    interval: 1000
  });

  watch({
    watchFunction: function () {
      let header = get('frame').parentNode.firstChild;
      return parseFloat(getComputedStyle(header).width.slice(0, -2));
    },
    reactFunction: function (newWidth) {
      arrangeContainers(newWidth);
      if(get('statsTableDummy').innerHTML != '')
        setStatsTable(window['selectedSort']);
    },
    interval: 1000
  });

  
}

function updateColorPalette () {
  let backgroundColor = listingStringToArray(getCssProperty(liaColorBackground));
  let highlightColor = listingStringToArray(getCssProperty(liaColorHighlight));


  let lulColorDark = highlightColor;
  let lulColorLight = backgroundColor;
  let lulColorMedium = [0, 0, 0];
  for(let i = 0; i < 3; i++)
    lulColorMedium[i] = highlightColor[i]*mediumTransparency + backgroundColor[i]*(1 - mediumTransparency);


  setCssProperty('--color-dark', arrayToListingString(lulColorDark));
  setCssProperty('--color-medium', arrayToListingString(lulColorMedium));
  setCssProperty('--color-light', arrayToListingString(lulColorLight));
  
}
