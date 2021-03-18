import * as balance from '../components/d3/AVLTree/steps/balance'
import * as insert from '../components/d3/AVLTree/steps/insert'
import * as stepHelper from '../components/d3/AVLTree/steps/step-helper'

it('', () => { })

describe('balance', () => {

    it('balance a "backslash" root', () => {
        const nodes = stepHelper.genNodeHash([1, 9, 21])

        const root = stepHelper.insertWithoutBalance(nodes)

        let result = balance.stepBalance(root, { value: 21 }, 0)
        expect(stepHelper.simplify(result.root)).toEqual(" 1 > { null,  9 > { null, 21 } }")
        expect(result.msg).toEqual("Balancing path from node 21")
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 21 }, 1)
        expect(stepHelper.simplify(result.root)).toEqual(" 1 > { null,  9 > { null,  [21]  } }")
        expect(result.msg).toEqual("Checking if node 21 is balanced")
        expect(result.done).toEqual(true)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 21 }, 2)
        expect(stepHelper.simplify(result.root)).toEqual(" 1 > { null,   [9]  > { null,  [21]  } }")
        expect(result.msg).toEqual("Checking if node 9 is balanced")
        expect(result.done).toEqual(true)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 21 }, 3)
        expect(stepHelper.simplify(result.root)).toEqual("  [1]  > { null,   [9]  > { null,  [21]  } }")
        expect(result.msg).toEqual("Checking if node 1 is balanced")
        expect(result.done).toEqual(false)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 21 }, 4)
        expect(stepHelper.simplify(result.root)).toEqual("  [1]  > { null,   [9]  > { null,  [21]  } }")
        expect(result.msg).toEqual("Node 1 is left heavy, rotating left")
        expect(result.done).toEqual(false)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 21 }, 5)
        expect(stepHelper.simplify(result.root)).toEqual("  [9]  > {  [1] ,  [21]  }")
        expect(result.msg).toEqual("Node 1 is now balanced")
        expect(result.done).toEqual(false)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 21 }, 6)
        expect(stepHelper.simplify(result.root)).toEqual(" 9 > { 1, 21 }")
        expect(result.msg).toEqual("")
        expect(result.done).toEqual(true)
        expect(result.taskCompleted).toEqual(true)


    })
    it('balance a "forward slash" root', () => {
        const nodes = stepHelper.genNodeHash([21, 9, 1])

        const root = stepHelper.insertWithoutBalance(nodes)

        let result = balance.stepBalance(root, { value: 1 }, 0)
        expect(stepHelper.simplify(result.root)).toEqual(" 21 > {  9 > { 1, null }, null }")
        expect(result.msg).toEqual("Balancing path from node 1")
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 1 }, 1)
        expect(stepHelper.simplify(result.root)).toEqual(" 21 > {  9 > {  [1] , null }, null }")
        expect(result.msg).toEqual("Checking if node 1 is balanced")
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 1 }, 2)
        expect(stepHelper.simplify(result.root)).toEqual(" 21 > {   [9]  > {  [1] , null }, null }")
        expect(result.msg).toEqual("Checking if node 9 is balanced")
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 1 }, 3)
        expect(stepHelper.simplify(result.root)).toEqual("  [21]  > {   [9]  > {  [1] , null }, null }")
        expect(result.msg).toEqual("Checking if node 21 is balanced")
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 1 }, 4)
        expect(stepHelper.simplify(result.root)).toEqual("  [21]  > {   [9]  > {  [1] , null }, null }")
        expect(result.msg).toEqual("Node 21 is right heavy, rotating right")
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 1 }, 5)
        expect(stepHelper.simplify(result.root)).toEqual("  [9]  > {  [1] ,  [21]  }")
        expect(result.msg).toEqual("Node 21 is now balanced")
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 1 }, 6)
        expect(stepHelper.simplify(result.root)).toEqual(" 9 > { 1, 21 }")
        expect(result.msg).toEqual("")
        expect(result.taskCompleted).toEqual(true)
    })
    it('balance a "less than" root', () => {
        const nodes = stepHelper.genNodeHash([21, 1, 9])

        const root = stepHelper.insertWithoutBalance(nodes)

        let result = balance.stepBalance(root, { value: 9 }, 0)
        expect(stepHelper.simplify(result.root)).toEqual(" 21 > {  1 > { null, 9 }, null }")
        expect(result.msg).toEqual("Balancing path from node 9")
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 9 }, 1)
        expect(stepHelper.simplify(result.root)).toEqual(" 21 > {  1 > { null,  [9]  }, null }")
        expect(result.msg).toEqual("Checking if node 9 is balanced")
        expect(result.done).toEqual(true)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 9 }, 2)
        expect(stepHelper.simplify(result.root)).toEqual(" 21 > {   [1]  > { null,  [9]  }, null }")
        expect(result.msg).toEqual("Checking if node 1 is balanced")
        expect(result.done).toEqual(true)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 9 }, 3)
        expect(stepHelper.simplify(result.root)).toEqual("  [21]  > {   [1]  > { null,  [9]  }, null }")
        expect(result.msg).toEqual("Checking if node 21 is balanced")
        expect(result.done).toEqual(false)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 9 }, 4)
        expect(stepHelper.simplify(result.root)).toEqual("  [21]  > {   [1]  > { null,  [9]  }, null }")
        expect(result.msg).toEqual("Node 21 is left heavy, rotating left at 1")
        expect(result.done).toEqual(false)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 9 }, 5)
        expect(stepHelper.simplify(result.root)).toEqual("  [21]  > {   [9]  > {  [1] , null }, null }")
        expect(result.msg).toEqual("Node 21 is right heavy, rotating right")
        expect(result.done).toEqual(false)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 9 }, 6)
        expect(stepHelper.simplify(result.root)).toEqual("  [9]  > {  [1] ,  [21]  }")
        expect(result.msg).toEqual("Node 21 is now balanced")
        expect(result.done).toEqual(false)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 9 }, 7)
        expect(stepHelper.simplify(result.root)).toEqual(" 9 > { 1, 21 }")
        expect(result.msg).toEqual("")
        expect(result.done).toEqual(true)
        expect(result.taskCompleted).toEqual(true)
    })
    it('balance a "greater than" root', () => {
        const nodes = stepHelper.genNodeHash([1, 21, 9])

        const root = stepHelper.insertWithoutBalance(nodes)

        let result = balance.stepBalance(root, { value: 9 }, 0)
        expect(stepHelper.simplify(result.root)).toEqual(" 1 > { null,  21 > { 9, null } }")
        expect(result.msg).toEqual("Balancing path from node 9")
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 9 }, 1)
        expect(stepHelper.simplify(result.root)).toEqual(" 1 > { null,  21 > {  [9] , null } }")
        expect(result.msg).toEqual("Checking if node 9 is balanced")
        expect(result.done).toEqual(true)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 9 }, 2)
        expect(stepHelper.simplify(result.root)).toEqual(" 1 > { null,   [21]  > {  [9] , null } }")
        expect(result.msg).toEqual("Checking if node 21 is balanced")
        expect(result.done).toEqual(true)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 9 }, 3)
        expect(stepHelper.simplify(result.root)).toEqual("  [1]  > { null,   [21]  > {  [9] , null } }")
        expect(result.msg).toEqual("Checking if node 1 is balanced")
        expect(result.done).toEqual(false)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 9 }, 4)
        expect(stepHelper.simplify(result.root)).toEqual("  [1]  > { null,   [21]  > {  [9] , null } }")
        expect(result.msg).toEqual("Node 1 is right heavy, rotating right at 21")
        expect(result.done).toEqual(false)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 9 }, 5)
        expect(stepHelper.simplify(result.root)).toEqual("  [1]  > { null,   [9]  > { null,  [21]  } }")
        expect(result.msg).toEqual("Node 1 is left heavy, rotating left")
        expect(result.done).toEqual(false)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 9 }, 6)
        expect(stepHelper.simplify(result.root)).toEqual("  [9]  > {  [1] ,  [21]  }")
        expect(result.msg).toEqual("Node 1 is now balanced")
        expect(result.done).toEqual(false)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 9 }, 7)
        expect(stepHelper.simplify(result.root)).toEqual(" 9 > { 1, 21 }")
        expect(result.msg).toEqual("")
        expect(result.done).toEqual(true)
        expect(result.taskCompleted).toEqual(true)

    })
    it('balance a sub root', () => {
        const nodes = stepHelper.genNodeHash([9, 15, 27, 35])

        let root = insert.balanceInsertNodes(nodes)

        root = stepHelper.insert(root, { value: 38, index: 5 })

        let result = balance.stepBalance(root, { value: 38 }, 0)
        expect(stepHelper.simplify(result.root)).toEqual(" 15 > { 9,  27 > { null,  35 > { null, 38 } } }")
        expect(result.msg).toEqual("Balancing path from node 38")
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 38 }, 1)
        expect(stepHelper.simplify(result.root)).toEqual(" 15 > { 9,  27 > { null,  35 > { null,  [38]  } } }")
        expect(result.msg).toEqual("Checking if node 38 is balanced")
        expect(result.done).toEqual(true)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 38 }, 2)
        expect(stepHelper.simplify(result.root)).toEqual(" 15 > { 9,  27 > { null,   [35]  > { null,  [38]  } } }")
        expect(result.msg).toEqual("Checking if node 35 is balanced")
        expect(result.done).toEqual(true)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 38 }, 3)
        expect(stepHelper.simplify(result.root)).toEqual(" 15 > { 9,   [27]  > { null,   [35]  > { null,  [38]  } } }")
        expect(result.msg).toEqual("Checking if node 27 is balanced")
        expect(result.done).toEqual(true)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 38 }, 4)
        expect(stepHelper.simplify(result.root)).toEqual(" 15 > { 9,   [27]  > { null,   [35]  > { null,  [38]  } } }")
        expect(result.msg).toEqual("Node 27 is left heavy, rotating left")
        expect(result.done).toEqual(true)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 38 }, 5)
        expect(stepHelper.simplify(result.root)).toEqual(" 15 > { 9,   [35]  > {  [27] ,  [38]  } }")
        expect(result.msg).toEqual("Node 27 is now balanced")
        expect(result.done).toEqual(true)
        expect(result.taskCompleted).toEqual(false)


        result = balance.stepBalance(root, { value: 38 }, 6)
        expect(stepHelper.simplify(result.root)).toEqual("  [15]  > { 9,  35 > { 27, 38 } }")
        expect(result.msg).toEqual("Checking if node 15 is balanced")
        expect(result.done).toEqual(false)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 38 }, 7)
        expect(stepHelper.simplify(result.root)).toEqual(" 15 > { 9,  35 > { 27, 38 } }" )
        expect(result.msg).toEqual("Root 15 is balanced")
        expect(result.done).toEqual(true)
        expect(result.taskCompleted).toEqual(true)

        result = balance.stepBalance(root, { value: 38 }, 8)
        expect(stepHelper.simplify(result.root)).toEqual(" 15 > { 9,  35 > { 27, 38 } }" )
        expect(result.msg).toEqual("Root 15 is balanced")
        expect(result.done).toEqual(true)
        expect(result.taskCompleted).toEqual(true)
    })
    it('balance a sub sub root', () => {
        const nodes = stepHelper.genNodeHash([9, 15, 27, 35, 38, 39, 40, 42])

        let root = insert.balanceInsertNodes(nodes)

        root = stepHelper.insert(root, { value: 43, index: 9 })

        let result = balance.stepBalance(root, { value: 43 }, 0)
        expect(stepHelper.simplify(result.root)).toEqual(" 35 > {  15 > { 9, 27 },  39 > { 38,  40 > { null,  42 > { null, 43 } } } }")
        expect(result.msg).toEqual("Balancing path from node 43")
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 43 }, 1)
        expect(stepHelper.simplify(result.root)).toEqual(" 35 > {  15 > { 9, 27 },  39 > { 38,  40 > { null,  42 > { null,  [43]  } } } }")
        expect(result.msg).toEqual("Checking if node 43 is balanced")
        expect(result.done).toEqual(true)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 43 }, 2)
        expect(stepHelper.simplify(result.root)).toEqual(" 35 > {  15 > { 9, 27 },  39 > { 38,  40 > { null,   [42]  > { null,  [43]  } } } }")
        expect(result.msg).toEqual("Checking if node 42 is balanced")
        expect(result.done).toEqual(true)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 43 }, 3)
        expect(stepHelper.simplify(result.root)).toEqual(" 35 > {  15 > { 9, 27 },  39 > { 38,   [40]  > { null,   [42]  > { null,  [43]  } } } }")
        expect(result.msg).toEqual("Checking if node 40 is balanced")
        expect(result.done).toEqual(true)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 43 }, 4)
        expect(stepHelper.simplify(result.root)).toEqual(" 35 > {  15 > { 9, 27 },  39 > { 38,   [40]  > { null,   [42]  > { null,  [43]  } } } }")
        expect(result.msg).toEqual("Node 40 is left heavy, rotating left")
        expect(result.done).toEqual(true)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 43 }, 5)
        expect(stepHelper.simplify(result.root)).toEqual(" 35 > {  15 > { 9, 27 },  39 > { 38,   [42]  > {  [40] ,  [43]  } } }")
        expect(result.msg).toEqual("Node 40 is now balanced")
        expect(result.done).toEqual(true)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 43 }, 6)
        expect(stepHelper.simplify(result.root)).toEqual(" 35 > {  15 > { 9, 27 },   [39]  > { 38,  42 > { 40, 43 } } }")
        expect(result.msg).toEqual("Checking if node 39 is balanced")
        expect(result.done).toEqual(true)
        expect(result.taskCompleted).toEqual(false)
        
        result = balance.stepBalance(root, { value: 43 }, 7)
        expect(stepHelper.simplify(result.root)).toEqual("  [35]  > {  15 > { 9, 27 },   [39]  > { 38,  42 > { 40, 43 } } }")
        expect(result.msg).toEqual("Checking if node 35 is balanced")
        expect(result.done).toEqual(false)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 43 }, 8)
        expect(stepHelper.simplify(result.root)).toEqual(" 35 > {  15 > { 9, 27 },  39 > { 38,  42 > { 40, 43 } } }")
        expect(result.msg).toEqual("Root 35 is balanced")
        expect(result.done).toEqual(true)
        expect(result.taskCompleted).toEqual(true)
    })


    it('balance a sub sub root', () => {
        const nodes = stepHelper.genNodeHash([
            21,  2,  4, 23, 26,
            28, 30, 31, 32, 33,
            34, 36, 38, 11, 12,
             ] )

        let root = insert.balanceInsertNodes(nodes)

        root = stepHelper.insert(root, { value: 14, index: 16 })

        let result = balance.stepBalance(root, { value: 14 }, 0)
        expect(stepHelper.simplify(result.root)).toEqual(" 31 > {  23 > {  4 > { 2,  12 > { 11,  21 > { 14, null } } },  28 > { 26, 30 } },  33 > { 32,  36 > { 34, 38 } } }")
        expect(result.msg).toEqual("Balancing path from node 14")
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 14 }, 1)
        expect(stepHelper.simplify(result.root)).toEqual(" 31 > {  23 > {  4 > { 2,  12 > { 11,  21 > {  [14] , null } } },  28 > { 26, 30 } },  33 > { 32,  36 > { 34, 38 } } }")
        expect(result.msg).toEqual("Checking if node 14 is balanced")
        expect(result.done).toEqual(true)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 14 }, 2)
        expect(stepHelper.simplify(result.root)).toEqual(" 31 > {  23 > {  4 > { 2,  12 > { 11,   [21]  > {  [14] , null } } },  28 > { 26, 30 } },  33 > { 32,  36 > { 34, 38 } } }")
        expect(result.msg).toEqual("Checking if node 21 is balanced")
        expect(result.done).toEqual(true)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 14 }, 3)
        expect(stepHelper.simplify(result.root)).toEqual(" 31 > {  23 > {  4 > { 2,   [12]  > { 11,   [21]  > {  [14] , null } } },  28 > { 26, 30 } },  33 > { 32,  36 > { 34, 38 } } }")
        expect(result.msg).toEqual("Checking if node 12 is balanced")
        expect(result.done).toEqual(true)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 14 }, 4)
        expect(stepHelper.simplify(result.root)).toEqual(" 31 > {  23 > {   [4]  > { 2,   [12]  > { 11,   [21]  > {  [14] , null } } },  28 > { 26, 30 } },  33 > { 32,  36 > { 34, 38 } } }")
        expect(result.msg).toEqual( "Checking if node 4 is balanced")
        expect(result.done).toEqual(true)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 14 }, 5)
        expect(stepHelper.simplify(result.root)).toEqual(" 31 > {  23 > {   [4]  > { 2,   [12]  > { 11,   [21]  > {  [14] , null } } },  28 > { 26, 30 } },  33 > { 32,  36 > { 34, 38 } } }")
        expect(result.msg).toEqual("Node 4 is left heavy, rotating left")
        expect(result.done).toEqual(true)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 14 }, 6)
        expect(stepHelper.simplify(result.root)).toEqual(" 31 > {  23 > {   [12]  > {   [4]  > { 2, 11 },   [21]  > {  [14] , null } },  28 > { 26, 30 } },  33 > { 32,  36 > { 34, 38 } } }")
        expect(result.msg).toEqual("Node 4 is now balanced")
        expect(result.done).toEqual(true)
        expect(result.taskCompleted).toEqual(false)
        
        result = balance.stepBalance(root, { value: 14 }, 7)
        expect(stepHelper.simplify(result.root)).toEqual(" 31 > {   [23]  > {  12 > {  4 > { 2, 11 },  21 > { 14, null } },  28 > { 26, 30 } },  33 > { 32,  36 > { 34, 38 } } }" )
        expect(result.msg).toEqual("Checking if node 23 is balanced")
        expect(result.done).toEqual(true)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 14 }, 8)
        expect(stepHelper.simplify(result.root)).toEqual("  [31]  > {   [23]  > {  12 > {  4 > { 2, 11 },  21 > { 14, null } },  28 > { 26, 30 } },  33 > { 32,  36 > { 34, 38 } } }")
        expect(result.msg).toEqual("Checking if node 31 is balanced")
        expect(result.done).toEqual(false)
        expect(result.taskCompleted).toEqual(false)

        result = balance.stepBalance(root, { value: 14 }, 9)
        expect(stepHelper.simplify(result.root)).toEqual(" 31 > {  23 > {  12 > {  4 > { 2, 11 },  21 > { 14, null } },  28 > { 26, 30 } },  33 > { 32,  36 > { 34, 38 } } }" )
        expect(result.msg).toEqual("Root 31 is balanced")
        expect(result.done).toEqual(true)
        expect(result.taskCompleted).toEqual(true)
    })

})