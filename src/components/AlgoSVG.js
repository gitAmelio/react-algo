import React, { Fragment } from 'react'

function AlgoSVG(props) {
    const markers = () => {
        return <Fragment>
                    <marker id="mC" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5">
                        <circle cx="2.5" cy="2.5" r="2.5" fill="#6c78b3" stroke="black" />
                    </marker>
                    <marker id="mP" markerWidth="20" markerHeight="10" refX="0" refY="5" orient="auto">
                        <path d="M0,5 L20,0 15,5 20,10 Z" style={{ fill: '#6c78b3', transform: '' }} />
                    </marker>
                    <marker id="mP2" markerWidth="20" markerHeight="10" refX="15" refY="5" orient="auto">
                        <path d="M0,0 L20,5 0,10 5,5 Z" style={{ fill: '#6c78b3', transform: '' }} />
                    </marker>
                    <marker id="mP3" markerWidth="20" markerHeight="10" refX="15" refY="5" orient="auto">
                        <path d="M0,0 L20,5 0,10 5,5 Z" />
                    </marker>
              </Fragment>
    }

    const filters = () => {
        return  <Fragment>
                    <filter id="f2" x="-2" y="-2" width="500%" height="500%">
                        <feOffset result="offOut" in="SourceGraphic" dx="0" dy="0" />
                        <feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" />
                        <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
                    </filter>

                    <filter id='shadow'>
                        <feDropShadow dx="1.2" dy="1.4" stdDeviation="1" />
                    </filter>
                </Fragment>
    }

    const headAndTail = () => {
        return <Fragment>
                    <g className="head" >
                        <path className="head-path" />
                        <rect className="head-shape"></rect>
                        <title className="head-path">Head</title>
                    </g>
                    <g className="tail" >
                        <circle className="tail-shape"></circle>
                        <path className="tail-path" />
                        <title className="tail-path">Tail</title>
                    </g>
               </Fragment>
    }

    const linksAndNodes = () => {
        return <Fragment>
                    <g className="links"></g>
                    <g className="nodes"></g>
               </Fragment>
    }

    return (
        
      <svg className="main-svg" ref={props.ref1} width={"100%"} height={"100vh"} > 
            <defs>
                {filters()}
                {markers()}
            </defs>
            {headAndTail()}
            {linksAndNodes()}
        </svg>

    )
}

export default AlgoSVG
