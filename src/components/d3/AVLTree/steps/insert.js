import * as H from '../../../../Utils/helpers'
import * as stepHelper from '../steps/step-helper'


const __balanceInsert = (root, value, index, last=false)=> {
    
    if(!root) {
        return {...(new stepHelper.AVLNode(value, index)), last } ;
    }
    
    if(value < root.value){
        return stepHelper.balance({...root, leftChild: __balanceInsert(root.leftChild, value, index, last)})
    } else {
        return stepHelper.balance({...root, rightChild: __balanceInsert(root.rightChild, value, index, last)})
    }
    
}
const balanceInsert = (root, value, index, last=false) => {
   
   const exist = stepHelper.findRoot(root, value) 
   
   if(exist) return root
   
   return __balanceInsert(root, value, index, last)
   
}

export const balanceInsertNodes = (objNodes) => {

    if(Object.keys(objNodes).length === 0) return null

    const nodes = H.objToArray(objNodes)
    return nodes.reduce((a,c)=> balanceInsert(a, c.value, c.index) )
    
}

const __stepInsert = (root, data, step=0, message=null) => {

    if (!data) return [null, 'no data'];
    const { value, index, stepped } = data;

    let msg = message

    if (!root) {

        if(!msg){
            msg = `Inserted ${value} as root to the tree`
        }

        if (step === 0) return {root:null, msg, done: false, step: step}
         
        msg =  `Inserted ${value} to the tree`
        
        return {root: new stepHelper.AVLNode(value, index, stepped), msg, done: true, step: step};
    }

    root.last = false;

    root.focus =  true  
    
    root.status = ''

    if (step === 0) {

        msg = `Search for a location for ${value}`
      
        return { root: {...root}, msg, done: false, step: step };
   
    }
    if (step === 1) {
        if (stepHelper.isLeaf(root)) {
            root.status = 'new-root'
            msg = `Parent found for new leaf ${value} at ${root.value}`

        }
    }

    if (value < root.value) {
        const {root: newRoot, msg: newMsg, done: newDone, step: newStep} = __stepInsert(root.leftChild, data, step - 1, msg)
        return {root: { ...root, leftChild: newRoot  }, msg: newMsg, done: newDone, step: newStep }
    } else {
        const {root: newRoot, msg: newMsg, done: newDone, step: newStep} = __stepInsert(root.rightChild, data, step - 1, msg)
        return {root: { ...root, rightChild: newRoot }, msg: newMsg, done: newDone, step: newStep }
    }

}

export const stepInsert = (root, data, step) => {

    if(!data) return {root, msg: 'No data'}

    const exist = stepHelper.findRoot(root, data.value)

    if(exist) {

        const msg = root.focus 
                        ? 'Insert succesfull'
                        : 'Value already exist in tree'
        
        const newRoot = stepHelper.clearPath(root, data.value)

        return {root: newRoot, msg, done: true, exist: true} 

    }    

    const result = __stepInsert(root, data, step)

    let newRoot = result.root

    if(result.done && result.step === 2) {

        newRoot = stepHelper.clearPath(result.root, data.value)
        
        return { ...result, root: newRoot, msg: "", done: false}
    }
    
    let newMsg = result.msg
    let newDone = false
    
    if (result.done && result.step > 2) {

        return  stepHelper.cleanUpResult(result)
    }

    return {root: newRoot, msg: newMsg, done: newDone}

}

export const insertNodes = (objNodes) => {

    const nodes = H.objToArray(objNodes)
    return nodes.reduce( (a,c)=> stepInsert(a, c.value, c.index) )
}

