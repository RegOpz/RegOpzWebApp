import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { dispatch } from 'redux';
import { Tab, Tabs } from 'react-bootstrap';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import _ from 'lodash';
import Breadcrumbs from 'react-breadcrumbs';
import {
  actionUpdateTenant
} from '../../../actions/TenantsAction';
import ModifyConnection from './ModifyConnection';
require('./ModifySubscriber.css');

const renderField = ({ input, label, type, readOnly, meta: { touched, error }}) => (
    <div className="form-group">
      <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor={label}>
        { label }
        <span className="required">*</span>
      </label>
      <div className="col-md-9 col-sm-9 col-xs-12">
        { type=="text" &&
          <input {...input}
           placeholder={label}
           type={type}
           id={label}
           readOnly={ readOnly }
           className="form-control col-md-4 col-xs-12"/>
        }
        { type=="textarea" &&
          <textarea {...input}
           placeholder={label}
           type={type}
           id={label}
           readOnly={ readOnly }
           className="form-control col-md-4 col-xs-12"/>
        }
        {
          type=="date" &&
          <DatePicker {...input}
           placeholderText={label}
           id={label}
           dateFormat="DD-MMM-YYYY"
           selected={input.value ? moment(input.value, 'DD-MMM-YYYY') : null}
           showMonthDropdown
           showYearDropdown
           monthsShown={2}
           className="view_data_date_picker_input form-control"/>
        }
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
            errors[item] = `${_.capitalize(item.replace(/\_/g,' '))} cannot be empty.`;
        }
    });

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.tenant_email)) {
        errors.tenant_email = "Invalid email address.";
    }

    if (moment(values.subscription_end_date,'DD-MMM-YYYY') < moment(values.subscription_start_date,'DD-MMM-YYYY')) {
        errors.subscription_end_date = "Subscription end date can not be earlier than start date.";
    }

    if (isNaN(Number(values["Contact Number"]))) {
        errors["Contact Number"] = "Must be a number.";
    }

    console.log("End of validate", errors);
    return errors;
}

class ModifySubscriber extends Component {
    constructor(props) {
        super(props);
        this.state = {
          editConnection: false,
          connDetails: null,
          connType: null,
          selectedTab: 0,
        }
        this.toInitialise = true;
        this.userIndex = null; //this.props.location.query['userId'];
        this.dataSource = this.props.subscriberDetails;

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.saveConnChanges = this.saveConnChanges.bind(this);
    }

    componentWillMount() {
        // TODO
    }

    componentWillUpdate() {
        // TODO
    }

    componentDidUpdate() {
        // TODO
        // console.log("Inside componentDidUpdate.......",this.dataSource)
        if (this.toInitialise) {
            this.props.initialize(this.dataSource);
            this.toInitialise = false;
        }
    }


    componentDidMount(){
          //console.log("Inside componentDidMount", this.initialValues, this.shouldUpdate)
          document.title = "RegOpz Dashboard | Edit Subscriber";
          if (this.toInitialise) {
              this.props.initialize(this.dataSource);
              this.toInitialise = false;
          }
    }

    render() {
        // console.log("Inside Modify Subscriber Render:", this.dataSource);
        return(
            <div>
              { this.renderForm() }
            </div>
        );
    }

    renderForm() {
        const { dataSource, renderFields, handleFormSubmit, handleCancel, handleDelete } = this;
        const { handleSubmit, pristine, dirty, submitting } = this.props;
        if (dataSource == null) {
            return(<h1>Loading...</h1>);
        } else if (typeof dataSource == 'undefined') {
            return (<h1>Data not found...</h1>);
        }
        return(
            <div className="form-container">
              <div className="x_panel">
                <div className="x_title">
                  <h2><span className="truncate-text">{dataSource.tenant_description}</span> Details <small>Edit Subscriber Details</small></h2>
                    <ul className="nav navbar-right panel_toolbox">
                      <li>
                        <a className="close-link" onClick={handleCancel}><i className="fa fa-close"></i></a>
                      </li>
                    </ul>
                  <div className="clearfix"></div>
                </div>
                <div className="x_content">
                  <form className="form-horizontal form-label-left" onSubmit={handleSubmit(handleFormSubmit)}>
                    <Tabs
                      defaultActiveKey={0}
                      activeKey={this.state.selectedTab}
                      onSelect={(key) => {
                          this.setState({selectedTab:key
                            });
                      }}
                      >
                      <Tab
                        key={0}
                        eventKey={0}
                        title={"General Information"}
                      >
                      <div className="">
                        <div className="x_panel">
                          <div className="x_title">
                            <h5>{ "Subscriber Details"}<small> Edit Details</small></h5>
                            <div className="clearfix"></div>
                          </div>
                          <div className="x_content">
                            { renderFields(dataSource) }
                            <div className="clearfix"></div>
                          </div>
                        </div>
                      </div>
                      </Tab>
                      <Tab
                        key={1}
                        eventKey={1}
                        title={"Connections"}
                      >
                        <div className="x_panel">
                          <div className="x_title">
                            <h5>Connections<small> Edit connection details</small></h5>
                            <div className="clearfix"></div>
                          </div>
                          <div className="x_content">
                          <button type="button" className="btn btn-sm btn-link"
                            onClick={()=>{
                                      this.setState({editConnection: true,
                                        connType: "tenant",
                                        connDetails: JSON.parse(dataSource.tenant_conn_details)})
                                      }
                                    }
                            disabled={ submitting }>
                            <i className="fa fa-leaf"></i>
                            { " Edit Tenant Space Connection" }
                          </button>
                          <button type="button" className="btn btn-sm btn-link"
                            onClick={()=>{
                                      this.setState({editConnection: true,
                                        connType: "master",
                                        connDetails: JSON.parse(dataSource.master_conn_details)})
                                      }
                                    }
                            disabled={ submitting }>
                            <i className="fa fa-sitemap"></i>
                            { " Edit Master Space Connection" }
                          </button>
                          {
                            this.state.editConnection ?
                            <ModifyConnection
                              connType = { this.state.connType }
                              connDetails={ this.state.connDetails }
                              saveConnChanges={ this.saveConnChanges }/>
                            :
                            <div className="separator"><h5>Please select a connection type to proceed.</h5></div>
                          }
                        </div>
                        </div>
                      </Tab>
                      <Tab
                        key={2}
                        eventKey={2}
                        title={"Subscribed Component"}
                      >
                        <div className="x_content">
                          <h5><i className="fa fa-cogs"></i> <i className="fa fa-wrench"></i>  Construction in progress ....</h5>
                        </div>
                      </Tab>
                    </Tabs>

                    <div className="form-group">
                      <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
                        <button type="button" className="btn btn-primary" onClick={handleCancel} disabled={ submitting }>
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-success" disabled={ pristine || submitting }>
                          Submit
                        </button>
                        <button type="button" className={"btn btn-warning"} onClick={handleDelete} disabled={ dirty || submitting }>
                          Deactivate
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

    renderFields(data) {
        console.log("inputList....", data);
        let fieldArray = [];
        let localValues = {};
        const inputList = Object.keys(data);
        inputList.sort().map((item, index) => {
            ['master_conn_details','tenant_conn_details','id','subscription_details'].includes(item) ?
            '':
            fieldArray.push(
                <Field
                  key={index}
                  name={ item }
                  type= { item.match("date") ? "date" : item.match(/address|description/)? "textarea":"text" }
                  component={renderField}
                  label={ _.capitalize(item.replace(/\_/g,' ')) }
                  normalize={ item == "tenant_phone" ? normaliseContactNumber : null}
                  readOnly={ item == "tenant_id" || item == "id" }
                />
            );
        });
        return fieldArray;
    }


    handleFormSubmit(data) {
        // console.log('User Details Submitted!', data);
        let newData = data;
        newData.tenant_conn_details = this.dataSource.tenant_conn_details;
        newData.master_conn_details = this.dataSource.master_conn_details;
        // console.log('User Details Submitted! and new data is: ', newData);
        this.props.updateTenant(newData);
        this.handleCancel();
    }

    saveConnChanges(data,connType){
        // console.log("Inside saveConnChanges....", data, connType);
        if (connType == "tenant"){
            this.dataSource.tenant_conn_details = JSON.stringify(data);
          }
        if (connType == "master"){
            this.dataSource.master_conn_details = JSON.stringify(data);
          }
        // console.log("Inside end of saveConnChanges....", this.dataSource);
    }

    handleCancel(event) {
        this.props.onCancel();
    }

    handleDelete(event) {
        this.handleCancel();
    }
}

function mapStateToProps(state) {
    //console.log("On map state of Manage Users:", state);
    return {
        login_details:state.login_store,
        tenantDetails: state.tenant_details,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateTenant: (data) => {
            dispatch(actionUpdateTenant(data));
        },
    };
};

const VisibleModifySubscriber = connect(
    mapStateToProps,
    mapDispatchToProps
)(ModifySubscriber);

export default reduxForm({
    form: 'edit-subscriber',
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
    validate
})(VisibleModifySubscriber);
