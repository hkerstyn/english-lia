import {generateFoo} from './foo.js';
function printFoo() {
  console.log(generateFoo());
}
console.log(printFoo, generateFoo);
