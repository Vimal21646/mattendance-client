import React from 'react';
import {NavLink} from 'react-router-dom';

class Header extends React.Component {
    render() {
        return (
            <div className="header">
                <p className="header-info">
                    Employee Attendence App
                </p>
                <div className="menu">
                    <NavLink exact className="menu-link-item" activeClassName="active" to="/">Employee</NavLink>
                    <NavLink exact className="menu-link-item" activeClassName="active"
                             to="/user">User</NavLink>
                    <NavLink exact className="menu-link-item" activeClassName="active"
                             to="/about">About</NavLink>
                </div>
            </div>
        );
    }
};

export default Header;