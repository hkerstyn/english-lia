The Base Library contains many convenient functions.

In order to use it, make sure that you
[ import ]{@tutorial ScriptImport} ` base.js `  
After doing so, all functions are immediately and globally available.

These functions can be grouped into different categories:
* [ get and store ]{@link GetStore} for saving and retrieving elements,
* [ css control functions ]{@link cssControl} that facilitate the reading and modifying of css variables,
* [ Insertion functions ]{@link Insert} for easily placing HTML-Elements on the page,
* and various [ other functions ]{@link Misc}

Here is an example usage of the base library:
```
<!DOCTYPE html>
<html lang="en">
<head>
  <title>My first Website</title>
  <meta charset="UTF-8"> 
  <script src="https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia@latest/base.js"></script>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <script>
  //create some text
  let textSpan = genText("Hello, World!");
  //put it inside the div
  set("myDiv", textSpan);
  </script>
</head>

<body>
 <div id="myDiv></div> 
</body>
</html>
```
