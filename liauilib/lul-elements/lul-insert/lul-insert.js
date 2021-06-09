
export function insertElement(element, insert) {
  console.log("Inserting element ", element, " with insert argument: ", insert);
  insert.target.forEach((target) => {
    if(insert == undefined) return;
    if(insert.mode == undefined) insert.mode = "set";

    if(insert.mode == "make" && target.innerHTML != "") return;
    if(insert.mode == "set") target.innerHTML = "";
    appendChildren(target, element);
  });


}
