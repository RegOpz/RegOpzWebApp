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
        this.state = {
          filterText: null
        }
        this.dataSource = null;
        this.fetchFlag = true;
        this.iconClass = {
            "Contact Number": "fa fa-phone",
            "Email": "fa fa-paper-plane",
            "Role": "fa fa-user",
            "Status": "fa fa-power-off",
            "Active": "green",
            "Unspecified":" red"
        };
        this.renderUsers = this.renderUsers.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
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

    handleFilter(){

        if(typeof this.props.userDetails != 'undefined' && this.props.userDetails ){
          let userData = this.props.userDetails;
          const { filterText } = this.state;
          if (filterText != null) {
              let matchText = RegExp(`(${filterText.toString().toLowerCase().replace(/[,+&\:\ ]$/,'').replace(/[,+&\:\ ]/g,'|')})`,'i');
              console.log("matchText",matchText);
              userData = userData.filter(element =>
                  element.name.match(matchText) ||
                  element.username.match(matchText)||
                  element.info.some(info => info.value.match(matchText))
              );
          }
          this.dataSource = userData;
        }
    }

    render() {
          return(
              <div>
                { this.renderDisplay() }
              </div>
          );
    }

    renderDisplay() {
        // this.dataSource = this.props.userDetails;
        this.handleFilter();
        // console.log("renderDisplay",this.dataSource,this.props.userDetails)

        if(this.dataSource == null) {
            return(
              <h4>Loading...</h4>
            );
        }
        return(
          <div className="row ">
            <div className="col-md-12">
              <div className="x_panel">
                <div className="x_title">
                <h2>User Management <small>Manage users</small></h2>
                    <div className="clearfix"></div>
                </div>
                <div className="x_content">
                  <div className="input-group">
                      <input
                        id="filter"
                        className="form-control col-md-9 col-sm-9 col-xs-12"
                        placeholder="Enter Filter Text"
                        value={this.state.filterText}
                        onChange={(event) => {
                            this.setState({ filterText: event.target.value });
                        }}
                      />
                      <span className="input-group-addon">
                        <i className="fa fa-filter"></i>
                      </span>
                  </div>
                  <div className="row">
                    <div className="col-md-12 col-sm-12 col-xs-12"></div>
                    <div classNam="clearfix"></div>
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
              <div key={index} className="col-md-4 col-sm-4 col-xs-12 profile_details">
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
                                <i className={this.iconClass[obj.title] + " " + this.iconClass[obj.value]}></i>
                                <strong> {obj.title}:</strong> { obj.value }
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
                            <i className="fa fa-user"></i> View Profile
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
