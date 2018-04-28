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
import Favicon from 'react-favicon';
import promiseRejectMiddleWare from './middlewares/promiseRejectMiddleWare';
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
import LoadData from './components/MaintainSources/LoadData';
import NotificationSystem from 'react-notification-system';
import ManageSubscribers from './components/ManageSubscribers/ManageSubscribers';
import MaintainBusinessRulesRepository from './components/MaintainBusinessRulesRepository/MaintainBusinessRulesRepository';

const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, promiseRejectMiddleWare)(createStore);
const store = createStoreWithMiddleware(reducers);

if (sessionStorage.RegOpzToken) {
    let webToken = sessionStorage.RegOpzToken;
    store.dispatch(actionRelogin(webToken));
}

class Index extends Component {
    componentDidMount() {
        this.notificationSystem = this.refs.notificationSystem;
    }

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

        if (this.props.notification.id !== nextProps.notification.id) {
            let length = nextProps.notification.messages.length;
            this.notificationSystem.addNotification({
                title: nextProps.notification.messages[length - 1].time,
                message: nextProps.notification.messages[length - 1].message,
                level: nextProps.notification.messages[length - 1].type,
                autoDismiss: 0
            });
        }
    }

    render() {
        console.log('Render Function Called,Index........');
        console.log("user,name,role,permission...", this.props.user, this.props.name, this.props.role, this.props.permission);
        //console.log(this.props);
        let ComponentToRender = null;
        let componentData = null;
        if (!this.props.user) {
            ComponentToRender = Login;
            componentData = this.props;
        } else if (this.props.children) {
            ComponentToRender = null;
            componentData = this.props.children;
        } else {
            ComponentToRender = Dashboard;
            componentData = this.props;
        }

        return (
            <div>
                <Favicon url="./images/favicon/favicon.ico" />
                <NotificationSystem ref="notificationSystem" />
                {
                    ComponentToRender !== null ?
                        <ComponentToRender {...componentData} /> :
                        <div>
                            {componentData}
                        </div>
                }
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        user: state.login_store.user,
        name: state.login_store.name,
        role: state.login_store.role,
        permission: state.login_store.permission,
        notification: state.displayMessage
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
                    <Route path="capture-report-template" name="Capture Report Template" component={authenticate(CaptureReportTemplate)} />
                    <Route path="data-grid" name="Data Grid" component={RegOpzDataGrid} />
                    <Route path="maintain-business-rules" name="Maintain Business Rules" component={authenticate(MaintainBusinessRules)} />
                    <Route path="view-data" name="View Data" component={authenticate(ViewDataComponentV2)} />
                    <Route path="load-data" name="Load Data" component={authenticate(LoadData)} />
                    <Route path="view-report" name="View Report" component={authenticate(ViewReport)} />
                    <Route path="create-report" name="Create Report" component={authenticate(CreateReport)} />
                    <Route path="maintain-report-rules" name="Maintain Report Rules" component={authenticate(MaintainReportRules)} />
                    <Route path="maintain-sources" name="Maintain Sources" component={authenticate(MaintainSources)} />
                    <Route path="variance-analysis" name="Variance Analysis" component={authenticate(VarianceAnalysis)} />
                    <Route path="workflow/manage-def-change" name="Manage Definition Change" component={authenticate(ManageDefChange)} />
                    <Route path="workflow/manage-data-change" name="Manage Data Change" component={authenticate(ManageDataChange)} />
                    <Route path="manage-roles" name="Role Management" component={authenticate(ManageRoles)} />
                    <Route path="manage-users" name="User Management" component={authenticate(ManageUsers)} />
                    <Route path="manage-users/edit-user" name="Edit User" component={EditUsers} />
                    <Route path="manage-subscribers" name="Subscriber Management" component={authenticate(ManageSubscribers)} />
                    <Route path="maintain-business-rules-repo" name="Maintain Business Rules Repository" component={authenticate(MaintainBusinessRulesRepository)} />
                </Route>
            </Route>
        </Router>
    </Provider>
    , document.querySelector(".react_container"));
