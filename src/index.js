import React, { Fragment } from 'react';
import ReactDom from 'react-dom';

import App from './components/d3/App'
import './style.css'
import logo from './img/React-Algo-logo.png'

ReactDom.render(
    <Fragment>
        <div className='app-name'>
            <figure className="logo">
                <img src={logo} alt="Logo"></img>
            </figure>
            <h1 >React-Algo</h1>
        </div>
        <App />
    </Fragment>
    , 
    document.querySelector('#root')
)
