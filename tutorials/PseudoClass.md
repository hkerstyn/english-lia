A PseudoClass is a class only shown in this documentation.
To retrieve a function of that class,
simply call it as global function.

**Example:**

```
let myObj = GetStore.get("myKey");
```
will throw an error.

The proper way to use the [get]{@link GetStore.get}-function would be:
```
let myObj = get("myKey");
```
