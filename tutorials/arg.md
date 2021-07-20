Most function provided in this package process their
input values normally,  
e.g. like so:
```
let apple = genApple("red", 10);
```
However, in some cases this makes the purpose of each
individual parameter a bit unclear, making function usage
more difficult to memorize and the code less self-documenting.

Therefore, some functions take their arguments like so:
```
let apple = genApple({
  colorName: "red",
  size: 10
});
```
These functions are marked in this documentation with this flag:  
Uses {@tutorial arg}
