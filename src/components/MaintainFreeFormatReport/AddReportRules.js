import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import {bindActionCreators, dispatch} from 'redux';
import DatePicker from 'react-datepicker';
import {
  Link,
  hashHistory
} from 'react-router';
import { WithContext as ReactTags } from 'react-tag-input';
import {
  actionFetchBusinessRulesBySourceId,
  actionFetchSources,
  actionFetchSourceColumnList,
  actionInsertRuleData,
  actionUpdateRuleData
} from '../../actions/MaintainReportRuleAction';
import CellCalcRuleAssist from './CellCalcRuleAssist';
import ModalAlert from '../ModalAlert/ModalAlert';

class AddReportRules extends Component {
  constructor(props) {
    super(props);
    this.state = {
        display: null,
        selectedCellRule: {},
        rulesTags: [],
        rulesSuggestions: [],
        form:{
          cell_calc_ref:null,
          report_id: this.props.report_id,
          sheet_id: this.props.sheet,
          cell_id:this.props.cell,
          source_id:0,
          cell_calc_extern_ref:null,
          cell_business_rules:null,
          cell_calc_decsription:null,
          aggregation_ref:null,
          aggregation_func:null,
          last_updated_by:null,
          id:null,
          },
        audit_form:{
          comment:null
        }
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);

    this.searchAnywhere = this.searchAnywhere.bind(this);
    this.handleEditCalcRule = this.handleEditCalcRule.bind(this);
    this.handleChangeRule = this.handleChangeRule.bind(this);

    this.ruleIndex = typeof this.props.index !== 'undefined' ? this.props.index : -1;
    this.dml_allowed = this.props.dml_allowed === 'Y' ? true : false;
    this.writeOnly = this.props.writeOnly;
  }

  componentWillMount() {
    this.props.fetchSources();
    // if (typeof this.ruleIndex !== 'undefined') {
    //     if (this.ruleIndex !== -1) {
    //       Object.assign(this.state.form, this.props.cell_rules.cell_rules[this.ruleIndex]);
    //       this.props.fetchBusinessRulesBySourceId(this.state.form.source_id);
    //       this.initialiseFormFields();
    //     }
    // }
    if (this.ruleIndex !== -1) {
      this.setState({form: this.props.formData,
                      rulesTags: [],
                    },
                  ()=>{
                    if(this.state.form.source_id!=null){
                      this.props.fetchSourceColumnList(null, this.state.form.source_id);
                      this.props.fetchBusinessRulesBySourceId(this.state.form.source_id);
                    }
                    this.initialiseFormFields();
                  });
    } else {
      let formData = {
        cell_calc_ref:this.props.cell_calc_ref,
        report_id: this.props.report_id,
        sheet_id: this.props.sheet,
        cell_id:this.props.cell,
        source_id:0,
        cell_calc_extern_ref:null,
        cell_business_rules:null,
        cell_calc_decsription:null,
        aggregation_ref:null,
        aggregation_func:null,
        last_updated_by:null,
        id:null,
      };
      this.setState({form: formData,
                      rulesTags: [],
                    });
    }
  }

  componentWillReceiveProps(nextProps) {
      if (typeof nextProps.index !== 'undefined' && this.ruleIndex !== nextProps.index) {
          this.ruleIndex = nextProps.index;
          if (this.ruleIndex !== -1) {
            this.setState({form: nextProps.formData,
                            rulesTags: [],
                          },
                        ()=>{
                          if(this.state.form.source_id!=null){
                            this.props.fetchSourceColumnList(null, this.state.form.source_id);
                            this.props.fetchBusinessRulesBySourceId(this.state.form.source_id);
                          }
                          this.initialiseFormFields();
                        });
          } else {
            let formData = {
              cell_calc_ref:nextProps.cell_calc_ref,
              report_id: nextProps.report_id,
              sheet_id: nextProps.sheet,
              cell_id:nextProps.cell,
              source_id:0,
              cell_calc_extern_ref:null,
              cell_business_rules:null,
              cell_calc_decsription:null,
              aggregation_ref:null,
              aggregation_func:null,
              last_updated_by:null,
              id:null,
            };
            this.setState({form: formData,
                            rulesTags: [],
                          });
          }

          this.dml_allowed = nextProps.dml_allowed === 'Y' ? true : false;
          this.writeOnly = nextProps.writeOnly;
      }
  }

  searchAnywhere(textInputValue, possibleSuggestionsArray) {
    var lowerCaseQuery = textInputValue.toLowerCase()

    return possibleSuggestionsArray.filter(function(suggestion)  {
        return suggestion.toLowerCase().includes(lowerCaseQuery)
    })
  }

  handleDelete(i) {
      let rulesTags = this.state.rulesTags;
      rulesTags.splice(i, 1);
      this.setState({rulesTags: rulesTags});
  }

  handleAddition(tag) {
        let rulesTags = this.state.rulesTags;
        // check whether its a valid rule to be added
        if (this.state.rulesSuggestions.indexOf(tag) != -1){
          if (rulesTags.map(function(r){return r.text;}).indexOf(tag) == -1){
            rulesTags.push({
                id: rulesTags.length + 1,
                text: tag
            });
            this.setState({rulesTags: rulesTags});
          } else {
            this.modalAlert.isDiscardToBeShown = false;
            this.modalAlert.open(
              <span className="">
                <i className="fa fa-warning amber"></i>
                {" Business rule [ " + tag + " ] already added, please check..."}
              </span>);
          }

        }
        else{
          this.modalAlert.isDiscardToBeShown = false;
          this.modalAlert.open(
            <span className="">
              <i className="fa fa-warning amber"></i>
              {" [ " + tag + " ] is not a valid business rule, please check..."}
            </span>);
        }

    }

  handleDrag(tag, currPos, newPos) {
        let rulesTags = this.state.rulesTags;

        // mutate array
        rulesTags.splice(currPos, 1);
        rulesTags.splice(newPos, 0, tag);

        // re-render
        this.setState({ rulesTags: rulesTags });
    }

  flatenTags(){

    this.state.form.cell_business_rules = '';
    console.log('inside process',this.state);
    this.state.rulesTags.map(function(item,index){
        this.state.form.cell_business_rules += `${item.text},`;
      }.bind(this));

    console.log('inside process form check',this.state.form);
  }

  initialiseFormFields(){
    console.log("inside initialiseFormFields function",this.state.form.cell_business_rules);
    Object.assign(this.state.rulesTags,[]);

    const {cell_business_rules}=this.state.form;
    if (typeof cell_business_rules === 'undefined' || cell_business_rules === null) {
        return;
    }
    let rulesTagsArray=cell_business_rules.split(',');
    rulesTagsArray.map((item,index)=>{
      if(item!=''){
        this.state.rulesTags.push({id:index+1,text:item});
      }
    })
    console.log("Rules Tags........:",this.state.rulesTags);

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

  render(){

    this.viewOnly = !(this.writeOnly && this.dml_allowed);
    console.log("this.writeOnly , this.dml_allowed", this.writeOnly , this.dml_allowed,this.viewOnly);

    this.state.rulesSuggestions = [];
    const { rulesTags, rulesSuggestions } = this.state;
    if(typeof(this.props.business_rule) != 'undefined'){
      if(this.props.business_rule.source_suggestion[0].rules_suggestion.length){
        const rules_suggestion = this.props.business_rule.source_suggestion[0].rules_suggestion;
        rules_suggestion.map(function(item,index){
          this.state.rulesSuggestions.push(item.business_rule);
        }.bind(this));
      }
    }

    if(typeof(this.props.sources) == 'undefined'){
      return(
        <h1>Loading...</h1>
      )
    } else {
      const { source_suggestion } = this.props.sources;
      if(typeof(this.state.ruleIndex) != 'undefined'){
        console.log('inside initialiseFormFields')
        this.initialiseFormFields();
      }
      console.log('in render',this.state)
      return(
        <div className="row form-container">
          <div className="x_panel">
            <div className="x_title">
              <h2>Maintain report rule <small>{ this.ruleIndex === -1 || this.ruleIndex === -2 ? 'Add' : 'Edit' } a report rule</small></h2>
              <div className="clearfix"></div>
            </div>
            <div className="x_content">

              <form className="form-horizontal form-label-left"
                onSubmit={this.handleSubmit.bind(this)}
              >
                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Cell Calc Ref <span className="required">*</span></label>
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <input
                      placeholder="Enter Cell Calulation Ref"
                      value={this.state.form.cell_calc_ref}
                      type="text"
                      required="required"
                      readOnly={true}
                      className="form-control col-md-7 col-xs-12"
                      onChange={
                        (event) => {
                          let form=this.state.form;
                          form.cell_calc_ref = event.target.value;
                          this.setState({form:form});
                        }
                      }
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Report ID <span className="required">*</span></label>
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <input value={this.state.form.report_id}  readOnly="readonly" type="text" className="form-control col-md-7 col-xs-12" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Cell ID <span className="required">*</span></label>
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <input value={this.state.form.cell_id} readOnly="readonly" type="text" required="required" className="form-control col-md-7 col-xs-12" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Sheet ID <span className="required">*</span></label>
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <input value={this.state.form.sheet_id}  type="text" required="required" className="form-control col-md-7 col-xs-12" readOnly="readonly" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Calc External Ref <span className="required">*</span></label>
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <input
                      type="text"
                      placeholder="Enter Calc External Ref"
                      readOnly={this.viewOnly}
                      required="required"
                      className="form-control col-md-7 col-xs-12"
                      value={this.state.form.cell_calc_extern_ref}
                      onChange={
                        (event) => {
                          let form=this.state.form;
                          form.cell_calc_extern_ref = event.target.value;
                          this.setState({form:form});
                        }
                      }
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="calc-description">Calculation Description <span className="required">*</span></label>
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <textarea
                      type="text"
                      required="requried"
                      className="form-control col-md-6 col-sm-6 col-xs-12"
                      placeholder="Enter Calculation Description"
                      value={this.state.form.cell_calc_decsription}
                      readonly={true}
                      disabled={this.viewOnly}
                      onChange={
                        (event) => {
                          let form=this.state.form;
                          form.cell_calc_decsription = event.target.value;
                          this.setState({form:form});
                        }
                      }
                      />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Source ID <span className="required">*</span></label>
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    {
                      (()=>{
                      if(!this.viewOnly){
                         return(
                            <select
                              value = {this.state.form.source_id}
                              className="form-control"
                              required="requried"
                              onChange={
                                (event) => {
                                  let form=this.state.form;
                                  form.source_id = event.target.value;
                                  form.aggregation_ref = null;
                                  form.aggregation_func = null;
                                  this.setState({display: false, form:form, rulesTags: []});
                                  if(event.target.value){
                                    let table_name = (event.target.options[event.target.selectedIndex].getAttribute('target'));
                                    console.log('Source ID............',this.state.form.source_id);
                                    this.props.fetchBusinessRulesBySourceId(this.state.form.source_id);
                                    console.log('table name in change event',table_name);
                                    this.props.fetchSourceColumnList(table_name,null);
                                    this.handleEditCalcRule(null,true);
                                  } else {
                                    this.handleEditCalcRule();
                                  }
                                }
                              }
                            >
                              <option key={9999999999} target={"Choose option"} value="">Choose option</option>
                              {
                                source_suggestion.map(function(item,index){
                                  return(
                                    <option key={index} target={item.source_table_name} value={item.source_id}>{item.source_id} - {item.source_table_name}</option>
                                  )
                                })
                              }
                            </select>);
                      }
                      else{
                        return(
                          <input value={this.state.form.source_id}  type="text" required="required" className="form-control col-md-7 col-xs-12" readOnly="readonly" />
                        );
                      }
                    })()
                  }
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Report Rules <span className="required">*</span></label>
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <ReactTags tags={rulesTags}
                      suggestions={rulesSuggestions}
                      readOnly={this.viewOnly}
                      handleDelete={this.handleDelete}
                      handleAddition={this.handleAddition}
                      handleDrag={this.handleDrag}
                      handleFilterSuggestions={this.searchAnywhere}
                      allowDeleteFromEmptyInput={false}
                      autocomplete={true}
                      minQueryLength={1}
                      classNames={{
                        tagInput: 'tagInputClass',
                        tagInputField: 'tagInputFieldClass form-control',
                        suggestions: 'suggestionsClass',
                      }}
                      placeholder="Enter Business Rule"
                    />
                  </div>
                </div>
                {
                  !this.state.display &&
                  <div className="form-group">
                    <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Aggregation Logic <span className="required">*</span></label>
                    <div className="col-md-6 col-sm-6 col-xs-12">
                      <textarea
                        type="text"
                        required="requried"
                        className="form-control col-md-6 col-sm-6 col-xs-12"
                        placeholder="Enter Aggregation Definition"
                        value={this.state.form.aggregation_ref}
                        readonly={true}
                        disabled={this.viewOnly}
                        />
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary btn-xs"
                      disabled={!this.state.form.source_id.toString() || this.viewOnly}
                      onClick={(event)=>{
                        this.handleEditCalcRule(null,true);
                      }}
                      >
                      Edit
                    </button>
                  </div>
                }
                {
                  this.state.display=="editCellRule" &&
                  this.props.source_table_columns &&
                  this.state.form.source_id.toString() !="" &&
                  <CellCalcRuleAssist
                    {...this.state.form}
                    sourceColumns={this.props.source_table_columns}
                    handleEditCalcRule={this.handleEditCalcRule}
                    handleChangeRule={this.handleChangeRule}
                    />
                }

                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Aggregation Funciton <span className="required">*</span></label>
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <input
                      type="text"
                      placeholder="Enter Aggregation function"
                      readOnly={this.viewOnly}
                      required="required"
                      className="form-control col-md-7 col-xs-12"
                      value={this.state.form.aggregation_func}
                      onChange={
                        (event) => {
                          let form=this.state.form;
                          form.aggregation_func = event.target.value;
                          this.setState({form:form});
                        }
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="Comment">Comment <span className="required">*</span></label>
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <textarea
                      type="text"
                      placeholder="Enter a Comment"
                      required="required"
                      className="form-control col-md-7 col-xs-12"
                      value={this.state.audit_form.comment}
                      readOnly={this.viewOnly}
                      maxLength="1000"
                      minLength="20"
                      onChange={
                        (event) => {
                          let {audit_form}=this.state;
                          audit_form.comment = event.target.value;
                          this.setState({audit_form});
                        }
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
                    <button type="button" className="btn btn-primary" onClick={()=>{this.props.handleClose()}}>
                      Cancel</button>
                    {
                      (()=>{
                      if(!this.viewOnly){
                        console.log("this.state.requestType........",this.state.requestType);
                        return(<button type="submit" className="btn btn-success" >Submit</button>);
                      }
                      })()
                    }
                  </div>
                </div>
              </form>
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
    if(this.state.rulesTags.length==0){
      this.modalAlert.isDiscardToBeShown = false;
      this.modalAlert.open(
        <span className="">
          <i className="fa fa-warning amber"></i> No report rule defined! Please check and add applicable business rules!
        </span>);

    } else {

      this.flatenTags();

      let data = {
        table_name:"report_calc_def",
        update_info:this.state.form
      };
      data['change_type'] = this.ruleIndex === -1 || this.ruleIndex === -2 ? "INSERT" : "UPDATE";

      let audit_info={
        id:this.state.form.id,
        table_name:data.table_name,
        change_type:data.change_type,
        change_reference:`Rule: ${this.state.form.cell_calc_ref} of : ${this.state.form.report_id}->${this.state.form.sheet_id}->${this.state.form.cell_id} [ Source: ${this.state.form.source_id} ]`,
        maker: this.props.login_details.user,
        maker_tenant_id: this.props.login_details.domainInfo.tenant_id,
        group_id: this.props.groupId,
      };
      Object.assign(audit_info,this.state.audit_form);

      data['audit_info']=audit_info;

      console.log('inside submit',this.state.form);
      if(data['change_type'] == "INSERT"){
        this.props.insertRuleData(data);
      }
      else if (data['change_type'] == "UPDATE"){
        this.props.updateRuleData(this.state.form.id,data);
      }

      this.props.handleClose();
    }
  }
}
function mapStateToProps(state){
  console.log("On map state of Add report rule",state);
  return{
    sources:state.maintain_report_rules_store.sources,
    business_rule: state.maintain_report_rules_store.business_rules,
    source_table_columns: state.maintain_report_rules_store.source_table_columns,
    cell_rules: state.report_store.cell_rules,
    login_details: state.login_store,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    fetchBusinessRulesBySourceId:(sourceId) => {
      dispatch(actionFetchBusinessRulesBySourceId(sourceId));
    },
    fetchSources:(sourceId) => {
      dispatch(actionFetchSources(sourceId));
    },
    fetchSourceColumnList:(table_name,source_id) => {
      dispatch(actionFetchSourceColumnList(table_name,source_id));
    },
    insertRuleData:(data) => {
      dispatch(actionInsertRuleData(data));
    },
    updateRuleData:(id,data) => {
      dispatch(actionUpdateRuleData(id,data));
    }
  }
}
const VisibleAddReportRules = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddReportRules);
export default VisibleAddReportRules;
