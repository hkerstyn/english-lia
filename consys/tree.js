export class TreeNode {

  constructor(name) {
    this.name = name;
    store(this, name);
    this.children = [];
  }

  recalculateIndices() {
    this.children.forEach((child, i) => {
      child.index = i;
    });
  }

  *[Symbol.iterator]() {
    yield this;
    for(let child of this.children)
      yield* child;
  }

  *youngestPredecessorGenerator() {
    if(this.children.length == 0)
      yield this;
    else
      for(let child of this.children)
        yield* child.youngestPredecessorGenerator()
  }


  setParent(parent, index) {
    if(this.parent != undefined) {
      this.parent.children.splice(this.index, 1);
      this.parent.recalculateIndices();
    }

    if(index == undefined)
      parent.children.push(this);
    else
      parent.children.splice(index, 0, this);

    this.parent = parent;
    parent.recalculateIndices();
  }

  addAsSiblingOf(sibling, index) {
    this.setParent(sibling.parent, index);
  }
  addAfter(sibling) {
    this.addAsSiblingOf(sibling, sibling.index + 1);
  }
  addBefore(sibling) {
    this.addAsSiblingOf(sibling, sibling.index);
  }

  get ancestors() {return [...this.ancestorGenerator()];}

  *ancestorGenerator() {
    yield this;
    if(this.parent != undefined)
      yield* this.parent.ancestorGenerator();
  }

  commonAncestor(...treeNodes) {
    return TreeNode.commonAncestor(this, ...treeNodes);
  }
  static commonAncestor(...treeNodes) {
    if (treeNodes.length == 1) {
      return treeNodes[0]; 
    }
    return getCommonAncestor(...treeNodes);
  }

}


//returns the smallest common Parent of a number of treeNodes

function getCommonAncestor(...treeNodes) {
  if(treeNodes.length > 2)
    return getCommonAncestor(treeNodes[0],
      getCommonAncestor(...treeNodes.slice(1)));

  let comparatorGenerator = treeNodes[1].ancestorGenerator();

  for(let comparatorNode of comparatorGenerator) {
    let referenceGenerator = treeNodes[0].ancestorGenerator();
    for(let referenceNode of referenceGenerator) {
      if(referenceNode == comparatorNode)
        return referenceNode;
    }
  }
  return undefined;
}
