import React, { Component } from 'react';
import ProfileLeftPane from './ProfileLeft';
import ProfileRightPane from './ProfileRight';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionFetchUsers, actionUpdateUser } from './../../actions/UsersAction';

class Profile extends Component {
    constructor(props) {
        super(props);

        console.log(props);

        this.state = {
            user: this.props.login.user,
            userDetails: []
        };

        this.saveEditedData = this.saveEditedData.bind(this);
        this.resetChanges = this.resetChanges.bind(this);
    }

    componentWillMount() {
        this.props.fetchUserDetails(this.state.user,undefined,true);
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        if (nextProps.userDetails.message === 'Data Updated') {
            this.props.fetchUserDetails(this.state.user,undefined,true);
            return;
        }
        if (nextProps.userDetails.error !== undefined) {
            this.setState({
                userDetails: nextProps.userDetails.error, //userDetails,
                user: nextProps.login.user
            });
        }
        else
            this.setState({ user: nextProps.login.user });
    }

    saveEditedData(userData) {
        console.log("update request....",userData);
        this.props.updateUserDetails(userData);
    }

    resetChanges() {
        this.props.fetchUserDetails(this.state.user,undefined,true);
    }

    render() {
        return (
            <div className="row form-container">
                <div className="col-xs-12">
                    <div className="x_panel">
                        <div className="x_title">
                            <h2>User Profile<small> manage profile</small></h2>
                            <ul className="nav navbar-right panel_toolbox">
                                <li>
                                    <a className="close-link" href="#/dashboard" title="Close"><i className="fa fa-close"></i></a>
                                </li>
                            </ul>
                            <div className="clearfix">
                            </div>
                        </div>
                        <div className="x_content">
                            <ProfileLeftPane
                                image="images/user.png"
                                username={this.state.user}
                                userData={this.state.userDetails}
                                saveEditedData={this.saveEditedData}
                                toInitialise={true}
                            />
                            <ProfileRightPane />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        userDetails: state.user_details,
        login: state.login_store
    };
}

const matchDispatchToProps = (dispatch) => {
    return {
        fetchUserDetails: (user,userCheck,labelList) => {
            dispatch(actionFetchUsers(user,userCheck,labelList));
        },
        updateUserDetails: (data) => {
            dispatch(actionUpdateUser(data));
        }
    };
};

export default connect(mapStateToProps, matchDispatchToProps)(Profile);
