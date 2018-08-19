import React from 'react';
import About from './../../About';
import User from './../../User';
import Employees from './../Employees'
import {Route} from "react-router-dom";


class MainTemplate extends React.Component {

    render() {
        return (
            <div className="padding">
                <Route exact path="/" component={Employees}/>
                <Route path="/user" component={User}/>
                <Route path="/about" component={About}/>
            </div>
        );
    }
}

export default MainTemplate;