import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import DatePicker from 'react-datepicker';
import { Button } from 'react-bootstrap';
import {
  Link,
  hashHistory
} from 'react-router';
import { WithContext as ReactTags } from 'react-tag-input';
import RuleAssist from './../RuleAssist';
import {
  actionFetchSources,
  actionFetchSourceColumnList
} from '../../../actions/MaintainReportRuleAction';
import {
  actionInsertBusinessRule,
  actionUpdateBusinessRule
} from '../../../actions/BusinessRulesAction';
require('./AddBusinessRule.css');

class AddBusinessRule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rulesTags: [],
      dataFieldsTags: [],
      fieldsSuggestions: [],
      dataFieldsSuggestions: [],
      componentDidUpdateCount: 0,
      requestType: this.props.location.query['request'],
      ruleIndex: this.props.location.query['index'],
      readOnly: null,
      form: {
        id: null,
        source_id: null,
        rule_execution_order: null,
        business_rule: this.props.location.query['report_id'],
        rule_description: this.props.location.query['sheet'],
        logical_condition: this.props.location.query['cell'],
        python_implementation: null,
        data_fields_list: null,
        business_or_validation: null,
        rule_type: null,
        valid_from: null,
        valid_to: null,
        last_updated_by: null
      },
      audit_form: {
        comment: null
      },
      showRuleAssist: false,
      selectedSource: null,
      ruleAssistProps: null
    };
    this.state.readOnly = this.state.requestType == "update" ? true : false;
    this.handleRuleRefDelete = this.handleRuleRefDelete.bind(this);
    this.handleRuleRefAddition = this.handleRuleRefAddition.bind(this);
    this.handleRuleRefDrag = this.handleRuleRefDrag.bind(this);

    this.handleDataFieldsDelete = this.handleDataFieldsDelete.bind(this);
    this.handleDataFieldsAddition = this.handleDataFieldsAddition.bind(this);
    this.handleDataFieldsDrag = this.handleDataFieldsDrag.bind(this);

    this.searchAnywhere = this.searchAnywhere.bind(this);
    this.handleRuleAssistClick = this.handleRuleAssistClick.bind(this);

  }

  componentWillReceiveProps(nextProps) {
    console.log('Next Props: ', nextProps);
  }

  componentWillMount() {
    this.props.fetchSources();
    console.log('ruleIndex.....', this.state.ruleIndex, typeof this.props.business_rules)
    if (typeof this.state.ruleIndex != 'undefined') {
      Object.assign(this.state.form, this.props.business_rules[0].rows[this.state.ruleIndex]);
      this.initialiseFormFields();
    }
  }
  componentDidUpdate() {
    //let table_name = document.getElementById("sourceId").options[this.state.form.source_id].getAttribute('target');
    if (this.state.componentDidUpdateCount == 0 && this.state.form.source_id ) {
      let table_name = this.sourceId.options[this.state.form.source_id].getAttribute('target');
      //alert(table_name);
      this.props.fetchSourceColumnList(table_name);
      //set the value componentDidUpdateCount to 1 to indicate that column list Updated
      //no need to call componentDidUpdate again
      this.setState({ componentDidUpdateCount: 1 });
    }
  }
  searchAnywhere(textInputValue, possibleSuggestionsArray) {
    var lowerCaseQuery = textInputValue.toLowerCase()

    return possibleSuggestionsArray.filter(function (suggestion) {
      return suggestion.toLowerCase().includes(lowerCaseQuery)
    })
  }
  handleValidFromDateChange(date) {
    let form = this.state.form;
    form.valid_from = date;

    this.setState({ form: form });

  }
  handleValidTillDateChange(date) {
    let form = this.state.form;
    form.valid_to = date;

    this.setState({ form: form });

  }
  handleRuleRefDelete(i) {
    let rulesTags = this.state.rulesTags;
    rulesTags.splice(i, 1);
    this.setState({ rulesTags: rulesTags });
  }

  handleRuleRefAddition(tag) {
    let rulesTags = this.state.rulesTags;
    rulesTags.push({
      id: rulesTags.length + 1,
      text: tag
    });
    this.setState({ rulesTags: rulesTags });
  }

  handleRuleRefDrag(tag, currPos, newPos) {
    let rulesTags = this.state.rulesTags;

    // mutate array
    rulesTags.splice(currPos, 1);
    rulesTags.splice(newPos, 0, tag);

    // re-render
    this.setState({ rulesTags: rulesTags });
  }
  handleDataFieldsDelete(i) {
    let dataFieldsTags = this.state.dataFieldsTags;
    dataFieldsTags.splice(i, 1);
    this.setState({ dataFieldsTags: dataFieldsTags });
  }

  handleDataFieldsAddition(tag) {
    let dataFieldsTags = this.state.dataFieldsTags;
    console.log('inside dataFieldsTags addition 0', dataFieldsTags, this.state.dataFieldsTags);
    // check whether its a valid rule to be added
    if (this.state.fieldsSuggestions.indexOf(tag) != -1) {
      dataFieldsTags.push({
        id: dataFieldsTags.length + 1,
        text: tag
      });
    }
    else {
      alert("Not a valid data field, please check...", tag)
    }
    this.setState({ dataFieldsTags: dataFieldsTags });
  }

  handleDataFieldsDrag(tag, currPos, newPos) {
    let dataFieldsTags = this.state.dataFieldsTags;

    // mutate array
    dataFieldsTags.splice(currPos, 1);
    dataFieldsTags.splice(newPos, 0, tag);

    // re-render
    this.setState({ dataFieldsTags: dataFieldsTags });
  }
  flatenTags() {

    this.state.form.python_implementation = '';
    this.state.form.data_fields_list = '';
    console.log('inside process', this.state);
    this.state.rulesTags.map(function (item, index) {
      console.log('Inside rulesTags.map....:', item.text);
      this.state.form.python_implementation += `${item.text}`;
    }.bind(this));

    this.state.dataFieldsTags.map(function (item, index) {
      if (index == 0) {
        this.state.form.data_fields_list += `${item.text}`;
      }
      else {
        this.state.form.data_fields_list += `,${item.text}`;
      }
    }.bind(this));

    console.log('inside process form check', this.state.form);
  }
  initialiseFormFields() {
    //this.setState({form: this.props.drill_down_result.cell_rules[this.state.ruleIndex]});
    this.state.form = this.props.business_rules[0].rows[this.state.ruleIndex];
    if (this.state.rulesTags.length == 0) {
      this.state.rulesTags.push({ id: 1, text: this.state.form.python_implementation });
    }
    if (this.state.dataFieldsTags.length == 0) {
      const { data_fields_list } = this.state.form;
      let dataFieldsTagsArray = data_fields_list.split(',');
      dataFieldsTagsArray.map((item, index) => {
        if (item != '') {
          this.state.dataFieldsTags.push({ id: index + 1, text: item });
        }
      })
    }
  }

  handleRuleAssistClick() {
    this.flatenTags();
    let formCopy = { ...this.state.form };
    let sourceTable = {
      source_id: formCopy.source_id,
      source_table_name: this.sourceId.options[formCopy.source_id].getAttribute('target')
    }
    this.setState({
      showRuleAssist: true,
      ruleAssistProps: {
        rule: formCopy,
        sourceTable: sourceTable
      }
    });
    console.log('State Saved',this.state.ruleAssistProps);
  }

  render() {
    this.state.fieldsSuggestions = [];
    this.state.dataFieldsSuggestions = [];
    const { rulesTags, dataFieldsTags, fieldsSuggestions, dataFieldsSuggestions } = this.state;

    if (typeof (this.props.source_table_columns) != 'undefined') {
      if (this.props.source_table_columns.length) {
        const columns_suggestion = this.props.source_table_columns;
        console.log('columns_suggestion', columns_suggestion);
        columns_suggestion.map(function (item, index) {
          this.state.fieldsSuggestions.push(item.Field);
        }.bind(this));
      }
      if (dataFieldsTags.length) {
        dataFieldsTags.map(function (item, index) {
          this.state.dataFieldsSuggestions.push(item.text);
        }.bind(this));
      }
    }
    if (typeof (this.props.sources) == 'undefined') {
      return (
        <h1>Loading...</h1>
      )
    } else if (this.state.showRuleAssist) {
      return (
        <RuleAssist
          rule={this.state.ruleAssistProps.rule}
          sourceTable={this.state.ruleAssistProps.sourceTable}
          cancelEditing={() => {
            this.setState({ showRuleAssist: false });
          }}
          handleSaveEditing={this.handleSaveEditing.bind(this)}
        />
      );
    }
    else {
      const { source_suggestion } = this.props.sources;
      // if(typeof(this.state.ruleIndex) != 'undefined'){
      //   console.log('inside initialiseFormFields')
      //   this.initialiseFormFields();
      // }
      console.log('in render', this.state)
      return (
        <div className="row">
          <div className="col col-lg-12">
            <div className="x_title">
              <h2>Maintain Business Rule <small>Add a new rule</small></h2>
              <div className="clearfix"></div>
            </div>
            <div className="x_content">
              <br />
              <form className="form-horizontal form-label-left"
                onSubmit={this.handleSubmit.bind(this)}
              >
                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">ID <span className="required">*</span></label>
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <input
                      defaultValue={this.state.form.id}
                      placeholder="System Reference ID"
                      readOnly="readonly"
                      type="text"
                      className="form-control col-md-7 col-xs-12"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Business Rule Ref<span className="required">*</span></label>
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <input
                      placeholder="Enter Business Rule Ref"
                      value={this.state.form.business_rule}
                      type="text"
                      readOnly={this.state.readOnly}
                      maxLength="10"
                      required="required"
                      className="form-control col-md-7 col-xs-12"
                      onChange={
                        (event) => {
                          let newState = { ...this.state };
                          newState.form.business_rule = event.target.value;
                          this.setState(newState);
                        }
                      }
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Rule Execution Order<span className="required">*</span></label>
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <input
                      placeholder="Enter Business Rule Ref"
                      value={this.state.form.rule_execution_order}
                      type="text"
                      readOnly={this.state.readOnly}
                      maxLength="10"
                      required="required"
                      className="form-control col-md-7 col-xs-12"
                      onChange={
                        (event) => {
                          let newState = { ...this.state };
                          newState.form.rule_execution_order = event.target.value;
                          this.setState(newState);
                        }
                      }
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Business Rule Description<span className="required">*</span></label>
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <textarea
                      placeholder="Enter Business Rule Description here..."
                      value={this.state.form.rule_description}
                      type="text"
                      maxLength="300"
                      required="required"
                      className="form-control col-md-7 col-xs-12"
                      onChange={
                        (event) => {
                          let newState = { ...this.state };
                          newState.form.rule_description = event.target.value;
                          this.setState(newState);
                        }
                      }
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Business Rule Logic Description<span className="required">*</span></label>
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <textarea
                      placeholder="Enter Business Rule Logic Description here..."
                      value={this.state.form.logical_condition}
                      type="text"
                      maxLength="300"
                      required="required"
                      className="form-control col-md-7 col-xs-12"
                      onChange={
                        (event) => {
                          let newState = { ...this.state };
                          newState.form.logical_condition = event.target.value;
                          this.setState(newState);
                        }
                      }
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Source ID <span className="required">*</span></label>
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <select
                      defaultValue={this.state.form.source_id}
                      required="required"
                      className="form-control"
                      ref={(select) => { this.sourceId = select; }}
                      onChange={
                        (event) => {
                          let table_name = (event.target.options[event.target.selectedIndex].getAttribute('target'));
                          let newState = { ...this.state };
                          console.log('table name in change event', table_name);
                          newState.form.source_id = event.target.value;
                          newState.selectedSource = {
                            id: event.target.value,
                            tableName: table_name
                          }
                          this.setState(newState);
                          this.props.fetchSourceColumnList(table_name);
                        }
                      }
                    >
                      <option value="">Choose option</option>
                      {
                        source_suggestion.map(function (item, index) {
                          return (
                            <option key={index} target={item.source_table_name} value={item.source_id}>{item.source_id} - {item.source_table_name}</option>
                          )
                        })
                      }
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Data Attribute Fields <span className="required">*</span></label>
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <ReactTags tags={dataFieldsTags}
                      suggestions={fieldsSuggestions}
                      handleDelete={this.handleDataFieldsDelete}
                      handleAddition={this.handleDataFieldsAddition}
                      handleDrag={this.handleDataFieldsDrag}
                      handleFilterSuggestions={this.searchAnywhere}
                      allowDeleteFromEmptyInput={false}
                      autocomplete={true}
                      minQueryLength={1}
                      classNames={{
                        tagInput: 'tagInputClass',
                        tagInputField: 'tagInputFieldClass form-control',
                        suggestions: 'suggestionsClass',
                      }}
                      placeholder="Enter List of Attributes required for the rule"
                      required="required"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Rule Condition <span className="required">*</span></label>
                  <div className="col-md-6 col-sm-6 col-xs-12">

                    <textarea
                      placeholder="Enter actual rule logic using selected attributes"
                      value={this.state.form.python_implementation}
                      type="text"
                      required="required"
                      disabled
                      className="form-control col-md-7 col-xs-12"
                      onChange={
                        (event) => {
                          let newState = { ...this.state };
                          newState.form.python_implementation = event.target.value;
                          this.setState(newState);
                        }
                      }
                    />
                  </div>
                  <button
                    type="button"
                    disabled={ !this.state.dataFieldsTags.length }
                    onClick={this.handleRuleAssistClick}
                    className="btn btn-primary btn-xs"
                  >
                    Edit
                  </button>
                </div>
                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="rounding-option">Business or Validation Rule<span className="required">*</span></label>
                  <div className="col-md-3 col-sm-3 col-xs-12">
                    <select
                      defaultValue={this.state.form.business_or_validation}
                      className="form-control"
                      required="required"
                      onChange={
                        (event) => {
                          let newState = { ...this.state };
                          newState.form.business_or_validation = event.target.value;
                          this.setState(newState);
                        }
                      }
                    >
                      <option value="">Choose option</option>
                      <option value="BUSINESS">BUSINESS</option>
                      <option value="VALIDATION">VALIDATION</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="rounding-option">Rule Type<span className="required"></span></label>
                  <div className="col-md-3 col-sm-3 col-xs-12">
                    <select
                      defaultValue={this.state.form.rule_type}
                      className="form-control"
                      onChange={
                        (event) => {
                          let newState = { ...this.state };
                          newState.form.rule_type = event.target.value;
                          this.setState(newState);
                        }
                      }
                    >
                      <option value="">Choose option</option>
                      <option value="DERIVED">DERIVED - This is a self reference value check</option>
                      <option value="USEDATA">USEDATA - Rule is evaluated using supplied data</option>
                      <option value="KEYCOLUMN">KEYCOLUMN - Key attribute of the data source</option>
                      <option value="BUYCURRENCY">BUYCURRENCY - Buy currency of the position</option>
                      <option value="SELLCURRENCY">SELLCURRENCY - Sell currency of the position</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Valid from <span className="required"> </span></label>
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <DatePicker
                      dateFormat="YYYYMMDD"
                      selected={this.state.form.valid_from}
                      onChange={console.log("this.handleValidFromDateChange.bind(this)")}
                      placeholderText="Rule Valid From"
                      readOnly="readonly"
                      className="view_data_date_picker_input form-control"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Valid till <span className="required"> </span></label>
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <DatePicker
                      dateFormat="YYYYMMDD"
                      selected={this.state.form.valid_to}
                      onChange={console.log("this.handleValidTillDateChange.bind(this)")}
                      placeholderText="Rule Valid Till"
                      readOnly="readonly"
                      className="view_data_date_picker_input form-control"
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
                      maxLength="1000"
                      minLength="20"
                      onChange={
                        (event) => {
                          let { audit_form } = this.state;
                          audit_form.comment = event.target.value;
                          this.setState({ audit_form });
                        }
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Last Updated by <span className="required">*</span></label>
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <input value="John Doe" type="text" required="required" className="form-control col-md-7 col-xs-12" readOnly="readonly" />
                  </div>
                </div>

                <div className="form-group">
                  <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
                    <button type="button" className="btn btn-primary" onClick={() => { this.handleCancel() }}>
                      Cancel</button>
                    <button type="submit" className="btn btn-success" >Submit</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )
    }
  }
  handleCancel(event) {
    console.log('inside cancel');
    hashHistory.push(`/dashboard/maintain-business-rules`);
  }
  handleSaveEditing(currentFormula){
    console.log('inside saveEditing');
    let formCopy = { ...this.state.form };
    formCopy.python_implementation = currentFormula;
    this.setState({ showRuleAssist: false, form: formCopy });
  }
  handleSubmit(event) {
    console.log('inside submit', this.state.form);
    event.preventDefault();
    this.flatenTags();
    let data = {
      table_name: "business_rules",
      update_info: this.state.form
    };

    // add audit info to the data part
    data['change_type'] = this.state.requestType == 'add' ? 'INSERT' : 'UPDATE';

    let audit_info = {
      id: this.state.form.id,
      table_name: data.table_name,
      change_type: data.change_type,
      change_reference: `Rule: ${this.state.form.business_rule} of Source: ${this.state.form.source_id}`,
      maker: this.props.login_details.user,
    };
    Object.assign(audit_info, this.state.audit_form);

    data['audit_info'] = audit_info;

    console.log('inside submit', this.state.form);
    if (this.state.requestType == "add") {
      this.props.insertBusinessRule(data, this.state.ruleIndex);
    }
    else {
      this.props.updateBusinessRule(data);
    }

    hashHistory.push(`/dashboard/maintain-business-rules`);
  }
}
function mapStateToProps(state) {
  console.log("On map state of Add report rule", state);
  return {
    sources: state.maintain_report_rules_store.sources,
    business_rules: state.business_rules,
    source_table_columns: state.maintain_report_rules_store.source_table_columns,
    login_details: state.login_store,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    fetchSources: (sourceId) => {
      dispatch(actionFetchSources(sourceId));
    },
    fetchSourceColumnList: (table_name) => {
      dispatch(actionFetchSourceColumnList(table_name));
    },
    insertBusinessRule: (item, at) => {
      dispatch(actionInsertBusinessRule(item, at))
    },
    updateBusinessRule: (item) => {
      dispatch(actionUpdateBusinessRule(item))
    }
  }
}
const VisibleAddBusinessRule = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddBusinessRule);
export default VisibleAddBusinessRule;
