import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import { Link } from 'react-router';
import _ from 'lodash';
import {

  actionInsertSourceData,
  actionUpdateSourceData,
  actionDeleteFromSourceData,
  actionFetchReportLinkage,
  //actionFetchDataChangeHistory,
  actionExportCSV,
} from '../../actions/ViewDataAction';
import { actionFetchAuditList } from '../../actions/DefChangeAction';
import {
  //actionFetchSources,
  actionFetchBusinessRules,
} from '../../actions/BusinessRulesAction';
import {
  actionFetchSources
} from '../../actions/MaintainReportRuleAction';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import RegOpzFlatGrid from '../RegOpzFlatGrid/RegOpzFlatGrid';
import RegOpzFlatGridActionButtons from '../RegOpzFlatGrid/RegOpzFlatGridActionButtons';
import AddBusinessRule from './AddBusinessRule';
import DataSourceList from './DataSourceList';
import AuditModal from '../AuditModal/AuditModal';
import ModalAlert from '../ModalAlert/ModalAlert';
import ShowToggleColumns from '../RegOpzFlatGrid/ShowToggleColumns';
import RuleReportLinkage from './RuleReportLinkage';
import DefAuditHistory from '../AuditModal/DefAuditHistory';
require('react-datepicker/dist/react-datepicker.css');
require('./MaintainBusinessRules.css');

class ViewDataComponentV2 extends Component {
  constructor(props){
    super(props)
    this.state = {
      sources:null,
      showDataGrid: false,
      showAddForm: false,
      showToggleColumns: false,
      itemEditable: true,
      sourceId: null,
      showAuditModal: false,
      showReportLinkage: false,
      showHistory: false,
      sourceFileName: null,
    }

    this.pages=0;
    this.currentPage=0;
    this.dataSource = null;
    this.selectedItems = [];
    this.selectedIndexOfGrid = 0;
    this.form_data={};
    this.selectedViewColumns=[];
    this.operationName=null;
    this.buttons=[
      {title: 'Refresh', iconClass: 'fa-refresh', checkDisabled: 'No', className: "btn-primary"},
      {title: 'Add', iconClass: 'fa-plus', checkDisabled: 'Yes', className: "btn-success"},
      {title: 'Copy', iconClass: 'fa-copy', checkDisabled: 'Yes', className: "btn-success"},
      {title: 'Details', iconClass: 'fa-pencil', checkDisabled: 'No', className: "btn-success"},
      {title: 'Delete', iconClass: 'fa-minus', checkDisabled: 'Yes', className: "btn-warning"},
      {title: 'Report Link', iconClass: 'fa-link', checkDisabled: 'No', className: "btn-info"},
      {title: 'History', iconClass: 'fa-history', checkDisabled: 'No', className: "btn-primary"},
      {title: 'Deselect', iconClass: 'fa-window-maximize', checkDisabled: 'No', className: "btn-default"},
      {title: 'Columns', iconClass: 'fa-th-large', checkDisabled: 'No', className: "btn-default"},
      {title: 'Export', iconClass: 'fa-table', checkDisabled: 'No', className: "btn-success"},
    ]
    this.buttonClassOverride = "None";


    this.handleDataFileClick = this.handleDataFileClick.bind(this);
    this.actionButtonClicked = this.actionButtonClicked.bind(this);
    this.fetchDataToGrid = this.fetchDataToGrid.bind(this);
    this.handleRefreshGrid = this.handleRefreshGrid.bind(this);
    this.handlePageNavigation = this.handlePageNavigation.bind(this);
    this.checkDisabled = this.checkDisabled.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.displaySelectedColumns = this.displaySelectedColumns.bind(this);
    this.handleReportLinkClick = this.handleReportLinkClick.bind(this);
    this.handleHistoryClick = this.handleHistoryClick.bind(this);
    this.handleExportCSV = this.handleExportCSV.bind(this);

    this.handleSelectRow = this.handleSelectRow.bind(this);
    this.handleFullSelect = this.handleFullSelect.bind(this);
    this.handleDuplicateClick=this.handleDuplicateClick.bind(this);
    this.handleUpdateRow = this.handleUpdateRow.bind(this);
    this.handleModalOkayClick = this.handleModalOkayClick.bind(this);
    this.handleAuditOkayClick = this.handleAuditOkayClick.bind(this);


    this.viewOnly = _.find(this.props.privileges, { permission: "View Data" }) ? true : false;
    this.writeOnly = _.find(this.props.privileges, { permission: "Edit Data" }) ? true : false;
  }

  componentWillMount(){
    this.props.fetchSources();
  }
  componentDidUpdate(){
    console.log("componentDidUpdate");
  }

  handleDataFileClick(item) {
    console.log("selected item",item);
    this.currentPage = 0;
    this.selectedViewColumns=[];
    this.setState({
        showToggleColumns: false,
        showDataGrid: true,
        showAddForm: false,
        showReportLinkage: false,
        showHistory: false,
        sourceId: item.source_id,
        sourceFileName: item.source_file_name,
     },
      this.props.fetchBusinesRules(item.source_id,this.currentPage)
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

  handleToggle(event) {
    let toggleValue = this.state.showToggleColumns;
    if (!toggleValue) {
      this.setState({
        showToggleColumns: true,
        showDataGrid: false,
        showAddForm: false,
        showReportLinkage: false,
        showHistory: false,
      });
    }
    else {
      this.setState({
        showToggleColumns: false,
        showDataGrid: true,
        showAddForm: false,
        showReportLinkage: false,
        showHistory: false,
      });
    }
  }

  displaySelectedColumns(columns) {
    var selectedColumns = [];
    for (let i = 0; i < columns.length; i++)
      if (columns[i].checked)
        selectedColumns.push(columns[i].name);

    this.selectedViewColumns = selectedColumns;
    //console.log(selectedColumns);
    //console.log(this.selectedViewColumns);
    this.setState({
      showToggleColumns: false,
      showDataGrid: true,
      showAddForm: false,
      showReportLinkage: false,
      showHistory: false,
    });
  }

  actionButtonClicked(event,itemClicked){
    console.log("actionButtonClicked",itemClicked ,event);
    switch (itemClicked){
      case "Refresh":
        this.handleRefreshGrid(event);
        break;
      case "Add":
        this.handleAdd(event,"add");
        break;
      case "Copy":
        this.handleDuplicateClick(event);
        break;
      case "Details":
        this.handleAdd(event,"update");
        break;
      case "Delete":
        this.handleDeleteClick(event);
        break;
      case "Report Link":
        this.handleReportLinkClick(event);
        break;
      case "History":
        this.handleHistoryClick(event);
        break;
      case "Deselect":
        this.selectedItems = this.flatGrid.deSelectAll();
        break;
      case "Columns":
        this.handleToggle(event);
        break;
      case "Export":
        this.handleExportCSV(event);
        break;
      case "FirstPage":
        if( this.currentPage !=0 ){
          this.handlePageNavigation(event,0);
        }
        break;
      case "NextPage":
        if ( this.currentPage < this.pages - 1 ){
          this.currentPage++;
          this.handlePageNavigation(event,this.currentPage);
        }
        break;
      case "PrevPage":
        if ( this.currentPage > 0 ){
          this.currentPage--;
          this.handlePageNavigation(event,this.currentPage);
        }
        break;
      case "LastPage":
        if( this.currentPage != this.pages -1 ){
          this.currentPage=this.pages -1;
          this.handlePageNavigation(event,this.currentPage);
        }
        break;
      case "Page":
        break;
      case "PageOkay":
        if(event.key == "Enter"){
            if(event.target.value > this.pages){
              this.modalAlert.isDiscardToBeShown = false;
              this.modalAlert.open("Page does not exists");
            } else {
              this.currentPage = event.target.value;
              this.fetchDataToGrid(event,this.currentPage);
            }
        }
        break;
      default:
        console.log("No specific action has been defined for ",itemClicked);
    }

  }

  handleRefreshGrid(event){
    this.selectedItems = this.flatGrid.deSelectAll();
    //this.currentPage = 0;
    this.setState({itemEditable:true});
    this.fetchDataToGrid(event);
  }

  handlePageNavigation(event, pageNo) {
    this.currentPage = pageNo;
    console.log("Inside handlePageNavigation",this.currentPage,pageNo);
    this.fetchDataToGrid(event);
  }

  fetchDataToGrid(event){
    this.props.fetchBusinesRules(this.state.sourceId,this.currentPage);
  }

  handleAdd(event,requestType){

    let isOpen = this.state.showAddForm;
    if(isOpen) {
      this.setState({
        showToggleColumns: false,
        showDataGrid: true,
        showAddForm: false,
        showReportLinkage: false,
        showHistory: false,
        itemEditable: true,
        },
        ()=>{
              if(this.selectedItems){
                this.selectedItems = this.flatGrid.deSelectAll();
              }
            }
      )
    } else {
        if( requestType != "add" && this.selectedItems.length != 1){
          this.modalAlert.isDiscardToBeShown = false;
          this.modalAlert.open("Please select " + (this.selectedItems.length ? "only one " : " a " ) + " record");
        } else {
          let itemEditable = true;
          if ( requestType == "add") {
            this.selectedItems = this.flatGrid.deSelectAll();
          } else {
            if(this.selectedItems.length==0){
                this.modalAlert.isDiscardToBeShown = false;
                this.modalAlert.open("Please select a row");
                return;
            }else{
              this.form_data = this.selectedItems[0];
              itemEditable = (this.form_data.dml_allowed == "Y");
            }
          }
          this.requestType = requestType;
          this.setState({
              showToggleColumns: false,
              showDataGrid: false,
              showAddForm: true,
              showReportLinkage: false,
              showHistory: false,
              itemEditable: itemEditable,
            });
        }
    }
  }


  handleSelectRow(indexOfGrid){
    console.log("Inside Single select....",this.selectedItems.length);
    if(this.selectedItems.length == 1){
      this.selectedIndexOfGrid = indexOfGrid;
      this.setState({itemEditable : (this.selectedItems[0].dml_allowed == "Y")});
      console.log("Inside Single select ", indexOfGrid);
    }

  }


  handleUpdateRow(row){
    this.operationName = "UPDATE";
    this.updateInfo = row;
    this.setState({ showAuditModal: true });
  }

  handleReportLinkClick(event) {
    let isOpen = this.state.showReportLinkage;
    if(isOpen) {
      this.setState({
        showToggleColumns: false,
        showDataGrid: true,
        showAddForm: false,
        showReportLinkage: false,
        showHistory: false,
      });
    } else {
      if(this.selectedItems.length < 1){
        this.modalAlert.isDiscardToBeShown = false;
        this.modalAlert.open("Please select atleast one record");
      } else {
        let selectedKeys=null;
        this.selectedItems.map((item,index)=>{
          selectedKeys += (selectedKeys ? ',' + item.business_rule : item.business_rule)
        })
        this.props.fetchReportLinkage(this.state.sourceId,selectedKeys);
        //console.log("Repot Linkage",this.props.report_linkage);
        this.setState({
          showToggleColumns: false,
          showDataGrid: false,
          showAddForm: false,
          showReportLinkage: true,
          showHistory: false,
        });
      }
    }
    this.selectedItems = this.flatGrid.deSelectAll();
  }

  handleHistoryClick(event) {
    let isOpen = this.state.showHistory;
    if(isOpen) {
      this.setState({
        showToggleColumns: false,
        showDataGrid: true,
        showAddForm: false,
        showReportLinkage: false,
        showHistory: false,
      });
    } else {
      let selectedKeys=null;
      this.selectedItems.map((item,index)=>{
        selectedKeys += (selectedKeys ? ',' + item.business_rule : item.business_rule)
      })
      this.props.fetchAuditList(selectedKeys,this.state.tableName);
      console.log("Repot Linkage",this.props.change_history);
      this.setState({
        showToggleColumns: false,
        showDataGrid: false,
        showAddForm: false,
        showReportLinkage: false,
        showHistory: true,
      });
    }
    this.selectedItems = this.flatGrid.deSelectAll();
  }

  handleExportCSV(event) {
    let business_ref = "_source_" + this.state.sourceId + "_";
    this.props.exportCSV(this.props.gridData.table_name,business_ref,this.props.gridData.sql);
  }

  handleFullSelect(items){
    console.log("Selected Items ", items);

    this.selectedItems = items;
    //this.props.setDisplayCols(this.props.gridData.cols,this.props.gridData.table_name);
    //this.props.setDisplayData(this.selectedItems[0]);

  }

  handleDuplicateClick(event){
    if(this.selectedItems.length != 1){
      this.modalAlert.isDiscardToBeShown = false;
      this.modalAlert.open("Please select " + (this.selectedItems.length ? "only one " : " a " ) + " record");
    } else {
      this.modalAlert.isDiscardToBeShown = true;
      this.operationName = "INSERT";
      this.modalAlert.open(`Are you sure to create a copy of this record (ID: ${this.selectedItems[0]['id']}) ?`)
    }
  }

  handleDeleteClick(event){
      if(this.selectedItems.length != 1){
        this.modalAlert.isDiscardToBeShown = false;
        this.modalAlert.open("Please select " + (this.selectedItems.length ? "only one " : " a " ) + " record");
        console.log("Inside OnClick delete ......",this.selectedItems);
      } else {
        this.modalAlert.isDiscardToBeShown = true;
        this.operationName = "DELETE";
        this.modalAlert.open(`Do you really want to delete this record (ID: ${this.selectedItems[0]['id']}) ?`)
      }
    }

  handleModalOkayClick(event){
    //console.log("showAuditModal",this.state.showAuditModal);
    this.modalAlert.isDiscardToBeShown = false;
    if(this.selectedItems.length==1 && (this.operationName=='DELETE'||this.operationName=='INSERT')){
      this.setState({showAuditModal:true},
          ()=>{console.log("showAuditModal",this.state.showAuditModal);});
    }
  }

  handleAuditOkayClick(auditInfo){
    let data={};
    data["change_type"]=this.operationName;
    data["table_name"]=this.props.gridData.table_name;

    if(this.operationName=='INSERT'){
      this.auditInfo={
        table_name:data["table_name"],
        id:null,
        change_type:this.operationName,
        change_reference:`Duplicate of Data: ${this.selectedItems[0]["id"]} of Source: ${this.state.SourceId} - ${data["table_name"]}`,
        maker:this.props.login_details.user,
      };
      Object.assign(this.auditInfo,auditInfo);
      data["audit_info"]=this.auditInfo;
      data["update_info"]={...this.selectedItems[0]};
      data.update_info.id = null;
      this.props.insertSourceData(data,this.selectedIndexOfGrid + 1);
      this.setState({showAuditModal:false});

    }

    if (this.operationName=='DELETE'){
      this.auditInfo={
        table_name:data["table_name"],
        change_type:this.operationName,
        change_reference:`Delete of Data: ${this.selectedItems[0]['id']} of Source: ${this.state.SourceId} - ${data["table_name"]}`,
        maker:this.props.login_details.user,
      };
      Object.assign(this.auditInfo,auditInfo);
      data["audit_info"]=this.auditInfo;
      data["update_info"]=this.selectedItems[0];

      this.props.deleteFromSourceData(this.selectedItems[0]['id'],data, this.selectedIndexOfGrid);
      this.setState({showAuditModal:false});
    }

   if(this.operationName=='UPDATE'){

     this.auditInfo={
       table_name:data["table_name"],
       change_type:this.operationName,
       change_reference:`Update of Data: ${this.updateInfo['id']} of Source: ${this.state.SourceId} - ${data["table_name"]}`,
       maker:this.props.login_details.user,
     };
     Object.assign(this.auditInfo,auditInfo);
     data["audit_info"]=this.auditInfo;
     data["update_info"]=this.updateInfo;
     this.props.updateSourceData(data);
     this.setState({showAuditModal:false});

   }

   this.handleRefreshGrid(event);

  }

  render(){
    if (typeof this.props.dataCatalog != 'undefined') {
        if (typeof this.props.gridData != 'undefined' ){
          this.pages = Math.ceil(this.props.gridData.count / 100);
        }
        return(
          <div>
            <div className="row form-container">
              <div className="x_panel">
                <div className="x_title">
                      { !this.state.showDataGrid &&
                        !this.state.showAddForm &&
                        !this.state.showToggleColumns &&
                        !this.state.showReportLinkage &&
                        !this.state.showHistory &&
                        <h2>View Business Rules <small>Available Sources</small></h2>
                      }
                      { (this.state.showDataGrid ||
                        this.state.showAddForm ||
                        this.state.showToggleColumns ||
                        this.state.showReportLinkage ||
                        this.state.showHistory ) &&
                        <h2>View Business Rules <small>{' Rules for Source '}</small>
                          <small>{this.state.sourceId + ' '}</small>
                          <small><i className="fa fa-file-text"></i></small>
                          <small>{' Source File: ' + this.state.sourceFileName}</small>
                        </h2>
                      }
                      <div className="row">
                        <ul className="nav navbar-right panel_toolbox">
                          <li>
                            <a className="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                              <i className="fa fa-rss"></i><small>{' Data Feeds '}</small>
                              <i className="fa fa-caret-down"></i>
                            </a>
                            <ul className="dropdown-menu dropdown-usermenu pull-right" style={{ "zIndex": 9999 }}>
                              <li>
                                <Link to="/dashboard/maintain-business-rules" onClick={()=>{this.setState({ showDataGrid: false, showAddForm: false, });}}>
                                    <i className="fa fa-bars"></i>{' All Sources'}
                                </Link>
                              </li>
                              <li>
                                <a href="#"></a>
                                <DataSourceList
                                  dataCatalog={this.props.dataCatalog}
                                  navMenu={true}
                                  handleDataFileClick={this.handleDataFileClick}
                                  />
                              </li>
                            </ul>
                          </li>
                        </ul>
                        <ul className="nav navbar-right panel_toolbox">
                          <li>
                            <a className="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                              <i className="fa fa-spinner"></i><small>{' Button Style '}</small>
                              <i className="fa fa-caret-down"></i>
                            </a>
                            <ul className="dropdown-menu dropdown-usermenu pull-right" style={{ "zIndex": 9999 }}>
                              <li>
                                <a onClick={(event)=>{this.buttonClassOverride="Simplified"; this.forceUpdate();}}>
                                    <i className="fa fa-toggle-off"></i>{' Simplified'}
                                </a>
                              </li>
                              <li>
                                <a onClick={(event)=>{this.buttonClassOverride="None";this.forceUpdate();}}>
                                    <i className="fa fa-toggle-on"></i>{' Multi Colour'}
                                </a>
                              </li>
                              <li>
                                <a onClick={(event)=>{this.buttonClassOverride="btn-default";this.forceUpdate();}}>
                                    <i className="fa fa-square-o"></i>{' Default'}
                                </a>
                              </li>
                              <li>
                                <a onClick={(event)=>{this.buttonClassOverride="btn-primary";this.forceUpdate();}}>
                                    <i className="fa fa-square"></i>{' Primary'}
                                </a>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </div>
                    <div className="clearfix"></div>
                </div>
                <div className="x_content">
                { !this.state.showDataGrid &&
                  !this.state.showAddForm &&
                  !this.state.showToggleColumns &&
                  !this.state.showReportLinkage &&
                  !this.state.showHistory &&
                  <DataSourceList
                    dataCatalog={this.props.dataCatalog}
                    navMenu={false}
                    handleDataFileClick={this.handleDataFileClick}
                    />
                }
                { this.state.showDataGrid &&
                  this.props.gridData &&
                  !this.state.showAddForm &&
                  !this.state.showToggleColumns &&
                  !this.state.showReportLinkage &&
                  !this.state.showHistory &&
                    <RegOpzFlatGridActionButtons
                      editable={this.writeOnly}
                      buttonClicked={this.actionButtonClicked}
                      checkDisabled={this.checkDisabled}
                      buttons={this.buttons}
                      dataNavigation={true}
                      pageNo={this.currentPage}
                      buttonClassOverride={this.buttonClassOverride}
                      />
                }
                {
                  !this.state.showDataGrid &&
                  this.props.gridData &&
                  !this.state.showAddForm &&
                  this.state.showToggleColumns &&
                  !this.state.showReportLinkage &&
                  !this.state.showHistory &&
                    <ShowToggleColumns
                        columns={this.props.gridData.cols}
                        saveSelection={this.displaySelectedColumns}
                        selectedViewColumns={this.selectedViewColumns}
                        handleClose={this.handleToggle}
                      />
                }
                {
                  this.state.showDataGrid &&
                  this.props.gridData &&
                  !this.state.showAddForm &&
                  !this.state.showToggleColumns &&
                  !this.state.showReportLinkage &&
                  !this.state.showHistory &&
                    <RegOpzFlatGrid
                     columns={this.selectedViewColumns.length ? this.selectedViewColumns : this.props.gridData.cols}
                     dataSource={this.props.gridData.rows}
                     onSelectRow={this.handleSelectRow.bind(this)}
                     onUpdateRow = {this.handleUpdateRow.bind(this)}
                     onSort = {()=>{}}
                     onFilter = {()=>{}}
                     onFullSelect = {this.handleFullSelect.bind(this)}
                     isMultiSelectAllowed = { true }
                     ref={
                           (flatGrid) => {
                             this.flatGrid = flatGrid;
                           }
                         }
                    />
                }
                {
                  !this.state.showDataGrid &&
                  this.state.showAddForm &&
                  this.props.gridData &&
                  !this.state.showToggleColumns &&
                  !this.state.showReportLinkage &&
                  !this.state.showHistory &&
                    <AddBusinessRule
                      businessRule={this.form_data}
                      handleCancel={this.handleAdd}
                      handleClose={this.handleAdd}
                      editable={ this.writeOnly && this.state.itemEditable }
                      />
                }
                {
                  this.state.showDataGrid &&
                  !this.props.gridData &&
                  !this.state.showAddForm &&
                  !this.state.showToggleColumns &&
                  !this.state.showReportLinkage &&
                  !this.state.showHistory &&
                  <div>
                    <h4>Loading ....</h4>
                  </div>
                }
                {
                  !this.state.showDataGrid &&
                  !this.state.showAddForm &&
                  !this.state.showToggleColumns &&
                  this.state.showReportLinkage &&
                  !this.state.showHistory &&
                  <RuleReportLinkage
                    data={ this.props.report_linkage }
                    ruleReference={ this.selectedKeys }
                    handleClose={this.handleReportLinkClick}
                  />
                }
                {
                  !this.state.showDataGrid &&
                  !this.state.showAddForm &&
                  !this.state.showToggleColumns &&
                  !this.state.showReportLinkage &&
                  this.props.change_history &&
                  this.state.showHistory &&
                  <DefAuditHistory
                    data={ this.props.change_history }
                    historyReference={ this.selectedKeys }
                    handleClose={this.handleHistoryClick}
                    />
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
    else {
      return(
        <h4> Loading.....</h4>
      );
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSources:(sourceId) => {
      dispatch(actionFetchSources(sourceId));
    },
    fetchBusinesRules: (source_id,page, order) => {
      dispatch(actionFetchBusinessRules(source_id,page, order))
    },
    insertSourceData:(data,at) => {
      dispatch(actionInsertSourceData(data,at));
    },
    updateSourceData:(data) => {
      dispatch(actionUpdateSourceData(data));
    },
    deleteFromSourceData:(id,data, at) => {
      dispatch(actionDeleteFromSourceData(id,data, at));
    },
    fetchReportLinkage:(source_id,qualifying_key,business_date) => {
      dispatch(actionFetchReportLinkage(source_id,qualifying_key,business_date));
    },
    fetchAuditList: (idList, tableName) => {
      dispatch(actionFetchAuditList(idList, tableName));
    },
    exportCSV:(table_name,business_ref,sql) => {
      dispatch(actionExportCSV(table_name,business_ref,sql));
    },
  }
}

function mapStateToProps(state){
  console.log("On mapState ", state.view_data_store);
  return {
    //data_date_heads:state.view_data_store.dates,
    dataCatalog: state.view_data_store.sources,
    gridData: state.business_rules[0],
    report_linkage:state.view_data_store.report_linkage,
    change_history:state.def_change_store.audit_list,
    login_details:state.login_store,
  }
}

const VisibleViewDataComponentV2 = connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewDataComponentV2);

export default VisibleViewDataComponentV2;
