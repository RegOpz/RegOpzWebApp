import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { hashHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import _ from 'lodash';
import {
  actionFetchRoles
} from '../../actions/RolesAction';
import {
  actionLeftMenuClick,
} from '../../actions/LeftMenuAction';
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

    this.viewOnly = _.find(this.props.privileges, { permission: "View Roles" }) ? true : false;
    this.writeOnly = _.find(this.props.privileges, { permission: "Edit Roles" }) ? true : false;
  }

  componentWillMount() {
    this.props.fetchPermission();
  }
  componentDidUpdate(){
      this.props.leftMenuClick(false);
  }
  componentDidMount() {
    document.title = "RegOpz Dashboard | Manage Roles";
  }
  componentWillReceiveProps(nextProps){
    console.log("nextProps",this.props.leftmenu);
    if(this.props.leftmenu){
      this.setState({
        display: false
      });
    }
  }

  handleEditButtonClicked(role) {
    if (this.writeOnly) {
      this.selectedRole = role;
      this.setState({ display: "Form" });
    }
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
                    handleClose={this.handleCancel.bind(this)}
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
              let role_list = [];
              if (this.writeOnly) {
                role_list.push(
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
                );
              }
              dataSource.map((item, index) => {
                    // console.log(index, item);
                    role_list.push(
                      <div key={index} className="col-md-4 col-sm-4 col-xs-12">
                        <ViewRole
                          item={item}
                          readOnly={!this.writeOnly}
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
    permissionList: state.role_management.data,
    leftmenu: state.leftmenu_store.leftmenuclick,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPermission: () => {
      dispatch(actionFetchRoles());
    },
    leftMenuClick:(isLeftMenu) => {
      dispatch(actionLeftMenuClick(isLeftMenu));
    },
  };
};

const VisibleRoleManager = connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageRolesComponent);

export default VisibleRoleManager;
