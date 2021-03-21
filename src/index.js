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
        <footer>
            <p className="footer__text">
                © 2021 - Developed by <a href="https://github.com/gitAmelio" target="_blank">Amelio Croza</a>
            </p>
        </footer>
    </Fragment>
    , 
    document.querySelector('#root')
)
