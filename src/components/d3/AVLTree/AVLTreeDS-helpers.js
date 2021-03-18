import {AVLNode} from './AVLTreeDS'
import * as H from '../../../Utils/helpers'

export const findRoot = (root, value) => {

    if(!root) return null;
    
    if(value === root.value) return root

    if(value < root.value){
        return findRoot(root.leftChild, value)
    } else 
    if(value > root.value){
        return findRoot(root.rightChild, value)
    } 

}

export const calcHeight = root =>  {

    if(!root) return 0;

    if(root && root.left !== undefined && root.right !== undefined){
        return Math.max(root.left, root.right)+1
    }

    return Math.max(calcHeight(root.leftChild), calcHeight(root.rightChild) )+1
    
}

export const balanceFactor = root => {

    if(!root) return 0;

    if(root && root.left !== undefined && root.right !== undefined){
        return root.left - root.right
    }

    return calcHeight(root.leftChild) - calcHeight(root.rightChild);
}



export const isLeftHeavy = root => {
    return balanceFactor(root) > 1;
}

export const isRightHeavy = root => {
    return balanceFactor(root) < -1;
}

export const leftRotate = (root) => {
    const {rightChild} = root;
    const {leftChild}  = rightChild;
    const updateRoot = {...root, rightChild: leftChild ? {...leftChild} : null}
    const newRoot = {...rightChild, leftChild: {...updateRoot}}

    return {...newRoot};
}

export const rightRotate = (root) => {
    const {leftChild} = root;
    const {rightChild}  = leftChild;
    const updateRoot = {...root, leftChild: rightChild ? {...rightChild} : null}
    const newRoot = {...leftChild, rightChild: {...updateRoot}}

    return {...newRoot};
}

export const balance = (root) => {
        
    if(!root) return null;

    if(isLeftHeavy(root)) {
      
        if(balanceFactor(root.leftChild) < 0){
            root.leftChild = {...leftRotate(root.leftChild)}                
        }

        return {...rightRotate(root)}

    } else if(isRightHeavy(root)) {
      
        if(balanceFactor(root.rightChild) > 0) {
            root.rightChild = {...rightRotate(root.rightChild)};
        }
       
        return {...leftRotate(root)};
        
    }
    return {...root};
}

const __rootInsert = (root, value, index, last=false)=> {
    
    if(!root) {
        return {...(new AVLNode(value, index)), last } ;
    }
    
    if(value < root.value){
        return balance({...root, leftChild: __rootInsert(root.leftChild, value, index, last)})
    } else {
        return balance({...root, rightChild: __rootInsert(root.rightChild, value, index, last)})
    }
    
}

export const rootInsert = (root, value, index, last=false) => {
   const exist = findRoot(root, value) 
   if(!exist){
       return __rootInsert(root, value, index, last)
   } 
   return null

}

export const balancePath = (root, value)=> {

    if(!root) return null
    
    if(root.value === value) return root

    if(value < root.value){
        return balance({...root, leftChild: balancePath(root.leftChild, value)})
    } else {
        return balance({...root, rightChild: balancePath(root.rightChild, value)})
    }
      
}

export const duplicateRoot = root => {

    if(!root) return null;

    return {
        ...root,
        leftChild: duplicateRoot(root.leftChild),
        rightChild: duplicateRoot(root.rightChild)
    }

} 

export const updateRowOnNodes = (nodes, tree) => {
    
    if(H.empty(nodes) || !tree || (tree && !tree.root)) return {}

    const [first, rest] = H.firstAndRest(nodes)

    const root = findRoot(tree.root, first[1].value)


    if(!root) return {}


    const updatedNode = {...first[1], level: root.height}

    return { [first[0]]: updatedNode, ...updateRowOnNodes(rest, tree)}

}

export const nodeProperties = (first) => {
  
    if(Array.isArray(first)) return {...first[1], index: first[0]}
  
    return first

}

const insertNodes = (nodes, root) => {
    
    if(H.empty(nodes)) return root

    const last = H.length(nodes) === 1

    const [ first, rest ] = H.firstAndRest(nodes)

    const { value, index } = nodeProperties(first)

    const newRoot = rootInsert( root, value, index, last )

    return insertNodes(rest, newRoot)

} 

const __nodesAtDistance = (root, nodes, distance) => {

    if(!root) return [];
  
    if(distance === 0) {
        const {index} = root
        return [{...nodes[index], index: +index}]
    }

    return [
        ...__nodesAtDistance(root.leftChild,  nodes, distance-1),
        ...__nodesAtDistance(root.rightChild, nodes, distance-1)
    ]

}

const nodesAtDistance = (root, nodes, distance=0) => {

    if(!root) return []

    return __nodesAtDistance(root, nodes, distance)

}

const setLevelOnNodes = (nodes, level) => {

    if(H.empty(nodes)) return []

    const [first, rest] = H.firstAndRest(nodes)

    return [
        { ...first, level },
        ...setLevelOnNodes(rest, level)
    ]

}


export const nodesOrderedByLevel = (root, inputNodes, level=0) => {

    const nodes = nodesAtDistance(root, inputNodes, level)
    
    if(H.empty(nodes)) return []

    const newNodes = setLevelOnNodes(nodes, level).sort((a,b)=> a.index - b.index)

    return [
        newNodes,
        ...nodesOrderedByLevel(root, inputNodes, level+1)
    ]

}

export const insertNodesBylevel = (leveledNodes, tree) => {

    if(!tree) return null

    if(H.empty(leveledNodes)) return tree.root

    const [first, rest] = H.firstAndRest(leveledNodes)

    tree.root = insertNodes(first)

    return insertNodesBylevel(rest, tree)

}

export const levelNodes = nodes => {

    const root = insertNodes(nodes)
        
    return nodesOrderedByLevel(root, nodes).flat()

}

const stepMessage = (msg, value) => {
    this.status = { msg, value } 
}

const getReplacementNode = (replacedNode) => {

    let replacementParent = replacedNode;
    let replacement = replacedNode;
    
    let focusNode = replacedNode.rightChild

    while (focusNode != null){
        replacementParent = replacement;
        replacement = focusNode;
        focusNode = focusNode.leftChild;
    }

    if(replacement !== replacedNode.rightChild){
        replacementParent.leftChild = replacement.rightChild;
        replacement.rightChild = replacedNode.rightChild;
    }

    return replacement;
}

const getTargetAndParent = (root, node, parent, side=true, step) => {
    if(!root) return [root, parent, side];

    const {value, index} = node
   
    if(root.value === value && root.index === index) {
        if(step === 0){
            stepMessage(`Found Target ${value} ${parent ? 'and Parent ' + parent.value :'' }`)
        }
        return [root, parent, side]
    }    
   
    if(step === 0){
        stepMessage(`Searching for Target ${value} and it's parent`)
        root.stepped = true
        return [null, parent, side];
    }

    if(value < root.value){
        return getTargetAndParent(root.leftChild, node, root, true, step-1)
    } else {
        return getTargetAndParent(root.rightChild, node, root, false, step-1)
    }
}

export const deleteNode = (root, node, step) => {
    let focusNode = root
    let parent = root

    let isItAtLeftChild = true;

    const [target, p, side] = getTargetAndParent(root, node, true, step)
    
    if(!target) return null

    focusNode = target
    parent = p;
    isItAtLeftChild = side;

    if(!focusNode.leftChild && !focusNode.rightChild){
        if(focusNode === root){

            root = null

        } else if(isItAtLeftChild){

            parent.leftChild = null;

        } else {

            parent.rightChild = null;

        }
    } else 
    if(!focusNode.rightChild){
        if(focusNode === root){

            root = focusNode.leftChild;

        } else
        if(isItAtLeftChild){

            parent.leftChild = focusNode.leftChild;

        } else {

            parent.rightChild = focusNode.leftChild;

        }
    } else 
    if(!focusNode.leftChild){
        if(focusNode === root){

            root = focusNode.rightChild;

        } else 
        if(isItAtLeftChild){

            parent.leftChild = focusNode.rightChild

        } else {

            parent.rightChild = focusNode.rightChild;

        }
    } else {
        const replacement = getReplacementNode(focusNode)
        
        if(focusNode === root){

            root = replacement;

        } else
        if(isItAtLeftChild) {

            parent.leftChild = replacement

        } else {

            parent.rightChild = replacement;

        }

        replacement.leftChild = focusNode.leftChild;
    }
    return root;
}


const nodesToArray = nodes => {

    if(H.empty(nodes)) return []

    const [first, rest] = H.firstAndRest(nodes)        

    const data = {
        index: +first[0], 
        deleted: false,
        ...first[1],
    }

    return [data, ...nodesToArray(rest)]

}

const getDeletedNodes = nodes => {

    if(H.empty(nodes)) return []
    
    const [first, rest] = H.firstAndRest(nodes)

    let data = []
  
    if(first.deleted){
       data = [ {...first} ]
    }

    return [...data, ...getDeletedNodes(rest)]

}


const __deleteNodes = nodes => {
 
    if(H.empty(nodes)) return this

    const [first, rest] = H.firstAndRest(nodes) 

    deleteNode(first.value)

    return __deleteNodes(rest)

}

export const deleteNodes = nodeObjects => {

    if(H.empty(nodeObjects)) return this 

    const nodes = nodesToArray(nodeObjects)
    
    const sortedNodes = nodes.sort((a,b)=> a.step - b.step)
    
    const deletedNodes = getDeletedNodes(sortedNodes)
    
    return __deleteNodes(deletedNodes)
    
}

export const deleteAndBalalnce = (nodes, root) => {
    
    if(!root) return null
    if(H.empty(nodes) ) return root

    const [first, rest] = H.firstAndRest(nodes)
   
    let newRoot = deleteNode(root, first.value)

    newRoot = newRoot || root

    newRoot = balancePath( newRoot, first.value)

    return deleteAndBalalnce(rest, newRoot)

}

export function calcSides (root, col=0, row=0) {
    if(!root) return 0;
    
    const leftSide  = calcSides(root.leftChild,  col - 1,  row + 1);
    const rightSide = calcSides(root.rightChild, col + 1,  row + 1);

    root = { 
        ...root, 
        col, row,
        width: leftSide + rightSide + 1, 
        leftSide,
        rightSide
    }

    return root.width
}

export function calcSides2(root, x=0, y=0){
    if(!root) return 0;
    root.col   = x;
    root.row   = y;
    root.leftSide  = calcSides(root.leftChild,  x - 1,  y + 1);
    root.rightSide = calcSides(root.rightChild, x + 1,  y + 1);
    root.width = root.leftSide  + root.rightSide + 1 ; 
    return root.width
}


