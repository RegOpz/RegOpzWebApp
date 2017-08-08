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
import AddBusinessRule from './components/MaintainBusinessRules/AddBusinessRule/AddBusinessRule';
import custom from '../js/custom';
import RegOpzDataGrid from './components/RegOpzDataGrid/RegOpzDataGrid';
import ViewDataComponentV2 from './components/ViewData/ViewDataComponentV2';
import ViewDataComponent from './components/ViewData/ViewDataComponent';
import ViewReport from './components/ViewReport/ViewReport';
import DrillDown from './components/DrillDown/DrillDown';
import MaintainReportRules from './components/MaintainReportRules/MaintainReportRules';
import AddReportRules from './components/MaintainReportRules/AddReportRules/AddReportRules';
import AddReportAggRules from './components/MaintainReportRules/AddReportAggRules';
import MaintainSources from './components/MaintainSources/MaintainSources';
import AddSources from './components/MaintainSources/AddSources/AddSources';
import VarianceAnalysisForm from './components/VarianceAnalysis/VarianceAnalysis';
import VarianceAnalysisGrid from './components/VarianceAnalysis/VarianceAnalysisGrid';
import VarianceAnalysisChart from './components/VarianceAnalysis/VarianceAnalysisChart';
import CreateReport from './components/CreateReport/CreateReport';
import ManageDefChange from './components/ManageDefChange/ManageDefChange';
import ManageRoles from './components/ManageRoles/ManageRoles';
import AddRoles from './components/ManageRoles/AddRoles/AddRoles';
import ManageUsers from './components/ManageUsers/ManageUsers';
import EditUsers from './components/ManageUsers/ModifyUser/ModifyUser';
import Profile from './components/Profile/Profile';
import authenticate from './components/Authentication/authenticate';
import AddData from './components/ViewData/AddData';


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
                    <Route path="maintain-business-rules/add-business-rule" component={AddBusinessRule} />
                    <Route path="view-data" name="View Data" component={ViewDataComponentV2} />
                    <Route path="view-data/add-data" name="Add Data" component={AddData} />
                    <Route path="view-data-on-grid" name="View Data Grid" component={ViewDataComponent} />
                    <Route path="view-report" name="View Report" component={ViewReport} />
                    <Route path="create-report" name="Create Report" component={CreateReport} />
                    <Route path="drill-down" name="DrillDown" component={DrillDown} />
                    <Route path="maintain-report-rules" name="Maintain Report Rules" component={MaintainReportRules} />
                    <Route path="maintain-report-rules/add-report-rules" name="Add Report Rules" component={AddReportRules} />
                    <Route path="maintain-report-rules/add-report-agg-rules" name="Add Report Aggregate Rules" component={AddReportAggRules} />
                    <Route path="maintain-sources" name="Maintain Sources" component={MaintainSources} />
                    <Route path="maintain-sources/add-sources" name="Add Sources" component={AddSources} />
                    <Route path="variance-analysis" name="Variance Analysis" component={authenticate(VarianceAnalysisForm)} />
                    <Route path="variance-analysis/variance-data-grid" name="Variance Analysis Grid" component={VarianceAnalysisGrid} />
                    <Route path="variance-analysis/variance-chart" name="Variance Analysis Chart" component={VarianceAnalysisChart} />
                    <Route path="workflow/manage-def-change" name="Manage Definition Change" component={authenticate(ManageDefChange)} />
                    <Route path="manage-roles" name="Role Management" component={ManageRoles} />
                    <Route path="manage-roles/add-roles" name="Add Role" component={AddRoles} />
                    <Route path="manage-users" name="User Management" component={ManageUsers} />
                    <Route path="manage-users/edit-user" name="Edit User" component={EditUsers}/>
                </Route>
            </Route>
        </Router>
    </Provider>
    , document.querySelector(".react_container"));
