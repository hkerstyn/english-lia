export function genDummy(dummyName) {
  let dummy = gen('span');
  dummy.id = dummyName;
  store(dummy, dummyName);
  return dummy;
}

export function constrainDummy(dummy, containerName) {
  if(dummy == undefined) return;
  dummy.style.display = 'block';
  dummy.style.whiteSpace = 'normal';
  dummy.style.overflowY = 'auto';
  dummy.style.height = get(containerName + '.container').size[1] + 'px';
  dummy.style.width = get(containerName + '.container').size[0] + 'px';
}
