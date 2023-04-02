import React, { Component } from 'react';
import {render} from 'react-dom';
import HomePage from './components/HomePage';
import "./output.css"

export default function App() { 
        return (
        <div id='main'>
            <HomePage />
        </div>
        )
}

const appDiv = document.getElementById('app');
render(<App />, appDiv);
