import * as Balance from '../steps/balance'
import * as Insert from '../steps/insert'
import * as Delete from '../steps/delete'
import * as stepHelper from '../steps/step-helper'

const hashNodes = (history, stepIndex) => {
    if (!history) return null

    let array = []
    for (let index in history) {
        const record = history[index]
        if (record && record.focusValue && record.modeStep === 1 && record.mode !== 'balance' && index <= stepIndex) {
            console.log('hashNodes > record', record)
            if (record.mode === 'delete') {
                array = array.filter(node => node.value !== record.focusValue)
            } else {
                array.push({ value: record.focusValue, index: record.index })
            }
        }
    }
    return array
}

export const balanceStepper = (history, stepIndex, step = 0) => {
    const nodes = hashNodes(history, stepIndex)
    const nodesWithoutLast = nodes.slice(0, nodes.length - 1)
    const last = nodes[nodes.length - 1]

    if (!last) return null

    let root = Insert.balanceInsertNodes(nodesWithoutLast)
    root = stepHelper.insertWithoutBalance([last], root)

    return Balance.stepBalance(root, last, step)

}

export const insertStepper = (history, stepIndex, step = 0) => {

    const nodes = hashNodes(history, stepIndex)
    const frontNodes = nodes.slice(0, nodes.length - 1)
    const stepHistory = history[stepIndex]
    const last = {
        value: stepHistory.focusValue,
        index: stepHistory.index
    }

    const root = Insert.balanceInsertNodes(frontNodes)

    return Insert.stepInsert(root, last, step)

}

export const deleteStepper = (history, stepIndex, step = 0) => {

    const nodes = hashNodes(history, stepIndex)

    const last = nodes.slice(nodes.length - 1)

    const root = Insert.balanceInsertNodes(nodes)

    return Delete.stepDelete(
        root,
        { deleteValue: last.value, delete: last.index },
        step
    )

}

export const compactHistory = (history) => {
    let newHistory = {}
    let idx = 0

    for (let key in history) {
        const entry = history[key]

        if (entry.mode !== '') {
            newHistory[idx] = entry
            idx++
        }
    }
    return {newHistory, maxIndex: idx}
}


export const steps = (avl) => {

    const { history, stepIndex } = avl
    let stepNumber = stepIndex

    const {
        newHistory, 
        maxIndex: idx
    } = compactHistory(history) 

    console.log('idx', idx)
    console.log('stepNumber', stepNumber)
    
    if (stepNumber > idx - 1) stepNumber = idx - 1
    console.log('stepNumber', stepNumber)

    const step = newHistory[stepNumber]
    if (!step) return null
    const { modeStep } = step

    console.log('history >> ', history)
    console.log('New history >> ', newHistory)


    switch (step.mode) {
        case 'insert':
            console.log('insert >> ', stepNumber, step)
            return insertStepper(newHistory, stepNumber, modeStep)
        case 'delete':
            console.log('delete >> ', stepNumber, step)
            return deleteStepper(history, avl.stepIndex, modeStep)
        case 'balance':
            console.log('balance >> ', stepNumber, step)
            return balanceStepper(newHistory, stepNumber, modeStep)
        case '':
            if (avl.root) {
                console.log('balance >> ', stepNumber, step)
                return balanceStepper(newHistory, stepNumber, modeStep)
            }
            break
        default:
             return
    }
}