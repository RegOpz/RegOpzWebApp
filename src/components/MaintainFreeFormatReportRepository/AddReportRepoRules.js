import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import {bindActionCreators, dispatch} from 'redux';
import DatePicker from 'react-datepicker';
import _ from 'lodash';
import {
  Link,
  hashHistory
} from 'react-router';
import { WithOutContext as ReactTags } from 'react-tag-input';
import {
  actionFetchBusinessRules,
} from '../../actions/BusinessRulesRepositoryAction';
import {
  actionInsertRuleData,
  actionUpdateRuleData
} from '../../actions/ReportRulesRepositoryAction';

import AddReportRepoRulesStep1 from './AddReportRepoRulesStep1';
import AddReportRepoRulesStep2 from './AddReportRepoRulesStep2';
import AddReportRepoRulesStep3 from './AddReportRepoRulesStep3';
import ModalAlert from '../ModalAlert/ModalAlert';

class AddReportRules extends Component {
  constructor(props) {
    super(props);
    this.state = {
        step: 1,
        display: null,
        form: this.props.form,
        audit_form:{
          comment:null
        }
    };


    this.getStepClassName = this.getStepClassName.bind(this);
    this.handleNextStep = this.handleNextStep.bind(this);
    this.handlePrevStep = this.handlePrevStep.bind(this);

    this.handleEditCalcRule = this.handleEditCalcRule.bind(this);
    this.handleChangeRule = this.handleChangeRule.bind(this);
    this.handleSetFormValues = this.handleSetFormValues.bind(this);
    this.handleSetAuditFormValues = this.handleSetAuditFormValues.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.requestType = this.props.requestType;
    this.dml_allowed = this.props.form.dml_allowed === 'Y' ? true : false;
    this.writeOnly = this.props.writeOnly;
  }

  componentWillMount() {
    const { form } = this.props;
    this.setState({form: form,
                    rulesTags: [],
                    step: 1,
                  },
                ()=>{
                  this.props.fetchBusinessRules(this.props.country);
                });
  }

  componentWillReceiveProps(nextProps) {
    if(!_.isEqual(this.props.form, nextProps.form)){
      const { form } = nextProps;
      this.setState({form: form,
                      rulesTags: [],
                      step: 1,
                    },
                  ()=>{
                    this.props.fetchBusinessRules(this.props.country);
                  });

      this.dml_allowed = form.dml_allowed === 'Y' ? true : false;
      this.writeOnly = nextProps.writeOnly;
    }

  }

  handleEditCalcRule(selectedRule,donotCheckAlreadyOpen){
    console.log("handleEditCalcRule parameters...",selectedRule,donotCheckAlreadyOpen);
    let isOpen = donotCheckAlreadyOpen ? false : (this.state.display == "editCellRule");
    if(isOpen){
        this.setState({display: null, selectedRule: null});
    }
    else{
      this.setState({display: "editCellRule", selectedRule: selectedRule});
    }
  }

  handleChangeRule(newRule){
    let form = this.state.form;
    form.aggregation_ref = newRule;
    this.setState({form});
  }

  handleSetFormValues(form){
    this.setState({form: form});
  }

  handleSetAuditFormValues(audit_form){
    this.setState({audit_form: audit_form});
  }

  getStepClassName(step){
    if(this.state.step == step){
      return "selected";
    } else if(this.state.step > step){
      return "done";
    } else {
      return "disabled";
    }
  }

  handleNextStep(){
    this.setState({step: this.state.step + 1 });
  }

  handlePrevStep(){
    this.setState({step: this.state.step - 1 });
  }

  render(){

    this.viewOnly = !(this.writeOnly && this.dml_allowed);
    console.log("this.writeOnly , this.dml_allowed", this.writeOnly , this.dml_allowed,this.viewOnly);

    this.state.rulesSuggestions = [];
    const { rulesTags, rulesSuggestions, requestType } = this.state;
    if(typeof(this.props.business_rule) != 'undefined'){
      if(this.props.business_rule.rows.length){
        const rules_suggestion = this.props.business_rule.rows;
        rules_suggestion.map(function(item,index){
          this.state.rulesSuggestions.push(item.business_rule);
        }.bind(this));
      }
    }

    if(typeof(this.props.business_rule) == 'undefined'){
      return(
        <h1>Loading...</h1>
      )
    } else {
      // if(typeof(this.state.ruleIndex) != 'undefined'){
      //   console.log('inside initialiseFormFields')
      //   this.initialiseFormFields();
      // }
      console.log('in render',this.state)
      return(
        <div className="">
          <div className="x_panel">
            <div className="x_title">
              <h2>{this.state.form.cell_calc_ref}<small>{ this.props.requestType + " Rule "}</small></h2>
              <div className="clearfix"></div>
            </div>
            <div className="x_content">
              <div className="form_wizard wizard_horizontal"
                >
                  <ul className = "wizard_steps anchor" >
                    <li>
                      <a  className = { this.getStepClassName(1) }>
                        <span className = "step_no">1</span>
                        <span className = "step_descr">
                            <small>Description<br/>& Source</small>
                          </span>
                      </a>
                    </li>
                    <li>
                      <a  className = { this.getStepClassName(2) }>
                        <span className = "step_no">2</span>
                        <span className = "step_descr">
                            <small>Rules<br/>& Calculation</small>
                          </span>
                      </a>
                    </li>
                    <li>
                      <a  className = { this.getStepClassName(3) }>
                        <span className = "step_no">3</span>
                        <span className = "step_descr">
                          <small>Comments<br/>& Submit</small>
                        </span>
                      </a>
                    </li>
                  </ul>
                  <div className="form-horizontal">
                  {
                    this.state.step == 1 &&
                    <AddReportRepoRulesStep1
                      form={ this.state.form }
                      country = { this.props.country }
                      handleSetFormValues = { this.handleSetFormValues }
                      handleNextStep = { this.handleNextStep }
                      viewOnly = { this.viewOnly }
                      />
                  }
                  {
                    this.state.step == 2 &&
                    <AddReportRepoRulesStep2
                      form={ this.state.form }
                      display = { this.state.display }
                      rulesSuggestions = {this.state.rulesSuggestions}
                      handleSetFormValues = { this.handleSetFormValues }
                      handleEditCalcRule = { this.handleEditCalcRule }
                      handleChangeRule = { this.handleChangeRule }
                      handleNextStep = { this.handleNextStep }
                      handlePrevStep = { this.handlePrevStep }
                      modalAlert = { this.modalAlert }
                      viewOnly = { this.viewOnly }
                      />
                  }
                  {
                    this.state.step == 3 &&
                    <AddReportRepoRulesStep3
                      audit_form={ this.state.audit_form }
                      handleSetAuditFormValues = { this.handleSetAuditFormValues }
                      handleSubmit = { this.handleSubmit }
                      handlePrevStep = { this.handlePrevStep }
                      viewOnly = { this.viewOnly }
                      />
                  }
                  </div>

              </div>


            </div>
          </div>
          <ModalAlert
            ref={(modalAlert) => {this.modalAlert = modalAlert}}
            onClickOkay={this.handleModalOkayClick}
          />
        </div>
      )
    }
  }

  handleSubmit(event){
    console.log('inside submit',this.state.form);
    event.preventDefault();

    let data = {
      table_name:"report_calc_def_master",
      update_info:this.state.form
    };
    data['change_type'] = this.props.requestType=="Edit" ? "UPDATE" : "INSERT";

    let audit_info={
      id:this.state.form.id,
      table_name:data.table_name,
      change_type:data.change_type,
      change_reference:`Repository Rule: ${this.state.form.cell_calc_ref} of : ${this.state.form.report_id}->${this.state.form.sheet_id}->${this.state.form.cell_id} [ country: ${this.props.country} ]`,
      maker: this.props.login_details.user,
      maker_tenant_id: this.props.login_details.domainInfo.tenant_id,
      group_id: this.props.groupId,
    };
    Object.assign(audit_info,this.state.audit_form);

    data['audit_info']=audit_info;

    console.log('inside submit',this.state.form, data);
    if(data['change_type'] == "INSERT"){
      this.props.insertRuleData(data);
    }
    else if (data['change_type'] == "UPDATE"){
      this.props.updateRuleData(this.state.form.id,data);
    }

    // this.props.handleClose();
    // this.props.handleForceRefresh(event);

  }
}
function mapStateToProps(state){
  console.log("On map state of Add report rule",state);
  return{
    sources:state.maintain_report_rules_store.sources,
    business_rule: state.business_rules_repo.gridBusinessRulesData,
    cell_rules: state.report_store.cell_rules,
    login_details: state.login_store,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    fetchBusinessRules:(country) => {
      dispatch(actionFetchBusinessRules(country));
    },
    insertRuleData:(data) => {
      dispatch(actionInsertRuleData(data));
    },
    updateRuleData:(data) => {
      dispatch(actionUpdateRuleData(data));
    }
  }
}
const VisibleAddReportRules = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddReportRules);

export default VisibleAddReportRules;
