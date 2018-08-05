import React, {Component} from 'react';
import './App.css';
import {Route, BrowserRouter, Switch} from 'react-router-dom';

import MainTemplate from "./pages/MainTemplate";
import Employees from "./pages/Employees";

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={MainTemplate}/>

                        <Route path="employees" components={{main: Employees}}/>


                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
