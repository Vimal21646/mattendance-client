import React, {Component} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import './App.css';
import Header from './pages/Header'
import MainTemplate from './pages/MainTemplate'

class App extends Component {

    render() {
        return (
            <div>
                <Router>
                    <div>
                        <Header/>
                        <MainTemplate/>
                    </div>
                </Router>
            </div>
        );
    }
}

export default App;
