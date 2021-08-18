When using the [ LUL ]{@tutorial LulTutorial}, it is
possible to change the appearance of a single element by modifying
its css class(es).  
Below is a list of all classes that are available to you.  
Notice how some classses look like this: ` lul-medium-hover `.
The ` -hover ` suffix means that the class is only applied when
the user hovers their cursor over the element.

You can also change some global css properties directly, using ` setCssProperty() `.  
That way you can change colors and other properties, which will apply to all LUL-Elements.  
Below the Classes chaper, you can find a list of all properties






## Classes

### lul-padding
**Description:**

Adds the default-padding as padding property

**Properties used:**
* --default-padding


### lul-margin
**Description:**

Adds the default-margin as margin property

**Properties used:**
* --default-margin

### lul-norm-height
**Description:**

Forces the use of a fixed height

**Properties used:**
* --norm-height

### lul-full-width
**Description:**

Forces an element to use all available width

**Properties used:**


### lul-text
**Description:**

Use this whenever you write text outside of buttons, etc.

**Properties used:**
* --text-color
* --default-font-size

### lul-highlight-text, lul-highlight-text-hover
**Description:**

Use this for text that should be highlighted always or when hovered

**Properties used:**
* --color-dark
* --increased-font-size

### lul-background-text, lul-background-text-hover
**Description:**

Use this for text that should not draw too much attention to itself

**Properties used:**
* --text-color
* --decreased-font-size



### lul-dark, lul-dark-hover
**Description:**

Makes this element have a dark border,
a dark background and
a light text color.

Its font weight is bold, except when
this is hover-only. 

**Properties used:**
* --color-dark
* --color-light
* --color-dark (for the border)
* --default-font-size
* --font-weight-dark


### lul-medium, lul-medium-hover
**Description:**


Makes this element have a dark border,
a medium background and
a dark text color.

Its font weight is bold, except when
this is hover-only. 


**Properties used:**
* --color-medium
* --color-dark
* --color-dark (for the border)
* --default-font-size
* --font-weight-medium


### lul-light, lul-light-hover
**Description:**

Makes this element have a dark border,
a light background and
a default text color.


**Properties used:**
* --color-light
* --text-color
* --color-dark (for the border)
* --default-font-size
* --font-weight-light


## Properties
### --text-color
**default:**  75, 75, 75

### --default-font-size
**default:**  1.5rem

### --increased-font-size
**default:**  1.75rem

### --decreased-font-size
**default:**  1rem

### --color-dark
**default:**  0, 0, 0

### --color-medium
**default:**  128, 128, 128

### --color-light
**default:**  255, 255, 255

### --font-weight-dark
**default:**  bold

### --font-weight-medium
**default:**  bold

### --font-weight-light
**default:**  normal

### --norm-height
**default:**  60px

### --default-padding
**default:**  10px

### --default-margin
**default:**  10px


