import React, { Fragment } from 'react';
import ReactDom from 'react-dom';

import App from './components/d3/App'
import './style.css'

ReactDom.render(
    <Fragment>
        <div className='app-name'>
            <figure className="logo">
                <img src="./img/React-Algo-logo.png" alt="Logo"></img>
            </figure>
            <h1 >React-Algo</h1>
        </div>
        <App />
    </Fragment>
    , 
    document.querySelector('#root')
)
