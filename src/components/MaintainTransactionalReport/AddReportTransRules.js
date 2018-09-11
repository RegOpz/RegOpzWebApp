import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import {bindActionCreators, dispatch} from 'redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';
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
import {
  actionTransReportUpdateRule,
  actionTransReportInsertRule
} from '../../actions/TransactionReportAction';
import TransSecColumnRule from './TransSecColumnRule';
import TransColMapAssist from './TransColMapAssist';

class AddReportTransRules extends Component {
  constructor(props) {
    super(props);
    this.state = {
        display: null,
        selectedColumn: null,
        rulesTags: [],
        aggRefTags:[],
        rulesSuggestions: [],
        fieldsSuggestions:[],
        dynamicDataColumns:[],
        renderRef: this.props.rule.cell_calc_render_ref ? JSON.parse(this.props.rule.cell_calc_render_ref) : null,
        form:{
          cell_calc_ref:this.props.rule.cell_calc_ref,
          report_id: this.props.rule.report_id,
          sheet_id: this.props.rule.sheet_id,
          cell_id:this.props.cell,
          section_id: this.props.rule.section_id,
          source_id:this.props.rule.source_id ? this.props.rule.source_id:null,
          cell_business_rules:this.props.rule.cell_calc_render_ref ? JSON.parse(this.props.rule.cell_calc_render_ref).rule : null,
          cell_calc_extern_ref:this.props.rule.cell_calc_extern_ref,
          cell_calc_decsription:this.props.rule.cell_calc_decsription,
          aggregation_ref:null,
          aggregation_func:null,
          valid_from:null,
          valid_to:null,
          last_updated_by:null,
          id:this.props.rule.id ? this.props.rule.id : null ,
          },
        audit_form:{
          comment:null
        }
    };

    this.sectionColumns = this.props.sectionColumns;

    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);

    this.handleAggRefDelete = this.handleAggRefDelete.bind(this);
    this.handleAggRefAddition = this.handleAggRefAddition.bind(this);
    this.handleAggRefDrag = this.handleAggRefDrag.bind(this);

    this.searchAnywhere = this.searchAnywhere.bind(this);
    this.populateDynDataColumns = this.populateDynDataColumns.bind(this);
    this.handleParameterChange = this.handleParameterChange.bind(this);
    this.handleEditColMapping = this.handleEditColMapping.bind(this);

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
      this.setState({
                      rulesTags: [],
                      aggRefTags: []},
                  ()=>{
                    this.props.fetchBusinessRulesBySourceId(this.state.form.source_id);
                    this.props.fetchSourceColumnList(null,this.state.form.source_id);
                    this.initialiseFormFields();
                    this.populateDynDataColumns();
                  });
    } else {
      let formData = {
        cell_calc_ref:moment().format('YYYYMMDDHHMMSS'),
        report_id: this.props.rule.report_id,
        sheet_id: this.props.rule.sheet_id,
        cell_id:this.props.cell,
        section_id: this.props.rule.section_id,
        source_id:null, //this.props.rule.source_id,
        cell_business_rules:null,
        cell_calc_extern_ref:null,
        cell_calc_decsription:null,
        aggregation_ref:null,
        aggregation_func:null,
        valid_from:null,
        valid_to:null,
        last_updated_by:null,
        id:null,
      };
      this.setState({form: formData,
                      rulesTags: [],
                      aggRefTags: [],
                      renderRef: null,
                      dynamicDataColumns:[],
                    },
                      ()=>{
                        this.populateDynDataColumns();
                      }
                  );
    }
  }

  componentWillReceiveProps(nextProps) {
      if (typeof nextProps.index !== 'undefined' && this.ruleIndex !== nextProps.index) {
          this.ruleIndex = nextProps.index;
          this.sectionColumns = nextProps.sectionColumns;
          let selectedTable = _.filter(nextProps.sources.source_suggestion,{source_id: nextProps.rule.source_id});
          // this.props.fetchSourceColumnList(selectedTable.source_table_name);
          // console.log("_.filter....",nextProps.sources,selectedTable)
          // console.log("AddReportTransRules this.sectionColumns",this.sectionColumns);
          if (this.ruleIndex !== -1) {
            let renderRef= nextProps.rule.cell_calc_render_ref ? JSON.parse(nextProps.rule.cell_calc_render_ref) : null;
            let form ={
              cell_calc_ref:nextProps.rule.cell_calc_ref,
              report_id: nextProps.rule.report_id,
              sheet_id: nextProps.rule.sheet_id,
              cell_id:nextProps.cell,
              section_id: nextProps.rule.section_id,
              source_id:nextProps.rule.source_id ? nextProps.rule.source_id:null,
              cell_business_rules:nextProps.rule.cell_calc_render_ref ? JSON.parse(nextProps.rule.cell_calc_render_ref).rule : null,
              cell_calc_extern_ref:nextProps.rule.cell_calc_extern_ref,
              cell_calc_decsription:nextProps.rule.cell_calc_decsription,
              aggregation_ref:null,
              aggregation_func:null,
              valid_from:null,
              valid_to:null,
              last_updated_by:null,
              id:nextProps.rule.id ? nextProps.rule.id : null,
              }
            this.setState({ form: form,
                            rulesTags: [],
                            aggRefTags: [],
                            dynamicDataColumns:[],
                            renderRef: renderRef
                          },
                        ()=>{
                          this.props.fetchBusinessRulesBySourceId(this.state.form.source_id);
                          this.props.fetchSourceColumnList(null,this.state.form.source_id);
                          this.initialiseFormFields();
                          this.populateDynDataColumns();
                        });
          } else {
            let formData = {
              cell_calc_ref:moment().format('YYYYMMDDHHMMSS'),
              report_id: nextProps.rule.report_id,
              sheet_id: nextProps.rule.sheet_id,
              cell_id:nextProps.cell,
              section_id: nextProps.rule.section_id,
              source_id:null, //nextProps.rule.source_id,
              cell_business_rules:null,
              cell_calc_extern_ref:null,
              cell_calc_decsription:null,
              aggregation_ref:null,
              aggregation_func:null,
              valid_from:null,
              valid_to:null,
              last_updated_by:null,
              id:null,
            };
            this.setState({form: formData,
                            rulesTags: [],
                            aggRefTags: [],
                            dynamicDataColumns:[],
                            renderRef: null
                          },
                          ()=>{
                            //this.props.fetchBusinessRulesBySourceId(this.state.form.source_id);
                            this.initialiseFormFields();
                            this.populateDynDataColumns();
                          });
            // Object.assign(this.state.rulesTags,[]);
            // Object.assign(this.state.aggRefTags,[]);
          }

          this.dml_allowed = nextProps.dml_allowed === 'Y' ? true : false;
          this.writeOnly = nextProps.writeOnly;
      }
  }

  populateDynDataColumns(){
    let newState={...this.state}
    this.sectionColumns.map(col=>{
      // console.log("Inside content push",col.col_id,this.props.source_table_columns, this.state.renderRef);
      let colAttributes={
                          col_id: col.col_id,
                          mapped_column: this.state.renderRef && this.state.renderRef.calc[col.col_id] ? this.state.renderRef.calc[col.col_id].column:"",
                        };
      newState.dynamicDataColumns.push(colAttributes);
    })

    this.setState(newState);

  }

  handleParameterChange(event, eventType, index) {
      var dynamicDataColumns = [...this.state.dynamicDataColumns];
      var value;
      var checked;
      switch (eventType) {
          case 'mappedColumn':
              value = event.target.value;
              dynamicDataColumns[index].mapped_column = value;
              this.setState({ dynamicDataColumns: dynamicDataColumns });
              // console.log("Changed value of the column mapping",dynamicDataColumns );
              break;
          case 'AddMoreKeyValue':
              // value = event.target.value;
              // value = value.replace(/[:]/g, "");
              // additionalParameters[index].keyValue = value;
              // this.setState({ additionalParameters: additionalParameters });
              break;
      }
  }

  handleEditColMapping(selectedColumn){
    console.log("handleEditColMapping parameters...",selectedColumn);
    let isOpen = (this.state.display == "editColMapping");
    if(isOpen){
        this.setState({display: null, selectedColumn: null});
    }
    else{
      this.setState({display: "editColMapping", selectedColumn: selectedColumn});
    }
  }

  searchAnywhere(textInputValue, possibleSuggestionsArray) {
    var lowerCaseQuery = textInputValue.toLowerCase()

    return possibleSuggestionsArray.filter(function(suggestion)  {
        return suggestion.toLowerCase().includes(lowerCaseQuery)
    })
  }
  handleValidFromDateChange(date){
    let form = this.state.form;
    form.valid_from = date;

    this.setState({form:form});

  }

  handleValidTillDateChange(date){
    let form = this.state.form;
    form.valid_to = date;

    this.setState({form:form});

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
    handleAggRefDelete(i) {
          let aggRefTags = this.state.aggRefTags;
          aggRefTags.splice(i, 1);
          this.setState({aggRefTags: aggRefTags});
      }

      handleAggRefAddition(tag) {
          let aggRefTags = this.state.aggRefTags;
          aggRefTags.push({
              id: aggRefTags.length + 1,
              text: tag
          });
          this.setState({aggRefTags: aggRefTags});
      }

      handleAggRefDrag(tag, currPos, newPos) {
          let aggRefTags = this.state.aggRefTags;

          // mutate array
          aggRefTags.splice(currPos, 1);
          aggRefTags.splice(newPos, 0, tag);

          // re-render
          this.setState({ aggRefTags: aggRefTags });
      }
      flatenTags(){

        this.state.form.cell_business_rules = '';
        this.state.form.aggregation_ref = '';
        console.log('inside process',this.state);
        this.state.rulesTags.map(function(item,index){
            this.state.form.cell_business_rules += `${item.text},`;
          }.bind(this));

        this.state.aggRefTags.map(function(item,index){
            this.state.form.aggregation_ref += `${item.text}`;
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
        //if(this.state.aggRefTags.length == 0){
          this.state.aggRefTags.push({id:1,text: this.state.form.aggregation_ref});
        //}

        // Now populate the dynamicDataColumns:[]
      }

  render(){

    this.viewOnly = !(this.writeOnly && this.dml_allowed);
    console.log("this.writeOnly , this.dml_allowed", this.writeOnly , this.dml_allowed,this.viewOnly);

    this.state.rulesSuggestions = [];
    this.state.fieldsSuggestions = [];
    const { rulesTags, rulesSuggestions,aggRefTags, fieldsSuggestions } = this.state;
    if(typeof(this.props.business_rule) != 'undefined'){
      if(this.props.business_rule.source_suggestion[0].rules_suggestion.length){
        const rules_suggestion = this.props.business_rule.source_suggestion[0].rules_suggestion;
        rules_suggestion.map(function(item,index){
          this.state.rulesSuggestions.push(item.business_rule);
        }.bind(this));
      }
    }

    if(typeof(this.props.source_table_columns) != 'undefined'){
      if(this.props.source_table_columns.length){
        const columns_suggestion = this.props.source_table_columns;
        columns_suggestion.map(function(item,index){
          this.state.fieldsSuggestions.push(item.Field);
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
              <h2>Maintain report rule <small>{ [-1,-2].includes(this.ruleIndex) ? 'Add' : 'Edit' } a report rule</small></h2>
                <ul className="nav navbar-right panel_toolbox">
                  <li>
                    <a
                      className="close-link"
                      onClick={this.props.handleClose}
                      title="To mapping list">
                      <i className="fa fa-close"></i>
                    </a>
                  </li>
                </ul>
              <div className="clearfix"></div>
            </div>
            <div className="x_content">

              <form className="form-horizontal form-label-left"
                onSubmit={this.handleSubmit.bind(this)}
              >
                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Section Ref <span className="required">*</span></label>
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <input
                      placeholder="Enter Transactional Section Ref"
                      value={this.state.form.section_id}
                      type="text"
                      required="required"
                      readOnly={true}
                      className="form-control col-md-7 col-xs-12"
                    />
                  </div>
                </div>
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
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Sheet ID <span className="required">*</span></label>
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <input value={this.state.form.sheet_id}  type="text" required="required" className="form-control col-md-7 col-xs-12" readOnly="readonly" />
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
                              required="required"
                              onChange={
                                (event) => {
                                  let table_name = (event.target.options[event.target.selectedIndex].getAttribute('target'));
                                  let form=this.state.form;
                                  form.source_id = event.target.value;
                                  this.setState({form:form, display: null});
                                  console.log('Source ID............',this.state.form.source_id);
                                  this.props.fetchBusinessRulesBySourceId(this.state.form.source_id);
                                  console.log('table name in change event',table_name);
                                  this.props.fetchSourceColumnList(table_name,null);
                                }
                              }
                            >
                              <option value="">Choose option</option>
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
                      readOnly={this.viewOnly}
                      disabled={this.viewOnly}
                      maxLength="1000"
                      minLength="20"
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
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Section Calculation Rules <span className="required">*</span></label>
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
                    <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="columnMapping"></label>
                    <div className="col-md-6 col-sm-6 col-xs-12">
                      <div className="x_panel">
                      <div className="x_title">
                        <h2>Source Column Mapping <small> for the Rule </small></h2>
                        <div className="clearfix"></div>
                      </div>
                      <div className="x_content">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Report Column</th>
                              <th>Mapping</th>
                              <th><i className="fa fa-wrench"></i></th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              this.renderColumns()
                            }
                          </tbody>
                        </table>
                      </div>
                      </div>
                    </div>
                  </div>
                }

                {
                  this.state.display=="editColMapping" &&
                  <TransColMapAssist
                    {...this.state.selectedColumn}
                    handleEditColMapping={this.handleEditColMapping}
                    handleChange={this.handleParameterChange}
                    />
                }

                {
                  !this.viewOnly &&
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

                }

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

  renderColumns(){
        let content=[];
        this.state.dynamicDataColumns.map((element,index)=>{
          console.log("Inside content push",element,this.props.source_table_columns);
          content.push(
            <TransSecColumnRule
              {...element}
              index={index}
              key={index}
              disabled={this.viewOnly}
              sourceId={this.state.form.source_id}
              sourceColumns={this.props.source_table_columns}
              handleChange={this.handleParameterChange}
              handleEditColMapping={this.handleEditColMapping}
              />
          );

        })
      console.log("Inside content push",content);
      return content;
  }
  handleSubmit(event){
    console.log('inside submit',this.state.form);
    event.preventDefault();
    this.flatenTags();

    // let data = {
    //   table_name:"report_calc_def",
    //   update_info:this.state.form
    // };
    // data['change_type'] = this.ruleIndex === -1 ? "INSERT" : "UPDATE";
    //
    // let audit_info={
    //   id:this.state.form.id,
    //   table_name:data.table_name,
    //   change_type:data.change_type,
    //   change_reference:`Rule: ${this.state.form.cell_calc_ref} of : ${this.state.form.report_id}->${this.state.form.sheet_id}->${this.state.form.cell_id} [ Source: ${this.state.form.source_id} ]`,
    //   maker: this.props.login_details.user,
    // };
    // Object.assign(audit_info,this.state.audit_form);
    //
    // data['audit_info']=audit_info;
    //
    // console.log('inside submit',this.state.form);
    // if(data['change_type'] == "INSERT"){
    //   this.props.insertRuleData(data);
    // }
    // else if (data['change_type'] == "UPDATE"){
    //   this.props.updateRuleData(this.state.form.id,data);
    // }
    let change_type = [-1,-2].includes(this.ruleIndex) ? "INSERT" : "UPDATE";
    let calc = {};
    this.state.dynamicDataColumns.map(element=>{
      calc[element.col_id]={column:element.mapped_column}
    })
    let calcRenderRef = {
                rule:this.state.form.cell_business_rules,
                calc: calc
              };
    calcRenderRef = JSON.stringify(calcRenderRef);
    console.log("calcRenderRef",calcRenderRef);
    let update_info={id:this.state.form.id,
                    report_id: this.state.form.report_id,
                    sheet_id: this.state.form.sheet_id,
                    section_id: this.state.form.section_id,
                    source_id:this.state.form.source_id ,
                    cell_calc_ref: this.state.form.cell_calc_ref,
                    cell_calc_render_ref:calcRenderRef,
                    cell_calc_extern_ref:this.state.form.cell_calc_extern_ref,
                    cell_calc_decsription:this.state.form.cell_calc_decsription,
                   };
   let audit_info={id:null,
                   table_name:"report_dyn_trans_calc_def",
                   change_reference: 'Transaction Section Data Rule for ' + update_info.report_id +
                                     '->' + update_info.sheet_id + '-> Source ID: ' + update_info.source_id +
                                     '->' + this.state.form.cell_calc_ref,
                   change_type: change_type,
                   maker:this.props.login_details.user,
                   maker_tenant_id:this.props.login_details.domainInfo.tenant_id,
                   comment:this.state.audit_form.comment,
                   group_id:this.props.groupId
                   };
    let data={
              table_name: "report_dyn_trans_calc_def",
              change_type: change_type,
              update_info:update_info,
              audit_info:audit_info
            }
    if (change_type=="INSERT"){
      // INSERT
      this.props.insertRuleData(data);
    } else {
      // UPDATE
      this.props.updateRuleData(this.state.form.id,data);
    }


    this.props.handleClose();
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
    insertRuleData:(data,domain_type) => {
      dispatch(actionTransReportInsertRule(data,domain_type));
    },
    updateRuleData:(id,data,domain_type) => {
      dispatch(actionTransReportUpdateRule(id,data,domain_type));
    }
  }
}
const VisibleAddReportTransRules = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddReportTransRules);
export default VisibleAddReportTransRules;
