import React,{Component} from 'react';
import DatePicker from 'react-datepicker';
import {Panel,Button} from 'react-bootstrap';
import {hashHistory,Link} from 'react-router';
import {connect} from 'react-redux';
import {dispatch} from 'redux';
import {
  actionTransReportDefineSec,
  actionFetchTransReportSecDef,
  actionDeleteTransReportRules
} from '../../actions/TransactionReportAction';
import _ from 'lodash';
import DrillDownTransRules from '../DrillDown/DrillDownTransRules';

import RegOpzFlatGridActionButtons from '../RegOpzFlatGrid/RegOpzFlatGridActionButtons';
import RegOpzReportGrid from './../RegOpzDataGrid/RegOpzReportGrid';
require('../MaintainReportRules/MaintainReportRules.css');

class AddTransReportSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
          form: {
            id: null,
            report_id: this.props.sectionData.report_id,
            sheet_id: this.props.sectionData.sheet_id,
            cell_id: this.props.sectionData.cell_id,
            section_id: null,
            section_type: null,
            sectionStart: null,
            sectionEnd: null,
            sectionRange: null,
          },
          audit_form:{
            comment:null
          },
          openDataGridCollapsible: false,
          buttons: [],
          selectedCell: null,
        }

        this.ruleIndex = typeof this.props.index === 'number' ? this.props.index : -1;
        this.dml_allowed = this.props.dml_allowed === 'Y' ? true : false;
        this.writeOnly = this.props.writeOnly;
        this.sectionData = undefined;
        this.undefineSection = false;
        this.updateRuleFormula = this.updateRuleFormula.bind(this);
        this.handleSelectCell = this.handleSelectCell.bind(this);
        this.handleResetSec = this.handleResetSec.bind(this);
        this.handleDeleteRules = this.handleDeleteRules.bind(this);
    }

    componentWillMount() {
      console.log("Inside componentWillMount of AddReportRules",this.sectionData);
      // this.setState({
      //   form: this.sectionData},
      //   ()=>{this.props.fetchTransReportSecDef(this.state.form.report_id,this.state.form.sheet_id,this.state.form.cell_id);}
      // );
      this.props.fetchTransReportSecDef(this.state.form.report_id,this.state.form.sheet_id,this.state.form.cell_id);
      if(this.props.cell_rules)
      {
        let content=[];
        this.props.cell_rules.secOrders.length > 0 && this.props.cell_rules.secOrders.map((item,index)=>{(item.dml_allowed!='X')&&content.push(item)});
        this.secOrders=content;
        content=[];
        this.props.cell_rules.secRules.length > 0 && this.props.cell_rules.secRules.map((item,index)=>{(item.dml_allowed!='X')&&content.push(item)});
        this.secRules=content;
        this.undefineSection=(this.secOrders.length == 0 && this.secRules.length ==0)?false:true;
      }
    }

    componentWillReceiveProps(nextProps) {

        // this.setState({
        //   form: nextProps.sectionData},
        //   //this.props.fetchTransReportSecDef(this.state.form.report_id,this.state.form.sheet_id,this.state.form.cell_id)
        // );
        if(nextProps.sectionDetails){
          console.log("Inside componentWillReceiveProps nextprops",nextProps.sectionDetails,nextProps.cellRules);
          this.sectionData = nextProps.sectionDetails;
          if (this.sectionData.section_id) {
            let form = this.state.form
            form.section_id = nextProps.sectionDetails.section_id;
            form.section_type = nextProps.sectionDetails.section_type;
            form.sectionStart = nextProps.sectionDetails.min_col_id + nextProps.sectionDetails.min_row_id.toString();
            form.sectionEnd = nextProps.sectionDetails.max_col_id + nextProps.sectionDetails.max_row_id.toString();
            form.sectionRange = form.sectionStart + ":" + form.sectionEnd;
            this.setState({form:form, openDataGridCollapsible: false});
          }
          else{
            this.setState({openDataGridCollapsible: true});
          }
          console.log("Inside componentWillReceiveProps nextprops2",nextProps.cellRules);
          if(nextProps.cell_rules){
            let content=[];
            nextProps.cell_rules.secOrders.length > 0 && nextProps.cell_rules.secOrders.map((item,index)=>{(item.dml_allowed!='X')&&content.push(item)});
            this.secOrders=content;
            content=[];
            nextProps.cell_rules.secRules.length > 0 && nextProps.cell_rules.secRules.map((item,index)=>{(item.dml_allowed!='X')&&content.push(item)});
            this.secRules=content;
            this.undefineSection = this.secOrders.length == 0 && this.secRules.length == 0?false:true;
          }
        }

        console.log("Inside componentWillReceiveProps");
    }

    handleSelectCell(data){
      console.log("handleSelectCell in AddTransReportSection",data,$("input:focus"));
      if(data.cell){
        // this.setState({selectedCell : data.cell});
        //console.log("inside if handleSelectCell",data);
        // this.props.drillDown(data.reportId,data.sheetName,data.cell)
        let newState = {...this.state};
        newState.selectedCell = data.cell;
        if (this.viewOnly || (this.sectionData && this.sectionData.section_id)){
          // READ ONLY DO NOTHING
        }
        else {

          if(!newState.form.sectionRange){
            newState.form.sectionRange = data.cell;
          }
          else if(newState.form.sectionRange.split(':').length == 1){
            newState.form.sectionRange += ':'+(data.item.merged ? data.item.merged:data.cell);
          }
          else if(newState.form.sectionRange.split(':').length == 2){
            newState.form.sectionRange = data.cell;
          }
          else {
            newState.form.sectionRange = data.cell;
          }
        }
        //if(this.checkRuleValidity(event) == "valid") {

          this.setState(newState);
      }
    }
    updateRuleFormula(event,elementRef){
      console.log("updateRuleFormula",elementRef);
      // if(!this.ruleInputField)
      //   return;
      // let form = this.state.form;
      // let currentFormula = form.comp_agg_rule ? form.comp_agg_rule : '';
      // if(currentFormula != '' && (this.ruleInputField.selectionStart || this.ruleInputField.selectionStart == '0')){
      //   let startPos = this.ruleInputField.selectionStart;
      //   let endPos = this.ruleInputField.selectionEnd;
      //   currentFormula = currentFormula.substring(0, startPos) +
      //     elementRef +
      //     currentFormula.substring(endPos, currentFormula.length);
      //   this.ruleInputField.selectionStart = startPos + elementRef.length;
      //   this.ruleInputField.selectionEnd = startPos + elementRef.length;
      // }
      // else{
      //   currentFormula += elementRef;
      //   this.ruleInputField.selectionStart = currentFormula.length;
      //   this.ruleInputField.selectionEnd = currentFormula.length;
      //   this.ruleInputField.focus();
      // }
      //
      //
      // form.comp_agg_rule = currentFormula;
      // this.setState({form});

      // this.ruleInputField.focus();
      console.log("updateRuleFormula buttons",this.state.buttons);

    }

  render() {
    this.viewOnly = ! (this.writeOnly && this.dml_allowed);
    console.log("Inside render AddTransReportSection",this.state,this.sectionData)
    if(typeof this.state.form == 'undefined') {
      return(
        <h4>Loading...</h4>
      )
    }
    return(
      <div className="row form-container" >
        <div className="x_panel">
          <div className="x_title">
            <h2>Maintain report rule <small>Add/Edit section definition</small></h2>
              <ul className="nav navbar-right panel_toolbox">
              <li>
                <a className="close-link" title="Close" onClick={this.props.handleClose}><i className="fa fa-close"></i></a>
              </li>
            </ul>
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
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="cell-id">Section ID <span className="required">*</span></label>
                  <div className="col-md-3 col-sm-3 col-xs-12">
                    <input
                      value={this.state.form.section_id}
                      type="text"
                      className="form-control col-md-7 col-xs-12"
                      readOnly={this.viewOnly || (this.sectionData && this.sectionData.section_id)}
                      required="required"
                      onChange={
                        (event)=>{
                          let newState = {...this.state};
                          //if(this.checkRuleValidity(event) == "valid") {
                            newState.form.section_id = event.target.value;
                            this.setState(newState);
                            console.log("this.sectionData.section_id", this.sectionData.section_id)
                        }
                      }
                    />
                  </div>
                  </div>
                  <div className="form-group">
                    <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="cell-id">Section Type <span className="required">*</span></label>
                    {
                      (this.viewOnly || (this.sectionData && this.sectionData.section_id)) &&
                      <div className="col-md-3 col-sm-3 col-xs-12">
                        <input
                          value={this.state.form.section_type}
                          type="text"
                          className="form-control col-md-7 col-xs-12"
                          readOnly={true}
                          required="required"
                        />
                      </div>
                    }
                    {
                      !(this.viewOnly || (this.sectionData && this.sectionData.section_id)) &&
                      <div className="col-md-3 col-sm-3 col-xs-12">
                        <select
                          value={this.state.form.section_type}
                          type="text"
                          className="form-control col-md-7 col-xs-12"
                          readOnly={false}
                          required="required"
                          onChange={
                            (event)=>{
                              if(this.viewOnly || (this.sectionData && this.sectionData.section_id)){
                                // Do nothing
                              }
                              else {
                                let newState = {...this.state};
                                //if(this.checkRuleValidity(event) == "valid") {
                                  newState.form.section_type = event.target.value;
                                  this.setState(newState);
                              }
                            }
                          }
                        >
                        <option value="">Choose section type</option>
                        <option value="DYNTEXT">Section Header Text</option>
                        <option value="DYNDATA">Transaction Data</option>
                      </select>
                      </div>
                    }
                    </div>

                  <div className="form-group">
                    <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="comp-agg-ref">Section Range <span className="required">*</span></label>
                    <div className="col-md-3 col-sm-3 col-xs-12">
                      <input
                        value={this.state.form.sectionRange}
                        type="text"
                        required="required"
                        className="form-control col-md-3 col-xs-12"
                        readOnly={! this.viewOnly && this.sectionData && this.sectionData.section_id }
                        title={"Select start and end cell range from the report grid.\n" +
                                "For example, first select A1 and then select N12 to define A1:N13 range."}
                        onChange={(event) => {
                            // Do nothing
                            let newState = {...this.state};
                            //if(this.checkRuleValidity(event) == "valid") {
                              newState.form.sectionRange = "";
                              this.setState(newState);

                         }
                        }
                        ref={(element) => {
                          this.sectionStartField = element;
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
                          }}
                        >
                          {this.state.openDataGridCollapsible ? "Hide" : "Show"} Report Grid
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
                          <RegOpzReportGrid
                            gridData={_.filter(this.props.gridData,{sheet:this.state.form.sheet_id})}
                            report_id={this.state.form.report_id}
                            handleSelectCell={this.handleSelectCell.bind(this)}
                            renderStyle={this.props.renderStyle}
                          />
                      </Panel>
                      </div>
                    }
                    {
                      ((viewOnly)=>{
                        if(! viewOnly && this.sectionData && this.sectionData.section_id && this.props.cell_rules && this.props.selectedCell) {
                          return(
                            <DrillDownTransRules
                              cellRules = {this.props.cell_rules}
                              readOnly = {true}
                              addRulesBtn = {false}
                              selectedCell = {this.props.selectedCell}
                              reportingDate={this.props.reportingDate}
                              showOnlyData={true}
                              handleDeleteRules={this.handleDeleteRules}
                            />
                          );
                        }
                      })(this.viewOnly)
                    }
                  {this.sectionData&&(!this.sectionData.section_id||(this.sectionData.section_id&&!this.undefineSection))&&
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
                }
                  <div className="form-group">
                    <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
                      <button type="button" className="btn btn-primary" onClick={this.props.handleClose}>
                        Cancel</button>
                      {
                        ((viewOnly)=>{
                          if(! viewOnly && this.sectionData && ! this.sectionData.section_id) {
                            return(
                                <button type="submit" className="btn btn-success" >Define Section</button>
                            );
                          }
                          if(! viewOnly && this.sectionData && this.sectionData.section_id) {
                            return(
                                <button type="button" className="btn btn-warning" onClick={this.handleResetSec}
                                disabled={this.undefineSection}>Undefine Section</button>
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
    // let data = {
    //   table_name: "report_comp_agg_def",
    //   update_info: this.state.form
    // };
    // data['change_type'] = this.state.form.id ? "UPDATE" : "INSERT";
    //
    // let audit_info={
    //   table_name:data["table_name"],
    //   change_type:data["change_type"],
    //   change_reference:`Aggregation Rule of : ${this.state.form.report_id}->${this.state.form.sheet_id}->${this.state.form.cell_id}`,
    //   maker: this.props.login_details.user,
    // };
    //
    // Object.assign(audit_info,this.state.audit_form);
    //
    // data['audit_info']=audit_info;
    //
    // if (data['change_type'] == "INSERT") {
    //   this.props.insertRuleData(data);
    // } else {
    //   this.props.updateRuleData(this.state.form.id,data);
    // }
    let formData={
      report_id: this.state.form.report_id,
      sheet_id: this.state.form.sheet_id,
      section_id: (this.sectionData.section_id ? '': this.state.form.section_id),
      section_type: (this.sectionData.section_id ? '': this.state.form.section_type),
      cell_group: this.state.form.sectionRange.split(":"),
    }
    console.log("Before call  of updateTransReportDefineSec",formData);
    this.props.updateTransReportDefineSec(formData);
    this.props.handleClose();
  }

  handleResetSec(){
    event.preventDefault();
    let formData={
      report_id: this.state.form.report_id,
      sheet_id: this.state.form.sheet_id,
      section_id: '',
      section_type: '',
      cell_group: this.state.form.sectionRange.split(":"),
    }
    console.log("Inside call  of handleResetSec",formData);
    this.props.updateTransReportDefineSec(formData);
    this.props.handleClose();
  }
  handleDeleteRules(){
    let content=[];
    let report_id=this.props.selectedCell.reportId;
    let sheet_id=this.props.selectedCell.sheetName;
    let user =this.props.login_details.user;
    let tenant_id= this.props.login_details.domainInfo.tenant_id;
    let group_id=this.props.groupId;
    let flag=false;
    this.secOrders.map((item,index)=>{
      if(item.dml_allowed !="X" && item.in_use != "X")
      {
        if(item.dml_allowed =="Y")
        {
          let audit_info={table_name:"report_dyn_trans_agg_def",
                          change_reference: 'Transaction Section Order for ' + report_id +
                                            '->' + sheet_id + '->' + item.cell_agg_ref,
                          change_type: "DELETE",
                          maker:user,
                          maker_tenant_id:tenant_id,
                          comment:"Intiated removal of existing definition of Section Order to facilitate undefine section " + item.cell_agg_ref,
                          group_id:group_id};
          let data={id:item.id,
                    change_type:"DELETE",
                    table_name:"report_dyn_trans_agg_def",
                    audit_info:audit_info
                  };
          content.push(data);
        }
        else if(item.dml_allowed =="N")
        {
          flag=true;
        }
      }
  })
  this.secRules.map((item,index)=>{
    if(item.dml_allowed !="X" && item.in_use != "X")
    {
        if(item.dml_allowed =="Y")
        {
          let audit_info={table_name:"report_dyn_trans_calc_def",
                          change_reference: 'Transaction Section Data Rule for ' + report_id +
                                            '->' + sheet_id + '->Source ID:' +item.source_id+
                                            '->'+item.cell_calc_ref,
                          change_type: "DELETE",
                          maker:user,
                          maker_tenant_id:tenant_id,
                          comment:"Intiated removal of existing definition of Section Rule to facilitate undefine section " + item.cell_calc_ref,
                          group_id:group_id};
          let data={id:item.id,
                    change_type:"DELETE",
                    table_name:"report_dyn_trans_calc_def",
                    audit_info:audit_info
                  };
          content.push(data);
        }
        else if(item.dml_allowed =="N")
          flag=true;
    }
   })
    if(flag==false)
    {
      let newData={data:content};
      this.props.deleteTransReportRules(newData);
      this.props.handleClose();
    }
  }
}

function mapStateToProps(state) {
  return{
    //cell_rules: state.report_store.cell_rules,
    sectionDetails: state.transreport.sectionDetails,
    cell_options: state.report_store.cell_rules,
    login_details: state.login_store,
    cell_rules: state.transreport.secRules,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    insertRuleData:(data) => {
      dispatch(actionInsertRuleData(data));
    },
    updateTransReportDefineSec:(data) => {
      dispatch(actionTransReportDefineSec(data));
    },
    fetchTransReportSecDef:(reportId,sheetId,cellId) => {
      dispatch(actionFetchTransReportSecDef(reportId,sheetId,cellId));
    },
    deleteTransReportRules:(newData) => {
      dispatch(actionDeleteTransReportRules(newData));
    },
  };
}

const VisibleAddTransReportSection = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddTransReportSection);

export default VisibleAddTransReportSection;
