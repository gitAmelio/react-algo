import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import { Provider} from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import history from '../../Utils/history'

import NodeLink from './StackLL';
import AVLTree  from './AVLTree';

import Links from '../Links'
import pageReducer from '../../reducer'
import stackLLReducer from './StackLL/reducers'
import avlTreeReducer from './AVLTree/reducers'

import './style.css'

const mainReducer = combineReducers(
    { 
        ...pageReducer,
        ...stackLLReducer, 
        ...avlTreeReducer
     }
)

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    mainReducer,   
    composeEnhancers( applyMiddleware(thunk) ) 
);


class App extends React.Component {
    config = {
        num: [4, 7],
        rps: 0.1,
        radius: [1, 4],
        life: [1.5, 3],
        v: [2, 5],
        tha: [-40, 40],
        alpha: [0.6, 0],
        scale: [1, 0.1],
        position: "center", 
        color: ["random"],
        cross: "dead", 
        random: 15,  
        g: 5,    
        onParticleUpdate: (ctx, particle) => {
            ctx.beginPath();
            ctx.rect(particle.p.x, particle.p.y, particle.radius * 2, particle.radius * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            ctx.closePath();
        }
    };

    render(){
        return (
            <Provider store={store}>
            <Router history={history}>
                <Links />
                <Switch >
                    <Route path="/node_link" exact component={NodeLink} />
                    <Route path="/avl_tree"  exact component={AVLTree}  />
                </Switch>
            </Router>
            </Provider>
        )

    }
}

export default App;





