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
            userDetails: [],
            role: null,
            status: null
        };

        this.saveEditedData = this.saveEditedData.bind(this);
    }

    componentWillMount() {
        this.props.fetchUserDetails(this.state.user);
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        if (nextProps.userDetails.message === 'Data Updated') {
            this.props.fetchUserDetails(this.state.user);
            return;
        }
        if (nextProps.userDetails.error !== undefined) {
            let userDetails = nextProps.userDetails.error[0].info;
            let role = null;
            let status = null;

            for (let i = 0; i < userDetails.length; i++) {
                if (userDetails[i].title === 'Role')
                    role = userDetails[i];
                if (userDetails[i].title === 'Status')
                    status = userDetails[i];
            }

            userDetails = userDetails.filter(element => {
                if (element.title === 'Status' || element.title === 'Role')
                    return false;
                else
                    return true;
            });
            this.setState({
                userDetails: userDetails,
                user: nextProps.login.user,
                role: role,
                status: status
            });
        }
        else
            this.setState({ user: nextProps.login.user });
    }

    saveEditedData(userData) {
        let firstName = null;
        let lastName = null;
        let email = null;
        let contactNumber = null;
        let username = null;
        for (let i = 0; i < userData.length; i++) {
            if (userData[i].title === 'First Name')
                firstName = userData[i].value;
            if (userData[i].title === 'Last Name')
                lastName = userData[i].value;
            if (userData[i].title === 'Email')
                email = userData[i].value;
            if (userData[i].title === 'Contact Number')
                contactNumber = userData[i].value;
            if (userData[i].title === 'User Name')
                username = userData[i].value;
        }

        var userDataFormat = {
            status: this.state.status.value,
            Status: this.state.status.value,
            Role: this.state.role.value,
            role: this.state.role.value,
            name: username,
            'User Name': username,
            first_name: firstName,
            'First Name': firstName,
            last_name: lastName,
            'Last Name': lastName,
            contact_number: contactNumber,
            'Contact Number': contactNumber,
            email: email,
            'Email': email
        };

        console.log(userDataFormat);
        this.props.updateUserDetails(userDataFormat);
    }

    render() {
        return (
            <div className="row form-container">
                <div className="col-xs-12">
                    <div className="x_panel">
                        <div className="x_title">
                            <h2>User Profile</h2>
                            <ul className="nav navbar-right panel_toolbox">
                                <li>
                                    <a className="close-link" onClick={console.log("this.props.handleClose")}><i className="fa fa-close"></i></a>
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
        fetchUserDetails: (user) => {
            dispatch(actionFetchUsers(user));
        },
        updateUserDetails: (data) => {
            dispatch(actionUpdateUser(data));
        }
    };
};

export default connect(mapStateToProps, matchDispatchToProps)(Profile);
