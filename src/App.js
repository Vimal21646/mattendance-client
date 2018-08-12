import React, {Component} from 'react';
import './App.css';
import {BrowserRouter as Router, NavLink, Route} from 'react-router-dom';

import About from './About';
import Home from './Home';
import User from './User';
import Employees from './pages/Employees'

class App extends Component {

    render() {
        return (
            <div>
                <Router>
                    <div>
                        <div className="header">
                            <p className="header-info">
                                Meeting React App
                            </p>
                            <div className="menu">
                                <NavLink exact className="menu-link-item" activeClassName="active" to="/">Home</NavLink>
                                <NavLink exact className="menu-link-item" activeClassName="active"
                                         to="/user">User</NavLink>
                                <NavLink exact className="menu-link-item" activeClassName="active"
                                         to="/about">About</NavLink>
                            </div>
                        </div>
                        <div className="padding">
                            <Route exact path="/" component={Employees}/>
                            <Route path="/user" component={User}/>
                            <Route path="/about" component={About}/>
                        </div>
                    </div>
                </Router>
            </div>
        );
    }
}

export default App;
