import React from 'react';
import About from './../../About';
import Departments from './../Departments';
import Employees from './../Employees'
import {Route} from "react-router-dom";


class MainTemplate extends React.Component {

    render() {
        return (
            <div className="padding">
                <Route exact path="/" component={Employees}/>
                <Route path="/departments" component={Departments}/>
                <Route path="/about" component={About}/>
            </div>
        );
    }
}

export default MainTemplate;