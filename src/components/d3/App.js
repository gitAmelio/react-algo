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





