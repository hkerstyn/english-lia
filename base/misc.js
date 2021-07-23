/**
 * @class Misc
 * @classdesc A {@tutorial PseudoClass}. Provides several small
 * pieces of code
 *
 * @borrows gen
 * @borrows genText
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

export function gen(name, className) {
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

export function genText(content, className) {
  let text = gen('span', className);
  text.innerHTML = content;

  return text;
}


var idCount = 0;

/**
 * returns a different string on each invocation
 */

export function uid() {
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

export function truetypeof(value) {
  let deepType = Object.prototype.toString.call(value);
  if(deepType == '[object Object]') return 'object';
  if(deepType == '[object Array]') return 'array';
  if(deepType.includes('HTML')) return 'html';
  if(deepType == '[object String]') return 'string';

  console.warn('No valid type identified.');
  console.warn('value: ', value);
  console.warn('deepType: ', deepType);
}
