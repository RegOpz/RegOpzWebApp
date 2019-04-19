import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Label, Tabs, Tab } from 'react-bootstrap';
import moment from 'moment';

// This is the checkpost for drilldown cells
// Two posible options:
// 1. Report maintenance drilldown, thus the following functions:
//    a. Agg rule maintenance
//    b. calc rule maintenance
//    c. cange history
// 2. Generated report data drillDown
//    a. Agg rule for reference read Only
//    b. Calc rule readonly logic and business rules access, but drilldown to actual data using report version data

class FreeFormatDrillDownRules extends Component {
  constructor(props){
    super(props);
    this.cellRules = this.props.cellRules;
    this.readOnly = this.props.readOnly;
    this.selectedCell = this.props.selectedCell;
    this.reportingDate = this.props.reportingDate;
    this.showRulesPanel = true;
    this.collapseIcon = "fa-chevron-up";
    //this.renderChangeHistory = this.renderChangeHistory.bind(this);
    this.renderAggRules = this.renderAggRules.bind(this);
    this.renderCalcRules = this.renderCalcRules.bind(this);
    this.renderCalcRulesBtn = this.renderCalcRulesBtn.bind(this);
    this.getCellCalcRef = this.getCellCalcRef.bind(this);

    this.handleCollapse = this.handleCollapse.bind(this);
  }


  componentWillReceiveProps(nextProps){
      //TODO
      this.cellRules = nextProps.cellRules;
      this.readOnly = nextProps.readOnly;
      this.selectedCell = nextProps.selectedCell;
      console.log("cellrules FreeFormatDrillDownRules", this.cellRules);

  }

  handleCollapse(event) {
    this.showRulesPanel=!this.showRulesPanel;
    if(this.showRulesPanel) {
      this.collapseIcon = "fa-chevron-up";
    }
    else {
      this.collapseIcon = "fa-chevron-down";
    }
    console.log("Clicked in the collapse-link",this.showRulesPanel);
    this.forceUpdate();
  }

  handleClickHistoryTab(){
    let item = {
        report_id: this.selectedCell.reportId,
        cell_id: this.selectedCell.cellRef,
        sheet_name: this.selectedCell.sheetName,
    };
    this.props.handleCellHistoryClicked(event, item);
    // this.showRulesPanel=!this.showRulesPanel;
  }

  render(){
    console.log("selected Cell ... ", this.selectedCell,this.cellRules)
    const { cellChangeHistory } = this.props;
    return(
          <div className="x_panel">
            <div className="x_title">
              <h2>Report Cell Rules
              <small> for <b>{this.selectedCell.cell}</b> of <b>{this.selectedCell.sheetName}</b> Value <b>{this.selectedCell.value}</b></small>
              </h2>
              <ul className="nav navbar-right panel_toolbox">
                <li>
                  <a className="close-link" onClick={this.props.handleClose}><i className="fa fa-close"></i></a>
                </li>
                <li>
                  <a onClick={()=>{
                      let boxSize = {
                        isMaximized: !this.props.isMaximized
                      }
                      console.log("Inside handleSection resize call...",this.props.id,this.props);
                      this.props.handleBoxSize(this.props.id,boxSize)
                    }} title={this.props.isMaximized ? "Restore" : "Maximize"}>
                    <small><i className="fa fa-square-o"></i></small>
                  </a>
                </li>
                {
                  ! this.props.isBringToFront &&
                  <li>
                    <a onClick={()=>{
                        let id = 'details';
                        this.props.handleBringToFront(id)
                      }} title={"Bring to front"}>
                      <small>
                        <i className="fa fa-share-square-o"></i>
                      </small>
                    </a>
                  </li>
                }
                <li>
                  <a className="collapse-link"
                    onClick={ (event)=>{
                      this.props.handleForceRefresh(event);
                    } }
                    title="Refresh"><i className= { "fa fa-refresh"}></i></a>
                </li>
              </ul>
              <div className="clearfix"></div>
            </div>
            <div className="x_content">
            {
              this.showRulesPanel &&
              <div>
                <Tabs
                  defaultActiveKey={0}
                  >
                  <Tab
                    key={0}
                    eventKey={0}
                    title={<span><i className="fa fa-bullhorn"></i> Aggregation</span>}>
                    { this.renderAggRules(this.cellRules)}
                  </Tab>
                  <Tab
                    key={1}
                    eventKey={1}
                    title={<span><i className="fa fa-tags"></i> Calculations</span>}>
                    { this.renderCalcRules(this.cellRules)}
                  </Tab>
                  <Tab
                    key={2}
                    eventKey={2}
                    title={
                      <span onClick={this.handleClickHistoryTab.bind(this)}>
                        <i className="fa fa-history"></i> Change History
                      </span>
                      }>
                    { cellChangeHistory }
                  </Tab>
                </Tabs>
              </div>
              }
            </div>
          </div>
    );
  }

  renderAggRules(cellRules) {
    console.log("Modal linkage data", cellRules);
    const {aggRuleComponent} = this.props;
    if (cellRules.comp_agg_rules.length == 0 )
      return (
        <div className="col-md-12 col-xs-12">
          <ul className="nav navbar-right panel_toolbox">
            <li>
              <a onClick={
                (event)=>{
                  let item = {
                      id: null,
                      comp_agg_ref: this.selectedCell.cellRef,
                      comp_agg_rule: null,
                      reporting_scale: null,
                      rounding_option: null,
                      // valid_from: null,
                      // valid_to: null,
                      // last_updated_by: null,
                      report_id: this.selectedCell.reportId,
                      cell_id: this.selectedCell.cellRef,
                      sheet_id: this.selectedCell.sheetName,
                      dml_allowed: 'Y'
                  };
                  this.props.handleAggeRuleClicked(event, item);
                  // this.showRulesPanel=!this.showRulesPanel;
                }
              } title={"Add aggregation"}>
                <small>
                  <i className="fa fa-plus green"><i><b> f(x)</b></i></i>
                </small>
              </a>
            </li>
          </ul>
          <div className="col-md-12 col-xs-12">
            <h5>No Agrregation Rule defined for  {this.selectedCell.cell} of {this.selectedCell.sheetName}!</h5>
            {
              aggRuleComponent
            }
          </div>
        </div>
      )
    else {
      // let item = cellRules.comp_agg_rules[0];
      return (
      <div className="col-md-12 col-xs-12">
        <div className="dataTables_wrapper form-inline dt-bootstrap no-footer">
          <div className="row">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Aggregation Ref</th>
                <th>Rounding Option</th>
                <th>Reporting Scale</th>
                <th>In Use</th>
              </tr>
            </thead>
            <tbody>
              {
                cellRules.comp_agg_rules.map((item,index)=>{
                  return(
                    (item.in_use =="Y" ||
                    (item.in_use !="X" && item.dml_allowed != 'X') ||
                    this.reportingDate ) &&
                    <tr>
                      <td>{index}</td>
                      <td>
                        <small>{item.comp_agg_ref}</small>
                          <button
                            type="button"
                            className="btn btn-link btn-xs"
                            onClick={
                              (event)=>{
                                this.props.handleAggeRuleClicked(event, {...item});
                                //this.showRulesPanel = !this.showRulesPanel;
                                // this.handleCollapse(event);
                              }
                            }>
                            <i className="fa fa-camera" data-toggle="tooltip" title="Details"></i>
                          </button>
                      </td>
                      <td>{item.rounding_option}</td>
                      <td>{item.reporting_scale}</td>
                      <td>
                        {
                          ((in_use) => {
                            if (in_use == 'Y') {
                              return (
                                <Label bsStyle="success">{in_use}</Label>
                              );
                            } else {
                              return (<Label bsStyle="warning">{in_use}</Label>);
                            }
                          })(item.in_use)
                        }
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
          </div>
        </div>
        {
          aggRuleComponent
        }
      </div>
      )
    }
  }

  renderCalcRules(cellRules) {
    console.log("Modal linkage data renderCalcRules", cellRules);
    const { calcRuleComponent } = this.props;
    // if (cellRules.cell_rules.length >  0 ){
      let item = cellRules.cell_rules;
      let qd = cellRules.report_snapshot.qualified_data;
    // }
    // console.log("item....",item,qd)
    return (
      <div className="col-md-12 col-xs-12">
        {
            this.renderCalcRulesBtn()
        }
        <div className="col-md-12 col-xs-12">
          {
            cellRules.cell_rules.length == 0 &&
            <div>
              <h5>No Calculations defined for  {this.selectedCell.cell} of {this.selectedCell.sheetName}!</h5>
            </div>
          }
          {
            cellRules.cell_rules.length > 0 &&
            <div className="dataTables_wrapper form-inline dt-bootstrap no-footer">
              <div className="row">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Source#</th>
                      <th>Calculation Ref</th>
                      <th>Calculation Logic</th>
                      <th>Business Rules</th>
                      <th>In Use</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    item.map((item,index)=>{
                      return(
                        (item.in_use =="Y" ||
                        (item.in_use !="X" && item.dml_allowed != 'X') ||
                        this.reportingDate ) &&
                        <tr>
                          <td>{item.source_id}</td>
                          <td>
                            <small>{item.cell_calc_ref}</small>
                            <div>
                            <button
                              type="button"
                              className="btn btn-link btn-xs"
                              onClick={
                                (event)=>{
                                  let calcRuleFilter = {
                                          form: item,
                                          params:{
                                            drill_kwargs: {
                                              index: index,
                                              report_id: item.report_id,
                                              sheet_id: item.sheet_id,
                                              cell_id: item.cell_id,
                                              reporting_date: this.reportingDate,
                                              source_id: item.source_id,
                                              cell_calc_ref: item.cell_calc_ref,
                                              dml_allowed: item.dml_allowed,
                                              page: 0
                                            }
                                          }
                                        }
                                  this.props.handleCalcRuleClicked(event, calcRuleFilter);
                                  //this.showRulesPanel=!this.showRulesPanel;
                                  // this.handleCollapse(event);
                                }
                              }>
                              <i className="fa fa-cube" data-toggle="tooltip" title="Rule Details"></i>
                            </button>
                            {
                              this.props.addRulesBtn &&
                              <button
                                type="button"
                                className="btn btn-link green btn-xs"
                                onClick={
                                  (event)=>{
                                    let cellCalcRef=this.getCellCalcRef();
                                    let copyItem = item;
                                    copyItem.cell_calc_ref = cellCalcRef;
                                    let calcRuleFilter = {
                                            form: copyItem,
                                            params:{
                                              drill_kwargs: {
                                                  index: -2, // index value -2 indicates copy, -1 is for a new rule to created fresh
                                                  report_id: this.selectedCell.reportId,
                                                  sheet: this.selectedCell.sheetName,
                                                  cellRef: this.selectedCell.cellRef,
                                                  cell: this.selectedCell.cell,
                                                  cell_calc_ref:cellCalcRef,
                                                  reporting_date: this.reportingDate,
                                                  in_use: 'N',
                                                  dml_allowed: 'Y',
                                                  page: 0
                                              }
                                            }
                                          }
                                    this.props.handleCalcRuleClicked(event, calcRuleFilter);
                                    //this.showRulesPanel=!this.showRulesPanel;
                                    // this.handleCollapse(event);
                                  }
                                }>
                                <i className="fa fa-copy" data-toggle="tooltip" title="Copy Rule"></i>
                              </button>
                            }
                            {
                              this.props.addRulesBtn &&
                              item.dml_allowed == 'Y' &&
                              item.in_use == 'Y' &&
                              <button
                                type="button"
                                className="btn btn-link amber btn-xs"
                                onClick={
                                  (event)=>{
                                    // TODO handledelete to be implemented later
                                    let toDeleteItem = {
                                      rule: item,
                                      table_name: "report_calc_def"
                                    }
                                    this.props.handleDeleteClick(toDeleteItem);
                                  }
                                }>
                                <i className="fa fa-remove" data-toggle="tooltip" title="Delete Rule"></i>
                              </button>
                            }
                          </div>
                          </td>
                          <td>
                            {
                              item.aggregation_ref &&
                              <span>
                              <Label>{item.aggregation_func}</Label> <b>of</b>
                              <small>{item.aggregation_ref.replace(/,/g,', ')}</small>
                              </span>
                            }
                          </td>
                          <td>
                            <small>{item.cell_business_rules.replace(/,/g,' ')}</small>
                            {
                              !this.props.addRulesBtn &&
                              qd &&
                              Object.keys(qd).includes(item.source_id.toString()) &&
                              <div className="x_content">
                              {
                                Object.keys(qd[item.source_id]).map(key =>{
                                  return(
                                      <button className="btn btn-default btn-xs"
                                        data-toggle="tooltip"
                                        title={"Rule Details" + "\n(version: " + qd[item.source_id][key]+")"}
                                        onClick={
                                          (event)=>{
                                            let calcBusinessRuleFilter = {
                                                    report_id: item.report_id,
                                                    sheet_id: item.sheet_id,
                                                    cell_id: item.cell_id,
                                                    reporting_date: this.reportingDate,
                                                    source_id: item.source_id,
                                                    cell_calc_ref: item.cell_calc_ref,
                                                    rules: item.cell_business_rules,
                                                    page: 0,
                                                    business_date: key,
                                                    qualified_data_version: qd[item.source_id][key],
                                                  }
                                            this.props.handleBusinessRuleClicked(event,calcBusinessRuleFilter);
                                            //this.showRulesPanel=!this.showRulesPanel;
                                            // this.handleCollapse(event);
                                          }
                                        }
                                      >
                                        <small>
                                        <i className="fa fa-camera"></i>
                                          <span>{" " + moment(key.toString()).format("DD-MMM")}</span>
                                        </small>
                                      </button>
                                    )
                                })
                              }
                              </div>
                            }
                            {
                              (
                                !qd ||
                                (qd && !Object.keys(qd).includes(item.source_id.toString()))
                              ) &&
                              <div>
                              {
                                <button className="btn btn-link btn-xs"
                                  data-toggle="tooltip"
                                  title={"Rule Details"}
                                  onClick={
                                    (event)=>{
                                      let calcBusinessRuleFilter = {
                                              report_id: item.report_id,
                                              sheet_id: item.sheet_id,
                                              cell_id: item.cell_id,
                                              reporting_date: this.reportingDate,
                                              source_id: item.source_id,
                                              cell_calc_ref: item.cell_calc_ref,
                                              rules: item.cell_business_rules,
                                              page: 0,
                                            }
                                      this.props.handleBusinessRuleClicked(event,calcBusinessRuleFilter);
                                      //this.showRulesPanel=!this.showRulesPanel;
                                      // this.handleCollapse(event);
                                    }
                                  }
                                >
                                  <i className="fa fa-shield"></i>
                                </button>
                              }
                              {
                                qd && !Object.keys(qd).includes(item.source_id.toString()) &&
                                  <i className="fa fa-warning amber">{" No Business Rules version Qualified"}</i>
                              }
                              </div>
                            }
                          </td>
                          <td>
                            {
                              ((in_use) => {
                                if (in_use == 'Y') {
                                  return (
                                    <Label bsStyle="success">{in_use}</Label>
                                  );
                                } else {
                                  return (<Label bsStyle="warning">{in_use}</Label>);
                                }
                              })(item.in_use)
                            }
                          </td>
                        </tr>
                        )
                      })
                  }
                  </tbody>
                </table>
              </div>
            </div>
          }
          {
            calcRuleComponent
          }
        </div>
      </div>
    )
  }

  getCellCalcRef(){
    let cellCalcRef='';
    if (this.cellRules.cell_rules.length ==0){
        cellCalcRef=this.selectedCell.cellRef + '.000';
    }
    else {
        let seq=[];
        let i=0;
        let existingCellCalcRefs=this.cellRules.cell_rules.map(e=>e.cell_calc_ref);
        console.log("Inside renderCalcRulesBtn cellCalcRefs",existingCellCalcRefs)
        for(let cellRef of existingCellCalcRefs){
          seq[i]=cellRef.split(/\./g)[1]
          console.log("Inside renderCalcRulesBtn",seq)
          i++;
        }
        let maxCellRef=Math.max(...seq)+1;
        if(maxCellRef > 999){ console.log("Error:Number can't be greater than 1000");}
        cellCalcRef=this.selectedCell.cellRef + '.' +
                             ((num,size)=>{
                                  var s = num+"";
                                  while (s.length < size) s = "0" + s;
                                  return s;
                                })(maxCellRef,3);

    }

    return cellCalcRef;
  }

  renderCalcRulesBtn(){
    console.log("Inside renderCalcRulesBtn",this.props.addRulesBtn);
    let cellCalcRef=this.getCellCalcRef();

    if (this.props.addRulesBtn) {
        return(
            <ul className="nav navbar-right panel_toolbox">
              <li>
                <a onClick={
                  (event) => {
                      let calcRuleFilter = {
                        form: {cell_calc_ref:cellCalcRef},
                        params:{
                          drill_kwargs: {
                              index: -1,
                              report_id: this.selectedCell.reportId,
                              sheet: this.selectedCell.sheetName,
                              cellRef: this.selectedCell.cellRef,
                              cell: this.selectedCell.cell,
                              cell_calc_ref:cellCalcRef,
                              reporting_date: this.reportingDate,
                              in_use: 'N',
                              dml_allowed: 'Y',
                              page: 0
                          }
                        }
                      }
                      this.props.handleCalcRuleClicked(event, calcRuleFilter);
                      //this.showRulesPanel=!this.showRulesPanel;
                      // this.handleCollapse(event);
                   }
                }
                title={"Add New Calculation"}>
                  <small>
                    <i className="fa fa-tag green"></i>
                  </small>
                </a>
              </li>
            </ul>
        );
    }
  }

}

export default FreeFormatDrillDownRules;
