import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
    Router,
    Route,
    Redirect,
    Link,
    IndexRoute,
    hashHistory,
    browserHistory
} from 'react-router';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import reducers from './reducers';
import { actionRelogin } from './actions/LoginAction';
import Login from './components/Authentication/Login';
import Signup from './components/Authentication/Signup';

import Dashboard from './components/Dashboard/Dashboard';
import CaptureReportTemplate from './components/CaptureReportTemplate/CaptureReportTemplate';
import DashboardIndex from './components/Dashboard/DashBoardIndex';
import MaintainBusinessRules from './components/MaintainBusinessRules/MaintainBusinessRules';
import custom from '../js/custom';
import RegOpzDataGrid from './components/RegOpzDataGrid/RegOpzDataGrid';
import ViewDataComponentV2 from './components/ViewData/ViewDataComponentV2';
import ViewReport from './components/ViewReport/ViewReport';
import MaintainReportRules from './components/MaintainReportRules/MaintainReportRules';
import MaintainSources from './components/MaintainSources/MaintainSources';
import VarianceAnalysis from './components/VarianceAnalysis/VarianceAnalysis';
import CreateReport from './components/CreateReport/CreateReport';
import ManageDefChange from './components/ManageDefChange/ManageDefChange';
import ManageRoles from './components/ManageRoles/ManageRoles';
import AddRoles from './components/ManageRoles/AddRoles/AddRoles';
import ManageUsers from './components/ManageUsers/ManageUsers';
import EditUsers from './components/ManageUsers/ModifyUser/ModifyUser';
import Profile from './components/Profile/Profile';
import authenticate from './components/Authentication/authenticate';
import ManageDataChange from './components/ManageDataChange/ManageDataChange';
import LoadData from './components/ViewData/LoadData';


const createStoreWithMiddleware = applyMiddleware(promiseMiddleware)(createStore);
const store = createStoreWithMiddleware(reducers);

if (localStorage.RegOpzToken) {
    let webToken = localStorage.RegOpzToken;
    store.dispatch(actionRelogin(webToken));
}

class Index extends Component {
    componentWillMount() {
        console.log('Component Mounted');
        if (this.props.user && !this.props.children) {
            hashHistory.push('/dashboard');
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log('Component Recieved Props');
        if (nextProps.user && !nextProps.children) {
            hashHistory.push('/dashboard');
        }
    }

    render() {
        console.log('Render Function Called,Index........');
        console.log("user,name,role,permission...", this.props.user, this.props.name, this.props.role, this.props.permission);
        //console.log(this.props);
        if (!this.props.user) {
            return (<Login {...this.props} />);
        } else if (this.props.children) {
            return (<div> {this.props.children} </div>);
        } else {
            return (<Dashboard {...this.props} />)
        }
    }
}


function mapStateToProps(state) {
    return {
        user: state.login_store.user,
        name: state.login_store.name,
        role: state.login_store.role,
        permission: state.login_store.permission
    };
}

const VisibleIndex = connect(
    mapStateToProps
)(Index);

ReactDOM.render(
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={VisibleIndex} />
            <Route path="/" name="Home" component={VisibleIndex}>
                <Route path="dashboard" name="Dashboard" component={Dashboard} >
                    <IndexRoute component={DashboardIndex} />
                    <Route path="profile" component={Profile} name="Profile" />
                    <Route path="capture-report-template" name="Capture Report Template" component={CaptureReportTemplate} />
                    <Route path="data-grid" name="Data Grid" component={RegOpzDataGrid} />
                    <Route path="maintain-business-rules" name="Maintain Business Rules" component={authenticate(MaintainBusinessRules)} />
                    <Route path="view-data" name="View Data" component={authenticate(ViewDataComponentV2)} />
                    <Route path="load-data" name="Load Data" component={LoadData} />
                    <Route path="view-report" name="View Report" component={authenticate(ViewReport)} />
                    <Route path="create-report" name="Create Report" component={authenticate(CreateReport)} />
                    <Route path="maintain-report-rules" name="Maintain Report Rules" component={authenticate(MaintainReportRules)} />
                    <Route path="maintain-sources" name="Maintain Sources" component={authenticate(MaintainSources)} />
                    <Route path="variance-analysis" name="Variance Analysis" component={authenticate(VarianceAnalysis)} />
                    <Route path="workflow/manage-def-change" name="Manage Definition Change" component={authenticate(ManageDefChange)} />
                    <Route path="workflow/manage-data-change" name="Manage Data Change" component={authenticate(ManageDataChange)} />
                    <Route path="manage-roles" name="Role Management" component={authenticate(ManageRoles)} />
                    <Route path="manage-users" name="User Management" component={ManageUsers} />
                    <Route path="manage-users/edit-user" name="Edit User" component={EditUsers}/>
                </Route>
            </Route>
        </Router>
    </Provider>
    , document.querySelector(".react_container"));
