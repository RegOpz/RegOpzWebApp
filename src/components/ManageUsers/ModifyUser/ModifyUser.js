import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { dispatch } from 'redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import Breadcrumbs from 'react-breadcrumbs';
import {
    actionFetchUsers,
    actionUpdateUser,
    actionDeleteUser
} from '../../../actions/UsersAction';
import {
    actionFetchRoles
} from '../../../actions/RolesAction';
import ViewRole from '../../ManageRoles/ViewRole';
require('./ModifyUser.css');

const selector = formValueSelector('edit-user');

const renderField = ({ input, label, type, readOnly, meta: { touched, error }}) => (
    <div className="form-group">
      <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor={label}>
        { label }
        <span className="required">*</span>
      </label>
      <div className="col-md-9 col-sm-9 col-xs-12">
        <input {...input}
         placeholder={label}
         type={type}
         id={label}
         readOnly={ readOnly }
         className="form-control col-md-4 col-xs-12"/>
         {
            touched &&
            ((error &&
            <div className="red">
              { error }
            </div>))
         }
      </div>
    </div>
);

const renderSelect = ({ input, label, options, defaultOption, meta: { touched, error }}) => (
    <div className="form-group">
      <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor={label}>
        { label }
        <span className="required">*</span>
      </label>
      <div className="col-md-9 col-sm-9 col-xs-12">
        <select {...input}
         id={label}
         defaultValue={ defaultOption }
         className="form-control col-md-4 col-xs-12">
         {
            ((options) => {
                let optionList = [];
                options.map((item, index) => {
                    optionList.push(
                        <option key={index} value={item.role}>
                            { item.role }
                        </option>
                    );
                });
                return optionList;
            })(options)
          }
          </select>
          {
              touched &&
              ((error &&
               <div className="red">
                 { error }
               </div>))
           }
        </div>
    </div>
);

const normaliseContactNumber = value => value && value.replace(/[^\d]/g, '');

const validate = (values) => {
    const errors = {};
    console.log("Inside validate", values);

    Object.keys(values).forEach((item) => {
        if (! values[item]) {
            errors[item] = `${item} cannot be empty.`;
        }
    });

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.Email)) {
        errors.Email = "Invalid email address.";
    }

    if (isNaN(Number(values["Contact Number"]))) {
        errors["Contact Number"] = "Must be a number.";
    }

    console.log("End of validate", errors);
    return errors;
}

class ModifyUser extends Component {
    constructor(props) {
        super(props);
        this.userIndex = this.props.location.query['userId'];
        this.dataSource = null;
        this.initialValues = {};
        this.shouldUpdate = true;
        this.userStatus = "Delete";
        this.buttonDeleteActivateClass = "btn btn-danger";
        this.renderForm = this.renderForm.bind(this);
        this.renderFields = this.renderFields.bind(this);
        this.renderSelectOption = this.renderSelectOption.bind(this);
        this.renderPermissions = this.renderPermissions.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleEditButtonClicked = this.handleEditButtonClicked.bind(this);
    }

    componentWillMount() {
        //console.log("Inside componentWillMount", this.initialValues, this.shouldUpdate)
        if (typeof this.userIndex !== 'undefined' && this.userIndex != null) {
            this.props.fetchUser(this.userIndex);
            this.props.fetchRoles();
        } else {
            hashHistory.push(encodeURI('/dashboard'));
        }
    }

    componentWillUpdate() {
        console.log("Inside componentWillUpdate", this.initialValues, this.shouldUpdate);
        if (this.shouldUpdate) {
            this.props.initialize(this.initialValues);
            this.shouldUpdate = false;
        }
    }

    componentDidUpdate() {
        //console.log("Inside componentDidUpdate", this.initialValues);
        //this.shouldUpdate = ! this.shouldUpdate;
    }


    componentDidMount(){
          //console.log("Inside componentDidMount", this.initialValues, this.shouldUpdate)
          document.title = "RegOpz Dashboard | Edit User";
    }

    render() {
        if (typeof this.props.userDetails !== 'undefined' && this.props.userDetails != null) {
            this.dataSource = this.props.userDetails[0];
        }
        //console.log("Inside Modify User Render:", this.dataSource);
        return(
            <div>
              { this.renderForm() }
            </div>
        );
    }

    renderForm() {
        const { dataSource, userStatus, renderFields, renderPermissions, handleFormSubmit, handleCancel, handleDelete, buttonDeleteActivateClass } = this;
        const { handleSubmit, pristine, dirty, submitting, roleList, selectedRole } = this.props;
        if (dataSource == null) {
            return(<h1>Loading...</h1>);
        } else if (typeof dataSource == 'undefined') {
            return (<h1>Data not found...</h1>);
        }
        return(
            <div className="row form-container">
              <div className="x_panel">
                <div className="x_title">
                  <h2>User Management <small>Edit User and Permissions</small></h2>
                  <div className="clearfix"></div>
                </div>
                <div className="x_content">
                  <form className="form-horizontal form-label-left" onSubmit={ handleSubmit(handleFormSubmit) }>
                    { renderFields(dataSource.info, roleList) }
                    <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
                    {
                        renderPermissions(roleList, selectedRole)
                    }
                    </div>
                    <div className="form-group">
                      <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
                        <button type="button" className="btn btn-primary" onClick={ handleCancel } disabled={ submitting }>
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-success" disabled={ pristine || submitting }>
                          Submit
                        </button>
                        <button type="button" className={ buttonDeleteActivateClass } onClick={ handleDelete } disabled={ dirty || submitting }>
                          { userStatus }
                        </button>
                      </div>
                   </div>
                  </form>
                  <div className="clearfix"></div>
                </div>
              </div>
            </div>
        );
    }

    renderFields(inputList, roleList) {
        let fieldArray = [];
        let localValues = {};
        typeof inputList != 'undefined' && inputList.map((item, index) => {
            if (item.title == "Status") {
                if (item.value != "Active") {
                  this.userStatus = "Activate";
                  this.buttonDeleteActivateClass = "btn btn-warning";
                } else {
                  this.userStatus = "Delete";
                  this.buttonDeleteActivateClass = "btn btn-danger";
                }
            }
            fieldArray.push(
                item.title == "Role" ?
                this.renderSelectOption(roleList, item.value) :
                <Field
                  key={index}
                  name={ item.title }
                  type="text"
                  component={renderField}
                  label={ item.title }
                  normalize={ item.title == "Contact Number" ? normaliseContactNumber : null}
                  readOnly={ item.title == "Status" || item.title == "User Name" }
                />
            );
            localValues[item.title] = item.value;
        });
        if (this.initialValues["User Name"] !== localValues["User Name"]) {
            this.shouldUpdate = true;
            this.initialValues = localValues;
        }
        return fieldArray;
    }

    renderSelectOption(roleList, defaultRole) {
        if (typeof roleList === 'undefined' || roleList == null) {
            return(
                <Field
                  key="role"
                  name="Role"
                  type="text"
                  component={renderField}
                  label="Role"
                  readOnly={ true }
                />
            );
        }
        return(
            <Field
              key="role"
              name="Role"
              type="text"
              label="Role"
              component={renderSelect}
              options={roleList}
              defaultOption={defaultRole}
            />
        );
    }

    renderPermissions(roleList, selectedRole) {
        if (roleList != null && selectedRole != null) {
            let permission = roleList.find((item, index) => item.role == selectedRole);
            if (typeof permission !== 'undefined' && permission != null) {
                return(
                    <ViewRole
                      item={permission}
                      handleButtonClicked={this.handleEditButtonClicked.bind(this)}/>
                );
            }
            return(<h2>No role found!</h2>);
        } else {
            return(<h2>Loading...</h2>);
        }
    }

    handleEditButtonClicked(role) {
      hashHistory.push(encodeURI('/dashboard/manage-roles'));
    }

    handleFormSubmit(data) {
        console.log('User Details Submitted!', data);
        this.props.submitUser(data);
        this.shouldUpdate = true;
        this.handleCancel();
    }

    handleCancel(event) {
        hashHistory.push(encodeURI('/dashboard/manage-users'));
    }

    handleDelete(event) {
        this.props.deleteUser(this.userIndex);
        this.handleCancel();
    }
}

function mapStateToProps(state) {
    //console.log("On map state of Manage Users:", state);
    return {
        userDetails: state.user_details.error,
        roleList: state.role_management.data,
        selectedRole: selector(state, 'Role')
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUser: (data) => {
            dispatch(actionFetchUsers(data));
        },
        fetchRoles: () => {
            dispatch(actionFetchRoles());
        },
        submitUser: (data) => {
            dispatch(actionUpdateUser(data));
        },
        deleteUser: (data) => {
            dispatch(actionDeleteUser(data));
        }
    };
};

const VisibleModifyUser = connect(
    mapStateToProps,
    mapDispatchToProps
)(ModifyUser);

export default reduxForm({
    form: 'edit-user',
    validate
})(VisibleModifyUser);
