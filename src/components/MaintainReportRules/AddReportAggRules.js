import React,{Component} from 'react';
import DatePicker from 'react-datepicker';
import {Panel,Button} from 'react-bootstrap';
import {hashHistory,Link} from 'react-router';
import {connect} from 'react-redux';
import {dispatch} from 'redux';
import {
  actionInsertRuleData,
  actionUpdateRuleData
} from '../../actions/MaintainReportRuleAction';
import RegOpzFlatGridActionButtons from '../RegOpzFlatGrid/RegOpzFlatGridActionButtons';
import RegOpzReportGrid from './../RegOpzDataGrid/RegOpzReportGrid';
require('./MaintainReportRules.css');

class AddReportAggRules extends Component {
    constructor(props) {
        super(props);
        this.state = {
          form: {
            id: null,
            report_id: this.props.report_id,
            sheet_id: this.props.sheet_id,
            cell_id: this.props.cell_id,
            comp_agg_ref: null,
            comp_agg_rule: null,
            reporting_scale: null,
            rounding_option: null,
            valid_from: null,
            valid_to: null,
            last_updated_by: null
          },
          audit_form:{
            comment:null
          },
          openDataGridCollapsible: false
        }
        // this.aggRulesList = new RegExp('[A-Z0-9]+') Options are included
        //this.aggRulesPattern = /(\w+([\+\-\*\/]\w+)?)|(\(\w+\))/g;
        this.aggRulesPattern = /[\+\-\*\/\(\)\[\]\{\}\^]/g;
        this.buttons=[];

        this.ruleIndex = typeof this.props.index === 'number' ? this.props.index : -1;
        this.dml_allowed = this.props.dml_allowed === 'Y' ? true : false;
        this.writeOnly = this.props.writeOnly;

        this.updateRuleFormula = this.updateRuleFormula.bind(this);
        this.handleSelectCell = this.handleSelectCell.bind(this);
    }

    componentWillMount() {
        if (this.ruleIndex !== -1) {
            Object.assign(this.state.form, this.props.cell_rules.comp_agg_rules[this.ruleIndex]);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.ruleIndex = nextProps.ruleIndex
        if (this.ruleIndex !== -1) {
            Object.assign(this.state.form, nextProps.cell_rules.comp_agg_rules[this.ruleIndex]);
        }
        this.dml_allowed = nextProps.dml_allowed;
        this.writeOnly = nextProps.writeOnly;
    }

    handleSelectCell(data){
      console.log("handleSelectCell",data);
      let newState = {...this.state}
      if(data.drillDown){
        this.buttons=[];
        //console.log("inside if handleSelectCell",data);
        data.drillDown.comp_agg_rules.map((item,index)=>{
          //console.log("inside if handleSelectCell data.drillDown.comp_agg_rules.map",this.props.cell_id + this.props.sheet_id,item.cell_id + item.sheet_id);
          if(this.props.cell_id + this.props.sheet_id != item.cell_id + item.sheet_id){
            this.buttons.push({
                title: item.cell_id + " Aggregation Rule: " + item.comp_agg_rule,
                name: item.comp_agg_ref,
                iconClass: 'fa-paperclip',
                checkDisabled: 'No',
                className: "btn-success",
              })
          }
        })
        data.drillDown.cell_rules.map((item,index)=>{
          this.buttons.push({
              title: item.cell_id + " Rule: " + item.cell_business_rules + " Aggregation: " + item.aggregation_func + "(" + item.aggregation_ref +")",
              name: item.cell_calc_ref,
              iconClass: 'fa-tag',
              checkDisabled: 'No',
              className: "btn-info",
            })
        })
        this.setState(newState);
        if(!this.ruleInputField)
          return;
        this.ruleInputField.selectionStart = newState.form.comp_agg_rule.length;
        this.ruleInputField.selectionEnd = newState.form.comp_agg_rule.length;
        this.ruleInputField.focus();
      }
      console.log("At the end of handle select");
    }
    updateRuleFormula(event,elementRef){
      console.log("updateRuleFormula",elementRef);
      if(!this.ruleInputField)
        return;
      let form = this.state.form;
      let currentFormula = form.comp_agg_rule ? form.comp_agg_rule : '';
      if(currentFormula != '' && (this.ruleInputField.selectionStart || this.ruleInputField.selectionStart == '0')){
        let startPos = this.ruleInputField.selectionStart;
        let endPos = this.ruleInputField.selectionEnd;
        currentFormula = currentFormula.substring(0, startPos) +
          elementRef +
          currentFormula.substring(endPos, currentFormula.length);
        this.ruleInputField.selectionStart = startPos + elementRef.length;
        this.ruleInputField.selectionEnd = startPos + elementRef.length;
      }
      else{
        currentFormula += elementRef;
        this.ruleInputField.selectionStart = currentFormula.length;
        this.ruleInputField.selectionEnd = currentFormula.length;
        this.ruleInputField.focus();
      }


      form.comp_agg_rule = currentFormula;
      this.setState({form});

      this.ruleInputField.focus();
      console.log("updateRuleFormula buttons",this.buttons);

    }

  render() {
    this.viewOnly = ! (this.writeOnly && this.dml_allowed);
    return(
      <div className="row form-container" >
        <div className="x_panel">
          <div className="x_title">
            <h2>Maintain report rule <small>Add a new aggregation rule</small></h2>
            <div className="clearfix"></div>
          </div>

          <div className="x_content">
           <form className="form-horizontal form-label-left" onSubmit={this.handleSubmit.bind(this)}>

            <div className="form-group">
              <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="report-id">Report ID <span className="required">*</span></label>
              <div className="col-md-3 col-sm-3 col-xs-12">
                <input
                  value={this.state.form.report_id}
                  type="text"
                  className="form-control col-md-7 col-xs-12"
                  readOnly="true"
                />
              </div>
              </div>

              <div className="form-group">
                <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="sheet-id">Sheet ID <span className="required">*</span></label>
                <div className="col-md-3 col-sm-3 col-xs-12">
                  <input
                    value={this.state.form.sheet_id}
                    type="text"
                    className="form-control col-md-7 col-xs-12"
                    readOnly="true"
                  />
                </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="cell-id">Cell ID <span className="required">*</span></label>
                  <div className="col-md-3 col-sm-3 col-xs-12">
                    <input
                      value={this.state.form.cell_id}
                      type="text"
                      className="form-control col-md-7 col-xs-12"
                      readOnly="true"
                    />
                  </div>
                  </div>

                  <div className="form-group">
                    <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="comp-agg-ref">Aggregation Reference <span className="required">*</span></label>
                    <div className="col-md-4 col-sm-4 col-xs-12">
                      <input
                        value={this.state.form.comp_agg_ref}
                        type="text"
                        className="form-control col-md-7 col-xs-12"
                        readOnly={this.viewOnly}
                        onChange={(event) => {
                          let newState = {...this.state};
                          //if(this.checkRuleValidity(event) == "valid") {
                            newState.form.comp_agg_ref = event.target.value;
                            this.setState(newState);
                          // }
                          // else {
                          //   alert("Invalid formula, please check");
                          //   this.setState(newState);
                          // }
                         }
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="comp-agg-ref">Aggregation Logic <span className="required">*</span></label>
                    <div className="col-md-6 col-sm-6 col-xs-12">
                      <textarea
                        value={this.state.form.comp_agg_rule}
                        type="text"
                        className="form-control col-md-7 col-xs-12"
                        readOnly={this.viewOnly}
                        onChange={(event) => {
                          let newState = {...this.state};
                          //if(this.checkRuleValidity(event) == "valid") {
                            newState.form.comp_agg_rule = event.target.value;
                            this.setState(newState);
                          // }
                          // else {
                          //   alert("Invalid formula, please check");
                          //   this.setState(newState);
                          // }
                         }
                        }
                        ref={(element) => {
                          this.ruleInputField = element;
                        }}
                      />
                    </div>
                    {
                      this.props.gridData &&
                      !this.viewOnly &&
                      <div className="col-md-2 col-sm-2 col-xs-12">
                        <button
                          type="button"
                          disabled={this.viewOnly}
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            let currentState = this.state.openDataGridCollapsible;
                            this.setState({openDataGridCollapsible: !currentState});
                            this.ruleInputField.selectionStart = this.state.form.comp_agg_rule.length;
                            this.ruleInputField.selectionEnd = this.state.form.comp_agg_rule.length;
                            this.ruleInputField.focus();
                          }}
                        >
                          {this.state.openDataGridCollapsible ? "Hide" : "Show"} Data Grid
                        </button>
                      </div>
                    }
                    </div>
                    {
                      this.props.gridData &&
                      !this.viewOnly &&
                      <div className="form-group">
                      <Panel
                        collapsible
                        bsClass=""
                        expanded={this.state.openDataGridCollapsible}
                        >
                          <RegOpzFlatGridActionButtons
                            editable={this.writeOnly}
                            checkDisabled={this.checkDisabled}
                            buttons={this.buttons}
                            dataNavigation={false}
                            buttonClicked={this.updateRuleFormula}
                          />
                          <RegOpzReportGrid
                            gridData={this.props.gridData}
                            report_id={this.state.form.report_id}
                            handleSelectCell={this.handleSelectCell.bind(this)}
                          />
                      </Panel>
                      </div>
                    }

                  <div className="form-group">
                    <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="reporting-scale">Reporting Scale<span className="required">*</span></label>
                    <div className="col-md-2 col-sm-2 col-xs-12">
                      <input
                        value={this.state.form.reporting_scale}
                        readOnly={this.viewOnly}
                        type="number"
                        className="form-control col-md-7 col-xs-12"
                        onChange={(event) => {
                            let newState = {...this.state};
                            newState.form.reporting_scale = event.target.value;
                            this.setState(newState);
                          }
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="rounding-option">Rounding Option<span className="required">*</span></label>
                    <div className="col-md-3 col-sm-3 col-xs-12">
                      <select
                        defaultValue = {this.state.form.rounding_option}
                        className="form-control"
                        readOnly={this.viewOnly}
                        onChange={
                          (event) => {
                            let newState = {...this.state};
                            newState.form.rounding_option = event.target.value;
                            this.setState(newState);
                          }
                        }
                      >
                        <option>Choose option</option>
                        <option value="NONE">NONE</option>
                        <option value="CEIL">CEIL</option>
                        <option value="FLOOR">FLOOR</option>
                        <option value="TRUNC">TRUNC</option>
                        <option value="DECIMAL0">DECIMAL0</option>
                        <option value="DECIMAL1">DECIMAL1</option>
                        <option value="DECIMAL2">DECIMAL2</option>
                        <option value="DECIMAL3">DECIMAL3</option>
                        <option value="DECIMAL4">DECIMAL4</option>
                        <option value="DECIMAL5">DECIMAL5</option>
                        <option value="DECIMAL6">DECIMAL6</option>
                        <option value="DECIMAL7">DECIMAL7</option>
                        <option value="DECIMAL8">DECIMAL8</option>
                        <option value="DECIMAL9">DECIMAL9</option>
                        <option value="DECIMAL10">DECIMAL10</option>
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
                    <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="comment">Comment<span className="required">*</span></label>
                    <div className="col-md-5 col-sm-5 col-xs-12">
                      <textarea
                        value={this.state.audit_form.comment}
                        minLength="20"
                        maxLength="1000"
                        required="true"
                        type="text"
                        readOnly={this.viewOnly}
                        className="form-control col-md-7 col-xs-12"
                        onChange={(event) => {
                          let newState = {...this.state};
                          newState.audit_form.comment = event.target.value;
                          this.setState(newState);
                          }
                        }
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="last-update-by">Last Updated By<span className="required">*</span></label>
                    <div className="col-md-3 col-sm-3 col-xs-12">
                      <input
                        value={this.state.form.last_updated_by}
                        type="text"
                        readOnly="true"
                        className="form-control col-md-7 col-xs-12"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
                      <button type="button" className="btn btn-primary" onClick={this.props.handleClose}>
                        Cancel</button>
                      {
                        ((viewOnly)=>{
                          if(! viewOnly) {
                            return(
                                <button type="submit" className="btn btn-success" >Submit</button>
                            );
                          }
                        })(this.viewOnly)
                      }

                    </div>
                  </div>

          </form>
         </div>
        </div>
      </div>
    );
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state.form);
    let data = {
      table_name: "report_comp_agg_def",
      update_info: this.state.form
    };
    data['change_type'] = this.ruleIndex === -1 ? "INSERT" : "UPDATE";

    let audit_info={
      table_name:data["table_name"],
      change_type:data["change_type"],
      change_reference:`Aggregation Rule of : ${this.state.form.report_id}->${this.state.form.sheet_id}->${this.state.form.cell_id}`,
      maker: this.props.login_details.user,
    };

    Object.assign(audit_info,this.state.audit_form);

    data['audit_info']=audit_info;

    if (data['change_type'] == "INSERT") {
      this.props.insertRuleData(data);
    } else {
      this.props.updateRuleData(this.state.form.id,data);
    }

    this.props.handleClose();
  }

  checkRuleValidity(event){
    var nstr = ''
    var str = event.target.value;
    var str1 = event.target.value;
    var nnstr=''
    var aggRulesPattern = /[\+\-\*\/\(\)\[\]\{\}\^]/g;
    //do {
      //nstr = str.replace(this.aggRulesPattern, '0');
      nstr = str.replace(aggRulesPattern, ',');
      nstr = nstr.split(",");
      nstr.map(function(item,index){
          this.state.form.cell_business_rules += `${item.text},`;
        }.bind(this));
      console.log('inside while...',nstr,str);
    //} while (nstr !== str && ((str = nstr) || 1));
    nnstr = str1.replace(/(AB\b|A\b|ABC\b)/g,'2');
    console.log('outside while...',nnstr,nstr,str);
    if (str === '0') {
      console.log("valid");
      return "valid";
    } else {
      console.log("invalid");
      return "invalid";
    }
  }

}

function mapStateToProps(state) {
  return{
    cell_rules: state.report_store.cell_rules,
    login_details: state.login_store,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    insertRuleData:(data) => {
      dispatch(actionInsertRuleData(data));
    },
    updateRuleData:(id, data) => {
      dispatch(actionUpdateRuleData(id, data));
    }
  };
}

const VisibleAddReportAggRules = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddReportAggRules);

export default VisibleAddReportAggRules;
