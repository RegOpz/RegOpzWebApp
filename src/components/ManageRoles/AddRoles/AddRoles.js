import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router';
import { Label, Checkbox } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import {
    actionFetchRoles,
    actionFetchComponents,
    actionFetchPermissions,
    actionUpdateRoles,
    actionDeleteRoles
} from '../../../actions/RolesAction';
import Breadcrumbs from 'react-breadcrumbs';
import AuditModal from '../../AuditModal/AuditModal';
import ModalAlert from '../../ModalAlert/ModalAlert';
import ViewRole from '../ViewRole';
require('./AddRoles.css');

class AddRolesComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            role: this.props.role,
            permissions: null,
            selectedComponent: null,
            showAuditModal: false
        };
        this.dataSource = null;
        this.formData = [];
        this.componentList = null;
        this.permissionList = null;
        this.modalAlert = null;
        this.buttonClicked = null;
        this.isDefaultChecked = this.isDefaultChecked.bind(this);
        this.savePrevious = this.savePrevious.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.onComponentSelect = this.onComponentSelect.bind(this);
        this.onPermissionSelect = this.onPermissionSelect.bind(this);
        this.handleClose = this.props.handleClose;
        this.onClickOkay = this.onClickOkay.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderSubmitRole = this.renderSubmitRole.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
    }

    componentWillMount() {
        if (this.state.role != null) {
            this.props.fetchOne(this.state.role);
        }
        this.props.fetchPermissions();
    }

    render() {
        if (this.props.role) {
            this.dataSource = this.props.form
        }
        if (typeof this.props.permissions !== 'undefined' && this.props.permissions !== null){
          this.permissionList = this.props.permissions;
          this.componentList = this.permissionList.map(
            (item) => {
              return { 'component': item.component };
          });
        }

        return(
              <div className="row form-container">
                  <div className="col col-lg-12 x_panel">
                      <div className="x_title">
                      <h2>Role Management <small>{ this.props.role ? "Edit" : "Add" } a role</small></h2>
                          <div className="clearfix"></div>
                      </div>
                      <div className="x_content">
                          <form className="form-horizontal form-label-left" onSubmit={ this.handleSubmit }>
                              <div className="form-group">
                                <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="role-title">Role <span className="required">*</span></label>
                                <div className="col-md-6 col-sm-6 col-xs-12">
                                  <input
                                    name="role"
                                    placeholder="Title"
                                    value={ this.state.role }
                                    type="text"
                                    id="role-title"
                                    className="form-control col-md-7 col-xs-12"
                                    onChange={ this.onTextChange }
                                  />
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="col-md-6 col-sm-6 col-xs-12 component-list">
                                    { this.renderComponents() }
                                </div>
                                <div className="col-md-6 col-sm-6 col-xs-12">
                                    { this.renderPermissions() }
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
                                  <button type="button"
                                  className="btn btn-primary"
                                  onClick={this.handleCancel}>
                                    Cancel
                                  </button>
                                  <button type="submit"
                                  className="btn btn-success"
                                  disabled={ !this.state.role }>
                                    Submit
                                  </button>
                                  <button type="button"
                                  className="btn btn-danger"
                                  disabled={ !this.props.role }
                                  onClick={this.handleDelete}>
                                    Delete
                                  </button>
                                </div>
                              </div>
                          </form>
                          <div className="clearfix"></div>
                      </div>
                      <ModalAlert
                        showDiscard={ true }
                        ref={ (modalAlert) => { this.modalAlert = modalAlert }}
                        onClickOkay= { this.onClickOkay }
                      />
                      <AuditModal
                        showModal={ this.state.showAuditModal }
                        onClickOkay={ this.formSubmit }
                      />
                  </div>
              </div>
        );
    }

    renderComponents() {
        if (this.componentList != null) {
            return(
            <div className="x_panel_overflow x_panel tile fixed_height_320">
              <div className="x_title">
                <h2>Asigning Permissions
                  <small> for { this.state.selectedComponent ? this.state.selectedComponent: "component" }</small>
                </h2>
                <div className="clearfix"></div>
              </div>
              <div className="x_content">
                <div className="dashboard-widget-content">
                  <ul className="to_do">
                  {
                      this.componentList.map((item, index) => {
                          return(
                              <li
                              className="list-group-item component-list-item"
                              key={ index }>
                                  <button type="button"
                                  name={ item.component }
                                  className="btn btn-primary component-btn"
                                  onClick={ this.onComponentSelect }>
                                      { item.component }
                                  </button>
                              </li>
                          );
                      })
                  }
                </ul>
              </div>
            </div>
          </div>
          );
      } else {
          return (
            <div className="x_panel_overflow x_panel tile fixed_height_320">
              <div className="x_title">
                <h2>No Component Available
                  <small>for permissions</small>
                </h2>
                <div className="clearfix"></div>
              </div>
              <div className="x_content">
                <div className="dashboard-widget-content">
                  <ul className="to_do">
                    <p>Ooops, No component available</p>
                  </ul>
                </div>
              </div>
            </div>
          );
        }
    }

    renderPermissions() {
        if (this.permissionList != null && this.state.selectedComponent != null) {
          return(
            <div className="x_panel_overflow x_panel tile fixed_height_320">
              <div className="x_title">
                <h2>{ this.state.selectedComponent }
                  <small>Available permissions</small>
                </h2>
                <div className="clearfix"></div>
              </div>
              <div className="x_content">
                <div className="dashboard-widget-content">
                  <ul className="to_do">
                  {
                      (() => {
                          let permissionIndex = this.permissionList.findIndex(
                              (item) => {
                                  return item.component === this.state.selectedComponent;
                              }
                          );
                          console.log("PermissionIndex inside permission list..",permissionIndex,this.permissionList[permissionIndex]);
                          let permission_list = [];
                          this.permissionList[permissionIndex].permissions.map((item, index) => {
                              permission_list.push(
                                  <li
                                  key={ index }>
                                  <div>
                                    <input
                                      type="checkbox"
                                      id={ item.permission }
                                      name={ item.permission }
                                      value={ item.permission }
                                      disabled={ this.isEditable(item.permission) }
                                      onChange={ this.onPermissionSelect }
                                      checked={ this.isDefaultChecked(item.permission) }/>
                                    <span className="perm_label">
                                      { item.permission }
                                    </span>
                                  </div>
                                  </li>
                              );
                          })
                          return permission_list;
                      })(this)
                  }
                  </ul>
                </div>
              </div>
            </div>
          );
      } else {
          return (
            <div className="x_panel_overflow x_panel tile fixed_height_320">
              <div className="x_title">
                <h2>No Component Selected
                  <small>for permissions</small>
                </h2>
                <div className="clearfix"></div>
              </div>
              <div className="x_content">
                <div className="dashboard-widget-content">
                  <ul className="to_do">
                    <p>Please select a component to assign permissions</p>
                  </ul>
                </div>
              </div>
            </div>
          );
        }
    }

    isDefaultChecked(permission) {
        if (this.state.permissions != null) {
            let selectedPermission = this.state.permissions.find(
                (item) => {
                    return item.permission == permission;
                }
            );
            if (typeof selectedPermission !== 'undefined') {
              return !!selectedPermission.permission_id;
            }
        }
        return false;
    }

    isEditable(permission) {
        if (this.state.permissions != null) {
            let selectedPermission = this.state.permissions.find(
                (item) => {
                    return item.permission == permission;
                }
            );
            if (typeof selectedPermission !== 'undefined') {
              return !!selectedPermission.dml_allowed;
            }
        }
        return false;
    }

    savePrevious() {
        if (this.state.selectedComponent != null && this.state.permissions != null) {
            let selectedComponent = this.state.selectedComponent;
            let permissions = this.state.permissions;
            let pushObj = {
                'component': selectedComponent,
                'permissions': permissions
            };
            if (this.dataSource == null) {
                this.dataSource = { 'components': [ pushObj ]};
            } else {
                let selectedPermissionsIndex = this.dataSource.components.findIndex(
                    (item) => {
                        return item.component == selectedComponent;
                    }
                );
                if (selectedPermissionsIndex == -1) {
                    this.dataSource.components.push(pushObj);
                } else {
                    this.dataSource.components[selectedPermissionsIndex].permissions = permissions;
                }
            }
        }
    }

    onTextChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onComponentSelect(e) {
        this.savePrevious();
        let selectedComponent = e.target.name;
        let permissions = null;
        if (this.dataSource != null) {
            let selectedPermissions = this.dataSource.components.filter(
                (item) => {
                    return item.component == selectedComponent;
                }
            );
            console.log(selectedComponent, "selectedPermissions...", selectedPermissions);
            if (selectedPermissions.length != 0) {
              permissions = selectedPermissions[0].permissions;
            }
        }
        this.setState({ selectedComponent: selectedComponent, permissions: permissions });
    }

    onPermissionSelect(e) {
        let targetName = e.target.name;
        let selectedComponent = this.state.selectedComponent;
        console.log("Clicked:", targetName, "on", selectedComponent);
        let permissionId = null, in_use = false, dml_allowed = false;
        if (this.permissionList != null) {
          let listElement = this.permissionList.find(
            (item) => {
              return item.component == selectedComponent;
            }
          );
          if (typeof listElement !== 'undefined') {
            let selectedPermission = listElement.permissions.find(
              (item) => {
                return item.permission == targetName;
            });
            console.log(selectedPermission);
            if (typeof selectedPermission !== 'undefined') {
              permissionId = selectedPermission.permission_id;
              dml_allowed = selectedPermission.dml_allowed;
            }
          }
        }
        let permissionObj = {
            'permission': targetName,
            'permission_id': permissionId,
            'dml_allowed': dml_allowed
        }
        if (this.state.permissions == null) {
            this.setState({ permissions: [ permissionObj ] });
        } else {
            let permissions = this.state.permissions;
            let permissionIndex = permissions.findIndex(
                (item) => {
                    return item.permission == targetName;
                }
            );
            if (permissionIndex == -1) {
                permissions.push(permissionObj);
            } else {
                permissions[permissionIndex].permission_id = permissions[permissionIndex].permission_id ? null : 1;
            }
            this.setState({ permissions: permissions });
        }
    }

    onClickOkay(e) {
        if (this.buttonClicked == 'Cancel') {
            this.handleClose();
        } else {
            this.setState({ showAuditModal: true });
        }
    }

    handleCancel(e) {
        this.buttonClicked = "Cancel";
        this.modalAlert.open("Are you sure to cancel all the changes?");
    }

    handleDelete(e) {
        this.buttonClicked = "Delete";
        this.modalAlert.open("Are you sure to delete this role?");
    }

    handleSubmit(e) {
        e.preventDefault();
        this.buttonClicked = "Submit";
        this.modalAlert.open(this.renderSubmitRole());
    }

    formSubmit(form) {
        if (this.buttonClicked == 'Delete') {
            console.log("410:", form.comment);
            this.props.deleteRow(this.state.role, form.comment);
        } else if (this.buttonClicked == 'Submit') {
            this.savePrevious();
            if (this.dataSource != null) {
                let formData = { ...this.dataSource, role: this.state.role, comment: form.comment } ;
                console.log("Submiting form data:", formData);
                this.props.submitForm(formData)
            } else {
                console.log("Nothing to commit, no data found!");
            }
        }
        this.handleClose();
    }

    renderSubmitRole() {
      this.savePrevious();
      if (this.dataSource != null) {
          let formData = { ...this.dataSource, role: this.state.role} ;
          return(
            <div className="row">
              <div className="col-md-10">
                <h4>Do you want to submit changes for this role?</h4>
              </div>
              <div key={formData.role} >
                <ViewRole item={formData}/>
              </div>
            </div>
          );
        } else {
            return("Nothing to commit, no data found!");
        }
    }
}

function mapStateToProps(state) {
    return {
        form: state.role_management.form,
        components: state.role_management.components,
        permissions: state.role_management.permissions,
        message: state.role_management.message
    };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchOne: (role) => {
        dispatch(actionFetchRoles(role));
    },
    fetchPermissions: () => {
        dispatch(actionFetchPermissions());
    },
    deleteRow: (role, comment) => {
        dispatch(actionDeleteRoles(role, comment));
    },
    submitForm: (data) => {
        dispatch(actionUpdateRoles(data));
    }
  };
};

const VisibleAddRoles = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddRolesComponent);

export default VisibleAddRoles;
