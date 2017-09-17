import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import { Link } from 'react-router';
import { Tab, Tabs } from 'react-bootstrap';
import _ from 'lodash';
import {
  actionExportXlsx,
  actionExportRulesXlsx,
  actionFetchReportChangeHistory
} from '../../actions/MaintainReportRuleAction';
import {
  actionExportCSV,
} from '../../actions/ViewDataAction';
import {
  actionDrillDown
} from '../../actions/CaptureReportAction';
import {
  actionFetchVarianceData,
} from '../../actions/VarianceAnalysisAction';
import {
  actionLeftMenuClick,
} from '../../actions/LeftMenuAction';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import RegOpzReportGrid from '../RegOpzDataGrid/RegOpzReportGrid';
import RegOpzFlatGridActionButtons from '../RegOpzFlatGrid/RegOpzFlatGridActionButtons';
import VarianceAnalysisForm from './VarianceAnalysisForm';
import AuditModal from '../AuditModal/AuditModal';
import ModalAlert from '../ModalAlert/ModalAlert';
import DataReportLinkage from '../ViewData/DataReportLinkage';
import DefAuditHistory from '../AuditModal/DefAuditHistory';
import DrillDownRules from '../DrillDown/DrillDownRules';
import AddReportAggRules from '../MaintainReportRules/AddReportAggRules';
import ViewData from '../ViewData/ViewDataComponentV2';
import ViewBusinessRules from '../MaintainBusinessRules/MaintainBusinessRules';
import VarianceAnalysisChart from './VarianceAnalysisChart';
require('react-datepicker/dist/react-datepicker.css');

class VarianceAnalysis extends Component {
  constructor(props){
    super(props)
    this.state = {
      startDate:moment().subtract(1,'months').format("YYYYMMDD"),
      endDate:moment().format('YYYYMMDD'),
      sources:null,
      itemEditable: true,
      reportId: null,
      varianceTolerance: 0,
      firstReportingDate: null,
      subsequentReportingDate: null,
      selectedAuditSheet: 0,

      showDrillDownData: false,
      showAggRuleDetails: false,
      showDrillDownCalcBusinessRules: false,
      showCellChangeHistory: false,
      showCharts: false,

      display: false,
      selectedCell: {},
      chartData : {title: "Variance",rate: "inc",value:"varaince %", data:[{name: "Variance", value1:0,value2:0}]},
      sheetChartData: {title: "Variance",rate: "inc",value:"varaince %", data:[{name: "Variance", value1:0,value2:0}]},
      sheetVarianceData: {title: "Variance",rate: "inc",value:"varaince %", data:[{name: "Variance", value1:0,value2:0}]},
    }

    this.pages=0;
    this.currentPage=0;
    this.dataSource = null;
    this.calcRuleFilter = {};
    this.businessRuleFilterParam = {};
    this.refreshedData = true;
    this.selectedItems = [];
    this.selectedSheetIndex = null;
    this.form_data={};
    this.selectedViewColumns=[];
    this.operationName=null;
    this.flatGrid = null;
    this.aggRuleData = null;
    this.buttons=[
      { title: 'Refresh', iconClass: 'fa-refresh', checkDisabled: 'No', className: "btn-primary", onClick: this.handleRefreshGrid.bind(this) },
      { title: 'Details', iconClass: 'fa-cog', checkDisabled: 'No', className: "btn-success", onClick: this.handleDetails.bind(this) },
      { title: 'History', iconClass: 'fa-history', checkDisabled: 'No', className: "btn-primary", onClick: this.handleHistoryClick.bind(this) },
      { title: 'Save Report Rules', iconClass: 'fa-puzzle-piece', checkDisabled: 'No', className: "btn-info", onClick: this.handleExportRules.bind(this) },
      { title: 'Export', iconClass: 'fa-table', checkDisabled: 'No', className: "btn-success", onClick: this.handleExportReport.bind(this) },
      { title: 'Variance Charts', iconClass: 'fa-bar-chart', checkDisabled: 'No', className: "btn-info", onClick: this.handleShowCharts.bind(this) },
    ];
    this.buttonClassOverride = "None";

    this.renderDynamic = this.renderDynamic.bind(this);

    this.handleSubmitVAForm = this.handleSubmitVAForm.bind(this);
    this.fetchDataToGrid = this.fetchDataToGrid.bind(this);
    this.checkDisabled = this.checkDisabled.bind(this);
    this.handleCalcRuleClicked = this.handleCalcRuleClicked.bind(this);
    this.handleBusinessRuleClicked = this.handleBusinessRuleClicked.bind(this);
    this.handleAggeRuleClicked = this.handleAggeRuleClicked.bind(this);
    this.handleCellHistoryClicked = this.handleCellHistoryClicked.bind(this);
    this.handleShowCharts = this.handleShowCharts.bind(this);

    this.handleSelectCell = this.handleSelectCell.bind(this);
    this.handleModalOkayClick = this.handleModalOkayClick.bind(this);
    this.handleAuditOkayClick = this.handleAuditOkayClick.bind(this);

    this.viewOnly = _.find(this.props.privileges, { permission: "Variance Analysis" }) ? true : false;
    //this.writeOnly = _.find(this.props.privileges, { permission: "Edit Report" }) ? true : false;
    this.writeOnly = false;
  }

  componentWillMount(){
    //TODO
  }
  componentDidUpdate(){
    console.log("Dates",this.state.startDate,this.flatGrid,this.props.leftmenu);
    this.props.leftMenuClick(false);
  }
  componentWillReceiveProps(nextProps){
    console.log("nextProps",this.props.leftmenu);
    if(this.props.leftmenu){
      this.setState({
        display: false,
        showDrillDownData: false,
        showDrillDownCalcBusinessRules: false,
        showAggRuleDetails: false,
        showCellChangeHistory: false,
      });
    }
  }

  handleSubmitVAForm(formObj) {
    console.log("handleSubmitVAForm selected report",formObj);
    this.currentPage = 0;
    this.selectedViewColumns=[];
    this.selectedSheetIndex = null;
    this.setState({
        display: "showReportGrid",
        reportId: formObj.report_id,
        varianceTolerance: formObj.variance_tolerance,
        firstReportingDate: formObj.first_date,
        subsequentReportingDate: formObj.subsequent_date,
        chartData : {title: "Variance",rate: "inc",value:"varaince %", data:[{name: "Variance", value1:0,value2:0}]},
        sheetChartData: {title: "Variance",rate: "inc",value:"varaince %", data:[{name: "Variance", value1:0,value2:0}]},
        sheetVarianceData: {title: "Variance",rate: "inc",value:"varaince %", data:[{name: "Variance", value1:0}]},
     },
      ()=>{this.props.fetchVarianceData(this.state.reportId,this.state.firstReportingDate,this.state.subsequentReportingDate,this.state.varianceTolerance);}
    );
  }

  checkDisabled(item){
    console.log("checkDisabled",item );
    switch (item){
      case "Add":
        return !this.writeOnly;
      case "Copy":
        return !this.writeOnly;
      case "Delete":
        return (!this.writeOnly || !this.state.itemEditable);
      default:
        console.log("No specific checkDisabled has been defined for ",item);
    }

  }

  handleRefreshGrid(event){
    //this.selectedItems = this.flatGrid.deSelectAll();
    //this.currentPage = 0;
    this.refreshedData = true;
    this.setState({
        display: "showReportGrid",
        showDrillDownData: false,
        showDrillDownCalcBusinessRules: false,
        showAggRuleDetails: false,
        showCellChangeHistory: false,
        showCharts: false,
        selectedCell: {},
        chartData : {title: "Variance",rate: "inc",value:"varaince %", data:[{name: "Variance", value1:0,value2:0}]},
        sheetChartData: {title: "Variance",rate: "inc",value:"varaince %", data:[{name: "Variance", value1:0,value2:0}]},
        sheetVarianceData: {title: "Variance",rate: "inc",value:"varaince %", data:[{name: "Variance", value1:0}]},
     },
      ()=>{this.fetchDataToGrid(event);}
    );
  }

  handleShowCharts(event){
    let isOpen = this.state.showCharts;
    if(isOpen){
      this.setState({showCharts:false});
    } else {
      this.setState({showCharts:true});
    }
  }


  fetchDataToGrid(event){
    this.props.fetchVarianceData(this.state.reportId,this.state.firstReportingDate,this.state.subsequentReportingDate,this.state.varianceTolerance);
  }

  handleDetails(event){
    //TODO
    let isOpen = this.state.display === "showDrillDownRules";
    if(isOpen){
      this.setState({
        display: "showReportGrid",
        showDrillDownData: false,
        showDrillDownCalcBusinessRules: false,
        showAggRuleDetails: false,
        showCellChangeHistory: false,
        showCharts: false,
        selectedCell: {},
      });
    } else {
      console.log("handleSelectCellDetails",this.state.chartData,this.state.selectedCell);
      if(!this.state.selectedCell.cell){
        this.modalAlert.isDiscardToBeShown = false;
        this.modalAlert.open("Please select a cell for details");
      } else {
        //this.buttons=this.dataButtons;
        this.setState({
          display: "showDrillDownRules",
          showDrillDownData: false,
          showDrillDownCalcBusinessRules: false,
          showAggRuleDetails: false,
          showCellChangeHistory: false,
          showCharts: false,
          },
          this.props.drillDown(this.state.selectedCell.reportId,this.state.selectedCell.sheetName,this.state.selectedCell.cell)
        );
      }
    }

  }
  handleSelectCell(cell){
    console.log("handleSelectCell",cell);
    let { sheetChartData, chartData, sheetVarianceData } = this.state;
    let firstPeriod = moment(this.state.firstReportingDate.substring(0,8)).format("DD-MMM") + "-" + moment(this.state.firstReportingDate.substring(8,)).format("DD-MMM");
    let subsequentPeriod = moment(this.state.subsequentReportingDate.substring(0,8)).format("DD-MMM") + "-" + moment(this.state.subsequentReportingDate.substring(8,)).format("DD-MMM");

    if(typeof cell.item != 'undefined'){
      chartData = {
          title: 'Variance Chart ' + cell.sheetName,
          value:  ' Cell ' + cell.cell + ' Variance ' + cell.value + ' %',
          rate: 'inc',
          data: [
              { name: cell.cell },
          ]
      }
      chartData.data[0][firstPeriod] = cell.item.first_value;
      chartData.data[0][subsequentPeriod] = cell.item.subsequent_value;

      if ( this.refreshedData || this.state.reportId != cell.reportId || this.selectedSheetIndex != this.flatGrid.state.selectedSheet) {
        let matrixData =[];
        let varianceData = [];
        let VAelement ={};
        this.selectedSheetIndex = this.flatGrid.state.selectedSheet;
        this.props.gridDataViewReport[this.flatGrid.state.selectedSheet].matrix.map(item => {
            VAelement ={};
            if(item.origin == "DATA" && (item.value != 0 || typeof item.variance != 'number')){
              VAelement['name'] = item.cell;
              VAelement[firstPeriod] = item.first_value;
              VAelement[subsequentPeriod] = item.subsequent_value;
              VAelement['variance'] = item.variance;
              matrixData.push(VAelement)
              varianceData.push({name:item.cell,variance:item.variance})
            }
        })
        sheetChartData = {
          title: 'Variance Value Chart for Sheet ' + cell.sheetName,
          value:  'Values with Variances %',
          rate: 'inc',
          data: matrixData.length ? matrixData : [{name: "Variance", Info: "All Variances are Zero", Scale: 0}]
        }
        sheetVarianceData = {
          title: 'Variance Chart for Sheet ' + cell.sheetName,
          value:  '% Variances',
          rate: 'inc',
          data: varianceData.length ? varianceData : [{name: "Variance", Info: "All Variances are Zero", Scale: 0}]
        }
        this.refreshedData = false;
      }
      this.setState({selectedCell: cell, chartData:chartData, sheetChartData: sheetChartData, sheetVarianceData: sheetVarianceData});
    }

    //console.log("chartData",this.state.selectedCell,this.state.chartData,this.state.sheetChartData);
  }

  handleCalcRuleClicked(event,calcRuleFilter){
    console.log("Clicked calcRuleFilter",calcRuleFilter);
    this.calcRuleFilter = calcRuleFilter;
    this.setState({
        showDrillDownData : true,
        showDrillDownCalcBusinessRules : false,
        showAggRuleDetails: false,
        showCellChangeHistory: false,
        showCharts: false,
      });

  }

  handleBusinessRuleClicked(event,businessRuleFilterParam){
    console.log("Clicked businessRule ruleFilterParam",businessRuleFilterParam);
    this.businessRuleFilterParam = businessRuleFilterParam;
    this.setState({
        showDrillDownData : false,
        showDrillDownCalcBusinessRules : true,
        showAggRuleDetails: false,
        showCellChangeHistory: false,
        showCharts: false,
      });

  }

  handleAggeRuleClicked(event,item){
    console.log("Clicked aggRuleData ruleFilterParam",item);
    this.aggRuleData = item;
    // TODO AddReportAggRules as form and then pass aggRuleData
    this.setState({
        showDrillDownData : false,
        showDrillDownCalcBusinessRules : false,
        showAggRuleDetails: true,
        showCellChangeHistory: false,
        showCharts: false,
      });

  }

  handleCellHistoryClicked(event,item){
    console.log("Clicked handleCellHistoryClicked",item);
    let isOpen = this.state.showCellChangeHistory;
    if(isOpen) {
      this.setState({
        showCellChangeHistory: false
      });
    } else {
      // TODO AddReportAggRules as form and then pass aggRuleData
      this.setState({
          showDrillDownData : false,
          showDrillDownCalcBusinessRules : false,
          showAggRuleDetails: false,
          showCellChangeHistory: true,
          showCharts: false,
        },
        ()=>{this.props.fetchReportChangeHistory(item.report_id,item.sheet_name,item.cell_id)}
      );
    }

  }

  handleHistoryClick() {
    let isOpen = this.state.display === "showHistory";
    if(isOpen) {
      this.setState({
        display: "showReportGrid"
      });
    } else {
      //this.props.fetchReportChangeHistory(this.state.reportId);
      //console.log("Repot Linkage",this.props.change_history);
      let sheetName = this.props.gridDataViewReport[0].sheet;
      this.setState({
        display: "showHistory"
        },
        ()=>{this.props.fetchReportChangeHistory(this.state.reportId,sheetName)}
      );
    }
  }

  handleExportCSV(event) {
    let business_ref = "_source_" + this.state.sourceId + "_COB_" + this.state.subsequentReportingDate + "_";
    this.props.exportCSV(this.props.gridDataViewReport.table_name,business_ref,this.props.gridDataViewReport.sql);
  }

  handleExportRules(event) {
    this.props.exportRulesXlsx(this.state.reportId);
  }

  handleExportReport(event) {
    let firstReportingDate = this.state.firstReportingDate ? this.state.firstReportingDate : "1900010119000101";
    this.props.exportXlsx(this.state.reportId, firstReportingDate,'Y')
  }

  handleModalOkayClick(event){
    // TODO
  }

  handleAuditOkayClick(auditInfo){
    //TODO
  }

  renderDynamic(displayOption) {
      switch (displayOption) {
          case "showReportGrid":
              if (this.props.gridDataViewReport) {
                  return(
                      <div>
                          <RegOpzFlatGridActionButtons
                            editable={this.writeOnly}
                            checkDisabled={this.checkDisabled}
                            buttons={this.buttons}
                            dataNavigation={false}
                            pageNo={this.currentPage}
                            buttonClassOverride={this.buttonClassOverride}
                          />
                          <RegOpzReportGrid
                            report_id={this.state.reportId}
                            reporting_date={this.state.firstReportingDate}
                            gridData={this.props.gridDataViewReport}
                            handleSelectCell={ this.handleSelectCell.bind(this) }
                            ref={
                               (flatGrid) => {
                                 this.flatGrid = flatGrid;
                               }
                             }
                          />
                      </div>
                  );
              }
              return(
                  <div>
                    <h4>Loading ....</h4>
                  </div>
              );
          case "showDrillDownRules":
              if (this.props.cell_rules) {
                  let content = [
                      <DrillDownRules
                        cellRules = {this.props.cell_rules}
                        readOnly = {this.readOnly}
                        selectedCell = {this.state.selectedCell}
                        handleClose={ this.handleDetails.bind(this) }
                        reportingDate={this.state.firstReportingDate}
                        handleAggeRuleClicked={ this.handleAggeRuleClicked.bind(this) }
                        handleCalcRuleClicked={ this.handleCalcRuleClicked.bind(this) }
                        handleBusinessRuleClicked={ this.handleBusinessRuleClicked.bind(this) }
                        handleCellHistoryClicked={ this.handleCellHistoryClicked.bind(this) }
                      />
                  ];
                  if (this.state.showDrillDownData) {
                      content.push(
                          <ViewData
                            showDataGrid={true}
                            flagDataDrillDown={true}
                            sourceId={this.state.sourceId}
                            businessDate={this.state.subsequentReportingDate}
                            dataFilterParam={this.calcRuleFilter}
                          />
                      );
                  } else if (this.state.showAggRuleDetails) {
                      content.push(
                          <AddReportAggRules
                            writeOnly={false}
                            handleClose={this.handleDetails.bind(this)}
                            aggRuleData = { this.aggRuleData }
                            dml_allowed = { this.aggRuleData.dml_allowed }
                          />
                      );
                  } else if (this.state.showDrillDownCalcBusinessRules) {
                      content.push(
                          <ViewBusinessRules
                            showBusinessRuleGrid={true}
                            flagRuleDrillDown={true}
                            sourceId={this.businessRuleFilterParam.source_id}
                            ruleFilterParam={this.businessRuleFilterParam}
                          />
                      );
                  } else if (this.state.showCellChangeHistory && this.props.change_history) {
                      content.push(
                        <DefAuditHistory
                          data={ this.props.change_history }
                          historyReference={ "" }
                          handleClose={ this.handleCellHistoryClicked.bind(this) }
                         />
                      );
                  }
                  return content;
              }
              break;
          case "showHistory":
              if (this.props.gridDataViewReport) {
                  return(
                    <Tabs
                      defaultActiveKey={0}
                      activeKey={this.state.selectedAuditSheet}
                      onSelect={(key) => {
                          let sheetName = this.props.gridDataViewReport[key].sheet;
                          this.setState({selectedAuditSheet:key},
                          ()=>{this.props.fetchReportChangeHistory(this.state.reportId,sheetName)}
                        );
                          //this.renderTabs(key);
                      }}
                      >
                      {
                        this.props.gridDataViewReport.map((item,index) => {
                          console.log("Inside dridData map");
                          return(
                              <Tab
                                key={index}
                                eventKey={index}
                                title={item['sheet']}
                              >
                                {
                                  (()=>{
                                    if(this.state.selectedAuditSheet == index){
                                      // reseting the selectedCell when chanding the tab of the report
                                      //this.selectedCell = {};
                                      return (
                                          <DefAuditHistory
                                            data={ this.props.change_history }
                                            historyReference={ "" }
                                            handleClose={ this.handleHistoryClick.bind(this) }
                                           />
                                        );
                                    }
                                  })()
                                }
                              </Tab>
                          )
                        })
                      }
                    </Tabs>
                  );
              }
              break;
          default:
              return(
                  <VarianceAnalysisForm
                    onSubmitForm = { this.handleSubmitVAForm }
                    navMenu={false}
                    />
              );
      }
  }

  render(){

        let firstPeriod = this.state.firstReportingDate ? moment(this.state.firstReportingDate.substring(0,8)).format("DD-MMM-YYYY") + "-" + moment(this.state.firstReportingDate.substring(8,)).format("DD-MMM-YYYY") : "";
        let subsequentPeriod = this.state.subsequentReportingDate ? moment(this.state.subsequentReportingDate.substring(0,8)).format("DD-MMM-YYYY") + "-" + moment(this.state.subsequentReportingDate.substring(8,)).format("DD-MMM-YYYY") : "";

        return(
          <div>
            <div className="row form-container">
              <div className="x_panel">
                <div className="x_title">
                    {
                        ((displayOption) => {
                            if (!displayOption) {
                                return(
                                    <h2>Variance Analysis <small> of Reports from Different Reporting Period</small>
                                    </h2>
                                );
                            }
                            return(
                                <h2>Variance Analysis Report <small>{' Report '}</small>
                                  <small><i className="fa fa-file-text"></i></small>
                                  <small>{this.state.reportId }</small>
                                  <small>{' Reporting Periods: ' + firstPeriod + ' & ' + subsequentPeriod }</small>
                                </h2>
                            );
                        })(this.state.display)
                    }
                      <div className="row">
                        <ul className="nav navbar-right panel_toolbox">
                          <li>
                            <a className="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                              <i className="fa fa-bar-chart"></i><small>{' Variance Analyais '}</small>
                              <i className="fa fa-caret-down"></i>
                            </a>
                            <ul className="dropdown-menu dropdown-usermenu pull-right" style={{ "zIndex": 9999 }}>
                              <li>
                                <Link to="/dashboard/variance-analysis"
                                  onClick={()=>{ this.setState({ display: false,showCharts: false, }) }}
                                >
                                    <i className="fa fa-calculator"></i>{' variance Anaylsis Form'}
                                </Link>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </div>
                    <div className="clearfix"></div>
                </div>
                {
                  this.state.display &&
                  this.state.showCharts &&
                  <div>
                    <VarianceAnalysisChart
                      height = {150}
                      chartData = { this.state.sheetVarianceData }
                      chartType = "BarChart"
                      tileType = "full_width" />
                    <VarianceAnalysisChart
                      height = {200}
                      chartData = { this.state.chartData }
                      tileType = "one_third" />
                    <VarianceAnalysisChart
                      height = {200}
                      chartData = { this.state.sheetChartData }
                      tileType = "two_third" />
                  </div>
                }
                <div className="x_content">
                {
                    this.renderDynamic(this.state.display)
                }
                </div>
            </div>
          </div>
          <ModalAlert
            ref={(modalAlert) => {this.modalAlert = modalAlert}}
            onClickOkay={this.handleModalOkayClick}
          />

          < AuditModal showModal={this.state.showAuditModal}
            onClickOkay={this.handleAuditOkayClick}
          />
        </div>
      );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchVarianceData:(report_id, first_reporting_date, subsequent_reporting_date, variance_tolerance)=>{
      dispatch(actionFetchVarianceData(report_id, first_reporting_date, subsequent_reporting_date, variance_tolerance))
    },
    drillDown:(report_id,sheet,cell) => {
      dispatch(actionDrillDown(report_id,sheet,cell));
    },
    fetchReportChangeHistory:(report_id,sheet_id,cell_id) => {
      dispatch(actionFetchReportChangeHistory(report_id,sheet_id,cell_id));
    },
    exportCSV:(table_name,business_ref,sql) => {
      dispatch(actionExportCSV(table_name,business_ref,sql));
    },
    exportXlsx:(report_id,reporting_date,cell_format_yn) => {
      dispatch(actionExportXlsx(report_id,reporting_date,cell_format_yn));
    },
    exportRulesXlsx:(report_id) => {
      dispatch(actionExportRulesXlsx(report_id));
    },
    leftMenuClick:(isLeftMenu) => {
      dispatch(actionLeftMenuClick(isLeftMenu));
    },
  }
}

function mapStateToProps(state){
  console.log("On mapState ", state);
  return {
    //data_date_heads:state.view_data_store.dates,
    gridDataViewReport: state.variance_analysis_store.variance_report,
    cell_rules: state.report_store.cell_rules,
    change_history:state.maintain_report_rules_store.change_history,
    login_details:state.login_store,
    leftmenu: state.leftmenu_store.leftmenuclick,
  }
}

const VisibleVarianceAnalysis = connect(
  mapStateToProps,
  mapDispatchToProps
)(VarianceAnalysis);

export default VisibleVarianceAnalysis;
