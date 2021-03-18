import * as insert from '../components/d3/AVLTree/steps/insert'
import * as stepHelper from '../components/d3/AVLTree/steps/step-helper'

describe('insert',()=>{

    // it('allow to step insert value to a empty tree', ()=>{
        
    //     const nodes = stepHelper.genNodeHash([])

    //     const root = insert.balanceInsertNodes(nodes)

    //     const newNode = {value: 41, index: 7}

    //     let result = insert.stepInsert(root,  newNode, 0 )
    //     expect(stepHelper.simplify(result.root)).toEqual("  [9]  > {  1 > { null, 8 },  18 > { 11, 21 } }")
    //     expect(result.msg).toEqual("Search for a location for 41")
    //     expect(result.done).toEqual(false)
    // })    

    it('allow to step insert value to tree', ()=>{
        
        const nodes = stepHelper.genNodeHash([ 21, 1, 9, 11, 8, 18])

        const root = insert.balanceInsertNodes(nodes)

        const newNode = {value: 41, index: 7}

        let result = insert.stepInsert(root,  newNode, 0 )
        expect(stepHelper.simplify(result.root)).toEqual("  [9]  > {  1 > { null, 8 },  18 > { 11, 21 } }")
        expect(result.msg).toEqual("Search for a location for 41")
        expect(result.done).toEqual(false)

        result = insert.stepInsert(root,  newNode, 1 )
        expect(stepHelper.simplify(result.root)).toEqual("  [9]  > {  1 > { null, 8 },   [18]  > { 11, 21 } }")
        expect(result.msg).toEqual("Search for a location for 41")
        expect(result.done).toEqual(false)

        result = insert.stepInsert(root,  newNode, 2 )
        expect(stepHelper.simplify(result.root)).toEqual("  [9]  > {  1 > { null, 8 },   [18]  > { 11,  [21]  } }")
        expect(result.msg).toEqual("Search for a location for 41")
        expect(result.done).toEqual(false)

        result = insert.stepInsert(root,  newNode, 3 )
        expect(stepHelper.simplify(result.root)).toEqual("  [9]  > {  1 > { null, 8 },   [18]  > { 11,  [21]  } }")
        expect(result.msg).toEqual("Parent found for new leaf 41 at 21")
        expect(result.done).toEqual(false)

        result = insert.stepInsert(root,  newNode, 4 )
        expect(stepHelper.simplify(result.root)).toEqual("  [9]  > {  1 > { null, 8 },   [18]  > { 11,   [21]  > { null, 41 } } }")
        expect(result.msg).toEqual("Inserted 41 to the tree")
        expect(result.done).toEqual(false)

        result = insert.stepInsert(root,  newNode, 5 )
        expect(stepHelper.simplify(result.root)).toEqual(" 9 > {  1 > { null, 8 },  18 > { 11,  21 > { null, 41 } } }")
        expect(result.msg).toEqual("")
        expect(result.done).toEqual(false)

        result = insert.stepInsert(root,  newNode, 6 )
        expect(stepHelper.simplify(result.root)).toEqual(" 9 > {  1 > { null, 8 },  18 > { 11,  21 > { null, 41 } } }")
        expect(result.msg).toEqual("")
        expect(result.done).toEqual(true)

    })
    
})

