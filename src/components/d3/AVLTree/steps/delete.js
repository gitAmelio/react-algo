import * as stepHelper from '../steps/step-helper'

const getTargetAndParent = (root, parent=null, deleteData, step, side=true, msg='') =>{
    
    const {deleteValue: value, deleteIndex: index} = deleteData

    if(!root) return {copyRoot: null, root, parent, side, msg, step};
    
    let newMsg = msg
    root.focus = true

    if(root.value === value && root.index === index) {
        if(step === 0){
            newMsg = `Found Target ${value} ${parent ? 'and Parent ' + parent.value :'' }`
            return {copyRoot: {...root}, root:null, parent, side, msg: newMsg, step, done: false}
        }
        newMsg = `Deleting Target ${value}`
        return {copyRoot: {...root}, root, parent, side, msg: newMsg, step: step-1, done: true}
    }    
   
    if(step === 0){
        newMsg = `Searching for Target ${value} and it's parent`
        return {copyRoot: {...root}, root:null, parent, side, msg: newMsg, step, done: false};
    }
    if(value < root.value){

        const result = getTargetAndParent(root.leftChild, root, deleteData, step-1, true, newMsg)
        return { 
            ...result,
            copyRoot: {
                ...root,
                leftChild: result.copyRoot ? {...result.copyRoot} : null
            },
            
        }
    } else {
        const result = getTargetAndParent(root.rightChild, root, deleteData, step-1, false, newMsg)
        return { 
             ...result,
            copyRoot: {
                ...root,
                rightChild: result.copyRoot ? {...result.copyRoot} : null
            },
           
        }    
        
    }
}

const getReplacementNode = target => {

    let replacementParent = target;
    let replacement = target;
    
    let focusNode = target.rightChild

    while (focusNode != null){
        replacementParent = replacement;
        replacement = focusNode;
        focusNode = focusNode.leftChild;
    }

    if(replacement !== target.rightChild){
        replacementParent.leftChild = replacement.rightChild;
        replacement.rightChild = target.rightChild;
    }

    return replacement;
}

function __deleteNode(troot, deleteData, step){
    if(!troot) return {troot, msg: '', step: step, done: true} 
    
    let focusNode = troot
    let parent = troot

    let isItAtLeftChild = true;
    const {copyRoot, root:target, parent:p, side, step: newStep, msg: tempMsg} = getTargetAndParent(troot, null, deleteData, step, true)
    let newMsg = tempMsg
    let root = {...copyRoot}

    if(!target) return {root, msg: newMsg, step: newStep, done: false}

    focusNode = stepHelper.findRoot(root, target.value);
    parent = p ? stepHelper.findRoot(root, p.value): null;
    isItAtLeftChild = side;

    if(!focusNode.leftChild && !focusNode.rightChild){

        if(focusNode === root){
            
            if(newStep === 0){
                newMsg = 'Deleting ' + focusNode.value + 'at root' 
                
                return {root, msg: newMsg, step: newStep, done: false}
            }

            root = null

        } else if(isItAtLeftChild){
            
            if(newStep === 0){
                newMsg = "Deleting root's left child " + focusNode.value 
                
                return {root, msg: newMsg, step: newStep, done: false}
            }
            newMsg = "Target " + focusNode.value + " deleted" 
            parent.leftChild = null;

        } else {
            
            if(newStep === 0){
                newMsg = "Deleting root's right child " + focusNode.value 
                
                return {root, msg: newMsg, step: newStep, done: false}
            }
            newMsg = "Target " + focusNode.value + " deleted" 
            parent.rightChild = null;

        }

    } else 
    if(!focusNode.rightChild){

        if(newStep === 0){
            newMsg = "Deleting target by replacing it with it's left child" 
            
            return {root, msg: newMsg, step: newStep, done: false}
        }

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
 
        if(newStep === 0){
            newMsg = "Deleting target by replacing it with it's right child"  
            
            return {root, msg: newMsg, step: newStep, done: false}
        }

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

        if(newStep === 0){
            newMsg = "Replacing target " + focusNode.value + " with " + replacement.value  
        }
        
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

    return {root: root, msg: newMsg, step: newStep, done: true}
}

export const stepDelete = (root, deleteData, step) => {
   
    const {root: newRoot, msg, step: newStep, done} = __deleteNode(stepHelper.duplicateRoot(root), deleteData, step)

    let tempRoot  = newRoot
    let newMsg = msg
  
    if(newStep === 2 && done){
        newMsg = "Reset Root" 
        return {root: stepHelper.clearRoot(tempRoot), msg: newMsg, step: newStep, done: false}
    } 
    if(newStep > 1 && done) tempRoot = stepHelper.clearRoot(tempRoot)
    
    if(newStep === 3 && done){
        newMsg = "Reset Root" 
        return {root: stepHelper.updateRoot(tempRoot), msg: newMsg, step: newStep, done: false}
    } 
    if(newStep > 1 && done){
        tempRoot = stepHelper.updateRoot(tempRoot)
        newMsg = ''
    } 

    return {root: tempRoot, msg: newMsg, step: newStep, done: newStep > 1 }

}