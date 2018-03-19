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
  actionFetchReportChangeHistory,
  actionUpdateRuleData
} from '../../actions/MaintainReportRuleAction';
import {
  //actionFetchDates,
  actionFetchReportCatalog,
  //actionFetchReportLinkage,
  //actionFetchDataChangeHistory,
  actionExportCSV,
  actionApplyRules,
} from '../../actions/ViewDataAction';
import {
  // actionFetchReportData,
  actionDrillDown
} from '../../actions/CaptureReportAction';
import {
  actionFetchTransReportTemplateData,
} from '../../actions/TransactionReportAction';
import {
  actionLeftMenuClick,
} from '../../actions/LeftMenuAction';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import RegOpzReportGrid from '../RegOpzDataGrid/RegOpzReportGrid';
import RegOpzFlatGridActionButtons from '../RegOpzFlatGrid/RegOpzFlatGridActionButtons';
import ReportCatalogList from '../MaintainReportRules/ReportRuleCatalog';
import AuditModal from '../AuditModal/AuditModal';
import ModalAlert from '../ModalAlert/ModalAlert';
import DataReportLinkage from '../ViewData/DataReportLinkage';
import DefAuditHistory from '../AuditModal/DefAuditHistory';
import DrillDownTransRules from '../DrillDown/DrillDownTransRules';
import AddTransReportSectionOrder from './AddTransReportSectionOrder';
import AddTransReportSection from './AddTransReportSection';
import AddReportTransRules from './AddReportTransRules';
import ViewBusinessRules from '../MaintainBusinessRules/MaintainBusinessRules';
import EditParameters from '../CreateReport/EditParameters';
require('react-datepicker/dist/react-datepicker.css');

class MaintainTransactionReportRules extends Component {
  constructor(props){
    super(props)
    this.state = {
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
      selectedReport: {}
    }

    this.pages=0;
    this.currentPage=0;
    this.dataSource = null;
    this.gridDataViewReport=undefined;
    this.changeHistory=undefined;
    this.calcRuleFilter = {};
    this.businessRuleFilterParam = {};
    this.selectedCell=[];
    this.selectedItems = [];
    this.selectedIndexOfGrid = 0;
    this.form_data={};
    this.selectedViewColumns=[];
    this.operationName=null;
    this.aggRuleData = null;
    this.sectionData = null;
    this.buttons=[
      { title: 'Refresh', iconClass: 'fa-refresh', checkDisabled: 'No', className: "btn-primary", onClick: this.handleRefreshGrid.bind(this) },
      { title: 'Details', iconClass: 'fa-cog', checkDisabled: 'No', className: "btn-success", onClick: this.handleDetails.bind(this) },
      { title: 'History', iconClass: 'fa-history', checkDisabled: 'No', className: "btn-primary", onClick: this.handleHistoryClick.bind(this) },
      { title: 'Save Report Rules', iconClass: 'fa-puzzle-piece', checkDisabled: 'No', className: "btn-info", onClick: this.handleExportRules.bind(this) },
      { title: 'Export', iconClass: 'fa-table', checkDisabled: 'No', className: "btn-success", onClick: this.handleExportReport.bind(this) },
      { title: 'Edit Report Parameters', iconClass: 'fa-cogs', checkDisabled: 'No', className: "btn-warning", onClick: this.handleEditParameterClick.bind(this) },
    ];
    this.editTools=[
      { title: 'Fornt', iconClass: 'fa-font', checkDisabled: 'No', className: "btn-primary", onClick: this.handleHistoryClick.bind(this) },
      { title: 'Text Size', iconClass: 'fa-text-height', checkDisabled: 'No', className: "btn-primary", onClick: this.handleHistoryClick.bind(this) },
      { title: 'Fornt Colour', iconClass: 'fa-paint-brush', checkDisabled: 'No', className: "btn-warning", onClick: this.handleEditParameterClick.bind(this) },
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
      { title: 'Define Section', iconClass: 'fa-code', checkDisabled: 'No', className: "btn-success", onClick: this.handleDefineSection.bind(this) },
      { title: 'Save', iconClass: 'fa-save', checkDisabled: 'No', className: "btn-success", onClick: this.handleDetails.bind(this) },
    ];
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

    this.handleDefineSection = this.handleDefineSection.bind(this);

    this.handleSaveParameterClick = this.handleSaveParameterClick.bind(this);
    this.handleSelectCell = this.handleSelectCell.bind(this);
    this.handleModalOkayClick = this.handleModalOkayClick.bind(this);
    this.handleAuditOkayClick = this.handleAuditOkayClick.bind(this);

    this.viewOnly = _.find(this.props.privileges, { permission: "View Report Rules" }) ? true : false;
    this.writeOnly = _.find(this.props.privileges, { permission: "Edit Report Rules" }) ? true : false;
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
    console.log("nextProps",this.props.leftmenu);
    if(this.props.leftmenu){
      this.setState({
        display: false,
        showDrillDownData: false,
        showAggRuleDetails: false,
        showDrillDownCalcBusinessRules: false,
        showCellChangeHistory: false,
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

  handleDefineSection(event){
      //TODO
      let isOpen = this.state.display === "defineSection";
      if(isOpen){
        this.sectionData = null;
        this.setState({
          display: "showReportGrid",
          showDrillDownData: false,
          showDrillDownCalcBusinessRules: false,
          showAggRuleDetails: false,
          showCellChangeHistory: false,
        });
      } else {
        //console.log("handleSelectCell",this.selectedCell.cell);
        if(!this.selectedCell[0].cell || this.selectedCell.length != 1){
          this.modalAlert.isDiscardToBeShown = false;
          this.modalAlert.open("Please select only one cell to re-define the section.");
        } else {
          //this.buttons=this.dataButtons;
          if (this.selectedCell[0].cell) {
            this.sectionData = { report_id: this.selectedCell[0].reportId,
                                sheet_id: this.selectedCell[0].sheetName,
                                cell_id: this.selectedCell[0].cell+(this.selectedCell[0].item.merged ? ":"+this.selectedCell[0].item.merged:""),
                                section_id: null,
                                }
          }

          this.setState({
            display: "defineSection",
            showDrillDownData: false,
            showDrillDownCalcBusinessRules: false,
            showAggRuleDetails: false,
            showCellChangeHistory: false,
            },
            //this.props.drillDown(this.selectedCell[0].reportId,this.selectedCell[0].sheetName,this.selectedCell[0].cell)
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
        display: "showHistory"
        },
        ()=>{this.props.fetchReportChangeHistory(this.state.reportId,sheetName)}
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
          this.props.fetchReportTemplateList();
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
    this.props.updateReportParameter(this.state.reportId,report_info)
    this.handleEditParameterClick();
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
                      <DrillDownTransRules
                        cellRules = {this.props.cell_rules}
                        readOnly = {this.readOnly}
                        addRulesBtn = {this.writeOnly}
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
                          <AddReportTransRules
                            writeOnly={this.writeOnly}
                            handleClose={this.handleDetails.bind(this)}
                            {...this.calcRuleFilter.params.drill_kwargs}
                            formData={this.calcRuleFilter.form}
                          />
                      );
                  } else if (this.state.showAggRuleDetails) {
                      content.push(
                          <AddTransReportSectionOrder
                            writeOnly={this.writeOnly}
                            handleClose={this.handleDetails.bind(this)}
                            aggRuleData = { this.aggRuleData }
                            dml_allowed = { this.aggRuleData.dml_allowed }
                            gridData={this.props.gridDataViewReport}
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
                      />
                    );
              break;
          case "defineSection":
              return(
                      <AddTransReportSection
                        writeOnly={this.writeOnly}
                        handleClose={this.handleDefineSection.bind(this)}
                        sectionData={this.sectionData}
                        dml_allowed = { "Y" }
                        gridData={this.props.gridDataViewReport}
                        />
                  );
              break;
          default:
              return(
                  <ReportCatalogList
                    dataCatalog={this.props.dataCatalog}
                    navMenu={false}
                    handleReportClick={this.handleReportClick}
                    applyRules={this.props.applyRules}
                    constantFilter={"TRANSACTION"}
                    />
              );
      }
  }

  render(){
    if (typeof this.props.dataCatalog !== 'undefined') {
        if (typeof this.props.gridDataViewReport != 'undefined' ){
          this.pages = Math.ceil(this.props.gridDataViewReport.count / 100);
        }

        let filtered =this.props.dataCatalog.filter(item=>
                          item.country.match('IN')
        );
        console.log("Filter in lodash...",filtered);
        return(
          <div>
            <div className="row form-container">
              <div className="x_panel">
                <div className="x_title">
                    {
                        ((displayOption) => {
                            if (!displayOption) {
                                return(
                                    <h2>View Report Rules <small>Available Report Rules for </small>
                                      <small>{moment(this.state.startDate).format("DD-MMM-YYYY") + ' - ' + moment(this.state.endDate).format("DD-MMM-YYYY")}</small>
                                    </h2>
                                );
                            }
                            return(
                                <h2>Maintain Report Rules <small>{' Report '}</small>
                                  <small><i className="fa fa-file-text"></i></small>
                                  <small title={this.state.selectedReport.report_description}>{this.state.reportId }</small>
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
                              <li style={{ "padding": "5px" }}>
                                <Link to="/dashboard/maintain-report-rules"
                                  onClick={()=>{ this.setState({ display: false },
                                                                ()=>{this.props.fetchReportTemplateList();})
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
                                  constantFilter={"TRANSACTION"}
                                  />
                              </li>
                            </ul>
                          </li>
                        </ul>
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
    dataCatalog: state.maintain_report_rules_store.report_template_list,
    gridDataViewReport: state.transreport.reportGridData,
    gridData: state.view_data_store.gridData,
    cell_rules: state.report_store.cell_rules,
    change_history:state.maintain_report_rules_store.change_history,
    login_details: state.login_store,
    leftmenu: state.leftmenu_store.leftmenuclick,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchReportTemplateList:(reports,country)=>{
        dispatch(actionFetchReportTemplate(reports,country))
    },
    fetchReportCatalog:(startDate,endDate)=>{
      dispatch(actionFetchReportCatalog(startDate,endDate))
    },
    fetchReportData:(report_id)=>{
      dispatch(actionFetchTransReportTemplateData(report_id))
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
    updateReportParameter:(id, data) => {
      dispatch(actionUpdateRuleData(id, data));
    },
  }
}

const VisibleMaintainTransactionReportRules = connect(
  mapStateToProps,
  mapDispatchToProps
)(MaintainTransactionReportRules);

export default VisibleMaintainTransactionReportRules;
