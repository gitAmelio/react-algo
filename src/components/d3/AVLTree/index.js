import React, { useRef, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { select } from 'd3-selection'



import {
    clearAll, textChanged,
    avlInsert, avlDelete, avlBalance, avlSetMode, deleteTextChanged,
    toggleStepping, stepUp, stepDown
} from './actions'

import { pageChange } from '../../../actions'
import useResizeObserver from '../../../useResizeObserver'
import { showSelection } from '../Selections/selections'
import { AVLTreeDS } from './AVLTreeDS'

import './avltree.css'
import AlgoSVG from '../../AlgoSVG'
import { findRoot } from './steps/step-helper'
import * as stepper from './steps/stepper'

import Gears from '../../Gears'


const AVLTree = (props) => {

    const { avl, avlTree, avlTreeInputs } = props
    const { stepping } = avl

    const [selection, setSelection] = useState(null)

    const upButton = useRef(null)
    const downButton = useRef(null)
    const stepMessage = useRef(null)

    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef)

    const insertRefStep = useRef(0)
    const balanceRefStep = useRef(0)
    const deleteRefStep = useRef(0)

    const graph = useRef({})

    const insertButtonPressed = useRef(false)
    const deleteButtonPressed = useRef(false)

    const inputValue = useRef('')

    useEffect(() => {
        if (!selection) {

            setSelection(select(wrapperRef.current))

        } else {

            if (!dimensions) return

            const svg = selection;

            let tree = new AVLTreeDS();

            if (stepping && avl.root) {
                const stepRoot = { ...avl.stepRoot.root, width: 0, leftSide: 0, rightSide: 0 }
                tree.updateTree2(stepRoot, dimensions)
                stepMessage.current = avl.stepRoot.msg
            } else {
                tree.updateTree2(avl.root, dimensions)
                stepMessage.current = avl.msg
            }

            graph.current = {
                ...graph.current,
                nodes: tree.nodesSortedByIndex,
                links: tree.links,
                nodeType: 'circle',
                linkType: 'line',
                tree,
                msg: stepMessage.current
            }

            showSelection(svg, graph)

            insertRefStep.current = tree.insertRefStep
            balanceRefStep.current = tree.balanceRefStep
            deleteRefStep.current = tree.deleteRefStep

            if (stepping) {
                stepper.steps(avl)
            } else {
                if (!avl.done) {
                    setTimeout(() => {
                        switch (avl.mode) {
                            case 'insert':
                                props.avlInsert()
                                break
                            case 'delete':
                                props.avlDelete()
                                break
                            case 'balance':
                                props.avlBalance()
                                break
                            default:
                                break
                        }

                    }, 400)
                }
            }

        }
    }, [avl, selection, avlTree, avlTreeInputs, dimensions, props, stepping])

    const handleInsertWithMode = (el) => {

        if (!avl.root || !findRoot(avl.root, avl.value)) {
            insertButtonPressed.current = true
            props.avlSetMode('insert')
        }
    }

    const handleDeleteWithMode = (el) => {
        if (avl.root || findRoot(avl.root, avl.deleteValue)) {
            insertButtonPressed.current = true
            props.avlSetMode('delete')
        }
    }

    const inputLength = (value) => value ? value.toString().length : 0

    const disableInsert = () => {
        if (avl.done) insertButtonPressed.current = false
        return !(
            !insertButtonPressed.current &&
            !isNaN(avl.value) &&
            inputLength(avl.value) !== 0 &&
            inputLength(avl.value) < 5 &&
            (!avl.root || !findRoot(avl.root, avl.value))
        )
    }

    const disableDelete = () => {
        if (avl.done) deleteButtonPressed.current = false
        return !(
            !deleteButtonPressed.current &&
            !isNaN(avl.value) &&
            inputLength(avl.deleteValue) !== 0 &&
            inputLength(avl.deleteValue) < 5 &&
            findRoot(avl.root, avl.deleteValue)
        )
    }

    const handleStepping = () => {
        if (avl.root) props.toggleStepping()
    }

    const insertErrors = () => {
        if (findRoot(avl.root, avl.value)) return 'Value already exist.'
        return null
    }
    const deleteErrors = () => {
        if (avl.deleteValue !== "" && !findRoot(avl.root, avl.deleteValue)) return 'Value is not in tree'
        return null
    }
    const errors = () => {
        return insertErrors() || deleteErrors()
    }

    const displayStatus = (msg) => {

        const err = errors()
        if (!avl.done || stepping) {
            if (msg !== '') {
                return (
                    <div className="status">
                        <p >
                            {msg}
                        </p>
                    </div>
                )
            }
        } else if (err) {
            return (
                <div className="status">
                    <p >
                        {err}
                    </p>
                </div>
            )
        }


    }

    const stepUp = () => {
        props.stepUp()
    }
    const stepDown = () => {
        props.stepDown()
    }

    const handleTextChanged = (el) => {
        inputValue.current = avl.value
        props.textChanged(el)
    }

    const busy = () => {
        if ((!avl.done)) return <Gears />
        return null
    }

    return (
        <div className="section-avl">
            <div className="controls" >
                <div className='inputs'>
                    <input placeholder="Enter a new value" id="input-insert" autoComplete="off" name="value" onChange={handleTextChanged} value={avl.value} disabled={(!avl.done || avl.stepping)} />
                    <button id="btn--insert" onClick={handleInsertWithMode} disabled={disableInsert() || stepping}>Insert</button>

                    <input placeholder="Enter a value in tree" id="input-delete" autoComplete="off" name="deleteValue" onChange={props.deleteTextChanged} value={avl.deleteValue} disabled={(!avl.done || avl.stepping)} />
                    <button id="btn--delete" onClick={handleDeleteWithMode} disabled={disableDelete() || stepping}>Delete</button>
                </div>

                <div className='step-buttons'>
                    <button id="btn--step" onClick={handleStepping} disabled={!avl.root}>{stepping ? 'Steps Enabled' : 'Enable Steps'}</button>
                    <button id="btn--backwards" ref={downButton} onClick={stepDown} disabled={!stepping}>Step Back</button>
                    <button id="btn--forwards" ref={upButton} onClick={stepUp} disabled={!stepping}>Step Forward</button>
                </div>

                <button id="btn--clear" onClick={props.clearAll} disabled={stepping || !avl.root}>Clear All</button>

            </div>
            <div ref={wrapperRef} className="svg-wrapper">
                <div className="status-box">
                    {displayStatus(stepMessage.current)}
                    {busy()}
                </div>
                <AlgoSVG />
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(
    mapStateToProps, {
    clearAll, textChanged,
    avlInsert, avlDelete, avlBalance, avlSetMode, deleteTextChanged,
    toggleStepping, stepUp, stepDown,
    pageChange
}
)(AVLTree);
