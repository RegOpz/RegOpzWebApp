import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router';
import { Label, Checkbox, Tab, Tabs } from 'react-bootstrap';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { bindActionCreators, dispatch } from 'redux';
import moment from 'moment';
import {
    actionFetchRoles,
    actionUpdateRoles,
    actionDeleteRoles
} from '../../../actions/RolesAction';
import Breadcrumbs from 'react-breadcrumbs';
import AuditModal from '../../AuditModal/AuditModal';
import ModalAlert from '../../ModalAlert/ModalAlert';
import ViewRole from '../ViewRole';
import SourcePermissions from './SourcePermissions';
import ReportPermissions from './ReportPermissions';
import ComponentPermissions from './ComponentPermissions';
require('./AddRoles.css');

class AddRolesComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            role: this.props.role,
            showAuditModal: false,
            selectedTab: 0,
            fetched: null,
        };
        this.domainInfo = this.props.login_details.domainInfo;
        this.subscribedComponents = JSON.parse(this.domainInfo.subscription_details);
        this.formData = [];
        this.components = null;
        this.sources = null;
        this.reports = null;
        this.modalAlert = null;
        this.buttonClicked = null;
        this.grouId = this.props.user + "PRMS" + moment.utc();

        this.onTextChange = this.onTextChange.bind(this);

        this.handleClose = this.props.handleClose;
        this.onClickOkay = this.onClickOkay.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderSubmitRole = this.renderSubmitRole.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
        this.checkRoleName = this.checkRoleName.bind(this);
    }

    componentWillMount() {
        if (this.state.role != null) {
            this.props.fetchOne(this.props.tenant_id,this.state.role,"N" );
        } else {
            this.props.fetchOne(this.props.tenant_id,'Default',"N");
        }
        // this.props.fetchPermissions();
    }

    componentWillReceiveProps(nextProps) {
        console.log("Role names: ",this.state.role,nextProps.form.role,nextProps.form);
        if (this.state.role == nextProps.form.role || (!this.state.role && nextProps.form.role=="Default")) {
          this.sources = nextProps.form.sources;
          this.reports = nextProps.form.reports;
          this.components = [];
          // Only subscribed components will be available for role assignment
          nextProps.form.components.map(
            (item) => {
              let isSubscribed = this.domainInfo.tenant_id=="regopz" ? true : this.subscribedComponents ? this.subscribedComponents[item.component] : false;
              if (isSubscribed) this.components.push(item);
          });
        }
        // this.props.fetchPermissions();
    }

    render() {

        console.log("Redering...",this.components,this.props.form);

        if (typeof this.components !== 'undefined' && this.components !== null){
          console.log("Redering...inside undefined ...",this.props.form);
          // this.sources = this.props.form.sources;
          // this.reports = this.props.form.reports;
          // this.components = [];
          // // Only subscribed components will be available for role assignment
          // this.props.form.components.map(
          //   (item) => {
          //     let isSubscribed = this.domainInfo.tenant_id=="regopz" ? true : this.subscribedComponents ? this.subscribedComponents[item.component] : false;
          //     if (isSubscribed) this.components.push(item);
          // });
        } else {
          return(
            <h4>Loading....</h4>
          )
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
                                <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="role-title"><i className="fa fa-rocket"></i>{' Role '}<span className="required">*</span></label>
                                <div className="col-md-4 col-sm-4 col-xs-12">
                                  <input
                                    name="role"
                                    placeholder="Title"
                                    value={ this.state.role }
                                    type="text"
                                    id="role-title"
                                    className="form-control col-md-4 col-xs-12"
                                    readOnly={this.props.role}
                                    onChange={ this.onTextChange }
                                  />
                                </div>
                                {
                                  !this.props.role &&
                                  this.state.roleExists != undefined &&
                                  <span className="red" ><i className="fa fa-warning"></i>{' Role name alreay exists!'}</span>
                                }
                              </div>
                              <Tabs
                                defaultActiveKey={0}
                                activeKey={this.state.selectedTab}
                                onSelect={(key) => {
                                    this.setState({selectedTab:key});
                                }}
                                >
                                <Tab
                                  key={0}
                                  eventKey={0}
                                  title={<div className="green"><i className="fa fa-support"></i> Components</div>}
                                >
                                  <div className="form-group">
                                  {
                                    this.components &&
                                    <ComponentPermissions
                                      role = { this.state.role }
                                      componentPermissions = { this.components }
                                      />
                                  }
                                  </div>
                                </Tab>
                                {
                                  this.props.tenant_id !='regopz' && // regopz tenant_id for master which does not have any source
                                  <Tab
                                    key={1}
                                    eventKey={1}
                                    title={<div className="blue"><i className="fa fa-rss"></i> Sources</div>}
                                  >
                                    <div className="form-group">
                                    {
                                      this.sources &&
                                      <SourcePermissions
                                        role = { this.state.role }
                                        sourcePermissions = { this.sources }
                                        />
                                    }
                                    </div>
                                  </Tab>
                                }
                                <Tab
                                  key={2}
                                  eventKey={2}
                                  title={<div className="amber"><i className="fa fa-file-text"></i> Reports</div>}
                                >
                                <div className="form-group">
                                {
                                  this.reports &&
                                  <ReportPermissions
                                    role = { this.state.role }
                                    reportPermissions = { this.reports }
                                    />
                                }
                                </div>
                                </Tab>
                              </Tabs>
                              <div className="form-group">
                                <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
                                  <button type="button"
                                  className="btn btn-primary"
                                  onClick={this.handleCancel}>
                                    Cancel
                                  </button>
                                  <button type="submit"
                                  className="btn btn-success"
                                  disabled={ !this.state.role || this.state.roleExists }>
                                    Submit
                                  </button>
                                  {
                                    this.props.role &&
                                    <button type="button"
                                    className="btn btn-danger"
                                    disabled={ !this.props.role }
                                    onClick={this.handleDelete}>
                                      Delete
                                    </button>
                                  }
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

    onTextChange(e) {
        let roleExists = this.checkRoleName(e.target.value);
        this.setState({ [e.target.name]: e.target.value, roleExists: roleExists });
    }

    checkRoleName(role){
        let a = this.props.roles.find(function(rec){return rec.role.toLowerCase() == role.trim().toLowerCase();});
        // console.log("Value of checkRoleName...", a)
        return a;
    }

    onClickOkay(e) {
        if (this.buttonClicked == 'Cancel') {
            this.handleClose();
        } else {
            if(this.modalAlert.isDiscardToBeShown){
              this.setState({ showAuditModal: true });
            } else {
              this.handleClose();
            }
        }
    }

    handleCancel(e) {
        this.buttonClicked = "Cancel";
        console.log("Values of the permissions...",this.props.form.sources)
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
            let components = [];
            this.components.map((item,index)=>{
                let permissions=item.permissions.filter(p=>(["EDITED"].includes(p.status)));
                if (permissions.length > 0) {
                  components.push({
                    component: item.component,
                    permissions: permissions
                  });
                }
            })
            let sources = this.sources.filter(p=>(p.status=="EDITED"));
            let reports = this.reports.filter(p=>(p.status=="EDITED"));
            console.log("Inside formSubmit...", components,sources,reports);
            if (components.length > 0 || sources.length >0 || reports.length > 0) {
                let formData = {
                                components: components,
                                sources: sources,
                                reports: reports,
                                role: this.state.role.trim(),
                                comment: form.comment,
                                maker: this.props.user,
                                maker_tenant_id: this.props.tenant_id,
                                group_id: this.grouId} ;
                console.log("Submiting form data:", formData);
                this.props.submitForm(formData)
            } else {
                console.log("Nothing to commit, no changes found!");
            }
        }
        this.handleClose();
    }

    renderSubmitRole() {
      let components = [];
      this.components.map((item,index)=>{
          let permissions=item.permissions.filter(p=>(["EDITED"].includes(p.status)));
          if (permissions.length > 0) {
            components.push({
              component: item.component,
              permissions: permissions
            });
          }
      })
      let sources = this.sources.filter(p=>(p.status=="EDITED"));
      let reports = this.reports.filter(p=>(p.status=="EDITED"));

      if (components.length > 0 || sources.length >0 || reports.length > 0) {
          let formData = { components: this.components, sources: this.sources, reports: this.reports , role: this.state.role} ;
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
            this.modalAlert.isDiscardToBeShown = false;
            return("Nothing to commit, no changes found!");
        }
    }
}

function mapStateToProps(state) {
    return {
        form: state.role_management.form,
        roles: state.role_management.data,
        // components: state.role_management.components,
        // permissions: state.role_management.permissions,
        message: state.role_management.message,
        login_details:state.login_store,
    };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchOne: (tenant_id,role, inUseCheck) => {
        dispatch(actionFetchRoles(tenant_id,role, inUseCheck));
    },
    // fetchPermissions: () => {
    //     dispatch(actionFetchPermissions());
    // },
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
