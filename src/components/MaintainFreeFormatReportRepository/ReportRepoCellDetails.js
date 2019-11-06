import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import { Label, Tabs, Tab, Carousel } from 'react-bootstrap';
import moment from 'moment';
import _ from 'lodash';
import AddReportRepoRules from './AddReportRepoRules';
import AddReportRepoAggRules from './AddReportRepoAggRules';
import LoadingForm from '../Authentication/LoadingForm';
import DefAuditHistory from '../AuditModal/DefAuditHistory';
import ViewRepoBusinessRules from '../MaintainBusinessRulesRepository/MaintainBusinessRulesRepository';

import {
  actionRepoDrillDown,
  actionFetchRepoReportChangeHistory,
} from '../../actions/ReportRulesRepositoryAction';

// This is the checkpost for drilldown cells
// Two posible options:
// 1. Report maintenance drilldown, thus the following functions:
//    a. Agg rule maintenance
//    b. calc rule maintenance
//    c. cange history
// 2. Generated report data drillDown
//    a. Agg rule for reference read Only
//    b. Calc rule readonly logic and business rules access, but drilldown to actual data using report version data

class ReportRepoCellDetails extends Component {
  constructor(props){
    super(props);
    this.state={
      // TODO
      displayCalc: false,
      displayCalcType: "Tabular",
      displayAgg: false,
      displayAggType: "Tabular",
    }

    // Local
    this.cellRules = undefined;
    this.cellChangeHistory = undefined;
    this.calcRuleData = {};
    this.aggRuleData = {};
    this.selectedCell = this.props.selectedCell;
    this.country = this.props.country;
    // Methods
    this.loadingPage = this.loadingPage.bind(this);
    this.renderAggRules = this.renderAggRules.bind(this);
    this.renderAggRulesBtn = this.renderAggRulesBtn.bind(this);
    this.renderAggRulesTabular = this.renderAggRulesTabular.bind(this);
    this.renderAggRulesSlide = this.renderAggRulesSlide.bind(this);
    this.renderCalcRules = this.renderCalcRules.bind(this);
    this.renderCalcRulesBtn = this.renderCalcRulesBtn.bind(this);
    this.renderCalcRulesTablular = this.renderCalcRulesTablular.bind(this);
    this.renderCalcRulesSlide = this.renderCalcRulesSlide.bind(this);
    this.getCellCalcRef = this.getCellCalcRef.bind(this);
    this.handleAddCalcRule = this.handleAddCalcRule.bind(this);
    this.renderCalcBusinessRules = this.renderCalcBusinessRules.bind(this);
    this.handleAddAggRule = this.handleAddAggRule.bind(this);
    this.renderChangeHistory = this.renderChangeHistory.bind(this);
  }


  componentWillMount(){
    this.props.drillDown(this.selectedCell.reportId,this.selectedCell.sheetName,this.selectedCell.cellRef);
    this.props.fetchReportChangeHistory(this.selectedCell.reportId,this.selectedCell.sheetName,this.selectedCell.cellRef);
  }



  componentWillReceiveProps(nextProps){
      //TODO
      // Only refresh cell rules, if this.cellRules is not defined
      // This can only happen when componentWillMount or we need to refresh the rules data
      // console.log("componentWillReceiveProps...selectedCell",this.selectedCell,this.props.selectedCell,nextProps.selectedCell)
        if(!this.cellRules && this.props.cell_rules !== nextProps.cell_rules)
        {
          this.cellRules = nextProps.cell_rules;
        }
        if(!this.cellChangeHistory && this.props.change_history !== nextProps.change_history){
          this.cellChangeHistory = nextProps.change_history;
        }

  }

  loadingPage(icon, color,msg){
    return(
      <LoadingForm
        loadingMsg={
            <div>
              <div>
                <a className="btn btn-app" style={{"border": "none"}}>
                  <i className={ "fa " + icon + " " + color }></i>
                  <span className={color}>..........</span>
                </a>
              </div>
              <span className={color}>{msg}</span>
              <br/>
              <span className={color}>Please wait</span>
            </div>
          }
        />
    );
  }


  renderAggRules(cellRules) {
    return (
      <div>
        {
          !this.state.displayAgg &&
          this.cellRules.comp_agg_rules.length == 0 &&
          <div className="col-md-12 col-xs-12">
            <div className="col-middle">
              <div className="text-center text-center">
                <div className="mid_center">
                  <div>
                    <div>
                      <a className="btn btn-app" style={{"border": "none"}}
                        onClick={
                          ()=>{this.handleAddAggRule("New");}
                        }
                        title="Add Rule">
                        <i className={ "fa fa-bullhorn green"}></i>
                      </a>
                    </div>
                    <span className={"green"}>Create Aggregation Rule</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        {
          this.cellRules.comp_agg_rules.length > 0 &&
          this.renderAggRulesBtn()
        }
        {
          this.cellRules.comp_agg_rules.length > 0 &&
          this.state.displayAggType == "Tabular" &&
          this.renderAggRulesTabular()
        }
        {
          this.cellRules.comp_agg_rules.length > 0 &&
          this.state.displayAggType == "Slide" &&
          this.renderAggRulesSlide()
        }
        <br/>
        {
          this.state.displayAgg &&
          <AddReportRepoAggRules
            writeOnly={this.props.writeOnly}
            requestType={this.state.displayAgg}
            reportGrid = { this.props.reportGrid }
            form = { this.aggRuleData }
            groupId={this.props.groupId}
          />
        }
      </div>
    )

  }

  renderAggRulesBtn(){
    return(
      <ul className="nav navbar-right panel_toolbox">
        <li>
          <a onClick={
            (event) => {
                this.setState({displayAggType:"Tabular"});
             }
          }
          title={"Table View"}>
            <small>
              <i className="fa fa-th-list"></i>
            </small>
          </a>
        </li>
        <li>
          <a onClick={
            (event) => {
                this.setState({displayAggType:"Slide"});
             }
          }
          title={"Slide View"}>
            <small>
              <i className="fa fa-square"></i>
            </small>
          </a>
        </li>
      </ul>
    );
  }

  renderAggRulesTabular(){
    return(
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
                this.cellRules.comp_agg_rules.map((item,index)=>{
                  return(
                    <tr>
                      <td>{index+1}</td>
                      <td>
                        <small className="cursor-pointer"
                          onClick={
                            (event)=>{
                              this.handleAddAggRule("Edit",item);
                            }
                          }>{item.comp_agg_ref}</small>
                          <button
                            type="button"
                            className="btn btn-link btn-xs red"
                            onClick={
                              (event)=>{
                                // TODO
                              }
                            }>
                            <i className="fa fa-trash" data-toggle="tooltip" title="Delete"></i>
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
      </div>
    );

  }

  renderAggRulesSlide(){
    return(
      <div className="x_content"
        style={{"background":"url(./images/calc.1.jpg)","backgroundColor": "#2A3F54","minHeight": "220px"}}
        >
        <Carousel
          interval={null}
          onSelect={
            (selectedIndex,event) => {
                // TODO
             }
          }>
          {
            this.cellRules.comp_agg_rules.map((item,index)=>{
              return(
                <Carousel.Item
                  key={"car"+index}
                  style={{"minHeight": "220px"}}
                  >
                  <Carousel.Caption>
                    <span
                      className="wrap-1-line cursor-pointer"
                      onClick={
                        ()=>{this.handleAddAggRule("Edit",item);}
                      }
                      >
                      <h3>
                        <i className={"fa " + (item.in_use == 'Y' ? "fa-check-square-o green" : "fa-warning amber")}></i>
                        &nbsp;{item.comp_agg_ref}
                      </h3>
                    </span>
                    <p>
                      <span className="wrap-1-line">
                        <i className="fa fa-trash cursor-pointer red"
                          title="Delete"
                          onClick={
                            ()=>{
                              // TODO
                            }
                          }
                          ></i>
                      </span>
                      <span className="wrap-1-line">
                        <Label>Aggegration</Label>&nbsp;
                        <small>{item.comp_agg_rule}</small>
                      </span>
                      <br/>
                      <span
                        className="wrap-3-line cursor-pointer"
                        onClick={()=>{alert(item.cell_agg_decsription)}}
                        >
                        <i className="fa fa-thumb-tack"></i>&nbsp;
                        <small>{item.cell_agg_decsription}</small>
                      </span>
                    </p>
                  </Carousel.Caption>
                </Carousel.Item>
              )
            })
          }
        </Carousel>
      </div>
    );
  }

  renderCalcRules(cellRules) {
    return (
      <div className="">
      {
          this.renderCalcRulesBtn()
      }
      {
        this.cellRules.cell_rules.length > 0 && this.state.displayCalcType == "Tabular" &&
        this.renderCalcRulesTablular()
      }
      {
        this.cellRules.cell_rules.length > 0 && this.state.displayCalcType == "Slide" &&
        this.renderCalcRulesSlide()
      }
      <br/>
      {
          ["Edit","New","Copy"].includes(this.state.displayCalc) &&
          <AddReportRepoRules
            writeOnly={this.props.writeOnly}
            requestType={this.state.displayCalc}
            form={this.calcRuleData}
            groupId={this.props.groupId}
            country={ this.country }
          />
      }
      {
        this.state.displayCalc=="BusinessRules" &&
        this.renderCalcBusinessRules()
      }
      </div>
    )
  }

  renderCalcRulesSlide(){
    return(
      <div className="x_content"
        style={{"background":"url(./images/calc.1.jpg)","backgroundColor": "#2A3F54","minHeight": "300px"}}
        >
        <Carousel
          interval={null}
          onSelect={
            (selectedIndex,event) => {
                // TODO
             }
          }>
          {
            this.cellRules.cell_rules.map((item,index)=>{
              return(
                <Carousel.Item
                  key={"ccr"+index}
                  style={{"minHeight": "300px"}}
                  >
                  <Carousel.Caption>
                    <span
                      className="wrap-1-line cursor-pointer"
                      onClick={
                        ()=>{this.handleAddCalcRule("Edit",item);}
                      }
                      >
                      <h3>
                        <i className={"fa " + (item.in_use == 'Y' ? "fa-check-square-o green" : "fa-warning amber")}></i>
                        &nbsp;{item.cell_calc_ref}
                      </h3>
                    </span>
                    <p>
                      <span className="wrap-1-line">
                        <i className="fa fa-copy cursor-pointer green"
                          title="Copy Rule"
                          onClick={
                            (event)=>{
                              this.handleAddCalcRule("Copy",item);
                            }
                          }></i>
                        &nbsp;&nbsp;&nbsp;
                        <i className="fa fa-trash cursor-pointer red"
                            title="Delete Rule"
                            onClick={
                              (event)=>{
                                // TODO
                              }
                            }></i>
                      </span>
                      <span className="wrap-1-line">
                        <i className="fa fa-rss"></i>&nbsp;
                        <small>{"for country #"  + this.props.country }</small>
                      </span>
                      <br/>
                      <span
                        className="wrap-2-line cursor-pointer"
                        onClick={()=>{
                          this.handleAddCalcRule("BusinessRules",item);
                        }}
                        >
                        <i className="fa fa-shield blue"></i>&nbsp;
                        <small>{item.cell_business_rules.replace(/,/g,' ')}</small>
                      </span>
                      <br/>
                      <span
                        className="wrap-3-line"
                        >
                        <i className="fa fa-thumb-tack"></i>&nbsp;
                        <small>{item.cell_calc_decsription.replace(/,/g,' ')}</small>
                      </span>
                    </p>
                  </Carousel.Caption>
                </Carousel.Item>
              )
            })
          }
        </Carousel>
      </div>
    );

  }
  renderCalcRulesTablular(){
    return(
      <div className="dataTables_wrapper form-inline dt-bootstrap no-footer">
        <div className="row">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Country#</th>
                <th>Calculation Ref</th>
                <th>Business Rules</th>
                <th>In Use</th>
              </tr>
            </thead>
            <tbody>
            {
              this.cellRules.cell_rules.map((item,index)=>{
                return(
                  <tr>
                    <td>{this.props.country}</td>
                    <td>
                      <small
                        className="cursor-pointer"
                        onClick={
                          (event)=>{
                            this.handleAddCalcRule("Edit",item);
                          }
                        }
                        >{item.cell_calc_ref}</small>
                      <div>

                      {
                        // this.props.addRulesBtn &&
                        <button
                          type="button"
                          className="btn btn-link green btn-xs"
                          onClick={
                            (event)=>{
                              this.handleAddCalcRule("Copy",item);
                            }
                          }>
                          <i className="fa fa-copy" data-toggle="tooltip" title="Copy Rule"></i>
                        </button>
                      }
                      {
                        // this.props.addRulesBtn &&
                        // item.dml_allowed == 'Y' &&
                        // item.in_use == 'Y' &&
                        <button
                          type="button"
                          className="btn btn-link red btn-xs"
                          onClick={
                            (event)=>{
                              // TODO handledelete to be implemented later
                            }
                          }>
                          <i className="fa fa-trash" data-toggle="tooltip" title="Delete Rule"></i>
                        </button>
                      }
                    </div>
                    </td>
                    <td>
                      <small>{item.cell_business_rules.replace(/,/g,' ')}</small>

                      {
                        <div>
                        {
                          <button className="btn btn-link btn-xs"
                            data-toggle="tooltip"
                            title={"Rule Details"}
                            onClick={
                              (event)=>{
                                this.handleAddCalcRule("BusinessRules",item);
                              }
                            }
                          >
                            <i className="fa fa-shield"></i>
                          </button>
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
    );
  }

  renderCalcBusinessRules(){
    const {permission,source} = this.props.login_details;
    let isRulesComponent = permission.find(function(p){return p.component.match(/Business Rules/);});
    const { source_id } = this.calcRuleData;
    let ruleFilterParam = {page:0};
    Object.assign(ruleFilterParam,this.calcRuleData);

    let sourceItem = source.find(function(s){return s.source_id==source_id;});
    if (sourceItem){
        sourceItem={...sourceItem,...JSON.parse(sourceItem.permission_details)};
    } else {
      sourceItem={source_id: source_id}
    }
    const permissions=[{"permission": isRulesComponent ? "View Business Rules Repository" : null}];
    return(
      <div className="col-md-12 col-xs-12">
        <ul className="nav navbar-right panel_toolbox">
          <li>
            <a className="close-link"
              onClick={()=>{
                this.setState({displayCalc: false});
              }}><i className="fa fa-close"></i></a>
          </li>
        </ul>
        <ViewRepoBusinessRules
          privileges={ permissions }
          selectedItem={ sourceItem }
          showBusinessRuleGrid={"showBusinessRuleGrid"}
          flagRuleDrillDown={true}
          country={this.props.country}
          ruleFilterParam={ruleFilterParam}
          origin={"FIXEDFORMAT"}
        />
      </div>
    );
  }

  handleAddCalcRule(requestType,calcData){
    // requestType: New, Copy, Edit
    // cellData: if Edit pass the selected record as is
    //           if Copy change the cell_id and pass the selected data
    //           if New, create new object
    const { selectedCell } = this.props;
    let cellCalcRef=this.getCellCalcRef();
    this.calcRuleData = {}
    switch(requestType){
      case "Edit":
        Object.assign(this.calcRuleData, calcData);
        break;
      case "Copy":
        Object.assign(this.calcRuleData, calcData);
        this.calcRuleData.id = null;
        this.calcRuleData.cell_calc_ref = cellCalcRef;
        this.calcRuleData.in_use = 'N';
        this.calcRuleData.dml_allowed = 'Y';
        break;
      case "New":
        this.calcRuleData = {
          cell_calc_ref: cellCalcRef,
          report_id: selectedCell.reportId,
          sheet_id: selectedCell.sheetName,
          cell_id: selectedCell.cellRef,
          cell_calc_extern_ref:'',
          cell_business_rules:'',
          cell_calc_decsription:'',
          last_updated_by:'',
          id:null,
          in_use: 'N',
          dml_allowed: 'Y',
        };
        break;
      default:
        Object.assign(this.calcRuleData, calcData);
        break;
    }

    this.setState({displayCalc: requestType});
  }

  handleAddAggRule(requestType,aggData){
    // requestType: New, Copy, Edit
    // cellData: if Edit pass the selected record as is
    //           if Copy change the cell_id and pass the selected data
    //           if New, create new object
    const { selectedCell } = this.props;
    this.aggRuleData = {}
    switch(requestType){
      case "Edit":
        Object.assign(this.aggRuleData, aggData);
        break;
      case "New":
        this.aggRuleData = {
          id: null,
          report_id: selectedCell.reportId,
          sheet_id: selectedCell.sheetName,
          cell_id: selectedCell.cellRef,
          comp_agg_extern_ref: '',
          cell_agg_decsription: '',
          comp_agg_ref: selectedCell.cellRef,
          comp_agg_rule: '',
          reporting_scale: '',
          rounding_option: '',
          last_updated_by: '',
          in_use: 'N',
          dml_allowed: 'Y',
        };
        break;
      default:
        Object.assign(this.aggRuleData, aggData);
        break;
    }

    this.setState({displayAgg: requestType});
  }



  getCellCalcRef(){
    const { selectedCell } = this.props;
    let cellCalcRef='';
    if (this.cellRules.cell_rules.length ==0){
        cellCalcRef=selectedCell.cellRef + '.000';
    }
    else {
        let seq=[];
        let i=0;
        let existingCellCalcRefs=this.cellRules.cell_rules.map(e=>e.cell_calc_ref);
        // console.log("Inside renderCalcRulesBtn cellCalcRefs",existingCellCalcRefs)
        for(let cellRef of existingCellCalcRefs){
          seq[i]=cellRef.split(/\./g)[1]
          // console.log("Inside renderCalcRulesBtn",seq)
          i++;
        }
        let maxCellRef=Math.max(...seq)+1;
        if(maxCellRef > 999){
          this.modalAlert.isDiscardToBeShown = false;
          this.modalAlert.open(
            <div className="col-middle">
              <i className="fa fa-warning red"></i>
              No of calculations exceeded 1000! Do you really require such a large number of calculation rules!
              Suggest you to review calculations and/or get in touch with support team!
            </div>
          );
        }
        cellCalcRef=selectedCell.cellRef + '.' +
                             ((num,size)=>{
                                  var s = num+"";
                                  while (s.length < size) s = "0" + s;
                                  return s;
                                })(maxCellRef,3);

    }

    return cellCalcRef;
  }


  renderCalcRulesBtn(){
      return(
        <div>
          {
            (!this.cellRules || this.cellRules.cell_rules.length == 0 ) &&
            !this.state.displayCalc &&
            <div className="col-md-12 col-xs-12">
              <div className="col-middle">
                <div className="text-center text-center">
                  <div className="mid_center">
                    <div>
                      <div>
                        <a className="btn btn-app" style={{"border": "none"}}
                          onClick={
                            (event) => {
                                this.handleAddCalcRule("New");
                             }
                          }
                          title="Add Calculation">
                          <i className={ "fa fa-tag blue"}></i>
                        </a>
                      </div>
                      <span className={"blue"}>Create New Calculation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
          {
            (this.cellRules && this.cellRules.cell_rules.length > 0 ) &&
            <ul className="nav navbar-right panel_toolbox">
              <li>
                <a onClick={
                  (event) => {
                      this.setState({displayCalcType:"Tabular"});
                   }
                }
                title={"Table View"}>
                  <small>
                    <i className="fa fa-th-list"></i>
                  </small>
                </a>
              </li>
              <li>
                <a onClick={
                  (event) => {
                      this.setState({displayCalcType:"Slide"});
                   }
                }
                title={"Slide View"}>
                  <small>
                    <i className="fa fa-square"></i>
                  </small>
                </a>
              </li>
              <li>
                <a onClick={
                  (event) => {
                      this.handleAddCalcRule("New");
                   }
                }
                title={"Create New Calculation"}>
                  <small>
                    <i className="fa fa-tag green"></i>
                  </small>
                </a>
              </li>
            </ul>
          }
        </div>
      );
  }

  renderChangeHistory(changeHistory){
    return(
      <div className="col-md-12 col-xs-12">
        <DefAuditHistory
          data={ changeHistory }
         />
     </div>
    );
  }

  render(){
    const { handleClose, handleBoxSize, handleBringToFront, details, selectedCell, handlePinDndBox } = this.props;
    if(!this.cellRules){
      return(
        <div>
          {
            this.loadingPage("fa-gear", "blue","Loading Cell Rules for " + selectedCell.cell)
          }
        </div>
      );
    }
    return(
        <div className="box-content-wrapper">
          <div className="box-tools">
            <ul className="nav navbar-right panel_toolbox">
              <li>
                <a className="close-link"
                  title={"Close"}
                  onClick={()=>{handleClose(details.id)}}><i className="fa fa-close"></i></a>
              </li>
              {
                details.position == "DnD" &&
                <li>
                  <a onClick={()=>{
                      let boxSize = {
                        isMaximized: !details.isMaximized
                      }
                      handleBoxSize(details.id,boxSize)
                    }} title={ history.isMaximized ? "Restore" : "Maximize"}>
                    <small><i className="fa fa-square-o"></i></small>
                  </a>
                </li>
              }
              <li>
                <a onClick={()=>{
                    let id = details.id;
                    let position = details.position == "DnD" ? "pinnedTop": "DnD";
                    handlePinDndBox(id,position);
                  }} title={ details.position == "DnD" ? "Pin Window" : "Float Window"}>
                  <small>
                    <i className={"fa " + (details.position == "DnD" ? "fa-thumb-tack" : "fa-external-link" )}></i>
                  </small>
                </a>
              </li>
              <li>
                <a className="close-link"
                  onClick={ (event)=>{
                    this.cellRules=undefined;
                    this.cellChangeHistory = undefined;
                    this.setState({displayCalc: false, displayAgg: false},
                                  ()=>{
                                      this.props.drillDown(this.selectedCell.reportId,
                                                       this.selectedCell.sheetName,
                                                       this.selectedCell.cellRef);
                                      this.props.fetchReportChangeHistory(this.selectedCell.reportId,
                                                        this.selectedCell.sheetName,
                                                        this.selectedCell.cellRef);
                                    }
                                  );
                  } }
                  title="Refresh"><i className= { "fa fa-refresh"}></i></a>
              </li>
              <li>
                <a title="Move Box" style={{'cursor':'grabbing'}}>
                  <small>
                    <i className="fa fa-arrows"></i>&nbsp;{this.selectedCell.sheetName + ' ' + this.selectedCell.cell}
                  </small>
                </a>
              </li>
            </ul>
          </div>
          <div className="x_panel">
            <div className="x_title">
              <h2>Cell Rules
              <small> for <b>{selectedCell.cell}</b> of <b>{selectedCell.sheetName}</b></small>
              </h2>
              <div className="clearfix"></div>
            </div>
            <div className="x_content">
            {
              // this.showRulesPanel &&
              <div  className="dontDragMe">
                <Tabs
                  id={"RCDTBS"}
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
                      <span >
                        <i className="fa fa-history"></i> Change History
                      </span>
                      }>
                    { this.renderChangeHistory(this.cellChangeHistory) }
                  </Tab>
                </Tabs>
              </div>
              }
            </div>
          </div>
        </div>
    );
  }


}

function mapStateToProps(state){
  console.log("On mapState ReportRepoCellDetails ", state);
  return {
    cell_rules: state.report_rules_repo.cellRules,
    change_history: state.report_rules_repo.changeHistory,
    login_details: state.login_store,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    drillDown:(report_id,sheet,cell) => {
      dispatch(actionRepoDrillDown(report_id,sheet,cell));
    },
    fetchReportChangeHistory:(report_id,sheet_id,cell_id) => {
      dispatch(actionFetchRepoReportChangeHistory(report_id,sheet_id,cell_id));
    },
  }
}

const VisibleReportRepoCellDetails = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportRepoCellDetails);

export default VisibleReportRepoCellDetails;
