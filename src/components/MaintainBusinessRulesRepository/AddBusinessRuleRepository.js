import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { Button } from 'react-bootstrap';
import _ from 'lodash';
import {
  actionFetchBusinessRules,
  actionInsertBusinessRule,
  actionUpdateBusinessRule
} from '../../actions/BusinessRulesRepositoryAction';

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
           maxLength={ input.name=="audit_comment" ? 1000 : 3000 }
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

const asyncValidate = (values, dispatch) => {
  return dispatch(actionFetchBusinessRules(values.country,values.business_rule.toUpperCase()))
    .then((action) => {
        console.log("Inside asyncValidate, promise resolved");
        let error = action.payload.data;
        console.log("Inside asyncValidate value of error", error,values.requestType,error.rows.length);
        if (error.rows.length > 0) {
            console.log("Inside asyncValidate", error);
            if(values.requestType!="update"){
                throw { business_rule: "Rule Tag exists, please try a different Tag Name or edit the existing Tag!" , donotUseMiddleWare: true };
            }
        }
     });
}

const normaliseContactNumber = value => value && value.replace(/[^\d]/g, '');

const validate = (values) => {
    const errors = {};
    console.log("Inside validate", values);

    Object.keys(values).forEach((item) => {
        if (! values[item] && !['last_updated_by','country'].includes(item)) {
            errors[item] = `${_.capitalize(item.replace(/\_/g,' '))} cannot be empty.`;
        }
    });
    if (values.business_rule && (values.business_rule.length< 3 || values.business_rule.length > 10)) {
        errors.business_rule = "Rule Tag must be greater than 2 characters and less than 10 characters.";
    }
    if (values.audit_comment && values.audit_comment.length< 20) {
        errors.audit_comment = "Audit comment must be greater than 30 characters.";
    }
    console.log("End of validate", errors);
    return errors;
}

class AddBusinessRuleRepository extends Component {
  constructor(props) {
    super(props);
    this.requestType = (this.props.businessRule && this.props.businessRule.id) ? "update":"add";
    this.readOnly = !this.props.editable;
    this.dataSource = this.props.businessRule;
    Object.assign(this.dataSource,{requestType: this.requestType})
    this.toInitialise = true;

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.renderForm = this.renderForm.bind(this);

  }

  componentWillMount() {
    // TODO
  }

  componentWillReceiveProps(nextProps) {
    // TODO
  }

  componentDidUpdate() {
    // TODO
    if (this.toInitialise) {
        this.props.initialize(this.dataSource);
        this.toInitialise = false;
    }
  }

  componentDidMount(){
        //console.log("Inside componentDidMount", this.initialValues, this.shouldUpdate)
        document.title = "RegOpz Dashboard | Edit Business Rule Repository";
        if (this.toInitialise) {
            this.props.initialize(this.dataSource);
            this.toInitialise = false;
        }
  }

  render() {
    return(
        <div>
          { this.renderForm() }
        </div>
    );
  }

  renderForm(){
    const { dataSource, renderFields, handleFormSubmit, handleCancel } = this;
    const { handleSubmit, pristine, dirty, submitting } = this.props;
    return(
      <div className="row">
        <div className="x_panel">
          <div className="x_title">
            <h2>Manage Rule <small>{ dataSource.business_rule ? `Edit rule ${dataSource.business_rule}` : "Add a new rule"}</small></h2>
            <ul className="nav navbar-right panel_toolbox">
              <li>
                <a className="close-link" onClick={handleCancel}><i className="fa fa-close"></i></a>
              </li>
            </ul>
            <div className="clearfix"></div>
          </div>
          <div className="x_content">
            <br />
            <form className="form-horizontal form-label-left"
              onSubmit={handleSubmit(handleFormSubmit)}
            >
              <Field
                key={1}
                name={ "country" }
                type= { "text" }
                component={renderField}
                label={ "Country Code" }
                normalize={ null}
                readOnly={ true }
              />
              <Field
                key={2}
                name={ "business_rule" }
                type= { "text" }
                component={renderField}
                label={ "Rule Tag" }
                normalize={ null}
                readOnly={ this.readOnly || this.requestType == "update" }
              />
              <Field
                key={3}
                name={ "rule_description" }
                type= { "textarea" }
                component={renderField}
                label={ "Rule Description" }
                normalize={ null}
                readOnly={ this.readOnly }
              />
              <Field
                key={4}
                name={ "last_updated_by" }
                type= { "text" }
                component={renderField}
                label={ "Last Updated by" }
                normalize={ null}
                readOnly={ true }
              />
              { !this.readOnly &&
                <Field
                  key={5}
                  name={ "audit_comment" }
                  type= { "textarea" }
                  component={renderField}
                  label={ "Audit Comment" }
                  normalize={ null}
                  readOnly={ false }
                />
              }
              <div className="form-group">
                <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
                  <button type="button" className="btn btn-primary" onClick={handleCancel} disabled={ submitting }>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success" disabled={ pristine || submitting }>
                    Submit
                  </button>
                </div>
             </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  handleCancel(){
    //TODO
    this.props.handleCancel(event);
  }

  handleFormSubmit(formData) {
    console.log('inside submit', formData);
    let update_info = {
        id: formData.id,
        country: formData.country,
        business_rule: formData.business_rule.toUpperCase(),
        rule_description: formData.rule_description,
        last_updated_by: this.requestType == 'add' ? this.props.login_details.user: formData.last_updated_by,
    }

    let data = {
      table_name: "business_rules_master",
      update_info: update_info
    };

    // add audit info to the data part
    data['change_type'] = this.requestType == 'add' ? 'INSERT' : 'UPDATE';

    let audit_info = {
      id: formData.id,
      table_name: data.table_name,
      change_type: data.change_type,
      change_reference: `Rule: ${formData.business_rule.toUpperCase()} of Country: ${formData.country}`,
      maker: this.props.login_details.user,
      maker_tenant_id: this.props.login_details.domainInfo.tenant_id,
      group_id: this.props.groupId,
    };
    Object.assign(audit_info, {comment: formData.audit_comment});

    data['audit_info'] = audit_info;

    if (this.requestType == "add") {
      this.props.insertBusinessRule(data);
    }
    else {
      this.props.updateBusinessRule(data);
    }

    this.props.handleClose(event);
  }
}
function mapStateToProps(state) {
  console.log("On map state of Add Business rule repository ", state);
  return {
    login_details: state.login_store,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    insertBusinessRule: (item) => {
      dispatch(actionInsertBusinessRule(item))
    },
    updateBusinessRule: (item) => {
      dispatch(actionUpdateBusinessRule(item))
    }
  }
}
const VisibleAddBusinessRuleRepository = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddBusinessRuleRepository);

export default reduxForm({
    form: 'edit-rule-repo',
    validate,
    asyncValidate,
    asyncBlurFields: ['business_rule']
})(VisibleAddBusinessRuleRepository);
