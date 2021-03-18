import * as AVLTreeDelete from '../components/d3/AVLTree/steps/delete'
import * as AVLTreeInsert from '../components/d3/AVLTree/steps/insert'
import * as stepHelper from '../components/d3/AVLTree/steps/step-helper'

describe('AVLTree delete',()=>{
    it('Deleting a left leaf', ()=>{
        const nodes = stepHelper.genNodeHash([ 21, 1, 9, 11, 8, 18])

        const root = AVLTreeInsert.balanceInsertNodes(nodes)
    
        const targetNode = {deleteValue: 11, deleteIndex: 3}
    
        let result = AVLTreeDelete.stepDelete(root,  targetNode, 0)
        expect(stepHelper.simplify(result.root)).toEqual("  [9]  > {  1 > { null, 8 },  18 > { 11, 21 } }")
        expect(result.msg).toEqual("Searching for Target 11 and it's parent")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 1)
        expect(stepHelper.simplify(result.root)).toEqual("  [9]  > {  1 > { null, 8 },   [18]  > { 11, 21 } }")
        expect(result.msg).toEqual("Searching for Target 11 and it's parent")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 2)
        expect(stepHelper.simplify(result.root)).toEqual("  [9]  > {  1 > { null, 8 },   [18]  > {  [11] , 21 } }")
        expect(result.msg).toEqual("Found Target 11 and Parent 18")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 3)
        expect(stepHelper.simplify(result.root)).toEqual("  [9]  > {  1 > { null, 8 },   [18]  > {  [11] , 21 } }")
        expect(result.msg).toEqual("Deleting root's left child 11")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 4)
        expect(stepHelper.simplify(result.root)).toEqual("  [9]  > {  1 > { null, 8 },   [18]  > { null, 21 } }")
        expect(result.msg).toEqual("Target 11 deleted")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 5)
        expect(stepHelper.simplify(result.root)).toEqual(" 9 > {  1 > { null, 8 },  18 > { null, 21 } }")
        expect(result.msg).toEqual("Reset Root")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 6)
        expect(stepHelper.simplify(result.root)).toEqual(" 9 > {  1 > { null, 8 },  18 > { null, 21 } }")
        expect(result.msg).toEqual("Reset Root")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 7)
        expect(stepHelper.simplify(result.root)).toEqual(" 9 > {  1 > { null, 8 },  18 > { null, 21 } }")
        expect(result.msg).toEqual("")
        expect(result.done).toEqual(true)
    })
    it('Deleting a right leaf', ()=>{
        const nodes = stepHelper.genNodeHash([ 21, 1, 9, 11, 8, 18])

        const root = AVLTreeInsert.balanceInsertNodes(nodes)
    
        const targetNode = {deleteValue: 21, deleteIndex: 0}
    
        let result = AVLTreeDelete.stepDelete(root,  targetNode, 0)
        expect(stepHelper.simplify(result.root)).toEqual("  [9]  > {  1 > { null, 8 },  18 > { 11, 21 } }")
        expect(result.msg).toEqual("Searching for Target 21 and it's parent")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 1)
        expect(stepHelper.simplify(result.root)).toEqual("  [9]  > {  1 > { null, 8 },   [18]  > { 11, 21 } }")
        expect(result.msg).toEqual("Searching for Target 21 and it's parent")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 2)
        expect(stepHelper.simplify(result.root)).toEqual("  [9]  > {  1 > { null, 8 },   [18]  > { 11,  [21]  } }")
        expect(result.msg).toEqual("Found Target 21 and Parent 18")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 3)
        expect(stepHelper.simplify(result.root)).toEqual("  [9]  > {  1 > { null, 8 },   [18]  > { 11,  [21]  } }")
        expect(result.msg).toEqual("Deleting root's right child 21")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 4)
        expect(stepHelper.simplify(result.root)).toEqual("  [9]  > {  1 > { null, 8 },   [18]  > { 11, null } }")
        expect(result.msg).toEqual("Target 21 deleted")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 5)
        expect(stepHelper.simplify(result.root)).toEqual(" 9 > {  1 > { null, 8 },  18 > { 11, null } }")
        expect(result.msg).toEqual("Reset Root")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 6)
        expect(stepHelper.simplify(result.root)).toEqual(" 9 > {  1 > { null, 8 },  18 > { 11, null } }")
        expect(result.msg).toEqual("Reset Root")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 7)
        expect(stepHelper.simplify(result.root)).toEqual(" 9 > {  1 > { null, 8 },  18 > { 11, null } }")
        expect(result.msg).toEqual("")
        expect(result.done).toEqual(true)
    })
    it('Deleting a full root', ()=>{
        const nodes = stepHelper.genNodeHash([ 21, 1, 9, 11, 8, 18])

        const root = AVLTreeInsert.balanceInsertNodes(nodes)
    
        const targetNode = {deleteValue: 18, deleteIndex: 5}
    
        let result = AVLTreeDelete.stepDelete(root,  targetNode, 0)
        expect(stepHelper.simplify(result.root)).toEqual("  [9]  > {  1 > { null, 8 },  18 > { 11, 21 } }")
        expect(result.msg).toEqual("Searching for Target 18 and it's parent")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 1)
        expect(stepHelper.simplify(result.root)).toEqual("  [9]  > {  1 > { null, 8 },   [18]  > { 11, 21 } }")
        expect(result.msg).toEqual("Found Target 18 and Parent 9")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 2)
        expect(stepHelper.simplify(result.root)).toEqual("  [9]  > {  1 > { null, 8 },  21 > { 11, null } }" )
        expect(result.msg).toEqual("Replacing target 18 with 21")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 3)
        expect(stepHelper.simplify(result.root)).toEqual("  [9]  > {  1 > { null, 8 },  21 > { 11, null } }")
        expect(result.msg).toEqual("Deleting Target 18")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 4)
        expect(stepHelper.simplify(result.root)).toEqual(" 9 > {  1 > { null, 8 },  21 > { 11, null } }")
        expect(result.msg).toEqual("Reset Root")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 5)
        expect(stepHelper.simplify(result.root)).toEqual(" 9 > {  1 > { null, 8 },  21 > { 11, null } }")
        expect(result.msg).toEqual("Reset Root")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode,  6)
        expect(stepHelper.simplify(result.root)).toEqual(" 9 > {  1 > { null, 8 },  21 > { 11, null } }")
        expect(result.msg).toEqual("")
        expect(result.done).toEqual(true)

    })
    it("Deleting root with only a right child", ()=>{
        const nodes = stepHelper.genNodeHash([ 21, 1, 9, 11, 8, 18])

        const root = AVLTreeInsert.balanceInsertNodes(nodes)
    
        const targetNode = {deleteValue: 1, deleteIndex: 1}
    
        let result = AVLTreeDelete.stepDelete(root,  targetNode, 0)
        expect(stepHelper.simplify(result.root)).toEqual("  [9]  > {  1 > { null, 8 },  18 > { 11, 21 } }")
        expect(result.msg).toEqual("Searching for Target 1 and it's parent")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 1)
        expect(stepHelper.simplify(result.root)).toEqual("  [9]  > {   [1]  > { null, 8 },  18 > { 11, 21 } }")
        expect(result.msg).toEqual("Found Target 1 and Parent 9")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 2)
        expect(stepHelper.simplify(result.root)).toEqual("  [9]  > {   [1]  > { null, 8 },  18 > { 11, 21 } }")
        expect(result.msg).toEqual("Deleting target by replacing it with it's right child"
        )
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 3)
        expect(stepHelper.simplify(result.root)).toEqual("  [9]  > { 8,  18 > { 11, 21 } }")
        expect(result.msg).toEqual("Deleting Target 1")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 4)
        expect(stepHelper.simplify(result.root)).toEqual(" 9 > { 8,  18 > { 11, 21 } }")
        expect(result.msg).toEqual("Reset Root")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 5)
        expect(stepHelper.simplify(result.root)).toEqual(" 9 > { 8,  18 > { 11, 21 } }")
        expect(result.msg).toEqual("Reset Root")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode,  6)
        expect(stepHelper.simplify(result.root)).toEqual(" 9 > { 8,  18 > { 11, 21 } }")
        expect(result.msg).toEqual("")
        expect(result.done).toEqual(true)

    })
    it("Deleting root with only a left child", ()=>{
        const nodes = stepHelper.genNodeHash([ 21,11,1,14])

        const root = AVLTreeInsert.balanceInsertNodes(nodes)
    
        const targetNode = {deleteValue: 21, deleteIndex: 0}
    
        let result = AVLTreeDelete.stepDelete(root,  targetNode, 0)
        expect(stepHelper.simplify(result.root)).toEqual("  [11]  > { 1,  21 > { 14, null } }")
        expect(result.msg).toEqual("Searching for Target 21 and it's parent")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 1)
        expect(stepHelper.simplify(result.root)).toEqual("  [11]  > { 1,   [21]  > { 14, null } }")
        expect(result.msg).toEqual("Found Target 21 and Parent 11")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 2)
        expect(stepHelper.simplify(result.root)).toEqual("  [11]  > { 1,   [21]  > { 14, null } }")
        expect(result.msg).toEqual("Deleting target by replacing it with it's left child")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 3)
        expect(stepHelper.simplify(result.root)).toEqual("  [11]  > { 1, 14 }")
        expect(result.msg).toEqual("Deleting Target 21")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 4)
        expect(stepHelper.simplify(result.root)).toEqual(" 11 > { 1, 14 }")
        expect(result.msg).toEqual("Reset Root")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 5)
        expect(stepHelper.simplify(result.root)).toEqual(" 11 > { 1, 14 }")
        expect(result.msg).toEqual("Reset Root")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode,  6)
        expect(stepHelper.simplify(result.root)).toEqual(" 11 > { 1, 14 }")
        expect(result.msg).toEqual("")
        expect(result.done).toEqual(true)

    })
    it("Deleting root with both children", ()=>{
        
        const nodes = stepHelper.genNodeHash([ 21,11,1,14,30])

        const root = AVLTreeInsert.balanceInsertNodes(nodes)
    
        const targetNode = {deleteValue: 21, deleteIndex: 0}
    
        let result = AVLTreeDelete.stepDelete(root,  targetNode, 0)
        expect(stepHelper.simplify(result.root)).toEqual("  [11]  > { 1,  21 > { 14, 30 } }")
        expect(result.msg).toEqual("Searching for Target 21 and it's parent")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 1)
        expect(stepHelper.simplify(result.root)).toEqual("  [11]  > { 1,   [21]  > { 14, 30 } }")
        expect(result.msg).toEqual("Found Target 21 and Parent 11")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 2)
        expect(stepHelper.simplify(result.root)).toEqual("  [11]  > { 1,  30 > { 14, null } }")
        expect(result.msg).toEqual("Replacing target 21 with 30")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 3)
        expect(stepHelper.simplify(result.root)).toEqual("  [11]  > { 1,  30 > { 14, null } }")
        expect(result.msg).toEqual("Deleting Target 21")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 4)
        expect(stepHelper.simplify(result.root)).toEqual(" 11 > { 1,  30 > { 14, null } }")
        expect(result.msg).toEqual("Reset Root")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 5)
        expect(stepHelper.simplify(result.root)).toEqual(" 11 > { 1,  30 > { 14, null } }")
        expect(result.msg).toEqual("Reset Root")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode,  6)
        expect(stepHelper.simplify(result.root)).toEqual(" 11 > { 1,  30 > { 14, null } }")
        expect(result.msg).toEqual("")
        expect(result.done).toEqual(true)

    })
    it("Deleting main root node (test1)", ()=>{
        
        const nodes = stepHelper.genNodeHash([ 21,11,1,14,30])

        const root = AVLTreeInsert.balanceInsertNodes(nodes)
    
        const targetNode = {deleteValue: 11, deleteIndex: 1}
    
        let result = AVLTreeDelete.stepDelete(root,  targetNode, 0)
        expect(stepHelper.simplify(result.root)).toEqual("  [11]  > { 1,  21 > { 14, 30 } }")
        expect(result.msg).toEqual("Found Target 11 ")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 1)
        expect(stepHelper.simplify(result.root)).toEqual(" 14 > { 1,  21 > { null, 30 } }")
        expect(result.msg).toEqual("Replacing target 11 with 14")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 2)
        expect(stepHelper.simplify(result.root)).toEqual(" 14 > { 1,  21 > { null, 30 } }")
        expect(result.msg).toEqual("Deleting Target 11")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 3)
        expect(stepHelper.simplify(result.root)).toEqual(" 14 > { 1,  21 > { null, 30 } }")
        expect(result.msg).toEqual("Reset Root")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 4)
        expect(stepHelper.simplify(result.root)).toEqual(" 14 > { 1,  21 > { null, 30 } }")
        expect(result.msg).toEqual("Reset Root")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 5)
        expect(stepHelper.simplify(result.root)).toEqual(" 14 > { 1,  21 > { null, 30 } }")
        expect(result.msg).toEqual("")
        expect(result.done).toEqual(true)

        result = AVLTreeDelete.stepDelete(root,  targetNode,  6)
        expect(stepHelper.simplify(result.root)).toEqual(" 14 > { 1,  21 > { null, 30 } }")
        expect(result.msg).toEqual("")
        expect(result.done).toEqual(true)

    })
    it("Deleting main root node (test2)", ()=>{
        
        const nodes = stepHelper.genNodeHash([ 21,2,3,4])

        const root = AVLTreeInsert.balanceInsertNodes(nodes)
    
        const targetNode = {deleteValue: 3, deleteIndex: 2}
    
        let result = AVLTreeDelete.stepDelete(root,  targetNode, 0)
        expect(stepHelper.simplify(result.root)).toEqual("  [3]  > { 2,  21 > { 4, null } }")
        expect(result.msg).toEqual("Found Target 3 ")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 1)
        expect(stepHelper.simplify(result.root)).toEqual(" 4 > { 2, 21 }")
        expect(result.msg).toEqual("Replacing target 3 with 4")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 2)
        expect(stepHelper.simplify(result.root)).toEqual(" 4 > { 2, 21 }")
        expect(result.msg).toEqual("Deleting Target 3")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 3)
        expect(stepHelper.simplify(result.root)).toEqual(" 4 > { 2, 21 }")
        expect(result.msg).toEqual("Reset Root")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 4)
        expect(stepHelper.simplify(result.root)).toEqual(" 4 > { 2, 21 }")
        expect(result.msg).toEqual("Reset Root")
        expect(result.done).toEqual(false)

        result = AVLTreeDelete.stepDelete(root,  targetNode, 5)
        expect(stepHelper.simplify(result.root)).toEqual(" 4 > { 2, 21 }")
        expect(result.msg).toEqual("")
        expect(result.done).toEqual(true)

        result = AVLTreeDelete.stepDelete(root,  targetNode,  6)
        expect(stepHelper.simplify(result.root)).toEqual(" 4 > { 2, 21 }")
        expect(result.msg).toEqual("")
        expect(result.done).toEqual(true)

    })
})

