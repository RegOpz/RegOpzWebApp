import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { dispatch } from 'redux';
import Breadcrumbs from 'react-breadcrumbs';
import {
  actionFetchUsers
} from '../../actions/UsersAction';
require('./ManageUsers.css');


class ManageUsersComponent extends Component {
    constructor(props) {
        super(props);
        this.dataSource = null;
        this.fetchFlag = true;
        this.iconClass = {
            "Contact Number": "fa fa-phone",
            "Email": "fa fa-paper-plane",
            "Role": "fa fa-user"
        };
        this.renderUsers = this.renderUsers.bind(this);
    }

    componentWillMount() {
        this.props.fetchUsers();
    }

    componentWillUpdate() {
        if (this.fetchFlag) {
            this.dataSource = null;
            this.props.fetchUsers();
        }
    }

    componentDidUpdate(){
        this.fetchFlag = ! this.fetchFlag;
    }

    componentDidMount() {
        document.title = "RegOpz Dashboard | Manage Users";
    }

    render() {
          return(
              <div>
                { this.renderDisplay() }
              </div>
          );
    }

    renderDisplay() {
        this.dataSource = this.props.userDetails;

        if(this.dataSource == null) {
            return(
              <h1>Loading...</h1>
            );
        } else if(this.dataSource.length == 0) {
            return(
            <h1>No data found!</h1>
            );
        }
        return(
          <div className="row ">
            <div className="col-md-12">
              <div className="x_panel">
                <div className="x_content">
                  <div className="row">
                    { this.renderUsers(this.dataSource)  }
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }

    renderUsers(dataSource) {
      let user_list = [];
      dataSource.map((item, index) => {
          console.log(index, "From ManageUsers", item);
          user_list.push(
              <div key={index} className="col-md-6 col-sm-6 col-xs-12 profile_details">
                <div className="well profile_view">
                  <div className="col-sm-12">
                    <h4 className="brief">
                      <i>User Details</i>
                    </h4>
                    <div className="left col-xs-7">
                      <h2>
                        { item.name }
                      </h2>
                      <ul className="list-unstyled">
                      {
                          item.info.map((obj, index) => (
                              <li key={index}>
                                <i className={this.iconClass[obj.title]}></i>
                                <strong>{obj.title}:</strong> { obj.value }
                              </li>
                          ))
                      }
                      </ul>
                    </div>
                    <div className="right col-xs-5 text-center">
                      <img src="images/user.png" alt="" className="img-circle img-responsive" />
                    </div>
                  </div>
                  <div className="col-xs-12 bottom text-center">
                    <div className="col-xs-12 col-sm-6 emphasis"></div>
                      <div className="col-xs-12 col-sm-6 emphasis">
                        <Link className="btn btn-primary btn-xs" to={`/dashboard/manage-users/edit-user?userId=${item.username}`}>
                            View Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
          );
      });
      return(user_list);
    }
}

function mapStateToProps(state) {
    console.log("On map state of Manage Users:", state);
    return {
        userDetails: state.user_details.data
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUsers: () => {
            dispatch(actionFetchUsers());
        }
    };
};

const VisibleManageUsers = connect(
    mapStateToProps,
    mapDispatchToProps
)(ManageUsersComponent);

export default VisibleManageUsers;
