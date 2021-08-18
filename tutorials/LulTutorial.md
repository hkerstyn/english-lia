The **Lia-UI-Library** (LUL for short) can create procedural
UI, and has features like buttons, radio, and input fields.  
This guide will show you how to use it in a LiaScript-Course,
however, many steps are the same when using it in an external website.


## Preparation

In order to use the LUL, you might need to import some or all of the following files
into your course:
* ` lul.js ` and ` lul.css ` (you will definetly need those)
* ` consys.js ` and ` consys.css ` (if you want to use [ containers ]{@tutorial ConsysTutorial})
* ` base.js ` (absolutely needed)
* ` lul-lia-bridge.js ` (to ensure that the colors are matching those of the LiaScript course; omit on external website)

Your course might initially look like this:

```
<!--
author:   Your Name
version:  0.1.0
language: en
narrator: US English Female

script: https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia@latest/base.js

script: https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia@latest/consys.js
link: https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia@latest/consys.css

script: https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia@latest/lul-lia-bridge.js

script: https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia@latest/lul.js
link: https://cdn.jsdelivr.net/gh/kaptn-seebar/english-lia@latest/lul.css

script: path/to/myScript.js
-->

# My first LiaScript Course

<div id="myDiv"></div>

```

Notice the ` myScript.js ` tag. This is were we will be putting all example code in.


## Basic Usage

Put the following code into your script:

```
let button = genButton({
  text: "Click me!",
  onclick: function() {
    alert("Thank you!");
  }
});

set("myDiv", button);
```

When you reload your course, you should see a black button appear that wants you to click on it.

You may have noticed that the function ` genButton()`, which returns an HTML-Button,ü
does not take its two arguments directly, but rather as object.
This helps making the code be more readable.  
More information can be found [ here ]{@tutorial arg}

So we can see that ` genButton() ` handles both the Text of the button as well as
its behaviour.

The second function used in this example was ` set()`. Its effect is to set the new **button** 
as child of the div **"myDiv"**, which we declared in our LiaMarkdown above. Without it,
we would not see the button.


### Keys

So, in the previous example, we used ` set("myDiv", button); ` to place one HTML-Element inside
another HTML-Element, yet one argument is a string and the other one the Element itself.  
It might seem peculiar to  use two different data types representing the same kind of object.

In reality however these alternatives (for example) would have worked as well:

```
store(button, "button");
set("myDiv", "button");
```

```
let myDiv = get("myDiv");
set(myDiv, button);
```

```
button.setAttribute("id", "button");
let myDiv = document.getElementById("myDiv"); 
set(myDiv, "button");
```

Arguments that are handled this way are called [ keys ]{@tutorial key}.


## Configuration

### Via LulConfig 
The example of the last chapter gave us a black button, that turns grey when hovered, since these colors are the default.  
This is because the css class of the button is
```
lul-dark lul-medium-hover lul-norm-height
```

We could make a grey button that hovers to white by setting the default button class to
```
lul-medium lul-light-hover lul-norm-height
```

This is done like so: 
```
//create a config object with all default values
let newLulConfig = new LulConfig();

//modify the value that interest us
newLulConfig.DEFAULT_BUTTON_CLASS = 'lul-medium lul-light-hover lul-norm-height';

//apply the changes
newLulConfig.apply();
```

Try it and you will see the effect!

Here is a [ list of all possible options ]{@link LulConfig}

### Via setCssProperty()

"But", I hear you say, "what if I don't want my buttons to be white, grey or black?"  
Don't worry, it is possible to change the dark, medium and light colors that the LUL will use.

The following will turn the lumpy old grey into fresh red:
```
setCssProperty("--color-medium", "255, 50, 0");
```
This code snippet can also be executed after `newLulConfig.apply() `, so you can change the colors
at any point.

A complete list of modifiable css-properties can be found [ here ]{@tutorial CssList}


### Via bridgeLulToLia()

Now, while it is great that you can manually specify any fancy color palette you like,
you might nonetheless feel the desire to have the color palette automatically match the LiaScript Course.  
On an external website, you would not care about that.

Luckily, the script **lul-lia-bridge.js** provides the function **bridgeLulToLia()**, which does just that.
You can try this out by using the following script:
```
bridgeLulToLia();
let button = genButton({
  text: "Click me!",
  onclick: function() {
    alert("Thank you!");
  }
});

set("myDiv", button);
```
Now, the button is green or whatever, and it even adapts if you change the color or the darkmode


## More examples

Great! All of the basic stuff is now set up and you can start LULling!  

Here is a list of examples that may interest you:
* [ using genEntry() ]{@tutorial LulGenEntry}
* [ creating a radio ]{@tutorial LulSelection}
* [ working with tables and text ]{@tutorial LulText}


These examples contain information that can help you with the LULusage
