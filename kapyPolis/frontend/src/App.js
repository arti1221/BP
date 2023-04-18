import React, { Component } from 'react';
import {render} from 'react-dom';
import HomePage from './components/HomePage';
import root from "./redux/reducers"; 
import {legacy_createStore as createStore} from 'redux'
import {Provider} from 'react-redux';
import "./output.css"

const store = createStore(root);

export default function App() { 
        return (
        <div id='main'>
            <Provider store={store}>
                <HomePage />
            </Provider>
        </div>
        )
}

const appDiv = document.getElementById('app');
render(<App />, appDiv);
