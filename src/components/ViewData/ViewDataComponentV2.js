import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import { Link } from 'react-router';
import _ from 'lodash';
import ReactTable from 'react-table';
import {
  //actionFetchDates,
  actionFetchSource,
  actionFetchReportFromDate,
  actionFetchDrillDownReport,
  actionInsertSourceData,
  actionUpdateSourceData,
  actionDeleteFromSourceData,
  actionFetchReportLinkage,
  actionFetchDataChangeHistory,
  actionExportCSV,
  actionApplyRules,
} from '../../actions/ViewDataAction';
import {
  actionLeftMenuClick,
} from '../../actions/LeftMenuAction';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import RegOpzFlatGrid from '../RegOpzFlatGrid/RegOpzFlatGrid';
import RegOpzFlatGridActionButtons from '../RegOpzFlatGrid/RegOpzFlatGridActionButtons';
import AddData from './AddData';
import DataCatalogList from './DataCatalogList';
import AuditModal from '../AuditModal/AuditModal';
import ModalAlert from '../ModalAlert/ModalAlert';
import ShowToggleColumns from '../RegOpzFlatGrid/ShowToggleColumns';
import DataReportLinkage from './DataReportLinkage';
import DefAuditHistory from '../AuditModal/DefAuditHistory';
require('react-datepicker/dist/react-datepicker.css');
require('./ViewDataComponentStyle.css');
require('react-table/react-table.css');

class ViewDataComponentV2 extends Component {
  constructor(props){
    super(props)
    this.state = {
      startDate: moment().subtract(1,'months').format("YYYYMMDD"),
      endDate: moment().format('YYYYMMDD'),
      sources: null,
      display: (this.props.showDataGrid ? "showDataGrid" : false),
      itemEditable: true,
      sourceId: null,
      sourceFileName: null,
      sourceDescription: null,
      businessDate: null,
      showAuditModal: false,
      // state variables for react-table
      rowIndex: [],
      currentPage: 0,
      pages: 0,
      pageSize: 20,
      manual: false,
      loading: true,
      page: 0,
      offsetPage:0,
      isFetched: true,
      sorted: [],
      filtered: [],
      filteredData: [],
    }

    this.dataFilterParam=this.props.dataFilterParam;
    this.flagDataDrillDown=this.props.flagDataDrillDown ? this.props.flagDataDrillDown : false;

    this.useDataGridPageHandler=true;
    this.dataSource = null;
    this.dataGrid=undefined;
    this.reportLinkage=undefined;
    this.changeHistory=undefined;
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
    this.groupId = this.props.user + "DS" + moment.utc();


    this.handleDataFileClick = this.handleDataFileClick.bind(this);
    this.handleDateFilter = this.handleDateFilter.bind(this);
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

    this.reactTableColumns = this.reactTableColumns.bind(this);
    this.recatTablePages = this.recatTablePages.bind(this);
    this.reactTableData = this.reactTableData.bind(this);


    this.viewOnly = _.find(this.props.privileges, { permission: "View Data" }) ? true : false;
    this.writeOnly = _.find(this.props.privileges, { permission: "Edit Data" }) ? true : false;
  }

  componentWillMount(){
    //this.props.fetchDates(this.state.startDate ? moment(this.state.startDate).format('YYYYMMDD') : "19000101",this.state.endDate ? moment(this.state.endDate).format('YYYYMMDD') : "30200101", 'data_catalog');
    if(this.flagDataDrillDown){
      console.log("Inside componentWillMount of ViewDataComponentV2");
      this.props.fetchDrillDownReport(this.dataFilterParam);
    } else {
      this.props.fetchSource(moment(this.state.startDate).format('YYYYMMDD') ,moment(this.state.endDate).format('YYYYMMDD') , 'Data');
    }
  }

  componentWillReceiveProps(nextProps){
    if(this.gridData != nextProps.gridData){
      console.log("nextProps gridData ...",this.gridData, nextProps.gridData,this.state);
      this.gridData=nextProps.gridData;
      this.setState({isFetched: true})
    }
    this.reportLinkage=nextProps.report_linkage;
    this.changeHistory=nextProps.change_history;
    //this.flagDataDrillDown = false;
    if(nextProps.flagDataDrillDown && this.dataFilterParam.params.drill_kwargs.cell_calc_ref != nextProps.dataFilterParam.params.drill_kwargs.cell_calc_ref ){
      console.log("Inside componentWillReceiveProps of ViewDataComponentV2",nextProps.dataFilterParam.params.drill_kwargs.cell_calc_ref);
      this.flagDataDrillDown = nextProps.flagDataDrillDown;
      this.dataFilterParam=nextProps.dataFilterParam;
      this.props.fetchDrillDownReport(this.dataFilterParam);
    }
    if(this.props.leftmenu){
      this.setState({
        display: false
      });
    }
  }

  componentDidUpdate(){
    console.log("Dates",this.state.startDate)
    this.isNextPropRun = !this.isNextPropRun;
    this.props.leftMenuClick(false);
  }

  handleDataFileClick(item) {
    console.log("selected item",item);
    this.useDataGridPageHandler = true;
    this.selectedViewColumns=[];
    this.gridData=undefined;
    this.setState({
        display: "showDataGrid",
        sourceId: item.source_id,
        businessDate: item.business_date,
        sourceFileName: item.data_file_name,
        sourceDescription: item.source_description,
        rowIndex: []
     },
      this.props.fetchReportFromDate(item.source_id,item.business_date,this.state.currentPage)
    );
  }

  handleDateFilter(dates) {
    this.setState({
      startDate: dates.startDate,
      endDate: dates.endDate
    },
      //since setState is asynchronus this gurantees that fetch is executed after setState is executed
      ()=>{this.props.fetchSource(this.state.startDate,this.state.endDate,"Data")}
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

  handleToggle(event) {
    let toggleValue = this.state.display === "showToggleColumns";
    if (!toggleValue) {
      this.useDataGridPageHandler=false;
      this.setState({ display: "showToggleColumns" });
    }
    else {
      this.setState({ display: "showDataGrid" });
    }
  }

  displaySelectedColumns(columns) {
    var selectedColumns = [];
    this.useDataGridPageHandler=false;
    for (let i = 0; i < columns.length; i++)
      if (columns[i].checked)
        selectedColumns.push(columns[i].name);

    this.selectedViewColumns = selectedColumns;
    //console.log(selectedColumns);
    //console.log(this.selectedViewColumns);
    this.setState({ display: "showDataGrid" });
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

  recatTablePages(state){
    console.log("Inside reactTablePages ....", state,state.page,this.state.pageSize,this.state.pages,this.state.currentPage);
    let pageSize = state.pageSize;
    let offsetPageFactor = 100 / pageSize;
    let offsetPage = (pageSize < 100) ? (state.page%offsetPageFactor): 0;
    let fetchedFirstRow = (this.state.currentPage) * 100 + 1;
    let fetchedLastRow = (this.state.currentPage + 1) * 100;
    let pageStartRow = state.page * pageSize + 1;
    // let isFetched = (fetchedFirstRow <= pageStartRow <= fetchedLastRow);
    // let manual = false;
    let currentPage = this.state.currentPage;
    if ((fetchedFirstRow > pageStartRow) || (fetchedLastRow < pageStartRow) ){
      currentPage = Math.ceil(pageStartRow / 100) - 1;
    }
    let isFetched = (this.state.currentPage==currentPage);
    // Chnage the page handler back to RecatTable default page handler through manual = true
    this.useDataGridPageHandler = true;

    let pages = Math.ceil(this.props.gridData.count / pageSize);
    this.setState({currentPage: currentPage,
                    pages: pages, pageSize: pageSize, page: state.page,
                    offsetPage: offsetPage, isFetched: isFetched,
                    sorted: state.sorted, filtered: state.filtered,
                  },
                  ()=>{
                    console.log("Inside setState reactTablePages ....", this.state.page,this.state.pageSize,this.state.pages,this.state.currentPage, fetchedFirstRow, fetchedLastRow, pageStartRow, isFetched,offsetPage);
                    if (!isFetched){
                      console.log("Inside isFetched reactTablePages ....", this.gridData);
                      this.fetchDataToGrid();
                    }

                  });
  }

  reactTableData(){
      let sliceStart=0;
      let sliceEnd=19;
      if (this.state.page==this.state.pages){
        sliceStart = this.state.offsetPage*this.state.pageSize;
        sliceEnd = this.props.gridData.count - 100*this.state.currentPage;
      } else {
        sliceStart = this.state.offsetPage*this.state.pageSize;
        sliceEnd = (this.state.offsetPage+1)*this.state.pageSize;
      }



      const {filtered, sorted} = {...this.state};
      let pageData = this.gridData.rows.slice(sliceStart,sliceEnd);

      return pageData
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
    this.setState({itemEditable:true, rowIndex: [], isFetched: false});
    this.selectedItems=[]
    this.fetchDataToGrid(event);
  }

  handlePageNavigation(event, pageNo) {
    console.log("Inside handlePageNavigation",this.state.currentPage,pageNo);
    this.fetchDataToGrid(event);
  }

  fetchDataToGrid(event){
    if(this.flagDataDrillDown){
      this.dataFilterParam.params.drill_kwargs.page = this.state.currentPage;
      this.props.fetchDrillDownReport(this.dataFilterParam);
    } else {
      this.props.fetchReportFromDate(this.state.sourceId,this.state.businessDate,this.state.currentPage);
      console.log("this.props.fetchReportFromDate gridData ...", this.props.gridData);
    }
  }

  handleAdd(event,requestType){

    let isOpen = this.state.display === "showAddForm";
    if(isOpen) {
      this.useDataGridPageHandler=false;
      this.setState({ display: "showDataGrid", rowIndex: [] },
        ()=>{
              if(this.selectedItems){
                // this.selectedItems = this.flatGrid.deSelectAll();
                this.selectedItems=[]
                this.handleRefreshGrid();
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
            // this.selectedItems = this.flatGrid.deSelectAll();
            this.selectedItems=[]
          } else {
            if(this.selectedItems.length==0){
                this.modalAlert.isDiscardToBeShown = false;
                this.modalAlert.open("Please select a row");
                return;
            }else{
              this.form_data = this.selectedItems[0];
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
      this.selectedItems = [];
      this.useDataGridPageHandler=false;
      this.setState({ display: "showDataGrid", rowIndex: [] });
    } else {
      if(this.selectedItems.length < 1){
        this.modalAlert.isDiscardToBeShown = false;
        this.modalAlert.open("Please select atleast one record");
      } else {
        let selectedKeys='';
        let source_id = 0 ;
        if (this.dataFilterParam){
          source_id = this.dataFilterParam.params.drill_kwargs.source_id;
          console.log("Inside true");
        } else {
          source_id = this.state.sourceId;
        }
        this.selectedItems.map((item,index)=>{
          console.log("Inthe iterator loop for selectedItems", source_id);
          selectedKeys += (selectedKeys!='' ? ',(' + source_id + ',' + item.id + ',' + item.business_date + ')' : '(' + source_id + ',' + item.id + ',' + item.business_date + ')')
        })
        //console.log("Repot Linkage",this.props.report_linkage);
        // this.selectedItems = this.flatGrid.deSelectAll();
        this.setState({ display: "showReportLinkage" },
              this.props.fetchReportLinkage(this.state.sourceId,selectedKeys,this.state.businessDate)
          );
      }
    }
  }

  handleHistoryClick(event) {
    let isOpen = this.state.display === "showHistory";
    this.changeHistory=undefined;
    if(isOpen) {
      this.selectedItems = [];
      this.useDataGridPageHandler=false;
      this.setState({ display: "showDataGrid", rowIndex: [] });
    } else {
      let selectedKeys='';
      this.selectedItems.map((item,index)=>{
        selectedKeys += (selectedKeys!='' ? ',(' + item.id + ',' + item.business_date + ')': '(' + item.id + ',' + item.business_date + ')')
      })
      console.log("Repot Linkage",this.props.change_history);
      // this.selectedItems = this.flatGrid.deSelectAll();
      this.setState({ display: "showHistory"},
            ()=>{
              if (selectedKeys){
                this.props.fetchDataChangeHistory(this.props.gridData.table_name,selectedKeys);
              } else if (this.state.businessDate){
                this.props.fetchDataChangeHistory(this.props.gridData.table_name,null,this.state.businessDate);
              } else {
                // this is in the drilldown stage where we would like to see only the history of the related records.
                selectedKeys = this.props.gridData.sql.replace("a.*"," a.id,a.business_date ");
                this.props.fetchDataChangeHistory(this.props.gridData.table_name,encodeURI(selectedKeys));
              }
            }
        );
    }
  }

  handleExportCSV(event) {
    let business_ref = "_source_" + this.state.sourceId + "_COB_" + this.state.businessDate + "_";
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
      this.handleAdd(event,"copy");
      // this.modalAlert.open(`Are you sure to create a copy of this record (ID: ${this.selectedItems[0]['id']}) ?`)
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
        change_reference:`Duplicate of Data: ${this.selectedItems[0]["id"]} of Source: ${this.state.sourceId} - ${data["table_name"]} Business Date: ${moment(this.state.businessDate).format('DD-MMM-YYYY')}`,
        maker:this.props.login_details.user,
        maker_tenant_id: this.props.login_details.domainInfo.tenant_id,
        business_date:this.state.businessDate,
        group_id: this.groupId,
      };
      Object.assign(this.auditInfo,auditInfo);
      data["audit_info"]=this.auditInfo;
      data["update_info"]={...this.selectedItems[0]};
      data["business_date"]=this.state.businessDate;
      data.update_info.id = null;
      this.props.insertSourceData(data,this.selectedIndexOfGrid + 1);
      // this.setState({showAuditModal:false});

    }

    if (this.operationName=='DELETE'){
      this.auditInfo={
        table_name:data["table_name"],
        change_type:this.operationName,
        change_reference:`Delete of Data: ${this.selectedItems[0]['id']} of Source: ${this.state.sourceId} - ${data["table_name"]} Business Date: ${moment(this.state.businessDate).format('DD-MMM-YYYY')}`,
        maker:this.props.login_details.user,
        maker_tenant_id: this.props.login_details.domainInfo.tenant_id,
        business_date:this.state.businessDate,
        group_id: this.groupId
      };
      Object.assign(this.auditInfo,auditInfo);
      data["audit_info"]=this.auditInfo;
      data["update_info"]=this.selectedItems[0];
      data["business_date"]=this.state.businessDate;

      this.props.deleteFromSourceData(this.selectedItems[0]['id'],data, this.selectedIndexOfGrid);
      // this.setState({showAuditModal:false});
    }

   if(this.operationName=='UPDATE'){

     this.auditInfo={
       table_name:data["table_name"],
       change_type:this.operationName,
       change_reference:`Update of Data: ${this.updateInfo['id']} of Source: ${this.state.sourceId} - ${data["table_name"]} Business Date: ${moment(this.state.businessDate).format('DD-MMM-YYYY')}`,
       maker:this.props.login_details.user,
       maker_tenant_id: this.props.login_details.domainInfo.tenant_id,
       business_date:this.state.businessDate,
       group_id: this.groupId,
     };
     Object.assign(this.auditInfo,auditInfo);
     data["audit_info"]=this.auditInfo;
     data["update_info"]=this.updateInfo;
     data["business_date"]=this.state.businessDate;
     this.props.updateSourceData(data);
    //  this.setState({showAuditModal:false});

   }

   this.setState({showAuditModal:false},
     ()=>{this.handleRefreshGrid(event);}
     );

  }

  renderDynamic(displayOption) {
      switch (displayOption) {
          case "showDataGrid":
              console.log("showDataGrid outside gridData check ...", this.gridData);
              if (this.gridData) {
                  console.log("Inside gridData check ...", typeof this.gridData);
                  return(
                      <div>
                          <RegOpzFlatGridActionButtons
                            editable={this.writeOnly}
                            buttonClicked={this.actionButtonClicked}
                            checkDisabled={this.checkDisabled}
                            buttons={this.buttons}
                            dataNavigation={false}
                            pageNo={this.state.currentPage}
                            buttonClassOverride={this.buttonClassOverride}
                            />
                            <ReactTable
                              data={this.reactTableData()}
                              filterable={false}
                              sortable={false}
                              className="-highlight -striped"
                              columns={this.reactTableColumns()}
                              page={this.useDataGridPageHandler ? undefined : this.state.page}
                              pageSize={this.useDataGridPageHandler ? undefined : this.state.pageSize }
                              pages={this.state.pages}
                              loading={!this.state.isFetched}
                              manual={true}
                              style={{
                                height: ( this.state.pageSize >= 20 ? "74vh" : "100%")
                              }}
                              onFetchData={(state, instance) => {
                                // show the loading overlay
                                this.recatTablePages(state);
                                // fetch your data
                                // pageSizeOptions= {[100,]}
                                // defaultPageSize= {100}

                              }}
                              onPageChange={(pageIndex)=>{console.log("onPageChange...",pageIndex)}}
                              getTrProps={(state, rowInfo, column) => {
                                            let isSelected = rowInfo && this.state.rowIndex.length != 0 && this.state.rowIndex.includes(rowInfo.original.id);
                                            let isEditable = rowInfo && rowInfo.original.dml_allowed !='Y';
                                            return {
                                                style : {
                                                    background: isSelected  ? '#009688' : (isEditable ? '' : ''),
                                                    color: isSelected  ? '#ECF0F1' : (isEditable ? '#f901017d' : ''),
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
                                                console.log('No of selectedItems row:', this.selectedItems)


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
              if (this.props.gridData) {
                  return(
                      <ShowToggleColumns
                        columns={this.props.gridData.cols}
                        saveSelection={this.displaySelectedColumns}
                        selectedViewColumns={this.selectedViewColumns}
                        handleClose={this.handleToggle}
                        />
                  );
              }
              break;
          case "showAddForm":
              if (this.props.gridData) {
                  return(
                      <AddData
                        requestType={this.requestType}
                        form_data={this.form_data}
                        form_cols={this.requestType=="update"? this.selectedViewColumns : this.props.gridData.cols }
                        all_cols={this.props.gridData.cols}
                        businessDate={this.state.businessDate}
                        table_name={this.props.gridData.table_name}
                        handleClose={this.handleAdd}
                        readOnly={(!this.writeOnly || !this.state.itemEditable)}
                        updateSourceData={this.updateSourceData}
                        insertSourceData={this.insertSourceData}
                        groupId={this.groupId}
                        />
                  );
              }
              break;
          case "showReportLinkage":
              return(
                  <DataReportLinkage
                    data={ this.reportLinkage }
                    ruleReference={ "" }
                    handleClose={this.handleReportLinkClick}
                  />
              );
          case "showHistory":
              if (this.props.change_history) {
                  return(
                      <DefAuditHistory
                        data={ this.changeHistory }
                        historyReference={ "" }
                        handleClose={this.handleHistoryClick}
                        />
                  );
              }
              break;
          default:
              return(
                  <DataCatalogList
                    dataCatalog={this.props.dataCatalog}
                    navMenu={false}
                    handleDataFileClick={this.handleDataFileClick}
                    dateFilter={this.handleDateFilter}
                    applyRules={this.props.applyRules}
                    />
              );
      }
  }

  render() {
    console.log("Display:", this.state.display);
    if (typeof this.props.dataCatalog != 'undefined' || this.flagDataDrillDown) {
        return(
          <div>
            <div className="row form-container">
              <div className="x_panel">
                <div className="x_title">
                      { !this.state.display &&
                        !this.flagDataDrillDown &&
                        <h2>View Data <small>Available Business Data</small>
                          <small>{moment(this.state.startDate).format("DD-MMM-YYYY") + ' - ' + moment(this.state.endDate).format("DD-MMM-YYYY")}</small>
                        </h2>
                      }
                      { this.state.display &&
                        !this.flagDataDrillDown &&
                        <h2>View Data <small>{' Data for Source '}</small>
                          <small><i className="fa fa-database"></i></small>
                          <small title={this.state.sourceDescription}>{'['+this.state.sourceId + '] ' + this.state.sourceFileName.substring(0,30) }</small>
                          <small>{' '}<i className="fa blue fa-tags" title={this.state.sourceFileName + '\n' + this.state.sourceDescription}></i></small>
                          <small>{' Business Date: ' + moment(this.state.businessDate).format("DD-MMM-YYYY")}</small>
                        </h2>
                      }
                      {
                        this.flagDataDrillDown &&
                        <h2>Drilldown Data <small>{' for Cell '}</small>
                          <small><i className="fa fa-tag"></i></small>
                          <small>{' ' + this.dataFilterParam.params.drill_kwargs.cell_id}</small>
                          <small>Calculation Ref</small>
                          <small><i className="fa fa-cube"></i></small>
                          <small>{ this.dataFilterParam.params.drill_kwargs.cell_calc_ref }</small>
                        </h2>
                      }
                      {
                        !this.flagDataDrillDown &&
                        <div className="row">
                          <ul className="nav navbar-right panel_toolbox">
                            <li>
                              <a className="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                <i className="fa fa-rss"></i><small>{' Data Feeds '}</small>
                                <i className="fa fa-caret-down"></i>
                              </a>
                              <ul className="dropdown-menu dropdown-usermenu pull-right" style={{ "zIndex": 9999 }}>
                                <li>
                                  <Link to="/dashboard/view-data"
                                    onClick={()=>{this.setState({
                                                                  display: false,
                                                                });}}>
                                      <i className="fa fa-bars"></i>{' All Data Feeds'}
                                  </Link>
                                </li>
                                <li>
                                  <a href="#"></a>
                                  <DataCatalogList
                                    dataCatalog={this.props.dataCatalog}
                                    navMenu={true}
                                    handleDataFileClick={this.handleDataFileClick}
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
                                        this.props.fetchSource(moment(this.state.startDate).format('YYYYMMDD') ,moment(this.state.endDate).format('YYYYMMDD') , 'Data');
                                      }
                                    }
                                  >
                                  <i className="fa fa-refresh"></i><small>{' Refresh '}</small>
                                </a>
                              </li>
                            </ul>
                          }
                        </div>
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
    fetchSource:(startDate,endDate, catalog_type)=>{
      dispatch(actionFetchSource(startDate,endDate,catalog_type))
    },
    fetchReportFromDate:(source_id,business_date,page)=>{
      dispatch(actionFetchReportFromDate(source_id,business_date,page))
    },
    fetchDrillDownReport:(drill_info)=>{
      dispatch(actionFetchDrillDownReport(drill_info))
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
    fetchDataChangeHistory:(table_name,id_list,business_date) => {
      dispatch(actionFetchDataChangeHistory(table_name,id_list,business_date));
    },
    exportCSV:(table_name,business_ref,sql) => {
      dispatch(actionExportCSV(table_name,business_ref,sql));
    },
    applyRules:(source_info) => {
      dispatch(actionApplyRules(source_info));
    },
    leftMenuClick:(isLeftMenu) => {
      dispatch(actionLeftMenuClick(isLeftMenu));
    },
  }
}

function mapStateToProps(state){
  console.log("On mapState ", state.view_data_store);
  return {
    //data_date_heads:state.view_data_store.dates,
    dataCatalog: state.view_data_store.dataCatalog,
    gridData: state.view_data_store.gridData,
    report_linkage:state.view_data_store.report_linkage,
    change_history:state.view_data_store.change_history,
    login_details:state.login_store,
    leftmenu: state.leftmenu_store.leftmenuclick,
  }
}

const VisibleViewDataComponentV2 = connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewDataComponentV2);

export default VisibleViewDataComponentV2;
