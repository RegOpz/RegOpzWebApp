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
        display: false,
        filterText: null
    };
    this.dataSource = null;
    this.selectedRole = null;
    this.handleEditButtonClicked = this.handleEditButtonClicked.bind(this);
    this.handleFilter = this.handleFilter.bind(this);

    this.viewOnly = _.find(this.props.privileges, { permission: "View Roles" }) ? true : false;
    this.writeOnly = _.find(this.props.privileges, { permission: "Edit Roles" }) ? true : false;
  }

  componentWillMount() {
    this.props.fetchPermission(this.props.tenant_id);
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

  handleFilter(){

      if(typeof this.props.permissionList != 'undefined' && this.props.permissionList ){
        let userData = this.props.permissionList;
        const { filterText } = this.state;
        if (filterText != null) {
            let matchText = RegExp(`(${filterText.toString().toLowerCase().replace(/[,+&\:\ ]$/,'').replace(/[,+&\:\ ]/g,'|')})`,'i');
            console.log("matchText",matchText);
            userData = userData.filter(element =>
                element.role.match(matchText)
            );
        }
        this.dataSource = userData;
      }
  }

  renderDynamic(displayOption) {
      switch (displayOption) {
          case "Form":
              return(
                  <AddRoles
                    role={this.selectedRole}
                    user={this.props.user}
                    tenant_id={this.props.tenant_id}
                    readOnly={!this.writeOnly}
                    handleClose={this.handleCancel.bind(this)}
                  />
              );
          default:
              // return this.renderPermissions();
              return (
                <div className="row ">
                  <div className="col-md-12">
                    <div className="x_panel">
                      <div className="x_title">
                      <h2>Role Management <small>Manage roles</small></h2>
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
                          {this.renderPermissions()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
      }
  }

  render() {
    return(
      <div>
        {
          this.renderDynamic(this.state.display)
        }
      </div>
    );
  }

  renderPermissions() {
    this.handleFilter();

    if(this.dataSource == null) {
      return(
        <h4>Loading...</h4>
      );
    } else if(this.dataSource.length == 0) {
        return(
          <h4>No data found!</h4>
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
                      className="x_panel tile fixed_height_320 x_panel_blank role_panel overflow_hidden"
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
                          tenant_id={this.props.tenant_id}
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
    fetchPermission: (tenant_id) => {
      dispatch(actionFetchRoles(tenant_id));
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
