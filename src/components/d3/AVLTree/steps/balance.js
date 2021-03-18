import * as stepHelper from '../steps/step-helper'

export const nodesOnPath = (root, value) => {
    if(!root) return []

    if(value < root.value){
        return [...nodesOnPath(root.leftChild, value), root]
    } else 
    if(value > root.value){
        return [...nodesOnPath(root.rightChild, value), root]
    }
    return [root]
}

const stepOutput = (root, msg, step=0 , status='', done=false, taskDone=false) => {
    return {root: {...root, status}, msg, newStep: step, done, taskDone}
}

const stepBalanceRoot = (root, step, inputMsg, doneWithPrev, mainRoot) => {
    let newStep = step

    if (!root) return stepOutput(root, 'Nothing to balance', step,'', true)
    if (step < 0) return stepOutput(root, inputMsg, step, '', true) 
    if(!doneWithPrev && !stepHelper.isLeaf(root)) return stepOutput(root, inputMsg, step, '', true) 
    root.focus = true

    let msg = `Checking if node ${root.value} is balanced`
    if(stepHelper.isLeaf(root)) return stepOutput(root, msg, step, 'stepped', true)

    if (step === 0) return stepOutput(root, msg, step, 'balancing')
    
    if (stepHelper.isLeftHeavy(root)) {
  
        if (stepHelper.balanceFactor(root.leftChild) < 0) {
            newStep = newStep -1
            msg = `Node ${root.value} is left heavy, rotating left at ${root.leftChild.value}`
            if (newStep === 0) return stepOutput(root, msg, newStep, 'unbalanced')

            root.leftChild = stepHelper.leftRotate(root.leftChild)
        }
        
        newStep = newStep -1
        msg = `Node ${root.value} is right heavy, rotating right`
        if (newStep === 0) return stepOutput(root, msg, newStep, 'unbalanced')
        
        root.focus = true
        newStep = newStep -1
        msg = `Node ${root.value} is now balanced`
        if (newStep === 0) return stepOutput( stepHelper.rightRotate(root), msg, newStep, 'balanced')

        const result = stepOutput( stepHelper.rightRotate(root), msg, newStep, 'balanced', true, mainRoot)
        return stepHelper.cleanUpResult(result)
        
    } else if (stepHelper.isRightHeavy(root)) {

        if (stepHelper.balanceFactor(root.rightChild) > 0) {
            
            newStep = newStep -1
            msg = `Node ${root.value} is right heavy, rotating right at ${root.rightChild.value}`
            if (newStep === 0) return stepOutput(root, msg, newStep, 'unbalanced') 

            root.rightChild = stepHelper.rightRotate(root.rightChild)
        }

        newStep = newStep -1
        msg = `Node ${root.value} is left heavy, rotating left`
        if (newStep === 0) return stepOutput(root, msg, newStep, 'unbalanced')
       
        newStep = newStep -1
        msg = `Node ${root.value} is now balanced`
        if (newStep === 0) return stepOutput( stepHelper.leftRotate(root), msg, newStep, 'balanced')
          
        const result = stepOutput( stepHelper.leftRotate(root), msg, newStep, 'balanced', true, mainRoot)
        return stepHelper.cleanUpResult(result)
    }

    msg = `Root ${root.value} is balanced`

    return stepOutput(root, msg, newStep, '', true, true)

}
//                                      9
//                                  1        21
//                                     4   15   24
//
const __stepBalanceTree = (root, endNode, step, rootValue) => {
    
    let msg = `Balancing path from node ${endNode.value}`

    if( step === 0 ) return {root, msg, newStep: step, done: false, taskDone: stepHelper.isLeaf(root)}
    if ( !root ) return {root, msg, newStep: step, done: true, taskDone: true}

    const { value } = endNode;

    let tempRoot = root;
    let newUpStep;

    if (value < root.value) {
        const {root: newRoot, msg,  newStep, done, active, taskDone} = __stepBalanceTree(root.leftChild, endNode, step, rootValue) 
        newUpStep = newStep 
            
        tempRoot = {root: { ...root, leftChild: newRoot}, msg, newStep: newStep, done, active, taskDone }
    } else 
    {   
        const {root: newRoot, msg, newStep, done, active, taskDone } = __stepBalanceTree(root.rightChild, endNode, step, rootValue)
        newUpStep = newStep 
           
        tempRoot = {root: { ...root, rightChild: newRoot}, msg, newStep: newStep, done, active, taskDone } 
    }
    
    return stepBalanceRoot( 
        {...tempRoot.root}, 
        newUpStep-1, 
        tempRoot.msg, 
        tempRoot.done, 
        rootValue === tempRoot.root.value 
    )
}

export const stepBalance =  (root, endNode, step) => {

    let result = __stepBalanceTree(root, endNode, step, root.value)
    
    const taskCompleted = (
        result.done &&
        result.taskDone
    )

    if(taskCompleted) result.root = stepHelper.clearRoot(result.root)
    
    return { ...result,  taskCompleted }

}



