/*
  hide() and reveal() change the visibility (the display) of an element
  solo() hides all but one element of a given solo group (array of ids)
*/


//which type of display should a revealed element without a set fallback receive?
const DEFAULT_DISPLAY = "inline-block";


//sets the display of an element to "none" and stores its original display
export function hideRaw(targetArray) {
  targetArray.forEach((target) => {
    console.log("Hiding ", target);
    let definedDisplay = target.getAttribute("definedDisplay");
    if(definedDisplay == "none") return;   //avoid duplicate hiding

    let trueDisplay = window.getComputedStyle(target).getPropertyValue("display");

    target.setAttribute("originalDisplay", trueDisplay);
    target.setAttribute("definedDisplay", "none");
    target.style.display = "none";
  });

}

//if present, restores original display of an element, otherwise defaults to DEFAULT_DISPLAY
export function revealRaw(targetArray) {
  targetArray.forEach((target) => {
    console.log("Revealing ", target);

    let definedDisplay = target.getAttribute("definedDisplay");
    let trueDisplay = window.getComputedStyle(target).getPropertyValue("display");
    let originalDisplay = target.getAttribute("originalDisplay");

    if(trueDisplay != definedDisplay && definedDisplay != null)
    console.warn("Defined display (%s) and true display (%s) are different",
    definedDisplay, trueDisplay);
    if(trueDisplay != "none") return;
    if(originalDisplay == "none") console.warn("Original display is none");


    if(originalDisplay == undefined || originalDisplay == null) {
      target.style.display = DEFAULT_DISPLAY;
      target.setAttribute("definedDisplay", DEFAULT_DISPLAY);
    } else {
      target.style.display = originalDisplay;
      target.setAttribute("definedDisplay", originalDisplay)
    }
  });
}
