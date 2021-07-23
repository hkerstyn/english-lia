/**
 * @class cssControl
 * @classdesc A {@tutorial PseudoClass}. Responsible for manipulating
 * css parameters
 * @borrows getCssProperty
 * @borrows setCssProperty
 * @borrows listingStringToArray
 * @borrows arrayToListingString
 * @hideconstructor
 */



var root = document.querySelector(':root');


/**
 * Returns a global css property.
 *
 * @param {string} propertyName - the name of the property, eg "--text-color"
 */
export function getCssProperty(propertyName) {
  let rootStyle = getComputedStyle(root);
  let property = rootStyle.getPropertyValue(propertyName);
  return property;
}

/**
 * Sets a global css property.
 *
 * @param {string} propertyName - the name of the property, eg "--text-color"
 * @param {string} propertyValue - the new value
 */
export function setCssProperty(propertyName, propertyValue) {
  root.style.setProperty(propertyName, propertyValue);
}


/**
 * Converts a string like "1, 2, 3" into an array like [1, 2, 3]
 *
 * @param {string} listingString - the string to convert
 */
export function listingStringToArray(listingString) {
  return JSON.parse('[' + listingString + ']');
}


/**
 * Converts an array like [1, 2, 3] into a string like "1, 2, 3"
 *
 * @param {Array} array - the array to convert
 */
export function arrayToListingString(array) {
  let listingString = '';
  array.forEach((item, i) => {
    listingString += item;
    if(i + 1 != array.length)
      listingString += ', ';
  });
  return listingString;
}
