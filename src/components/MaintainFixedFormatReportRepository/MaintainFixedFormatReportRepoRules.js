import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import { Link } from 'react-router';
import { Tab, Tabs } from 'react-bootstrap';
import _ from 'lodash';
import {
  actionFetchReportTemplate,
  actionExportXlsx,
  actionExportRulesXlsx,
  //actionFetchReportChangeHistory,
  // actionUpdateRuleData
} from '../../actions/MaintainReportRuleAction';
import {
  actionUpdateReportParameter,
} from '../../actions/ReportRulesRepositoryAction';
import {
  //actionFetchDates,
  // actionFetchReportCatalog,
  //actionFetchReportLinkage,
  //actionFetchDataChangeHistory,
  actionExportCSV,
  actionApplyRules,
} from '../../actions/ViewDataAction';
import {
  actionFetchReportData,
  actionRepoDrillDown,
  actionFetchReportCatalog,
  actionFetchRepoReportChangeHistory,
  actionFetchReportBusinessRules,
} from '../../actions/ReportRulesRepositoryAction';
import {
  actionLeftMenuClick,
} from '../../actions/LeftMenuAction';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import RegOpzReportGrid from '../RegOpzDataGrid/RegOpzReportGrid';
import RegOpzFlatGridActionButtons from '../RegOpzFlatGrid/RegOpzFlatGridActionButtons';
import ReportCatalogList from '../MaintainReportRulesRepository/ReportRuleRepositoryCatalog';
import AuditModal from '../AuditModal/AuditModal';
import ModalAlert from '../ModalAlert/ModalAlert';
import DataReportLinkage from '../ViewData/DataReportLinkage';
import DefAuditHistory from '../AuditModal/DefAuditHistory';
import DrillDownRules from '../ReportRepositoryDrillDown/DrillDownRules';
import AddReportAggRules from './AddReportAggRules';
import AddReportRules from './AddReportRules';
import ViewBusinessRules from '../MaintainBusinessRulesRepository/MaintainBusinessRulesRepository';
import EditParameters from '../CreateReport/EditParameters';
import ReportBusinessRules from '../MaintainReportRulesRepository/RepositoryReportBusinessRules';
import CopyReportTemplate from '../MaintainReportRulesRepository/CopyReportRules';
require('react-datepicker/dist/react-datepicker.css');

class MaintainFixedFormatReportRules extends Component {
  constructor(props){
    super(props)
    this.state = {
      country:null,
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
      selectedReport: {},
      renderStyle: false,
    }

    this.country = this.props.country ? this.props.country
                  :
                  (this.props.login_details.domainInfo.tenant_id != "regopz" ?
                    this.props.login_details.domainInfo.country
                    :
                    null);
    this.tenantRenderType = this.props.tenantRenderType;
    this.domainInfo = this.props.login_details.domainInfo;
    this.tenant_report_details= this.props.tenant_report_details;
    this.tableList=[];
    this.pages=0;
    this.currentPage=0;
    this.dataSource = null;
    this.gridDataViewReport=undefined;
    this.changeHistory=undefined;
    this.reportBusinessRules=undefined;
    this.calcRuleFilter = {};
    this.businessRuleFilterParam = {};
    this.selectedCell=[];
    this.selectedItems = [];
    this.selectedIndexOfGrid = 0;
    this.form_data={};
    this.selectedViewColumns=[];
    this.operationName=null;
    this.copyType=null;
    this.aggRuleData = null;
    if (this.tenantRenderType=="copyRule"){
      this.buttons=[
        { title: 'Refresh', iconClass: 'fa-refresh', checkDisabled: 'No', className: "btn-primary", onClick: this.handleRefreshGrid.bind(this) },
        { title: 'Details', iconClass: 'fa-cog', checkDisabled: 'No', className: "btn-success", onClick: this.handleDetails.bind(this) },
        { title: 'Copy Report', iconClass: 'fa-rocket', checkDisabled: 'Yes', className: "btn-success", onClick: this.handleCopyReportClick.bind(this) },
        { title: 'Copy Selected', iconClass: 'fa-crop', checkDisabled: 'Yes', className: "btn-warning", onClick: this.handleCopySelectedClick.bind(this) },
        { title: 'History', iconClass: 'fa-history', checkDisabled: 'No', className: "btn-primary", onClick: this.handleHistoryClick.bind(this) },
        { title: 'Save Report Rules', iconClass: 'fa-puzzle-piece', checkDisabled: 'No', className: "btn-info", onClick: this.handleExportRules.bind(this) },
        { title: 'Export', iconClass: 'fa-table', checkDisabled: 'No', className: "btn-success", onClick: this.handleExportReport.bind(this) },
      ];
      this.editTools=[];
    }
    else {
      this.buttons=[
        { title: 'Refresh', iconClass: 'fa-refresh', checkDisabled: 'No', className: "btn-primary", onClick: this.handleRefreshGrid.bind(this) },
        { title: 'Details', iconClass: 'fa-cog', checkDisabled: 'No', className: "btn-success", onClick: this.handleDetails.bind(this) },
        { title: 'History', iconClass: 'fa-history', checkDisabled: 'No', className: "btn-primary", onClick: this.handleHistoryClick.bind(this) },
        { title: 'Business Rules', iconClass: 'fa-link', checkDisabled: 'No', className: "btn-primary", onClick: this.handleReportBusinessRulesClick.bind(this) },
        { title: 'Save Report Rules', iconClass: 'fa-puzzle-piece', checkDisabled: 'No', className: "btn-info", onClick: this.handleExportRules.bind(this) },
        { title: 'Export', iconClass: 'fa-table', checkDisabled: 'No', className: "btn-success", onClick: this.handleExportReport.bind(this) },
        { title: 'Edit Report Parameters', iconClass: 'fa-cogs', checkDisabled: 'No', className: "btn-warning", onClick: this.handleEditParameterClick.bind(this) },
      ];
      this.editTools=[
        { title: 'Font', iconClass: 'fa-font', checkDisabled: 'No', className: "btn-primary", onClick: this.handleHistoryClick.bind(this) },
        { title: 'Text Size', iconClass: 'fa-text-height', checkDisabled: 'No', className: "btn-primary", onClick: this.handleHistoryClick.bind(this) },
        { title: 'Font Colour', iconClass: 'fa-paint-brush', checkDisabled: 'No', className: "btn-warning", onClick: this.handleEditParameterClick.bind(this) },
        { title: 'Background Colour', iconClass: 'fa-square', checkDisabled: 'No', className: "btn-warning", onClick: this.handleEditParameterClick.bind(this) },
        { title: 'Bold', iconClass: 'fa-bold', checkDisabled: 'No', className: "btn-success", onClick: this.handleExportReport.bind(this) },
        { title: 'Italic', iconClass: 'fa-italic', checkDisabled: 'No', className: "btn-success", onClick: this.handleExportReport.bind(this) },
        { title: 'Align Left', iconClass: 'fa-align-left', checkDisabled: 'No', className: "btn-info", onClick: this.handleExportRules.bind(this) },
        { title: 'Align Centre', iconClass: 'fa-align-center', checkDisabled: 'No', className: "btn-info", onClick: this.handleExportRules.bind(this) },
        { title: 'Align Rigt', iconClass: 'fa-align-right', checkDisabled: 'No', className: "btn-info", onClick: this.handleExportRules.bind(this) },
        { title: 'Border', iconClass: 'fa-table', checkDisabled: 'No', className: "btn-success", onClick: this.handleDetails.bind(this) },
        { title: 'Image', iconClass: 'fa-photo', checkDisabled: 'No', className: "btn-success", onClick: this.handleExportReport.bind(this) },
        { title: 'merge', iconClass: 'fa-th-large', checkDisabled: 'No', className: "btn-primary", onClick: this.handleRefreshGrid.bind(this) },
        { title: 'split', iconClass: 'fa-th', checkDisabled: 'No', className: "btn-success", onClick: this.handleDetails.bind(this) },
        { title: 'Save', iconClass: 'fa-save', checkDisabled: 'No', className: "btn-success", onClick: this.handleDetails.bind(this) },
      ];
    }
    this.buttonClassOverride = "None";

    this.renderDynamic = this.renderDynamic.bind(this);

    this.handleReportClick = this.handleReportClick.bind(this);
    this.fetchDataToGrid = this.fetchDataToGrid.bind(this);
    this.checkDisabled = this.checkDisabled.bind(this);
    this.handleCalcRuleClicked = this.handleCalcRuleClicked.bind(this);
    this.handleBusinessRuleClicked = this.handleBusinessRuleClicked.bind(this);
    this.handleAggeRuleClicked = this.handleAggeRuleClicked.bind(this);
    this.handleCellHistoryClicked = this.handleCellHistoryClicked.bind(this);
    this.handleEditParameterClick = this.handleEditParameterClick.bind(this);
    this.handleCopyReportClick = this.handleCopyReportClick.bind(this);
    this.handleCopySelectedClick = this.handleCopySelectedClick.bind(this);
    this.handleReportBusinessRulesClick = this.handleReportBusinessRulesClick.bind(this);

    this.handleSaveParameterClick = this.handleSaveParameterClick.bind(this);
    this.handleSelectCell = this.handleSelectCell.bind(this);
    this.handleModalOkayClick = this.handleModalOkayClick.bind(this);
    this.handleAuditOkayClick = this.handleAuditOkayClick.bind(this);

    this.viewOnly = _.find(this.props.privileges, { permission: "View Report Rules Repository" }) ? true : false;
    this.writeOnly = _.find(this.props.privileges, { permission: "Edit Report Rules Repository" }) ? true : false;
  }

  componentWillMount() {
      // Now required to call as it is being called in the first instance of MAINTAIN REPORT RULE CALL
      // this.props.fetchReportTemplateList();
  }

  componentDidUpdate() {
    console.log("Dates",this.state.startDate);
    this.props.leftMenuClick(false);
  }
  componentWillReceiveProps(nextProps){
    this.gridDataViewReport=nextProps.gridDataViewReport;
    this.changeHistory=nextProps.change_history;
    this.reportBusinessRules=nextProps.cell_rules;
    this.country = this.props.country ? this.props.country
                  :
                  (this.props.login_details.domainInfo.tenant_id != "regopz" ?
                    this.props.login_details.domainInfo.country
                    :
                    null);
    this.tenantRenderType = nextProps.tenantRenderType;
    console.log("nextProps",this.props.leftmenu);
    if(this.props.leftmenu){
      this.setState({
        display: false,
        showDrillDownData: false,
        showAggRuleDetails: false,
        showDrillDownCalcBusinessRules: false,
        showCellChangeHistory: false,
        renderStyle: false,
        },
        ()=>{
          // Not required as this is fired by maintain report rule left click
          // this.props.fetchReportTemplateList();
        }
      );
    }
  }

  handleReportClick(item) {
    console.log("selected item",item);
    this.currentPage = 0;
    this.selectedViewColumns=[];
    this.gridDataViewReport=undefined;
    this.setState({
        display: "showReportGrid",
        country: item.country,
        reportId: item.report_id,
        reportingDate: item.reporting_date,
        businessDate: item.as_of_reporting_date,
        selectedReport: item,
     },
      ()=>{ this.props.fetchReportData(this.state.reportId) }
    );
  }

  checkDisabled(item) {
    console.log("checkDisabled",item );
    switch (item){
      case "Add":
        return !this.writeOnly;
      case "Copy":
        return !this.writeOnly;
      case "Delete":
        return (!this.writeOnly || !this.state.itemEditable);
      case "Copy Report":
        return !this.writeOnly;
      case "Copy Selected":
        return !this.writeOnly;
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
    this.props.fetchReportData(this.state.reportId);
  }

  handleDetails(event){
    //TODO
    console.log('Showing the details of the selected cell',this.selectedCell);
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
      if(!this.selectedCell[0].cell || this.selectedCell.length!=1){
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
          this.props.drillDown(this.selectedCell[0].reportId,this.selectedCell[0].sheetName,this.selectedCell[0].cell)
        );
      }
    }

  }
  handleSelectCell(cell){
    console.log("handleSelectCell",cell);
    // console.log(this.props.gridDataViewReport);
    if (cell.multiSelect){
      this.selectedCell.push(cell);
    } else {
      this.selectedCell = [cell];
    }
    console.log("handleSelectCell selectedCell ... ",this.selectedCell);
  }

  handleCalcRuleClicked(event,calcRuleFilter){
    console.log("Clicked calcRuleFilter",calcRuleFilter);
    this.calcRuleFilter = calcRuleFilter;
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
    this.setState({
        showDrillDownData : false,
        showDrillDownCalcBusinessRules : true,
        showAggRuleDetails: false,
        showCellChangeHistory: false,
      });

  }

  handleAggeRuleClicked(event, item){
    console.log("Clicked aggRuleData ruleFilterParam", item);
    this.aggRuleData = item;
    // TODO AddReportAggRules as form and then pass aggRuleData
    this.setState({
        showDrillDownData : false,
        showDrillDownCalcBusinessRules : false,
        showAggRuleDetails: true,
        showCellChangeHistory: false,
      },
      ()=>{console.log("aggRuleData",this.aggRuleData)});

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
        display: "showHistory",
        selectedAuditSheet: 0,
        },
        ()=>{this.props.fetchReportChangeHistory(this.state.reportId,sheetName)}
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
        ()=>{this.props.fetchReportBusinessRules(this.state.reportId)}
      );
    }
  }

  handleEditParameterClick() {
    let isOpen = this.state.display === "editParameter";
    if(isOpen) {
      this.setState({
        display: "showReportGrid"
        },
        ()=>{
          this.props.fetchReportCatalogList();
        }
      );
    } else {
      //this.props.fetchReportChangeHistory(this.state.reportId);
      //console.log("Repot Linkage",this.props.change_history);
      this.setState({
        display: "editParameter"
        },
        ()=>{
          //TODO save in the def catalog
        }
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

  handleSaveParameterClick(report_info){
    // TODO
    console.log("handleSaveParameterClick...",report_info);
    this.props.updateReportParameter(report_info,this.state.reportId)
    this.handleEditParameterClick();
  }
//Made By Me..
  handleCopyReportClick(){
    let isOpen = this.state.display === "copyTenant";
    if(isOpen) {
      this.tableList=[];
      this.setState({
        display: "showReportGrid"
      })
    } else {
      this.tableList = [
                          { ref_table: "report_def_master",
                            target_table: "report_def",
                            review_columns: false,
                          },
                          { ref_table: "report_calc_def_master",
                            target_table: "report_calc_def",
                            review_columns: true,
                          },
                          { ref_table: "report_comp_agg_def_master",
                            target_table: "report_comp_agg_def",
                            review_columns: true,
                          }
                      ];
      this.setState({
        display: "copyTenant"
        },
      );
      this.operationName = "INSERTTENANT";
      this.copyType = "CopyAll";
    }
  }

  handleCopySelectedClick(){
    this.operationName = "INSERTTENANT";
    this.copyType = "CopySelected";
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
                          <RegOpzFlatGridActionButtons
                            editable={this.writeOnly}
                            checkDisabled={this.checkDisabled}
                            buttons={this.editTools}
                            dataNavigation={false}
                            pageNo={this.currentPage}
                            buttonClassOverride={"Simplified"}
                            donotDisplayName={true}
                          />
                          <RegOpzReportGrid
                            report_id={this.state.reportId}
                            reporting_date={this.state.reportingDate}
                            gridData={this.gridDataViewReport}
                            handleSelectCell={ this.handleSelectCell.bind(this) }
                            multiSelectAllowed={true}
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
                        readOnly = {this.tenantRenderType=="copyRule" ? true : this.readOnly}
                        addRulesBtn = {this.tenantRenderType=="copyRule" ? false : this.writeOnly}
                        selectedCell = {this.selectedCell[0]}
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
                          <AddReportRules
                            country = { this.state.country }
                            writeOnly={this.writeOnly}
                            handleClose={this.handleDetails.bind(this)}
                            {...this.calcRuleFilter.params.drill_kwargs}
                            formData={this.calcRuleFilter.form}
                            groupId={this.props.groupId}
                          />
                      );
                  } else if (this.state.showAggRuleDetails) {
                      content.push(
                          <AddReportAggRules
                            country = { this.state.country }
                            writeOnly={this.writeOnly}
                            handleClose={this.handleDetails.bind(this)}
                            aggRuleData = { this.aggRuleData }
                            dml_allowed = { this.aggRuleData.dml_allowed }
                            gridData={this.props.gridDataViewReport}
                            groupId={this.props.groupId}
                          />
                      );
                  } else if (this.state.showDrillDownCalcBusinessRules) {
                      const {permission} = this.props.login_details;
                      const filter = this.businessRuleFilterParam;
                      let isRulesComponent = permission.find(function(p){return p.component.match(/Business Rules Repository/);});
                      const permissions=[{"permission": isRulesComponent ? "View Business Rules Repository" : null}];
                      // const permissions=[{"permission": "View Business Rules Repository"}];
                      content.push(
                          <ViewBusinessRules
                            country = { this.state.country }
                            privileges={ permissions }
                            showBusinessRuleGrid={true}
                            flagRuleDrillDown={true}
                            sourceId={this.state.country}
                            ruleFilterParam={this.businessRuleFilterParam}
                            origin={"FIXEDFORMAT"}
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
                      <EditParameters
                        maintainReportParameter={true}
                        reportDetails={this.state.selectedReport}
                        handleCancel={this.handleEditParameterClick}
                        handleSubmit={this.handleSaveParameterClick}
                        domainType={"master"}
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
         case "copyTenant":
          if(this.copyType == "CopyAll"){
            console.log("Inside Copy Report,,,",this.country,this.tenant_report_details,this.state.selectedReport);
            return(
              <CopyReportTemplate
                master_report_details={this.state.selectedReport}
                handleCancel={this.handleCopyReportClick}
                handleOnSubmit={this.props.handleCancel}
                groupId={this.props.groupId}
                report_type={"Fixed Format"}
                country={this.country}
                tenant_report_details={this.tenant_report_details}
                tableList={this.tableList}
              />
            );
          }
          break;
          default:
              return(
                  <ReportCatalogList
                    dataCatalog={this.props.dataCatalog}
                    navMenu={false}
                    handleReportClick={this.handleReportClick}
                    applyRules={this.props.applyRules}
                    constantFilter={"FIXEDFORMAT"}
                    />
              );
      }
  }

  render(){
    if (typeof this.props.dataCatalog !== 'undefined') {
        if (typeof this.props.gridDataViewReport != 'undefined' ){
          this.pages = Math.ceil(this.props.gridDataViewReport.count / 100);
        }
        return(
          <div>
            <div className="row form-container">
              <div className="x_panel">
                <div className="x_title">
                    {
                        ((displayOption) => {
                            if (!displayOption) {
                                return(
                                    <h2>View Repository Report Rules <small>Available Report Rules for </small>
                                      <small>{moment(this.state.startDate).format("DD-MMM-YYYY") + ' - ' + moment(this.state.endDate).format("DD-MMM-YYYY")}</small>
                                    </h2>
                                );
                            }
                            return(
                                <h2>Maintain Repository Report Rules <small>{' Report '}</small>
                                  <small><i className="fa fa-file-text"></i></small>
                                  <small title={this.state.selectedReport.report_description}>{this.state.reportId }</small>
                                </h2>
                            );
                        })(this.state.display)
                    }
                      <div className="row">
                        <ul className="nav navbar-right panel_toolbox">
                          {
                            this.tenantRenderType &&
                            <li>
                              <a className="close-link" onClick={this.props.handleCancel}><i className="fa fa-close"></i></a>
                            </li>
                          }
                          <li>
                            <a className="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                              <i className="fa fa-file-text-o"></i><small>{' Reports '}</small>
                              <i className="fa fa-caret-down"></i>
                            </a>
                            <ul className="dropdown-menu dropdown-usermenu pull-right" style={{ "zIndex": 9999 }}>
                              <li style={{ "padding": "5px" }}>
                                <Link
                                  onClick={()=>{ this.setState({ display: false, renderStyle: false, },
                                                                ()=>{this.props.fetchReportCatalogList(this.country);})
                                                }
                                          }
                                >
                                    <i className="fa fa-bars"></i> All Report List
                                </Link>
                              </li>
                              <li>
                                <ReportCatalogList
                                  dataCatalog={this.props.dataCatalog}
                                  navMenu={true}
                                  handleReportClick={this.handleReportClick}
                                  constantFilter={"FIXEDFORMAT"}
                                  />
                              </li>
                            </ul>
                          </li>
                        </ul>
                        {
                          this.state.display &&
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

function mapStateToProps(state){
  console.log("On mapState ", state, state.view_data_store, state.report_store);
  return {
    //data_date_heads:state.view_data_store.dates,
    dataCatalog: state.report_rules_repo.reportCatalogList,
    gridDataViewReport: state.report_rules_repo.capturedTemplate,
    gridData: state.view_data_store.gridData,
    cell_rules: state.report_rules_repo.cellRules,
    change_history: state.report_rules_repo.changeHistory,
    login_details: state.login_store,
    leftmenu: state.leftmenu_store.leftmenuclick,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchReportCatalogList:(country)=>{
        dispatch(actionFetchReportCatalog(country))
    },
    fetchReportData:(report_id)=>{
      dispatch(actionFetchReportData(report_id))
    },
    drillDown:(report_id,sheet,cell) => {
      dispatch(actionRepoDrillDown(report_id,sheet,cell));
    },
    fetchReportChangeHistory:(report_id,sheet_id,cell_id) => {
      dispatch(actionFetchRepoReportChangeHistory(report_id,sheet_id,cell_id));
    },
    fetchReportBusinessRules:(report_id,sheet_id,cell_id) => {
      dispatch(actionFetchReportBusinessRules(report_id,sheet_id,cell_id));
    },
    exportCSV:(table_name,business_ref,sql) => {
      dispatch(actionExportCSV(table_name,business_ref,sql));
    },
    applyRules:(source_info) => {
      dispatch(actionApplyRules(source_info));
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
    updateReportParameter:(data,report) => {
      dispatch(actionUpdateReportParameter(data,report));
    },
  }
}

const VisibleMaintainFixedFormatReportRules = connect(
  mapStateToProps,
  mapDispatchToProps
)(MaintainFixedFormatReportRules);

export default VisibleMaintainFixedFormatReportRules;
