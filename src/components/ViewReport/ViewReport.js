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
  //actionFetchDates,
  actionFetchReportCatalog,
  //actionFetchReportLinkage,
  //actionFetchDataChangeHistory,
  actionExportCSV,
  actionGenerateReport,
} from '../../actions/ViewDataAction';
import {
  actionCreateTransReport,
  actionFetchTransReportData
} from '../../actions/TransactionReportAction';
import {
  actionFetchReportData,
  actionDrillDown
} from '../../actions/CaptureReportAction';
import {
  actionLeftMenuClick,
} from '../../actions/LeftMenuAction';
import {
  actionFetchOperationLog
} from '../../actions/OperationLogAction';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import RegOpzReportGrid from '../RegOpzDataGrid/RegOpzReportGrid';
import RegOpzFlatGridActionButtons from '../RegOpzFlatGrid/RegOpzFlatGridActionButtons';
import ReportCatalogList from './ReportCatalogList';
import ReportVersionsList from './ReportVersionsList';
import AuditModal from '../AuditModal/AuditModal';
import ModalAlert from '../ModalAlert/ModalAlert';
import DataReportLinkage from '../ViewData/DataReportLinkage';
import DefAuditHistory from '../AuditModal/DefAuditHistory';
import DrillDownRules from '../DrillDown/DrillDownRules';
import AddReportAggRules from '../MaintainFixedFormatReport/AddReportAggRules';
import ViewData from '../ViewData/ViewDataComponentV2';
import ViewBusinessRules from '../MaintainBusinessRules/MaintainBusinessRules';
import CreateReport from '../CreateReport/CreateReport';
import OperationLogList from '../OperationLog/OperationLogList';
require('react-datepicker/dist/react-datepicker.css');

class ViewReport extends Component {
  constructor(props){
    super(props)
    this.state = {
      startDate:moment().subtract(1,'months').format("YYYYMMDD"),
      endDate:moment().format('YYYYMMDD'),
      sources:null,
      itemEditable: true,
      reportId: null,
      reportingDate: null,
      businessDate: null,
      selectedAuditSheet: 0,

      showDrillDownData: false,
      showAggRuleDetails: false,
      showDrillDownCalcBusinessRules: false,
      showCellChangeHistory: false,

      display: false,
      selectedRecord: null,
      renderStyle: false,
    }

    this.pages=0;
    this.currentPage=0;
    this.dataSource = null;
    this.gridDataViewReport=undefined;
    this.changeHistory=undefined;
    this.operationLogs=undefined;
    this.gridData=undefined;
    this.calcRuleFilter = {};
    this.businessRuleFilterParam = {};
    this.selectedCell={};
    this.selectedItems = [];
    this.selectedIndexOfGrid = 0;
    this.form_data={};
    this.selectedViewColumns=[];
    this.operationName=null;
    this.flatGrid = null;
    this.aggRuleData = null;
    this.reportVersions = undefined;
    this.buttons=[
      { title: 'Refresh', iconClass: 'fa-refresh', checkDisabled: 'No', className: "btn-primary", onClick: this.handleRefreshGrid.bind(this) },
      { title: 'Details', iconClass: 'fa-cog', checkDisabled: 'No', className: "btn-success", onClick: this.handleDetails.bind(this) },
      { title: 'History', iconClass: 'fa-history', checkDisabled: 'No', className: "btn-primary", onClick: this.handleHistoryClick.bind(this) },
      { title: 'Save Report Rules', iconClass: 'fa-puzzle-piece', checkDisabled: 'No', className: "btn-info", onClick: this.handleExportRules.bind(this) },
      { title: 'Export', iconClass: 'fa-table', checkDisabled: 'No', className: "btn-success", onClick: this.handleExportReport.bind(this) },
    ];
    this.buttonClassOverride = "None";

    this.renderDynamic = this.renderDynamic.bind(this);

    this.handleReportClick = this.handleReportClick.bind(this);
    this.handleEditParameterClick = this.handleEditParameterClick.bind(this);
    this.viewReportVersions = this.viewReportVersions.bind(this);
    this.handleDateFilter = this.handleDateFilter.bind(this);
    this.fetchDataToGrid = this.fetchDataToGrid.bind(this);
    this.checkDisabled = this.checkDisabled.bind(this);
    this.handleCalcRuleClicked = this.handleCalcRuleClicked.bind(this);
    this.handleBusinessRuleClicked = this.handleBusinessRuleClicked.bind(this);
    this.handleAggeRuleClicked = this.handleAggeRuleClicked.bind(this);
    this.handleCellHistoryClicked = this.handleCellHistoryClicked.bind(this);
    this.submitGenerateReport = this.submitGenerateReport.bind(this);
    this.viewOperationLog = this.viewOperationLog.bind(this);
    this.refreshOperationLog = this.refreshOperationLog.bind(this);

    this.handleSelectCell = this.handleSelectCell.bind(this);
    this.handleModalOkayClick = this.handleModalOkayClick.bind(this);
    this.handleAuditOkayClick = this.handleAuditOkayClick.bind(this);

    this.viewOnly = _.find(this.props.privileges, { permission: "View Report" }) ? true : false;
    this.writeOnly = _.find(this.props.privileges, { permission: "Edit Report" }) ? true : false;
  }

  componentWillMount(){
    //this.props.fetchDates(this.state.startDate ? moment(this.state.startDate).format('YYYYMMDD') : "19000101",this.state.endDate ? moment(this.state.endDate).format('YYYYMMDD') : "30200101", 'data_catalog');
    this.props.fetchReportCatalog(moment(this.state.startDate).format('YYYYMMDD') ,moment(this.state.endDate).format('YYYYMMDD') , 'Data');
  }
  componentDidUpdate(){
    console.log("Dates",this.state.startDate)
    this.props.leftMenuClick(false);
  }
  componentWillReceiveProps(nextProps){
    if (this.state.selectedRecord && this.state.selectedRecord.report_type=="TRANSACTION"){
      console.log("Inside this.state.selectedRecord && this.state.selectedRecord.report_type==TRANSACTION",this.state.selectedRecord)
      this.gridDataViewReport = nextProps.gridDataViewTransReport;
    } else {
      this.gridDataViewReport=nextProps.gridDataViewReport;
    }
    this.gridData=nextProps.gridData;
    this.changeHistory=nextProps.change_history;
    this.operationLogs=nextProps.operation_log;
    console.log("nextProps",this.props.leftmenu);
    if(this.props.leftmenu){
      this.setState({
        display: false,
        showDrillDownData: false,
        showDrillDownCalcBusinessRules: false,
        showAggRuleDetails: false,
        showCellChangeHistory: false,
        renderStyle: false,
      });
    }
  }

  handleReportClick(item) {
    console.log("selected item",item);
    this.currentPage = 0;
    this.selectedViewColumns=[];
    this.gridDataViewReport=undefined;
    this.setState({
        display: "showReportGrid",
        reportId: item.report_id,
        reportingDate: item.reporting_date,
        businessDate: item.as_of_reporting_date,
        selectedRecord: item,
     },
      ()=>{
        if (item.report_type=="TRANSACTION"){
          this.props.fetchTransReportData(this.state.reportId,this.state.reportingDate);
        } else {
          this.props.fetchReportData(this.state.reportId,this.state.reportingDate,
            this.state.selectedRecord.version,this.state.selectedRecord.report_snapshot,
            this.state.selectedRecord.report_parameters
          );
        }

      }
    );
  }

  handleEditParameterClick(item) {
    console.log("selected item",item);
    let isOpen = this.state.display === "editParameter";
    if(isOpen){
      this.setState({
        display: false,
        reportId: null,
        reportingDate: null,
        businessDate: null,
        selectedRecord: null,
      });
    }
    else {
      this.setState({
        display: "editParameter",
        reportId: item.report_id,
        reportingDate: item.reporting_date,
        businessDate: item.as_of_reporting_date,
        selectedRecord: item,
       },
        // Nothing to add at this stage
      );
    }
  }

  viewReportVersions(item) {
    console.log("selected view report versions item",item);
    let isOpen = this.state.display === "viewReportVersions";
    if(isOpen){
      this.reportVersions = undefined;
      this.setState({
        display: false,
        reportId: null,
        reportingDate: null,
        businessDate: null,
        selectedRecord: null,
      },
      // Nothing to add at this stage
      );
    }
    else {
      this.reportVersions = {data_sources: item.versions};
      // console.log("Inside data_sources....", this.reportVersions);
      this.setState({
        display: "viewReportVersions",
        reportId: item.report_id,
        reportingDate: item.reporting_date,
        businessDate: item.as_of_reporting_date,
        selectedRecord: item,
       },
        // Nothing to add at this stage
      );
    }
  }

  viewOperationLog(item) {
    console.log("selected view operation log for item",item);
    let isOpen = this.state.display === "viewOperationLog";
    if(isOpen){
      this.operationLogs = undefined;
      console.log("this.state.selectedRecord..",this.state.selectedRecord)
      this.viewReportVersions(this.state.selectedRecord);
    }
    else {
      this.setState({
        display: "viewOperationLog",
        reportId: item.report_id,
        reportingDate: item.reporting_date,
        businessDate: item.as_of_reporting_date,
        selectedRecord: item,
       },
        // Nothing to add at this stage
        ()=>{this.props.fetchOperationLog("Report",item.id)}
      );
    }
  }

  refreshOperationLog(entity_id){
    // this.operationLogs = undefined;
    this.props.fetchOperationLog("Report",entity_id);
  }

  handleDateFilter(dates) {
    this.setState({
      startDate: dates.startDate,
      endDate: dates.endDate
    },
      //since setState is asynchronus this gurantees that fetch is executed after setState is executed
      ()=>{this.props.fetchReportCatalog(this.state.startDate,this.state.endDate)}
    );
    // console.log("Dates",dates)
    // this.props.fetchSource(dates.startDate,dates.endDate,"Data");
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
    this.setState({itemEditable:true});
    this.fetchDataToGrid(event);
  }


  fetchDataToGrid(event){
    if (item.report_type=="TRANSACTION"){
      this.props.fetchTransReportData(this.state.reportId,this.state.reportingDate);
    } else {
      this.props.fetchReportData(this.state.reportId,this.state.reportingDate,
        this.state.selectedRecord.version,this.state.selectedRecord.report_snapshot,
        this.state.selectedRecord.report_parameters
      );
    }
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
      });
    } else {
      //console.log("handleSelectCell",this.selectedCell.cell);
      if(!this.selectedCell.cell){
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
          },
          this.props.drillDown(this.selectedCell.reportId,this.selectedCell.sheetName,this.selectedCell.cell,
                              this.state.selectedRecord.report_snapshot)
        );
      }
    }

  }

  handleSelectCell(cell){
    console.log("handleSelectCell",cell);
    this.selectedCell = cell;
  }

  handleCalcRuleClicked(event,calcRuleFilter){
    console.log("Clicked calcRuleFilter",calcRuleFilter);
    this.calcRuleFilter = calcRuleFilter;
    this.calcRuleFilter.params.drill_kwargs['version']=this.state.selectedRecord.version;
    this.calcRuleFilter.params.drill_kwargs['filter']='';
    console.log("Clicked calcRuleFilter 2",calcRuleFilter);
    this.setState({
        showDrillDownData : true,
        showDrillDownCalcBusinessRules : false,
        showAggRuleDetails: false,
        showCellChangeHistory: false,
      });

  }

  handleBusinessRuleClicked(event,businessRuleFilterParam){
    console.log("Clicked businessRule ruleFilterParam",businessRuleFilterParam);
    this.businessRuleFilterParam = businessRuleFilterParam;
    this.businessRuleFilterParam['report_snapshot'] = this.state.selectedRecord.report_snapshot;
    this.setState({
        showDrillDownData : false,
        showDrillDownCalcBusinessRules : true,
        showAggRuleDetails: false,
        showCellChangeHistory: false,
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
      });

  }

  handleCellHistoryClicked(event,item){
    console.log("Clicked handleCellHistoryClicked",item);
    let isOpen = this.state.showCellChangeHistory;
    this.changeHistory=undefined;
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
          showCellChangeHistory: true
        },
        ()=>{this.props.fetchReportChangeHistory(item.report_id,item.sheet_name,item.cell_id)}
      );
    }

  }

  handleHistoryClick() {
    let isOpen = this.state.display === "showHistory";
    this.changeHistory=undefined;
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
    let business_ref = "_source_" + this.state.sourceId + "_COB_" + this.state.businessDate + "_";
    this.props.exportCSV(this.props.gridDataViewReport.table_name,business_ref,this.props.gridDataViewReport.sql);
  }

  handleExportRules(event) {
    this.props.exportRulesXlsx(this.state.reportId);
  }

  handleExportReport(event) {
    let reportingDate = this.state.reportingDate ? this.state.reportingDate : "1900010119000101";
    this.props.exportXlsx(this.state.reportId, reportingDate,'Y')
  }

  handleModalOkayClick(event){
    // TODO
  }

  handleAuditOkayClick(auditInfo){
    //TODO
  }

  submitGenerateReport(reportInfo){
    if (reportInfo.report_type=="TRANSACTION"){
      this.props.createTransReport(reportInfo);
    } else {
      this.props.generateReport(reportInfo);
    }
  }

  renderDynamic(displayOption) {
      switch (displayOption) {
          case "showReportGrid":
              if (this.gridDataViewReport) {
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
                            reporting_date={this.state.reportingDate}
                            gridData={this.gridDataViewReport}
                            handleSelectCell={ this.handleSelectCell.bind(this) }
                            multiSelectAllowed={false}
                            renderStyle={this.state.renderStyle}
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
                        selectedCell = {this.selectedCell}
                        handleClose={ this.handleDetails.bind(this) }
                        reportingDate={this.state.reportingDate}
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
                            businessDate={this.state.businessDate}
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
                      const permissions=[{"permission": "View Business Rules"}];
                      content.push(
                          <ViewBusinessRules
                            privileges={ permissions }
                            showBusinessRuleGrid={true}
                            flagRuleDrillDown={true}
                            sourceId={this.businessRuleFilterParam.source_id}
                            ruleFilterParam={this.businessRuleFilterParam}
                          />
                      );
                  } else if (this.state.showCellChangeHistory && this.changeHistory) {
                      content.push(
                        <DefAuditHistory
                          data={ this.changeHistory }
                          historyReference={ "" }
                          handleClose={ this.handleCellHistoryClicked.bind(this) }
                         />
                      );
                  }
                  return content;
              }
              break;
          case "showHistory":
              if (this.gridDataViewReport) {
                  return(
                    <Tabs
                      defaultActiveKey={0}
                      activeKey={this.state.selectedAuditSheet}
                      onSelect={(key) => {
                          let sheetName = this.gridDataViewReport[key].sheet;
                          this.setState({selectedAuditSheet:key},
                          ()=>{this.props.fetchReportChangeHistory(this.state.reportId,sheetName)}
                        );
                          //this.renderTabs(key);
                      }}
                      >
                      {
                        this.gridDataViewReport.map((item,index) => {
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
                                            data={ this.changeHistory }
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
          case "editParameter":
            return(
                    <CreateReport
                      reportDetails={this.state.selectedRecord}
                      reGenerateReport={true}
                      handleCancel={this.handleEditParameterClick}
                    />
                  );
            break;
          case "viewReportVersions":
            return(
                <ReportVersionsList
                  dataCatalog={this.reportVersions}
                  handleReportClick={this.handleReportClick}
                  editParameter={this.handleEditParameterClick}
                  generateReport={this.submitGenerateReport}
                  handleClose={this.viewReportVersions}
                  viewOperationLog={this.viewOperationLog}
                  />
            );
            break;
          case "viewOperationLog":
            return(
                <OperationLogList
                  data={this.operationLogs}
                  reference={"Report " + this.state.reportId + " version " + this.state.selectedRecord.id}
                  handleClose={this.viewOperationLog}
                  refreshOperationLog={this.refreshOperationLog}
                  />
            );
            break;
          default:
              return(
                  <ReportCatalogList
                    dataCatalog={this.props.dataCatalog}
                    navMenu={false}
                    handleReportClick={this.handleReportClick}
                    dateFilter={this.handleDateFilter}
                    editParameter={this.handleEditParameterClick}
                    generateReport={this.submitGenerateReport}
                    viewReportVersions={this.viewReportVersions}
                    viewOperationLog={this.viewOperationLog}
                    />
              );
      }
  }

  render(){
    if (typeof this.props.dataCatalog != 'undefined') {
        //console.log("This grid ref", this.flatGrid);
        return(
          <div>
            <div className="row form-container">
              <div className="x_panel">
                <div className="x_title">
                    {
                        ((displayOption) => {
                            if (!displayOption) {
                                return(
                                    <h2>View Report <small>Available Reports for </small>
                                      <small>{moment(this.state.startDate).format("DD-MMM-YYYY") + ' - ' + moment(this.state.endDate).format("DD-MMM-YYYY")}</small>
                                    </h2>
                                );
                            }
                            return(
                                <h2>View Report <small>{' Report '}</small>
                                  <small><i className="fa fa-file-text"></i></small>
                                  <small>{this.state.reportId }</small>
                                  <small>{' as on Business Date: ' + moment(this.state.businessDate).format("DD-MMM-YYYY")}</small>
                                </h2>
                            );
                        })(this.state.display)
                    }
                      <div className="row">
                        <ul className="nav navbar-right panel_toolbox">
                          <li>
                            <a className="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                              <i className="fa fa-file-text-o"></i><small>{' Reports '}</small>
                              <i className="fa fa-caret-down"></i>
                            </a>
                            <ul className="dropdown-menu dropdown-usermenu pull-right" style={{ "zIndex": 9999 }}>
                              <li>
                                <Link to="/dashboard/view-report"
                                  onClick={()=>{ this.setState({ display: false, renderStyle: false, }) }}
                                >
                                    <i className="fa fa-bars"></i>{' All Report List'}
                                </Link>
                              </li>
                              <li>
                                <a href="#"></a>
                                <ReportCatalogList
                                  dataCatalog={this.props.dataCatalog}
                                  navMenu={true}
                                  handleReportClick={this.handleReportClick}
                                  dateFilter={this.handleDateFilter}
                                  />
                              </li>
                            </ul>
                          </li>
                        </ul>
                        {
                          !this.state.display &&
                          <ul className="nav navbar-right panel_toolbox">
                            <li>
                              <a className="user-profile"
                                aria-expanded="false"
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Refresh List"
                                onClick={
                                    (event) => {
                                      this.props.fetchReportCatalog(moment(this.state.startDate).format('YYYYMMDD') ,moment(this.state.endDate).format('YYYYMMDD') , 'Data');
                                    }
                                  }
                                >
                                <i className="fa fa-refresh"></i><small>{' Refresh '}</small>
                              </a>
                            </li>
                          </ul>
                        }
                        {
                          this.state.display &&
                          this.state.display != "viewReportVersions" &&
                          <ul className="nav navbar-right panel_toolbox">
                            <label className="switch">
                            <input type="checkbox" onChange={()=>{this.setState({renderStyle: !this.state.renderStyle})}}/>
                              <span className="slider round" title={this.state.renderStyle ? "Deactivate Style": "Activate Style"}></span>
                            </label>
                          </ul>
                        }
                      </div>
                    <div className="clearfix"></div>
                </div>
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
    } else {
      return(
        <h4> Loading.....</h4>
      );
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchReportCatalog:(startDate,endDate)=>{
      dispatch(actionFetchReportCatalog(startDate,endDate))
    },
    fetchReportData:(report_id, reporting_date, version, report_snapshot,report_parameters)=>{
      dispatch(actionFetchReportData(report_id, reporting_date, version, report_snapshot,report_parameters))
    },
    fetchTransReportData:(report_id, reporting_date)=>{
      dispatch(actionFetchTransReportData(report_id, reporting_date))
    },
    drillDown:(report_id,sheet,cell,report_snapshot) => {
      dispatch(actionDrillDown(report_id,sheet,cell,report_snapshot));
    },
    fetchReportChangeHistory:(report_id,sheet_id,cell_id) => {
      dispatch(actionFetchReportChangeHistory(report_id,sheet_id,cell_id));
    },
    exportCSV:(table_name,business_ref,sql) => {
      dispatch(actionExportCSV(table_name,business_ref,sql));
    },
    generateReport: (report_info) => {
      dispatch(actionGenerateReport(report_info));
    },
    createTransReport:(reportInfo)=>{
      dispatch(actionCreateTransReport(reportInfo));
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
    fetchOperationLog:(entity_type,entity_id) => {
      dispatch(actionFetchOperationLog(entity_type,entity_id));
    },
  }
}

function mapStateToProps(state){
  console.log("On mapState ", state, state.view_data_store, state.report_store);
  return {
    //data_date_heads:state.view_data_store.dates,
    dataCatalog: state.report_store.reports,
    gridDataViewReport: state.captured_report,
    gridDataViewTransReport: state.transreport.reportGridData,
    gridData: state.view_data_store.gridData,
    cell_rules: state.report_store.cell_rules,
    change_history:state.maintain_report_rules_store.change_history,
    operation_log: state.operation_log_store.operation_log,
    login_details:state.login_store,
    leftmenu: state.leftmenu_store.leftmenuclick,
  }
}

const VisibleViewReport = connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewReport);

export default VisibleViewReport;
