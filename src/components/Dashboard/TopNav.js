import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import { actionLoadData, actionLoadDataFile } from '../../actions/LoadDataAction';
import LogOut from '../Authentication/Logout';
import { actionDisplayMessage } from '../../actions/MiddleWareAction';

class TopNav extends Component {
    constructor(props) {
        super(props);
        console.log('Top Nav Props: ', props);
    }

    componentWillReceiveProps(nextProps) {
        let date = new Date();
        let formattedTime = date.getHours() + ':' + date.getMinutes()

        if (nextProps.loadData.error || nextProps.loadData.message) {
            let alertMsg = nextProps.loadData.message;
            alertMsg += nextProps.loadData.error ? " " + nextProps.loadData.error.data.msg : "";

            // this.props.displayNotification(
            //     alertMsg,
            //     formattedTime,
            //     'error'
            // );
        }
        if (nextProps.loadData.loadDataFileMsg) {
            this.props.displayNotification(
                nextProps.loadData.loadDataFileMsg.msg,
                formattedTime,
                'info'
            );
        }
    }

    render() {
        return (
            <div className="top_nav">
                <div className="nav_menu">
                    <nav>
                        <div className="nav toggle">
                            <a id="menu_toggle">
                                <i className="fa fa-bars"></i>
                            </a>
                        </div>
                        <ul className="nav navbar-nav navbar-right">
                            <li className="">
                                <a href="javascript:;" className="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                    <img src="images/user.png" alt="..." />{this.props.login.user}
                                    <span className=" fa fa-angle-down"></span>
                                </a>
                                <ul className="dropdown-menu dropdown-usermenu pull-right" style={{ "zIndex": 9999 }}>
                                    <li>
                                        <Link to="/dashboard/profile">
                                            Profile
                                            <i className="fa fa-camera-retro pull-right"></i>
                                        </Link>
                                    </li>
                                    <li>
                                        <a href="javascript:;">Help</a>
                                    </li>
                                    <li>
                                        <LogOut />
                                    </li>
                                </ul>
                            </li>

                            <li role="presentation" className="dropdown">
                                <a href="javascript:;" className="dropdown-toggle info-number" data-toggle="dropdown" aria-expanded="false">
                                    <i className="fa fa-envelope-o"></i>
                                    {
                                        this.props.notifications.messages.length > 0 &&
                                        <span className="badge bg-green">{this.props.notifications.messages.length}</span>
                                    }
                                </a>
                                <ul id="menu1" className="dropdown-menu list-unstyled msg_list" role="menu">
                                    {
                                        this.props.notifications.messages.map((element, index) => {
                                            return (
                                                <li key={index}>
                                                    <a>
                                                        <span className="image"><img src="images/user.png" alt="Profile Image" /></span>
                                                        <span>
                                                            <span>{this.props.login.user}</span>
                                                            <span className="time">{element.time}</span>
                                                        </span>
                                                        <span className={"message " + element.type}>
                                                            {element.message}
                                                        </span>
                                                    </a>
                                                </li>
                                            )
                                        })
                                    }

                                    <li>
                                        <div className="text-center">
                                            <a>
                                                <strong>See All Alerts</strong>
                                                <i className="fa fa-angle-right"></i>
                                            </a>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        login: state.login_store,
        loadData: state.loadData,
        notifications: state.displayMessage
    };
}

const matchDispatchToProps = (dispatch) => {
    return {
        displayNotification: (message, time, messageType) => {
            dispatch(actionDisplayMessage(message, time, messageType));
        }
    };
}

export default connect(mapStateToProps, matchDispatchToProps)(TopNav);
