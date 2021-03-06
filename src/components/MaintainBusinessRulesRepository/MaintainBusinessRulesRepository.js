import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import { Link } from 'react-router';
import _ from 'lodash';
import moment from 'moment';
import ReactTable from 'react-table';
import { actionFetchAuditList } from '../../actions/DefChangeAction';
import {
  actionFetchReportLinkage,
  actionExportCSV,
} from '../../actions/BusinessRulesAction';
import {
  actionFetchBusinessRules,
  actionDeleteBusinessRule,
  actionCopyBusinessRuleToTenant,
} from '../../actions/BusinessRulesRepositoryAction';
import {
  actionFetchCountries
} from '../../actions/SharedDataAction';
import {
  actionFetchDrillDownRulesReport
} from '../../actions/ViewDataAction';
import {
  actionLeftMenuClick,
} from '../../actions/LeftMenuAction';
import RegOpzFlatGrid from '../RegOpzFlatGrid/RegOpzFlatGrid';
import RegOpzFlatGridActionButtons from '../RegOpzFlatGrid/RegOpzFlatGridActionButtons';
import AddBusinessRuleRepository from './AddBusinessRuleRepository';
import CountryList from './CountryList';
import AuditModal from '../AuditModal/AuditModal';
import ModalAlert from '../ModalAlert/ModalAlert';
import ShowToggleColumns from '../RegOpzFlatGrid/ShowToggleColumns';
import RuleReportLinkage from './RuleReportLinkage';
import DefAuditHistory from '../AuditModal/DefAuditHistory';
import AccessDenied from '../Authentication/AccessDenied';
import RuleCopyIntoTenantReport from './RuleCopyIntoTenantReport';
require('./MaintainBusinessRulesRepository.css');
require('react-table/react-table.css');

class MaintainBusinessRulesRepository extends Component {
  constructor(props){
    super(props)
    this.state = {
      display: (this.props.showBusinessRuleGrid ? "showBusinessRuleGrid" : false),
      sources:null,
      itemEditable: true,
      sourceId: this.props.sourceId ? this.props.sourceId
                  :
                  (this.props.login_details.domainInfo.tenant_id != "regopz" ?
                    this.props.login_details.domainInfo.country
                    :
                    null),
      showAuditModal: false,
      sourceFileName: null,
      sourceDescription: null,
      tableName: null,
      // ReactTable variables
      page: 0,
      pageSize: 20,
      rowIndex: [],
      loading: true,
      filtered: []
    }

    this.ruleFilterParam=this.props.ruleFilterParam;
    this.flagRuleDrillDown=this.props.flagRuleDrillDown ? this.props.flagRuleDrillDown : false;
    this.tenantRenderType = this.props.tenantRenderType ? this.props.tenantRenderType : false;
    this.tenantSource = this.props.tenantSource;
    this.pages=0;
    this.currentPage=undefined;
    this.dataSource = null;
    this.gridData=undefined;
    this.changeHistory=undefined;
    this.reportLinkage=undefined;
    this.tenantCopyResult=undefined;
    this.selectedItems = [];
    this.selectedIndexOfGrid = 0;
    this.form_data={};
    this.selectedViewColumns=[];
    this.operationName=null;
    if (this.tenantRenderType=="copyRule"){
      this.buttons=[
        {title: 'Refresh', iconClass: 'fa-refresh', checkDisabled: 'No', className: "btn-primary"},
        {title: 'Details', iconClass: 'fa-pencil', checkDisabled: 'No', className: "btn-success"},
        {title: 'Copy Rule', iconClass: 'fa-rocket', checkDisabled: 'Yes', className: "btn-success"},
        {title: 'Report Link', iconClass: 'fa-link', checkDisabled: 'No', className: "btn-info"},
        {title: 'History', iconClass: 'fa-history', checkDisabled: 'No', className: "btn-primary"},
        {title: 'Deselect', iconClass: 'fa-window-maximize', checkDisabled: 'No', className: "btn-default"},
        {title: 'Columns', iconClass: 'fa-th-large', checkDisabled: 'No', className: "btn-default"},
        {title: 'Export', iconClass: 'fa-table', checkDisabled: 'No', className: "btn-success"},
      ]
    } else {
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
    }

    this.buttonClassOverride = "None";
    this.selectedKeys = '';
    this.groupId = this.props.groupId ?
                    this.props.groupId
                    :
                    this.props.user + this.props.tenant_id + "BRR" + moment.utc();


    this.handleCountryClick = this.handleCountryClick.bind(this);
    this.actionButtonClicked = this.actionButtonClicked.bind(this);
    this.fetchDataToGrid = this.fetchDataToGrid.bind(this);
    this.handleRefreshGrid = this.handleRefreshGrid.bind(this);
    this.checkDisabled = this.checkDisabled.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.displaySelectedColumns = this.displaySelectedColumns.bind(this);
    this.handleReportLinkClick = this.handleReportLinkClick.bind(this);
    this.handleHistoryClick = this.handleHistoryClick.bind(this);
    this.handleExportCSV = this.handleExportCSV.bind(this);
    this.handleTenantCopyResultClick = this.handleTenantCopyResultClick.bind(this);

    this.handleSelectRow = this.handleSelectRow.bind(this);
    this.handleFullSelect = this.handleFullSelect.bind(this);
    this.handleDuplicateClick=this.handleDuplicateClick.bind(this);
    this.handleCopyIntoTenantClick = this.handleCopyIntoTenantClick.bind(this);
    this.handleUpdateRow = this.handleUpdateRow.bind(this);
    this.handleModalOkayClick = this.handleModalOkayClick.bind(this);
    this.handleAuditOkayClick = this.handleAuditOkayClick.bind(this);

    this.reactTableColumns = this.reactTableColumns.bind(this);


    this.viewOnly = _.find(this.props.privileges, { permission: "View Business Rules Repository" }) ? true : false;
    this.writeOnly = _.find(this.props.privileges, { permission: "Edit Business Rules Repository" }) ? true : false;
    this.tenantWriteOnly = this.props.tenantWriteOnly;
  }

  componentWillMount(){
    if(!this.viewOnly && !this.writeOnly){
      // TODO
      // Do nothing, just throw 403 error
      // console.log("privileges.......",this.props.privileges)
    }
    else if(this.flagRuleDrillDown){
      console.log("Inside componentWillMount of MaintainBusinessRules",this.ruleFilterParam);
      // this.props.fetchDrillDownRulesReport(this.ruleFilterParam.rules,this.ruleFilterParam.source_id,this.ruleFilterParam.page);
      this.props.fetchBusinesRules(this.state.sourceId)
    } else if(this.tenantRenderType) {
      // TODO
      // Render only the grid of the subscribe country for tenant.
      this.props.fetchBusinesRules(this.state.sourceId)
    } else {
      this.props.fetchCountries(this.state.sourceId);
    }
  }

  componentWillReceiveProps(nextProps){
    if (this.gridData != nextProps.gridBusinessRulesData){
      this.gridData=nextProps.gridBusinessRulesData;
      this.currentPage = undefined;
      this.setState({loading: false});
    }

    this.changeHistory=nextProps.change_history;
    this.reportLinkage=nextProps.report_linkage;
    this.tenantCopyResult=nextProps.tenantCopyResult;
    //console.log("Inside componentWillReceiveProps of ViewDataComponentV2",this.isNextPropRun);
    //this.flagDataDrillDown = false;
    if(nextProps.flagRuleDrillDown && this.ruleFilterParam.cell_calc_ref != nextProps.ruleFilterParam.cell_calc_ref ){
      console.log("Inside componentWillReceiveProps of MaintainBusinessRules",this.ruleFilterParam);
      this.flagRuleDrillDown = nextProps.flagRuleDrillDown;
      this.ruleFilterParam = nextProps.ruleFilterParam;
      // this.props.fetchDrillDownRulesReport(this.ruleFilterParam.rules,this.ruleFilterParam.source_id,this.ruleFilterParam.page);
      this.props.fetchBusinesRules(this.state.sourceId)
    }
    if(this.props.leftmenu){
     this.setState({
       display: false
     });
   }
  }

  componentDidUpdate(){
    console.log("componentDidUpdate");
    this.props.leftMenuClick(false);
  }

  handleCountryClick(item) {
    console.log("selected item",item);
    this.currentPage = undefined;
    this.selectedViewColumns=[];
    this.gridData=undefined;
    this.selectedItems =[];
    this.setState({
        display: "showBusinessRuleGrid",
        sourceId: item.country,
        sourceFileName: item.country_name,
        sourceDescription: item.country_information,
        tableName: 'business_rules_master',
        rowIndex: []
     },
      this.props.fetchBusinesRules(item.country)
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
      case "Copy Rule":
        return !this.tenantWriteOnly;
      default:
        console.log("No specific checkDisabled has been defined for ",item);
    }

  }

  handleToggle(event) {
    let toggleValue = this.state.display == "showToggleColumns";
    if (!toggleValue) {
      this.currentPage = this.state.page;
      this.setState({ display: "showToggleColumns" });
    }
    else {
      this.setState({ display: "showBusinessRuleGrid" });
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
    this.setState({ display: "showBusinessRuleGrid" });
  }

  reactTableColumns(){
    let columns = this.selectedViewColumns.length ? this.selectedViewColumns : this.gridData.cols;
    let reactTableViewColumns=[];
    if (columns){
      columns.map(item =>{
        reactTableViewColumns.push({Header: item.toString().replace(/_/g,' '), accessor: item})
      })
    }
    return reactTableViewColumns;
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
      case "Copy Rule":
        this.handleCopyIntoTenantClick(event);
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
        // this.selectedItems = this.flatGrid.deSelectAll();
        this.setState({itemEditable:true, rowIndex: []});
        this.selectedItems=[]
        break;
      case "Columns":
        this.handleToggle(event);
        break;
      case "Export":
        this.handleExportCSV(event);
        break;
      default:
        console.log("No specific action has been defined for ",itemClicked);
    }

  }

  handleRefreshGrid(event){
    //this.selectedItems = this.flatGrid.deSelectAll();
    this.currentPage = this.state.page;
    this.setState({itemEditable:true,
                  rowIndex: [],
                  loading: true},
                  ()=>{
                    this.selectedItems=[]
                    this.fetchDataToGrid(event);
                  }
    );

  }

  fetchDataToGrid(event){
    let fetchPage=0;
    if(this.flagRuleDrillDown){
      // this.props.fetchDrillDownRulesReport(this.ruleFilterParam.rules,this.ruleFilterParam.source_id,fetchPage);
      this.props.fetchBusinesRules(this.state.sourceId);
    } else if(this.tenantRenderType) {
      // TODO
      // Render only the grid of the subscribe country for tenant.
      this.props.fetchBusinesRules(this.state.sourceId)
    } else {
      this.props.fetchBusinesRules(this.state.sourceId);
    }
  }

  handleAdd(event,requestType){

    let isOpen = this.state.display === "showAddForm";
    if(isOpen) {
      this.currentPage = this.state.page;
      this.setState({
        display: "showBusinessRuleGrid",
        itemEditable: true,
        rowIndex: [],
        loading: true,
        },
        ()=>{
              if(this.selectedItems){
                // this.selectedItems = this.flatGrid.deSelectAll();
                this.selectedItems=[]
              }
              this.handleRefreshGrid();
            }
      )
    } else {
        if( requestType != "add" && this.selectedItems.length != 1){
          this.modalAlert.isDiscardToBeShown = false;
          this.modalAlert.open("Please select " + (this.selectedItems.length ? "only one " : " a " ) + " record");
        } else {
          let itemEditable = true;
          if ( requestType == "add") {
            // this.selectedItems = this.flatGrid.deSelectAll();
            // this.setState({itemEditable:true, rowIndex: null});
            this.selectedItems=[]
            this.form_data = {
                      country:this.state.sourceId,
                      business_rule: null,
                      rule_description: null,
                      last_updated_by: null,
                      audit_comment: null
                    };
          } else {
            if(this.selectedItems.length==0){
                this.modalAlert.isDiscardToBeShown = false;
                this.modalAlert.open("Please select a row");
                return;
            }else{
              this.form_data = this.selectedItems[0];
              this.form_data.audit_comment = null;
              if (requestType=="copy"){
                itemEditable = true;
                this.form_data.id=null;
              }else {
                itemEditable = (this.form_data.dml_allowed == "Y");
              }
            }
          }
          this.requestType = requestType;
          this.setState({
              display: "showAddForm",
              itemEditable: itemEditable,
            });
        }
    }
  }


  handleSelectRow(indexOfGrid){
    console.log("Inside Single select....",this.selectedItems.length);
    // if(this.selectedItems.length == 1){
    //   this.selectedIndexOfGrid = indexOfGrid;
    //   this.setState({itemEditable : (this.selectedItems[0].dml_allowed == "Y")});
    //   console.log("Inside Single select ", indexOfGrid);
    // }

  }


  handleUpdateRow(row){
    this.operationName = "UPDATE";
    this.updateInfo = row;
    this.setState({ showAuditModal: true });
  }

  handleReportLinkClick(event) {
    let isOpen = this.state.display === "showReportLinkage";
    this.reportLinkage=undefined;
    if(isOpen) {
      this.currentPage = this.state.page;
      this.setState({ display: "showBusinessRuleGrid" });
      this.selectedKeys = '';
    } else {
      if(this.selectedItems.length < 1){
        this.modalAlert.isDiscardToBeShown = false;
        this.modalAlert.open("Please select atleast one record");
      } else {
        let selectedKeys='';
        console.log("Inside handleReportLinkClick .. items", this.selectedItems);
        this.selectedItems.map((item,index)=>{
          selectedKeys += (selectedKeys ? ',' + item.business_rule : item.business_rule)
        })
        this.selectedKeys = selectedKeys;
        this.props.fetchReportLinkage(this.state.sourceId,selectedKeys);
        //console.log("Repot Linkage",this.props.report_linkage);
        this.setState({ display: "showReportLinkage" });
      }
    }
    // this.selectedItems = this.flatGrid.deSelectAll();

  }

  handleTenantCopyResultClick(event) {
    let isOpen = this.state.display === "showTenantCopyResult";
    this.tenantCopyResult=undefined;
    if(isOpen) {
      this.currentPage = this.state.page;
      this.setState({ display: "showBusinessRuleGrid" });
    } else {
        this.setState({ display: "showTenantCopyResult" });
    }

  }

  handleHistoryClick(event) {
    let isOpen = this.state.display === "showHistory";
    this.changeHistory=undefined;
    if(isOpen) {
      this.currentPage = this.state.page;
      this.setState({ display: "showBusinessRuleGrid" });
      this.selectedKeys = '';
    } else {
      let selectedKeys='';
      this.selectedItems.map((item,index)=>{
        selectedKeys += (selectedKeys ? ',' + item.id : item.id)
      })
      this.selectedKeys = selectedKeys ? selectedKeys : "undefined";
      this.props.fetchAuditList(this.selectedKeys,"business_rules_master",this.state.sourceId);
      console.log("Repot Linkage",this.props.change_history);
      this.setState({ display: "showHistory" });
    }
    // this.selectedItems = this.flatGrid.deSelectAll();
  }

  handleExportCSV(event) {
    let business_ref = "_source_" + this.state.sourceId + "_";
    this.props.exportCSV(this.state.sourceId);
  }

  handleFullSelect(items){
    console.log("Selected Items ", items);

    // this.selectedItems = items;
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
      this.handleAdd(event,"copy");
      // this.modalAlert.open(`Are you sure to create a copy of this record (ID: ${this.selectedItems[0]['id']}) ?`)
    }
  }

  handleCopyIntoTenantClick(event){
    // if(!this.tenantSource){
    //   this.modalAlert.isDiscardToBeShown = false;
    //   this.modalAlert.open("Unable to copy rules. Invalid or no destination table provided!");
    // }
    // else
    if(this.selectedItems.length == 0){
      this.modalAlert.isDiscardToBeShown = true;
      this.operationName = "INSERTTENANT";
      this.modalAlert.open(
            <div>
              Do you really want to copy <strong className="red">All Rules</strong> into source : {this.tenantSource ? this.tenantSource.sourceFileName : ''}?
            </div>)
    } else {
      this.modalAlert.isDiscardToBeShown = true;
      this.operationName = "INSERTTENANT";
      this.modalAlert.open(
            <div>
              Do you want to copy following rules into source : {this.tenantSource ? this.tenantSource.sourceFileName : ''}?
              <table className="table table-hover">
                <thead>
                  <th>In Use</th>
                  <th>Rule Tag</th>
                  <th>Rule Description</th>
                </thead>
                <tbody>
                  {
                    this.selectedItems.map((item,index)=>{
                      return(
                        <tr>
                          <td><i className={"fa fa-circle "+ (item.in_use=="Y" ? " green" : " amber")}></i></td>
                          <td>{item.business_rule}</td>
                          <td><span className="truncate-text">{item.rule_description}</span></td>
                        </tr>)
                    })
                  }
                </tbody>
              </table>
            </div>)
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
    if( this.operationName=="INSERTTENANT" ||
        (this.selectedItems.length==1 && (this.operationName=='DELETE'||this.operationName=='INSERT'))
      ){
      this.setState({showAuditModal:true},
          ()=>{console.log("showAuditModal",this.state.showAuditModal);});
    }
  }

  handleAuditOkayClick(auditInfo){
    let data={};

    if (this.operationName=='DELETE'){
      data["change_type"]=this.operationName;
      data["table_name"]="business_rules_master";
      this.auditInfo={
        table_name:data["table_name"],
        change_type:this.operationName,
        change_reference:`Delete of Repository Rule: ${this.selectedItems[0]['business_rule']} of country: ${this.state.sourceId}`,
        maker:this.props.login_details.user,
        maker_tenant_id: this.props.login_details.domainInfo.tenant_id,
        group_id: this.groupId,
      };
      Object.assign(this.auditInfo,auditInfo);
      data["audit_info"]=this.auditInfo;
      data["update_info"]=this.selectedItems[0];

      this.props.deleteBusinessRule(data);
      // this.setState({showAuditModal:false});
    }

    if(this.operationName=="INSERTTENANT"){
      if (this.selectedItems.length==0){
        data["rules"]=this.gridData.rows;
      } else {
        data["rules"]=this.selectedItems;
      }

      data["audit_info"]={"audit_comment": auditInfo.comment,
                          "maker": this.props.user,
                          "maker_tenant_id": this.props.tenant_id,
                          "group_id": this.groupId
                        };
      // console.log("INSERTTENANT data...", data);
      this.props.copyBusinessRuleToTenant(data,this.tenantSource.sourceId)
    }

   this.setState({showAuditModal:false},
                  this.handleTenantCopyResultClick()
                );
  this.operationName=null;

  }

  renderTitle(displayOption, flagRuleDrillDown) {
      let content = [];
      if (flagRuleDrillDown) {
          content.push(
              <h2>Drilldown Cell Rules <small>{' for Cell '}</small>
                <small><i className="fa fa-tag"></i></small>
                <small>{' ' + this.ruleFilterParam.cell_id}</small>
                <small>Calculation Ref</small>
                <small><i className="fa fa-cube"></i></small>
                <small>{ this.ruleFilterParam.cell_calc_ref }</small>
              </h2>
          );
      } else {
          if (displayOption) {
              content.push(
                  <h2>View Business Rules Repository <small>{' Rules for '}</small>
                    <small>{this.state.sourceId + ' '}</small>
                    <small><i className="fa fa-bank"></i></small>
                    <small title={this.state.sourceDescription}>{ this.state.sourceFileName}</small>
                    <small>{' '}<i className="fa blue fa-tags" title={this.state.sourceDescription}></i></small>
                  </h2>
              );
          } else {
              content.push(
                  <h2>View Business Rules Repository <small>Available Sources</small></h2>
              );
          }
          // Only show dropdown menu to select different sources if its not a tenant environment
          if (this.tenantRenderType){
              content.push(
                  <div className="row">
                    <ul className="nav navbar-right panel_toolbox">
                      <li>
                        <a className="close-link" onClick={this.props.handleCancel}><i className="fa fa-close"></i></a>
                      </li>
                    </ul>
                  </div>
                );
          } else {
              content.push(
                  <div className="row">
                    <ul className="nav navbar-right panel_toolbox">
                      <li>
                        <a className="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                          <i className="fa fa-rss"></i><small>{' Rule Reporsitory '}</small>
                          <i className="fa fa-caret-down"></i>
                        </a>
                        <ul className="dropdown-menu dropdown-usermenu pull-right" style={{ "zIndex": 9999 }}>
                          <li>
                            <Link to="/dashboard/maintain-business-rules-repo"
                              onClick={()=>{ this.setState({ display: false }) }}>
                                <i className="fa fa-bars"></i>{' All Sources'}
                            </Link>
                          </li>
                          <li>
                            <a href="#"></a>
                            <CountryList
                              dataCatalog={this.props.dataCatalog}
                              navMenu={true}
                              handleCountryClick={this.handleCountryClick}
                              />
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
              );
          }

      }
      return content;
  }

  renderDynamic(displayOption) {
      switch(displayOption) {
          case "showBusinessRuleGrid":
              if (this.gridData) {
                  return(
                      <div>
                        <RegOpzFlatGridActionButtons
                          editable={this.writeOnly}
                          buttonClicked={this.actionButtonClicked}
                          checkDisabled={this.checkDisabled}
                          buttons={this.buttons}
                          dataNavigation={false}
                          pageNo={0}
                          buttonClassOverride={this.buttonClassOverride}
                          />
                        <ReactTable
                          data={this.gridData.rows}
                          filterable={true}
                          className="-highlight -striped"
                          columns={this.reactTableColumns()}
                          loading={this.state.loading}
                          page={this.currentPage}
                          pageSize={this.currentPage || this.currentPage ==0 ? this.state.pageSize : undefined}
                          style={{
                              height: ( this.state.pageSize >= 20 ? "74vh" : "100%")
                          }}
                          defaultFiltered={
                            this.ruleFilterParam ? [this.ruleFilterParam] : []
                          }
                          defaultFilterMethod = {(filter, row, column) => {
                            const id = filter.pivotId || filter.id
                            let matchText = RegExp(`(${filter.value.toString().toLowerCase().replace(/[,+&\:\ ]$/,'').replace(/[,+&\:\ ]/g,'|')})`,'i');
                            return row[id] !== undefined ? String(row[id]).match(matchText) : true
                          }}
                          onFetchData={(state,instance)=>{
                                          console.log("Inside onFetchData ...",state.page, state.pageSize, this.currentPage);
                                          this.currentPage = undefined;
                                          this.setState({page: state.page,
                                                         pageSize:  state.pageSize,
                                                         filtered: state.filtered,
                                                       });
                                          console.log("Post onFetchData ...",state.page, state.pageSize, this.currentPage);
                                        }
                                      }
                          getTrProps={(state, rowInfo, column) => {
                                        let isSelected = rowInfo && this.state.rowIndex.length != 0 && this.state.rowIndex.includes(rowInfo.original.id)
                                        return {
                                            style : {
                                                background: isSelected  ? '#009688' : '',
                                                color: isSelected  ? '#ECF0F1' : '',
                                              }
                                        }
                                      }}
                          getTdProps={(state, rowInfo, column, instance) => {
                                        return {
                                          onClick: (e, handleOriginal) => {
                                            // console.log('A Td Element was clicked!')
                                            // console.log('it produced this event:', e, e.ctrlKey)
                                            // console.log('It was in this column:', column)
                                            // console.log('It was in this row:', rowInfo, this.selectedItems.length,this.state.rowIndex)
                                            // console.log('It was in this table instance:', instance)
                                            if (e.ctrlKey){
                                              let {rowIndex} = {...this.state};
                                              let rowId = rowInfo.original.id;
                                              const idIndex = rowIndex.indexOf(rowId);
                                              if(idIndex==-1){
                                                rowIndex.push(rowId)
                                                this.selectedItems.push(rowInfo.original);
                                              } else {
                                                rowIndex.splice(idIndex,1);
                                                this.selectedItems = _.filter(this.selectedItems,function(item){return item.id!=rowId});
                                              }
                                              this.setState({rowIndex: rowIndex})
                                            }
                                            else{
                                              this.selectedItems = [rowInfo.original];
                                              this.setState({rowIndex:[rowInfo.original.id],
                                                            itemEditable : (this.selectedItems[0].dml_allowed == "Y")})
                                            }
                                            // console.log('No of selectedItems row:', this.selectedItems)


                                            // IMPORTANT! React-Table uses onClick internally to trigger
                                            // events like expanding SubComponents and pivots.
                                            // By default a custom 'onClick' handler will override this functionality.
                                            // If you want to fire the original onClick handler, call the
                                            // 'handleOriginal' function.
                                            if (handleOriginal) {
                                              handleOriginal()
                                            }
                                          }
                                        }
                                      }}

                        />

                      </div>
                  );
              }
              return(
                  <div>
                    <h4>Loading ....</h4>
                  </div>
              );
          case "showToggleColumns":
              if (this.props.gridBusinessRulesData) {
                  return(
                      <ShowToggleColumns
                        columns={this.props.gridBusinessRulesData.cols}
                        saveSelection={this.displaySelectedColumns}
                        selectedViewColumns={this.selectedViewColumns}
                        handleClose={this.handleToggle}
                      />
                  );
              }
              break;
          case "showAddForm":
              if (this.props.gridBusinessRulesData) {
                  return(
                      <AddBusinessRuleRepository
                        businessRule={this.form_data}
                        handleCancel={this.handleAdd}
                        handleClose={this.handleAdd}
                        editable={ this.writeOnly && this.state.itemEditable }
                        groupId={ this.groupId }
                        />
                  );
              }
              break;
          case "showReportLinkage":
              return(
                  <RuleReportLinkage
                    data={ this.reportLinkage }
                    ruleReference={ this.selectedKeys }
                    handleClose={this.handleReportLinkClick}
                    />
              );
              break;
          case "showHistory":
              return(
                  <DefAuditHistory
                    data={ this.changeHistory }
                    historyReference={ this.selectedKeys != "undefined" ? "for keys: " + this.selectedKeys : "for All" }
                    handleClose={this.handleHistoryClick}
                    />
              );
              break;
          case "showTenantCopyResult":
              return(
                <RuleCopyIntoTenantReport
                  data={ this.tenantCopyResult }
                  handleClose={this.handleTenantCopyResultClick}
                  />
              );
              break;
          default:
            return(
                <CountryList
                  dataCatalog={this.props.dataCatalog}
                  navMenu={false}
                  handleCountryClick={this.handleCountryClick}
                  />
            );
      }
  }

  render(){
    console.log("Displaying:", this.state.display);
    if(!this.viewOnly && !this.writeOnly){
      return(
        <div>
          <div className="row form-container">
            <div className="x_panel">
              <div className="x_title">
                {
                  this.renderTitle(this.state.display, this.flagRuleDrillDown)
                }
                <div className="clearfix"></div>
              </div>
              <div className="x_content">
                <AccessDenied
                        component={"Maintain Business Rules Repository"}/>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (typeof this.props.dataCatalog != 'undefined' || this.flagRuleDrillDown || this.tenantRenderType) {
        if (typeof this.props.gridBusinessRulesData != 'undefined' ){
          this.pages = Math.ceil(this.props.gridBusinessRulesData.count / 100);
        }
        return(
          <div>
            <div className="row form-container">
              <div className="x_panel">
                <div className="x_title">
                  {
                    this.renderTitle(this.state.display, this.flagRuleDrillDown)
                  }
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
    fetchCountries:(country) => {
      dispatch(actionFetchCountries(country));
    },
    fetchBusinesRules: (country) => {
      dispatch(actionFetchBusinessRules(country))
    },
    copyBusinessRuleToTenant: (data,tenantSourceId) => {
      dispatch(actionCopyBusinessRuleToTenant(data,tenantSourceId))
    },
    fetchDrillDownRulesReport:(rules,source_id,page)=>{
      dispatch(actionFetchDrillDownRulesReport(rules,source_id,page))
    },
    deleteBusinessRule: (item) => {
      dispatch(actionDeleteBusinessRule(item))
    },
    fetchReportLinkage: (sourceId,selectedKeys) => {
      dispatch(actionFetchReportLinkage(sourceId,selectedKeys))
    },
    fetchAuditList: (idList, tableName, sourceId) => {
      dispatch(actionFetchAuditList(idList, tableName,sourceId));
    },
    exportCSV:(sourceId) => {
      dispatch(actionExportCSV(sourceId));
    },
    leftMenuClick:(isLeftMenu) => {
      dispatch(actionLeftMenuClick(isLeftMenu));
    },
  }
}

function mapStateToProps(state){
  console.log("On mapState ", state,state.view_data_store);
  return {
    //data_date_heads:state.view_data_store.dates,
    dataCatalog: state.sharedData.countries,
    gridBusinessRulesData: state.business_rules_repo.gridBusinessRulesData,
    tenantCopyResult: state.business_rules_repo.message,
    report_linkage:state.report_linkage,
    change_history:state.def_change_store.audit_list,
    login_details:state.login_store,
    leftmenu: state.leftmenu_store.leftmenuclick,
  }
}

const VisibleMaintainBusinessRulesRepository = connect(
  mapStateToProps,
  mapDispatchToProps
)(MaintainBusinessRulesRepository);

export default VisibleMaintainBusinessRulesRepository;
