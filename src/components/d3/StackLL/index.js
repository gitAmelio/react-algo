import React, { useRef, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { select } from 'd3-selection'
import 'd3-transition'

import { push, pop, clearAll, textChanged } from './actions'
import { updateStep, forward, backward, pause } from '../Stepper/actions'
import { pageChange } from '../../../actions'
import useResizeObserver from '../../../useResizeObserver'
import { showSelection } from '../Selections/selections'
import * as H from '../../../Utils/helpers'
import * as H2 from './stackLL-helpers'
import AlgoSVG from '../../AlgoSVG'
import './stackLL.css'

const StackLLDS = (props) => {

    const { stackLL, stackLLInputs, page } = props
  
    const [selection, setSelection] = useState(null)
    const ref = useRef(null)
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef)
    const graph = useRef({})
    graph.current.stepBuffer = graph.current.stepBuffer || []

    const direction = useRef('')
    const [paused, setPaused] = useState(false)

    const refForward  = useRef(null)
    const refBackward = useRef(null)
    const refPaused   = useRef(null)

    const refPage = useRef('')

    useEffect(() => {

        if (!selection) {
            setSelection(select(ref.current))
        } else {

            if (!dimensions) return

            const svg = selection;

            let devNodes = stackLL;
            let devPaused = paused;

            const nodes = H2.genNodesRecursive(
                devNodes,
                devPaused,
                dimensions,
                H.length(devNodes)
            )

            const links = H2.generateNodeLinks(nodes);

            graph.current = {
                ...graph.current,
                nodes, links,
                paused: devPaused,
                head: true
            }

            showSelection(svg, graph)
            
            if(refPage.current !== page.name){
                showSelection(svg, graph)
            }

            refPage.current = page.name

        }

    }, [selection, stackLL, dimensions, paused, page])

    const getStepBuffer = () => graph.current.stepBuffer
    const appendToStepBuffer = node => graph.current.stepBuffer = [...getStepBuffer(), { ...node }]
    const lastInStepBuffer = () => {
        const buffer = getStepBuffer()
        return buffer[buffer.length - 1]
    }
    const popStepBuffer = () => getStepBuffer().pop();
    const inputValue = node => ({ name: 'value', value: node.val });
    const triggerTextChanged = node => props.textChanged(inputValue(node))
    const stepBufferEmpty = () => H.empty(getStepBuffer())
    const popStackLL = () => props.pop()
    const pushStackLL = () => props.push(true)

    const stepForwardDisabled = () => {
        const bufferLength = getStepBuffer().length
        const lastNode = stackLL[H.length(stackLL) - 1]
        return (bufferLength === 0 && lastNode && lastNode.step === 3) || 
               !paused ||
               (bufferLength === 0 && H.length(stackLL) === 0)
    }

    const disableStepForwardButton = () => refForward.current.disabled = true;
    const enableStepForwardButton = () => refForward.current.disabled = false;

    const handleForward = () => {

        if (paused) {
            refForward.current.disabled = true

            direction.current = 'forward'
            const node = H2.getlastNode(graph.current.nodes);
            disableStepForwardButton()
            if ((!node || node.step === 3)) {
                pushStackLL()
                popStepBuffer()
                if (!stepBufferEmpty()) {
                    const node = lastInStepBuffer()
                    triggerTextChanged(node)
                }
            } else {
                props.forward(graph.current.nodes.length - 1)
            }
            setTimeout(() => {
                enableStepForwardButton()
            }, 1000)
        }

    }

    const stepBackDisabled = () => H.empty(stackLL) || !paused

    const disableStepBackButton = () => refBackward.current.disabled = true;
    const enableStepBackButton = () => refBackward.current.disabled = false;

    const handleBackward = () => {
        const node = H2.getlastNode(graph.current.nodes)
        if (!node) return;
        disableStepBackButton()
        if (paused && node.step === 0) {
            appendToStepBuffer(node)
            popStackLL()
            triggerTextChanged(node)
        }
        direction.current = 'backward'
        props.backward(graph.current.nodes.length - 1)
        setTimeout(() => {
            if (!stepBackDisabled()) enableStepBackButton()
        }, 1000)
    }
    const handlePaused = () => {
        setPaused(!paused);
        props.pause(getStepBuffer())
    }
    const steppingStatus = () => {
        if (paused) {
            return 'Stepping Active'
        }
        return 'Enable Steps'
    }
    const inputText = () => {
        if (paused && !H.empty(graph.current.stepBuffer)) {
            return H2.getlastNode(graph.current.stepBuffer).value
        }
        return stackLLInputs.value
    }
    const inputValid = () => {
        const text = inputText()
        return text.length > 0
    }
    const popDisabled = () => H.empty(stackLL)

    return (
        <div>
            <div className='controls'>
                <div className='inputs'>
                    <input placeholder="Enter value" id="input-value" name="value" autoComplete="off" onChange={props.textChanged} value={inputText()} disabled={paused} />
                    <button id="btn--push" onClick={() => props.push()} disabled={paused || !inputValid()}>Push</button>
                    <button id="btn--pop" onClick={() => props.pop()} disabled={paused || popDisabled()}>Pop</button>
                </div>

                <div className='step-buttons'>
                    <button id="btn--step" onClick={handlePaused} ref={refPaused}  disabled={H.empty(stackLL)}>{steppingStatus()}</button>
                    <button id="btn--backwards" onClick={handleBackward} ref={refBackward} disabled={stepBackDisabled()}>Step Back</button>
                    {/* TODO: need to disable button on stepping */}
                    <button id="btn--forwards" onClick={handleForward} ref={refForward} disabled={stepForwardDisabled()}>Step Forward</button>
                </div>

                <button id="btn--clear" onClick={props.clearAll} disabled={paused || H.empty(stackLL)}>Clear All</button>
            </div>
            <div ref={wrapperRef}>
                <AlgoSVG ref1={ref}/>
            </div>
        </div>
        
    )
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(
    mapStateToProps,
    {
        push, pop, clearAll, textChanged,
        updateStep, forward, backward, pause,
        pageChange
    }
)(StackLLDS);



