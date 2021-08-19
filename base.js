/**
 * @class Misc
 * @classdesc A {@tutorial PseudoClass}. Provides several small
 * pieces of code
 *
 * @borrows gen
 * @borrows genText
 * @borrows genHtml
 * @borrows uid
 * @borrows truetypeof
 * @hideconstructor
 */


/**
 * Returns a newly created HTML-Element.
 *
 * @param {string} name - The type of the element, like "span", "p", or "div"
 * @param {string} className - (optional) the className attribute (for css)
 */

function gen(name, className) {
  let obj = document.createElement(name);

  if(className != undefined)
    obj.className = className;

  return obj;
}



/**
 * returns a newly created HTML <span> containing **content**
 *
 * @param {string} content - the span's innerHTML
 * @param {string} className - (optional) the className attribute (for css)
 */

function genText(content, className) {
  let text = gen('span', className);
  text.innerHTML = content;

  return text;
}

/**
 * turns an html string into a node
 *
 * @param {string} html - the html code to parse
 */
function genHtml(html) {
  let span = gen('span');
  span.innerHTML = html;
  return span.firstChild;
}

var idCount = 0;

/**
 * returns a different string on each invocation
 */

function uid() {
  idCount++;
  return 'uid' + idCount;
}


/**
 * Returns a string representing the  
 * true (useful) type of some **value**
 *
 * The possible return values are:
 * * 'object'
 * * 'array'
 * * 'html'
 * * 'string'
 *
 * Otherwise, a warning is issued and *undefined* is returned.
 *
 * @param {any} value - the type of which is to be determined
 */

function truetypeof(value) {
  let deepType = Object.prototype.toString.call(value);
  if(deepType == '[object Object]') return 'object';
  if(deepType == '[object Array]') return 'array';
  if(deepType.includes('HTML')) return 'html';
  if(deepType == '[object String]') return 'string';

  console.warn('No valid type identified.');
  console.warn('value: ', value);
  console.warn('deepType: ', deepType);
}



async function getXMLDocFromLink(link, mimeType) {
  var request = new XMLHttpRequest();
  request.open('GET', link, true);
  request.responseType = 'document';
  if(mimeType == undefined)
    request.overrideMimeType('text/xml');
  else
    request.overrideMimeType(mimeType);
  return new Promise(function(resolve, reject) {
    request.onload = function () {
      if (request.readyState === request.DONE) {
        if (request.status === 200) {
          resolve(request.responseXML);
        }
        else {
          reject(request.status);
        }
      }
    };
    request.send(null);
  });
}

/**
 * @class GetStore
 * @classdesc A {@tutorial PseudoClass}. Responsible for retrieving and
 * storing elements under some {@tutorial key}
 * 
 * @borrows get
 * @borrows store
 * @borrows clear
 * @hideconstructor
 */

//a global object containing all stored elements
var STORED_ELEMENTS = {};



/**
 * Returns the object associated with a {@tutorial key}.
 *
 * @param {key} key - the {@tutorial key} pointing to some object
 * @returns{Object}
 * @tutorial key
 */

function get(key) {
  if(key == undefined) return undefined;


  let trueType = truetypeof(key);
  if(trueType != 'string') return key;

  if(STORED_ELEMENTS[key] != undefined)
    return STORED_ELEMENTS[key];

  let result =  document.getElementById(key);
  return result;
}


/**
 * Stores an **element** that can now be accessed using [get(**element**)]{@link GetStore.get}
 *
 * If no **key** is provided, [generate one]{@link Misc.uid} and return it.
 *
 * @param {Object} element - an arbitrary object you  
 * want to retrieve later
 * @param {string} key - (optional) use this key to
 * retrieve your **element**
 * @tutorial key
 */

function store(element, key) {
  if(STORED_ELEMENTS[key] != undefined) {
    console.warn('store: key', key, 'is already taken by', STORED_ELEMENTS[key], 'element:', element, 'Override...');
  }
  if(key == undefined) {
    key = uid();
    console.warn('Defaulting to uid:', key, element);
  }
  STORED_ELEMENTS[key] = element;
  return key;
}

/**
 * Removes the innerHtml of all the provided elements
 *
 * @param {...key} keys - a {@tutorial key} array of elements
 *
  */

function clear(...keys) {
  for(let key of keys) {
    get(key).innerHTML = '';
  }
}

/**
 * @class Insert
 * @classdesc A {@tutorial PseudoClass}. Resposible for inserting
 * Elements into the HTML-page
 * @borrows set
 * @borrows add
 * @borrows make
 * @borrows insert
 * @hideconstructor
 */



/**
 * Sets one or several **elements** as children
 * of some **parent** element.  
 * All previous children of **parent** get cleared.
 *
 *
 * @param {key} parentKey - the {@tutorial key} to the **parent** element
 * @param {...key} elementKeys - the [keys]{@tutorial key} to one or multiple **elements**
 * @tutorial key
 */

function set(parentKey, ...elementKeys) {
  insert('set', parentKey, ...elementKeys);
}

/**
 * Sets one or several **elements** as children
 * of some **parent** element.  
 * All previous children of **parent** remain next to the new ones.
 *
 *
 * @param {key} parentKey - the {@tutorial key} to the **parent** element
 * @param {...key} elementKeys - the [keys]{@tutorial key} to one or multiple **elements**
 * @tutorial key
 */

function add(parentKey, ...elementKeys) {
  insert('add', parentKey, ...elementKeys);
}

/**
 * Sets one or several **elements** as children
 * of some **parent** element.  
 * If **parent** already has children, the process gets aborted
 *
 *
 * @param {key} parentKey - the {@tutorial key} to the **parent** element
 * @param {...key} elementKeys - the [keys]{@tutorial key} to one or multiple **elements**
 * @tutorial key
 */

function make(parentKey, ...elementKeys) {
  insert('make', parentKey, ...elementKeys);
}



/**
 * Sets one or several **elements** as children
 * of some **parent** element.  
 * The behaviour is like that of [set]{@link Insert.set}, [make]{@link Insert.make} or [add]{@link Insert.add},  
 * depending on the value of **mode**
 *
 * @param {string} mode - either "set", "make", or "add"
 * @param {key} parentKey - the {@tutorial key} to the **parent** element
 * @param {...key} elementKeys - the [keys]{@tutorial key} to one or multiple **elements**
 * @tutorial key
 */

function insert(mode, parentKey, ...elementKeys) {
  let parent = get(parentKey);
  if(mode == undefined) mode = 'set';

  if(mode == 'make' && parent.childNodes.length > 0) return;
  if(mode == 'set') parent.childNodes
    .forEach((child) => {child.remove();});

  elementKeys.forEach((elementKey) => {
    parent.appendChild(get(elementKey));
  });
}

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
function getCssProperty(propertyName) {
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
function setCssProperty(propertyName, propertyValue) {
  root.style.setProperty(propertyName, propertyValue);
}


/**
 * Converts a string like "1, 2, 3" into an array like [1, 2, 3]
 *
 * @param {string} listingString - the string to convert
 */
function listingStringToArray(listingString) {
  return JSON.parse('[' + listingString + ']');
}


/**
 * Converts an array like [1, 2, 3] into a string like "1, 2, 3"
 *
 * @param {Array} array - the array to convert
 */
function arrayToListingString(array) {
  let listingString = '';
  array.forEach((item, i) => {
    listingString += item;
    if(i + 1 != array.length)
      listingString += ', ';
  });
  return listingString;
}

/**
 * Creates an interval that checks for a variable,
 * and if it changes, executes arbitrary code
 *
 * @param {watcher} watcher - an object defining the above values
 *
 */

function watch(watcher) {
  let previousValue;
  let watcherInterval = setInterval(function () {
    if(watcher.killFunction != undefined) 
      if(watcher.killFunction() == true) {
        clearInterval(watcherInterval);
        return;
      }

    let newValue = watcher.watchFunction();
    if(newValue == previousValue)
      return;

    previousValue = newValue;
    watcher.reactFunction(newValue);
  }, watcher.interval);
  watcher.reactFunction(watcher.watchFunction());
}

//import all api functions

//log them so that rollup will include them
//these functions will now be globally available
console.log(
  get, store, clear, set, add, make, insert,
  gen, genText, genHtml, uid, truetypeof, getXMLDocFromLink,
  getCssProperty, setCssProperty, listingStringToArray, arrayToListingString,
  watch
);
