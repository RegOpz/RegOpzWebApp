import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import RightPane from './RightPane';

export default class DashboardIndex extends Component {
    render() {
        return (
            <div>
                <RightPane />
            </div>
        )
    }
    componentDidMount() {
        document.title = "RegOpz Dashboard | Capture Report Template ";
    }
}
