//variables determining the Lul-Look
const liaColorBackground = '--color-background';
const liaColorHighlight = '--color-highlight';
const liaColorText = '--color-text';
const mediumTransparency = 0.2;

function bridgeLulToLia() {
  //when background or highlight color change, the color palette should change accordingly
  watch({
    watchFunction: function () {
      return getCssProperty(liaColorHighlight)
      + getCssProperty(liaColorBackground);
    },
    reactFunction: updateColorPalette,
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

}

function asNumber(stringPx) {
  return parseFloat(stringPx.slice(0, -2));
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
