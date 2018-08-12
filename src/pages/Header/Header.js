import React from 'react';
import { NavLink } from 'react-router-dom';

class Header extends React.Component {
	render(){
		
		return (
			<div className="header">
				<p className="header-info">
					Meeting React App
				</p>
				<div className="menu">
					<NavLink exact className="menu-link-item" activeClassName="active" to="/employees" >Employees</NavLink>
				</div>
			</div>

		);
	}
};

export default Header;