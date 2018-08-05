import Header from '../Header';
import React from 'react';

import '../../styles/index.css';

class MainTemplate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {cSelected: []};

        this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
    }

    onRadioBtnClick(rSelected) {
        this.setState({rSelected});
    }

    render() {
        return (
            <div>
                <Header/>
            </div>
        );
    }
};

export default MainTemplate;