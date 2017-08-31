import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { hashHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import Breadcrumbs from 'react-breadcrumbs';
import {
  actionFetchRoles
} from '../../actions/RolesAction';
import ViewRole from './ViewRole';
import AddRoles from './AddRoles/AddRoles';
require('./ManageRoles.css');

class ManageRolesComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
        checked: "checked",
        display: false
    };
    this.dataSource = null;
    this.selectedRole = null;
    this.handleEditButtonClicked = this.handleEditButtonClicked.bind(this);
  }

  componentWillMount() {
    this.props.fetchPermission();
  }

  componentDidMount() {
    document.title = "RegOpz Dashboard | Manage Roles";
  }

  handleEditButtonClicked(role) {
      this.selectedRole = role;
      this.setState({ display: "Form" });
  }

  handleCancel() {
      this.selectedRole = null;
      this.setState({ display: false });
  }

  renderDynamic(displayOption) {
      switch (displayOption) {
          case "Form":
              return(
                  <AddRoles
                    role={this.selectedRole}
                    handleCancel={this.handleCancel.bind(this)}
                  />
              );
          default:
              return this.renderPermissions();
      }
  }

  render() {
    return(
        <div>
          <h4>Manage Roles</h4>
          {
              this.renderDynamic(this.state.display)
          }
        </div>
    );
  }

  renderPermissions() {
    this.dataSource = this.props.permissionList;

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
        <div className="row form-container">
        {
            ((dataSource) => {
              let role_list = [
                  <div key={-1} className="col-md-4 col-sm-4 col-xs-12">
                    <div
                      className="x_panel tile fixed_height_320 x_panel_blank overflow_hidden"
                      style={{ "cursor": "pointer" }}
                      onClick={() => this.handleEditButtonClicked(null) }
                    >
                      <div className="x_content x_content_plush">
                        <h2>Add New Role</h2>
                        <i className="fa fa-plus" rel="tooltip" title="Add New Role"></i>
                      </div>
                    </div>
                  </div>
              ];
              dataSource.map((item, index) => {
                    console.log(index, item);
                    role_list.push(
                      <div key={index} className="col-md-4 col-sm-4 col-xs-12">
                        <ViewRole
                          item={item}
                          handleButtonClicked={this.handleEditButtonClicked.bind(this)}
                        />
                      </div>
                      );
                    })
              return(role_list);
            })(this.dataSource)
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    permissionList: state.role_management.data
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPermission: () => {
      dispatch(actionFetchRoles());
    }
  };
};

const VisibleRoleManager = connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageRolesComponent);

export default VisibleRoleManager;
