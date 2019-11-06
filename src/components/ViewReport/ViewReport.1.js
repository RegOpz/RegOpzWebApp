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
  actionFetchTransReportData,
  actionFetchTransReportChangeHistory,
  actionTransExportXlsx
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
// import RegOpzReportGrid from '../RegOpzDataGrid/RegOpzReportGrid';
import RegOpzReportGrid from '../RegOpzReportGrid/RegOpzReportGrid';
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
import ReportBusinessRules from '../MaintainReportRules/ReportBusinessRules';
import AccessDenied from '../Authentication/AccessDenied';
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
    this.reportBusinessRules=undefined;
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

    // this.buttons=[
    //   { title: 'Refresh', iconClass: 'fa-refresh', checkDisabled: 'No', className: "btn-primary", onClick: this.handleRefreshGrid.bind(this) },
    //   { title: 'Details', iconClass: 'fa-cog', checkDisabled: 'No', className: "btn-success", onClick: this.handleDetails.bind(this) },
    //   { title: 'History', iconClass: 'fa-history', checkDisabled: 'No', className: "btn-primary", onClick: this.handleHistoryClick.bind(this) },
    //   { title: 'Business Rules', iconClass: 'fa-link', checkDisabled: 'Yes', className: "btn-primary", onClick: this.handleReportBusinessRulesClick.bind(this) },
    //   { title: 'Save Report Rules', iconClass: 'fa-puzzle-piece', checkDisabled: 'No', className: "btn-info", onClick: this.handleExportRules.bind(this) },
    //   { title: 'Export', iconClass: 'fa-table', checkDisabled: 'No', className: "btn-success", onClick: this.handleExportReport.bind(this) },
    // ];
    this.buttonClassOverride = "None";

    this.renderDynamic = this.renderDynamic.bind(this);

    this.alphaSequence = this.alphaSequence.bind(this);
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
    this.handleReportBusinessRulesClick = this.handleReportBusinessRulesClick.bind(this);

    this.handleSelectCell = this.handleSelectCell.bind(this);
    this.handleModalOkayClick = this.handleModalOkayClick.bind(this);
    this.handleAuditOkayClick = this.handleAuditOkayClick.bind(this);

    // this.getGridData = this.getGridData.bind(this);
    this.getaccTypeColor = this.getaccTypeColor.bind(this);

    // additional tool buttons
    this.buttons=[
      // {id: 'details', title: 'Cell Rule Details', onClick: this.handleRefreshGrid.bind(this), toolObj: <i className="fa fa-refresh green"></i>},
      { id: 'refresh', title: 'Refresh Report', onClick: this.handleRefreshGrid.bind(this), toolObj: <i className="fa fa-refresh"></i> },
      { id: 'details', title: 'Cell Rule Details', onClick: this.handleDetails.bind(this), toolObj: <i className="fa fa-cog green"></i> },
      { id: 'history', title: 'Report Change History', onClick: this.handleHistoryClick, toolObj: <i className="fa fa-history dark"></i> },
      { id: 'allRules', title: 'All Report Rules', onClick: this.handleReportBusinessRulesClick, toolObj: <i className="fa fa-link aero"></i> },
      { id: 'parameters', title: 'Edit Report Parameters', onClick: this.handleEditParameterClick, toolObj: <i className="fa fa-cogs dark"></i> },
      { id: 'closeAll', title: 'Close All Open Boxes', onClick: this.handleCloseAllClick, toolObj: <i className="fa fa-power-off red"></i> },
      // { title: 'Save Report Rules', iconClass: 'fa-puzzle-piece', checkDisabled: 'No', className: "btn-info", onClick: this.handleExportRules.bind(this) },
      // { title: 'Export', iconClass: 'fa-table', checkDisabled: 'No', className: "btn-success", onClick: this.handleExportReport.bind(this) },
      // { title: 'Edit Report Parameters', iconClass: 'fa-cogs', checkDisabled: 'No', className: "btn-warning", onClick: this.handleEditParameterClick.bind(this) },
    ];

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
      this.changeHistory=nextProps.trans_change_history;
    } else {
      this.gridDataViewReport=nextProps.gridDataViewReport;
      this.changeHistory=nextProps.change_history;
    }
    this.gridData=nextProps.gridData;
    this.operationLogs=nextProps.operation_log;
    this.reportBusinessRules=nextProps.cell_rules;
    console.log("nextProps",this.props.leftmenu);
    if(this.props.leftmenu){
      this.setState({
        display: false,
        showDrillDownData: false,
        showDrillDownCalcBusinessRules: false,
        showAggRuleDetails: false,
        showCellChangeHistory: false,
        renderStyle: false,
        selectedRecord: null,
      });
    }
  }

  handleReportClick(item) {
    console.log("selected item",item);
    if(item.access_type=="No access"){
      this.modalAlert.isDiscardToBeShown = false;
      this.modalAlert.open("Please note that you do not have access to view " + item.report_type + " report "
                            +"[" + item.report_id + "]. Contact administrator for access permission.");
      this.setState({display: "accessDenied",
                     reportId: item.report_id,
                     reportingDate: item.reporting_date,
                     businessDate: item.as_of_reporting_date,
                     selectedRecord: item,
                   });
    } else {
      this.currentPage = 0;
      this.selectedViewColumns=[];
      this.gridDataViewReport=undefined;
      this.report_type = item.report_type;
      this.setState({
          display: "showReportGrid",
          reportId: item.report_id,
          reportingDate: item.reporting_date,
          businessDate: item.as_of_reporting_date,
          selectedRecord: item,
       },
        ()=>{
          if (item.report_type=="TRANSACTION"){
            this.props.fetchTransReportData(this.state.reportId,this.state.reportingDate, this.state.selectedRecord.version);
          } else {
            this.props.fetchReportData(this.state.reportId,this.state.reportingDate,
              this.state.selectedRecord.version,this.state.selectedRecord.report_snapshot,
              this.state.selectedRecord.report_parameters
            );
          }

        }
      );
    }
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
      case "Business Rules":
        return this.report_type=="TRANSACTION";
      default:
        console.log("No specific checkDisabled has been defined for ",item);
    }

  }

  handleRefreshGrid(event){
    //this.selectedItems = this.flatGrid.deSelectAll();
    //this.currentPage = 0;
    this.gridDataViewReport=undefined;
    this.setState({itemEditable:true});
    this.fetchDataToGrid(event);
  }


  fetchDataToGrid(event){
    if (this.state.selectedRecord.report_type=="TRANSACTION"){
      this.props.fetchTransReportData(this.state.reportId,this.state.reportingDate,this.state.selectedRecord.version);
    } else {
      this.props.fetchReportData(this.state.reportId,this.state.reportingDate,
        this.state.selectedRecord.version,this.state.selectedRecord.report_snapshot,
        this.state.selectedRecord.report_parameters
      );
    }
  }

  getaccTypeColor(accType){
    switch(accType){
      case "No access": return "red";
      case "Not restricted": return "green";
      case "Restricted": return "amber";
      case "Search matched": return "purple";
      default: return "red";
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
          this.props.drillDown(this.selectedCell.reportId,this.selectedCell.sheetName,this.selectedCell.cellRef,
                              this.state.selectedRecord.report_snapshot,this.state.selectedRecord.report_type)
        );
      }
    }

  }

  handleSelectCell(sheetName, cell_selected, sheetIndexKey){
    console.log("handleSelectCell",cell_selected);
    // this.selectedCell = cell;
    let reportId = this.state.selectedRecord.report_id;
    this.selectedCell = {reportId, sheetName};
    this.selectedCellRange = cell_selected ? cell_selected : [undefined,undefined,undefined,undefined];
    if(cell_selected){
      let [startrow,startcol,endrow,endcol]=cell_selected;
      this.selectedCell.cell = this.alphaSequence(startcol)+(startrow+1);
      this.selectedCell.cellRef = this.gridDataViewReport[sheetIndexKey].cell_refs ?
                                  this.gridDataViewReport[sheetIndexKey].cell_refs[startrow][startcol]
                                  :
                                  null;
    } else {
      this.selectedCell.cell = null;
    }
  }

  alphaSequence(i) {
      return i < 0
          ? ""
          : this.alphaSequence((i / 26) - 1) + String.fromCharCode((65 + i % 26) + "");
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
      this.setState({
        display: "showHistory"
        },
        ()=>{
          if (this.state.selectedRecord.report_type=="TRANSACTION"){
            let sheetName = this.props.gridDataViewTransReport[0].sheet;
            this.props.fetchTransReportChangeHistory(this.state.reportId,sheetName);
          } else {
            let sheetName = this.props.gridDataViewReport[0].sheet;
            this.props.fetchReportChangeHistory(this.state.reportId,sheetName)
          }
        }
      );
    }
  }

  handleReportBusinessRulesClick() {
    let isOpen = this.state.display === "showReportBusinessRules";
    this.reportBusinessRules=undefined;
    if(isOpen) {
      this.setState({
        display: "showReportGrid"
      });
    } else {
      this.setState({
        display: "showReportBusinessRules"
        },
        ()=>{this.props.drillDown(this.state.reportId,undefined,undefined,this.state.selectedRecord.report_snapshot,
                                  this.state.selectedRecord.report_type)}
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
    if (this.state.selectedRecord.report_type=="TRANSACTION"){
      this.props.exportTransXlsx(this.state.reportId, reportingDate,'Y',
                            this.state.selectedRecord)
    } else {
      this.props.exportXlsx(this.state.reportId, reportingDate,'Y',
                            this.state.selectedRecord)
    }

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
          // additionalTools = { this.buttons }
          // boxes = { this.state.boxes }
          // moveBox = { this.moveBox }
          // handleBoxSize = { this.handleBoxSize }
          // handleBringToFront = { this.handleBringToFront }
          // handlePinDndBox = { this.handlePinDndBox }
          // handleClickToOpenBox = { this.handleClickToOpenBox }
          // handleToolsButtonClick = { this.handleToolsButtonClick }
          // handleSetBoxObjects = { this.handleSetBoxObjects }
          // handleSelectCell={ this.handleSelectCell }
          // handleUpdateReportData={ this.handleUpdateReportData }
              if (this.gridDataViewReport) {
                  return(
                    <RegOpzReportGrid
                      { ...this.state.selectedRecord }
                      showToolsMenu = { false }
                      additionalTools = { this.buttons }
                      gridData={this.gridDataViewReport}
                      boxes = { {editSection:  { isMoveBoxExternal: true, moveBoxComponent: 'reportGrid',
                                      id: 'editSection', key: 'editSection', left: 10, top:60,
                                      hideSourceOnDrag: false, isResizeAllowed:true,
                                      className: 'col-md-6 col-xs-12', isMaximized: false,isAlwaysOnTop:false ,
                                      isBringToFront: false, isOpen: false, position: 'DnD' },} }
                      handleSelectCell={ this.handleSelectCell }

                      ref={
                         (reportGrid) => {
                           this.reportGrid = reportGrid;
                         }
                       }
                    />
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
                      console.log("this.calcRuleFilter...",this.calcRuleFilter);
                      const {permission,source} = this.props.login_details;
                      const filters=this.calcRuleFilter.params.drill_kwargs;
                      let isDataComponent = permission.find(function(p){return p.component.match(/View Data/);});
                      let sourceItem = source.find(function(s){return s.source_id==filters.source_id;});
                      if (!sourceItem){
                        sourceItem={source_id: filters.source_id,
                                    source_file_name: 'Check source',
                                    source_table_name: 'Check source',
                                    access_type: 'No access',
                                    access_condition: ''
                                  };
                      } else {
                        sourceItem = {...sourceItem,...JSON.parse(sourceItem.permission_details)}
                      }
                      const permissions=[{"permission": isDataComponent ? "View Data" : null}];
                      content.push(
                          <ViewData
                            showDataGrid={true}
                            selectedItem={ sourceItem }
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
                      const {permission,source} = this.props.login_details;
                      const filter = this.businessRuleFilterParam;
                      let isRulesComponent = permission.find(function(p){return p.component.match(/Business Rules/);});
                      let sourceItem = source.find(function(s){return s.source_id==filter.source_id;;});
                      if (!sourceItem){
                        sourceItem={source_id: filter.source_id,
                                    source_file_name: 'Check source',
                                    source_table_name: 'Check source',
                                    ruleaccess_type: 'No access',
                                    ruleaccess_condition: ''
                                  };
                      } else {
                        sourceItem = {...sourceItem,...JSON.parse(sourceItem.permission_details)}
                      }
                      const permissions=[{"permission": isRulesComponent ? "View Business Rules" : null}];
                      content.push(
                          <ViewBusinessRules
                            privileges={ permissions }
                            selectedItem={ sourceItem }
                            showBusinessRuleGrid={"showBusinessRuleGrid"}
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
          case "showReportBusinessRules":
              return(
                  <ReportBusinessRules
                    data={ this.reportBusinessRules }
                    handleClose={this.handleReportBusinessRulesClick}
                    />
              );
              break;
          case "accessDenied":
            let item = this.state.selectedRecord;
            if (this.state.selectedRecord){
                return <AccessDenied
                        component={"View Report for [" + item.report_id + "]"
                                              + " [Report Type: " + item.report_type + "] "}/>
            }
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
                    reportPermissions={this.props.login_details.report}
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
                                  <small><i className={"fa fa-file-text " + this.getaccTypeColor(this.state.selectedRecord.access_type)}></i></small>
                                  <small>{this.state.reportId + ' [Version: ' + this.state.selectedRecord.version + ' @' + this.state.selectedRecord.report_create_date + ']'}</small>
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
                                  reportPermissions={this.props.login_details.report}
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
                        {
                          this.state.display &&
                          this.state.selectedRecord &&
                          <ul className="nav navbar-right panel_toolbox">
                            <div className={" label bg-" + this.getaccTypeColor(this.state.selectedRecord.access_type)}>
                              {this.state.selectedRecord.access_type?this.state.selectedRecord.access_type:"No access"}
                            </div>
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
    fetchTransReportData:(report_id, reporting_date, version)=>{
      dispatch(actionFetchTransReportData(report_id, reporting_date, version))
    },
    drillDown:(report_id,sheet,cell,report_snapshot,report_type) => {
      dispatch(actionDrillDown(report_id,sheet,cell,report_snapshot,report_type));
    },
    fetchReportChangeHistory:(report_id,sheet_id,cell_id) => {
      dispatch(actionFetchReportChangeHistory(report_id,sheet_id,cell_id));
    },
    fetchTransReportChangeHistory:(report_id,sheet_id,section_id) => {
      dispatch(actionFetchTransReportChangeHistory(report_id,sheet_id,section_id));
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
    exportXlsx:(report_id,reporting_date,cell_format_yn,selectedRecord) => {
      dispatch(actionExportXlsx(report_id,reporting_date,cell_format_yn,selectedRecord));
    },
    exportTransXlsx:(report_id,reporting_date,cell_format_yn,selectedRecord) => {
      dispatch(actionTransExportXlsx(report_id,reporting_date,cell_format_yn,selectedRecord));
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
    trans_change_history:state.transreport.change_history,
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
