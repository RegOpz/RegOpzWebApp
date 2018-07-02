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
  actionFetchBusinessRules,
} from '../../actions/BusinessRulesRepositoryAction';
import {
  actionInsertRuleData,
  actionUpdateRuleData
} from '../../actions/ReportRulesRepositoryAction';

class AddReportRules extends Component {
  constructor(props) {
    super(props);
    this.state = {
        rulesTags: [],
        aggRefTags:[],
        rulesSuggestions: [],
        fieldsSuggestions:[],
        form:{
          cell_calc_ref:null,
          report_id: this.props.report_id,
          sheet_id: this.props.sheet,
          cell_id:this.props.cell,
          cell_calc_extern_ref:null,
          cell_business_rules:null,
          cell_calc_decsription:null,
          last_updated_by:null,
          id:null,
          },
        audit_form:{
          comment:null
        }
    };

    this.country = this.props.country;

    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);

    // this.handleAggRefDelete = this.handleAggRefDelete.bind(this);
    // this.handleAggRefAddition = this.handleAggRefAddition.bind(this);
    // this.handleAggRefDrag = this.handleAggRefDrag.bind(this);

    this.searchAnywhere = this.searchAnywhere.bind(this);

    this.ruleIndex = typeof this.props.index !== 'undefined' ? this.props.index : -1;
    this.dml_allowed = this.props.dml_allowed === 'Y' ? true : false;
    this.writeOnly = this.props.writeOnly;
  }

  componentWillMount() {
    this.props.fetchBusinessRules(this.country);
    if (this.ruleIndex !== -1) {
      // existing calc rule viewing
      this.setState({form: this.props.formData,
                      rulesTags: [],
                      aggRefTags: []},
                  ()=>{
                    // this.props.fetchBusinessRulesBySourceId(this.state.form.source_id);
                    this.initialiseFormFields();
                  });
    } else {
      // adding new calc rule
      let formData = {
        cell_calc_ref:this.props.cell_calc_ref,
        report_id: this.props.report_id,
        sheet_id: this.props.sheet,
        cell_id:this.props.cell,
        cell_calc_extern_ref:null,
        cell_business_rules:null,
        cell_calc_decsription:null,
        last_updated_by:null,
        id:null,
      };
      this.setState({form: formData,
                      rulesTags: [],
                      aggRefTags: []
                    });
    }
  }

  componentWillReceiveProps(nextProps) {
      if (typeof nextProps.index !== 'undefined' && this.ruleIndex !== nextProps.index) {
          this.ruleIndex = nextProps.index;
          if (this.ruleIndex !== -1) {
            this.setState({form: nextProps.formData,
                            rulesTags: [],
                            aggRefTags: []},
                        ()=>{
                          // this.props.fetchBusinessRulesBySourceId(this.state.form.source_id);
                          this.props.fetchBusinessRules(this.country);
                          this.initialiseFormFields();
                        });
          } else {
            let formData = {
              cell_calc_ref:nextProps.cell_calc_ref,
              report_id: nextProps.report_id,
              sheet_id: nextProps.sheet,
              cell_id:nextProps.cell,
              cell_calc_extern_ref:null,
              cell_business_rules:null,
              cell_calc_decsription:null,
              last_updated_by:null,
              id:null,
            };
            this.setState({form: formData,
                            rulesTags: [],
                            aggRefTags: []
                          });
            // Object.assign(this.state.rulesTags,[]);
            // Object.assign(this.state.aggRefTags,[]);
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
          rulesTags.push({
              id: rulesTags.length + 1,
              text: tag
          });
          this.setState({rulesTags: rulesTags});
        }
        else{
          alert("Not a valid rule, please check...",tag)
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
      //this.setState({form: this.props.drill_down_result.cell_rules[this.state.ruleIndex]});
      //this.state.form = this.props.drill_down_result.cell_rules[this.state.ruleIndex];
      console.log("inside initialiseFormFields function",this.state.form.cell_business_rules);
      Object.assign(this.state.rulesTags,[]);
      Object.assign(this.state.aggRefTags,[]);
      //if(this.state.rulesTags.length == 0){
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
        //this.state.rulesTags = [{id:1,text: this.state.form.cell_business_rules}];
      //}
  }

  render(){

    this.viewOnly = !(this.writeOnly && this.dml_allowed);
    console.log("this.writeOnly , this.dml_allowed", this.writeOnly , this.dml_allowed,this.viewOnly);

    this.state.rulesSuggestions = [];
    this.state.fieldsSuggestions = [];
    const { rulesTags, rulesSuggestions,aggRefTags, fieldsSuggestions } = this.state;
    if(typeof(this.props.business_rule) != 'undefined'){
        const rules_suggestion = this.props.business_rule.rows;
        rules_suggestion.map(function(item,index){
          this.state.rulesSuggestions.push(item.business_rule);
        }.bind(this));
    }

    if(typeof(this.props.business_rule) == 'undefined'){
      return(
        <h4>Loading...</h4>
      )
    } else {
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
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Cell Calc External Ref <span className="required">*</span></label>
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <input
                      placeholder="Enter Cell Calulation external Ref"
                      value={this.state.form.cell_calc_extern_ref}
                      type="text"
                      required="required"
                      readOnly={this.viewOnly}
                      className="form-control col-md-7 col-xs-12"
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
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Business Rules <span className="required">*</span></label>
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

                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="Comment">Cell Calculation Logic <span className="required">*</span></label>
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <textarea
                      type="text"
                      placeholder="Enter calculation logic Description"
                      required="required"
                      className="form-control col-md-7 col-xs-12"
                      value={this.state.form.cell_calc_decsription}
                      readOnly={this.viewOnly}
                      maxLength="3000"
                      minLength="50"
                      onChange={
                        (event) => {
                          let {form}=this.state;
                          form.cell_calc_decsription = event.target.value;
                          this.setState({form});
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
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Last Updated by <span className="required">*</span></label>
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <input value=""  type="text" required="required" className="form-control col-md-7 col-xs-12" readOnly="readonly" />
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
        </div>
      )
    }
  }

  handleSubmit(event){
    console.log('inside submit',this.state.form);
    event.preventDefault();
    this.flatenTags();

    let data = {
      table_name:"report_calc_def_master",
      update_info:this.state.form
    };
    data['change_type'] = this.ruleIndex === -1 || this.ruleIndex === -2 ? "INSERT" : "UPDATE";

    let audit_info={
      id:this.state.form.id,
      table_name:data.table_name,
      change_type:data.change_type,
      change_reference:`Rule: ${this.state.form.cell_calc_ref} of : ${this.state.form.report_id}->${this.state.form.sheet_id}->${this.state.form.cell_id}`,
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
      this.props.updateRuleData(data);
    }

    this.props.handleClose();
  }
}
function mapStateToProps(state){
  console.log("On map state of Add report rule",state);
  return{
    business_rule: state.business_rules_repo.gridBusinessRulesData,
    source_table_columns: state.maintain_report_rules_store.source_table_columns,
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
