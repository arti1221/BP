import React, { Component } from 'react';
import {render} from 'react-dom';

export default class App extends Component { // main component
    constructor(props) {
        super(props);
    }

    render() {
        return <h1>React Component Test - ZABIL SOM TONU CASU :)))))</h1>;
    }
}

const appDiv = document.getElementById('app');
render(<App />, appDiv);
