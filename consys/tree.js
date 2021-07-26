// a simple class allowing familiy trees
// ie parents and children
export class TreeNode {

  //create a new TreeNode of a given name
  constructor(name) {
    this.name = name;
    store(this, name);
    this.children = [];
  }

  //take care of children
  recalculateIndices() {
    this.children.forEach((child, i) => {
      child.index = i;
    });
  }

  //set a node's parent
  setParent(parent, index) {
    //remove from old parent
    if(this.parent != undefined) {
      this.parent.children.splice(this.index, 1);
      this.parent.recalculateIndices();
    }
    if(parent == undefined) return;

    //add to new parent
    if(index == undefined)
      parent.children.push(this);
    else
      parent.children.splice(index, 0, this);

    this.parent = parent;
    parent.recalculateIndices();
  }

  //set a node's parent via its sibling
  addAsSiblingOf(sibling, index) {
    this.setParent(sibling.parent, index);
  }
  addAfter(sibling) {
    this.addAsSiblingOf(sibling, sibling.index + 1);
  }
  addBefore(sibling) {
    this.addAsSiblingOf(sibling, sibling.index);
  }

  


  //yields this and all predecessors
  *[Symbol.iterator]() {
    yield this;
    for(let child of this.children)
      yield* child;
  }

  //yields all childless predecessors
  *youngestPredecessorGenerator() {
    if(this.children.length == 0)
      yield this;
    else
      for(let child of this.children)
        yield* child.youngestPredecessorGenerator();
  }

  //yields all ancestors
  *ancestorGenerator() {
    yield this;
    if(this.parent != undefined)
      yield* this.parent.ancestorGenerator();
  }

  //returns all ancestors in an array
  get ancestors() {return [...this.ancestorGenerator()];}

  //returns the smallest common ancestor of a number of tree-nodes
  static commonAncestor(...treeNodes) {
    //if only one is provided, return it
    if (treeNodes.length == 1) 
      return treeNodes[0]; 
    //if more than two are provided, recurse
    if(treeNodes.length > 2)
      return TreeNode.commonAncestor(treeNodes[0], TreeNode.commonAncestor(...treeNodes.slice(1)));

    //exactly two
    //compare their ancestors
    let comparatorGenerator = treeNodes[1].ancestorGenerator();
    for(let comparatorNode of comparatorGenerator) {
      let referenceGenerator = treeNodes[0].ancestorGenerator();
      for(let referenceNode of referenceGenerator) {
        if(referenceNode == comparatorNode)
          return referenceNode;
      }
    }

    //if no common ancestor is found, return undefined
    console.warn('No common ancestor found');
    return undefined;
  }

}

