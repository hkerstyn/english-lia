import {genModules}
  from './lul-gen-modules/lul-gen-modules.js';
console.log("Gen modules:", genModules);

const HTML_PROPERTIES = ['id', 'className', 'style'];

export function genElementArray(arg) {
  let trueType = truetypeof(arg);
  console.log("Called genElementArray. trueType: ", trueType);
  switch (trueType) {
    case 'html': return [arg];
    case 'string': return [get(arg)];
    case 'object': return genElementArrayFromObject(arg);
    case 'array':
      let result = [];
      arg.forEach((item) => {
        result = result.concat(genElementArray(item))
      });
      return result;
    default: console.warn("genElementArray: No proper type found for: ", arg);
      return;
  }
}


function genElementArrayFromObject(arg) {
  console.log("Generating element with arg: ", arg);
  let childModules = [];
  let parentModules = [];
  let ownGenModule;

  console.log("Considering all modules...");
  for (var i = 0; i < genModules.length; i++) {
    let genModule = genModules[i];
    let property = genModule.type;

    //check if module is own module
    if(arg.type == property) ownGenModule = genModule;

    //check if module applies
    if(arg[property] == undefined) continue;

    //cast to array
    arg[property] = castToArray(arg[property]);

    //add type
    arg[property].forEach((item) => {
      if(item.type == undefined)
      item.type = property;
    });

    //add to property list
    if(genModule.hierarchyType == 'parent')
    parentModules.push(genModule);
    else
    childModules.push(genModule);
  }
  console.log("childModules: ", childModules);
  console.log("parentModules: ", parentModules);
  console.log("ownGenModule: ", ownGenModule);


  childModules.forEach((childModule) => {
    let childProperty = childModule.type;
    console.log("Applying Child module ", childProperty);
    arg[childProperty] = genElementArray(arg[childProperty]);
  });

  console.log("Applying Own module: ", arg.type);
  if(ownGenModule == undefined) return [arg];
  if(ownGenModule.genFunction == undefined) return [arg];
  let selfArray = genElementArray(ownGenModule.genFunction(arg));
  if(truetypeof(selfArray[0]) == 'html')
  {
    //appending children
    if(arg.children != undefined)
    appendChildren(selfArray[0], arg.children);
    //setting html properties
    HTML_PROPERTIES.forEach((htmlProperty) => {
      if(arg[htmlProperty] != undefined)
      selfArray[0][htmlProperty] = arg[htmlProperty];
    });
    //setting events
    let argProperties = Object.getOwnPropertyNames(arg);
    console.log("argProperties: ", argProperties);
    argProperties.forEach((property) => {
      if(property.startsWith('on'))
      selfArray[0].addEventListener(property.slice(2), arg[property]);
    });
  }





  console.log("Applying Parent modules...");
  parentModules.forEach((parentModule) => {
    let parentProperty = parentModule.type;
    let parentAlias = parentModule.parentAlias;
    let parentArray = arg[parentProperty];
    delete arg[parentProperty];
    parentArray.forEach((parent) => {
      if(parent[parentAlias] == undefined) parent[parentAlias] = [];
      parent[parentAlias] = parent[parentAlias].concat(selfArray);
      selfArray = genElementArray(parent);
    });
  });
  console.log("Applied all modules. Result:");
  console.log("selfArray: ", selfArray);
  console.log("arg:", arg);
  return selfArray;
}


function castToArray(value) {
  let trueType = truetypeof(value);
  if(trueType == 'array') return value;
  return [value];
}

function truetypeof(value) {
  let deepType = Object.prototype.toString.call(value);
  if(deepType == '[object Object]') return 'object';
  if(deepType == '[object Array]') return 'array';
  if(deepType.includes('HTML')) return 'html';
  if(deepType == '[object String]') return 'string';

  console.warn("No valid type identified.");
  console.warn("value: ", value);
  console.warn("deepType: ", deepType);

}
