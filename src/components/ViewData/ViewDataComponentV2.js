import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import { Link } from 'react-router';
import _ from 'lodash';
import {
  //actionFetchDates,
  actionFetchSource,
  actionFetchReportFromDate,
  actionInsertSourceData,
  actionUpdateSourceData,
  actionDeleteFromSourceData
} from '../../actions/ViewDataAction';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import RegOpzFlatGrid from '../RegOpzFlatGrid/RegOpzFlatGrid';
import RegOpzFlatGridActionButtons from '../RegOpzFlatGrid/RegOpzFlatGridActionButtons';
import AddData from './AddData';
import DataCatalogList from './DataCatalogList';
import AuditModal from '../AuditModal/AuditModal';
import ModalAlert from '../ModalAlert/ModalAlert';
import ShowToggleColumns from '../RegOpzFlatGrid/ShowToggleColumns';
require('react-datepicker/dist/react-datepicker.css');
require('./ViewDataComponentStyle.css');

class ViewDataComponentV2 extends Component {
  constructor(props){
    super(props)
    this.state = {
      startDate:moment().subtract(1,'months').format("YYYYMMDD"),
      endDate:moment().format('YYYYMMDD'),
      sources:null,
      showDataGrid: false,
      showAddForm: false,
      showToggleColumns: false,
      itemEditable: true,
      sourceId: null,
      businessDate: null,
      showAuditModal: false,
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
      {title: 'Refresh', iconClass: 'fa-refresh', checkDisabled: 'No'},
      {title: 'Add', iconClass: 'fa-plus', checkDisabled: 'Yes'},
      {title: 'Copy', iconClass: 'fa-copy', checkDisabled: 'Yes'},
      {title: 'Details', iconClass: 'fa-pencil', checkDisabled: 'No'},
      {title: 'Delete', iconClass: 'fa-minus', checkDisabled: 'Yes'},
      {title: 'Report Link', iconClass: 'fa-link', checkDisabled: 'No'},
      {title: 'History', iconClass: 'fa-history', checkDisabled: 'No'},
      {title: 'Deselect', iconClass: 'fa-window-maximize', checkDisabled: 'No'},
      {title: 'Columns', iconClass: 'fa-th-large', checkDisabled: 'No'},
      {title: 'Export', iconClass: 'fa-table', checkDisabled: 'No'},
    ]


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
    this.displaySelectedColumns=this.displaySelectedColumns.bind(this);

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
    //this.props.fetchDates(this.state.startDate ? moment(this.state.startDate).format('YYYYMMDD') : "19000101",this.state.endDate ? moment(this.state.endDate).format('YYYYMMDD') : "30200101", 'data_catalog');
    this.props.fetchSource(moment(this.state.startDate).format('YYYYMMDD') ,moment(this.state.endDate).format('YYYYMMDD') , 'Data');
  }
  componentDidUpdate(){
    console.log("Dates",this.state.startDate)
  }

  handleDataFileClick(item) {
    console.log("selected item",item);
    this.currentPage = 0;
    this.selectedViewColumns=[];
    this.setState({
        showDataGrid: true,
        showAddForm: false,
        sourceId: item.source_id,
        businessDate: item.business_date
     },
      this.props.fetchReportFromDate(item.source_id,item.business_date,this.currentPage)
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
    let toggleValue = this.state.showToggleColumns;
    if (!toggleValue) {
      this.setState({
        showToggleColumns: true,
        showDataGrid: false,
        showAddForm: false,
      });
    }
    else {
      this.setState({
        showToggleColumns: false,
        showDataGrid: true,
        showAddForm: false,
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
        console.log("actionButtonClicked",itemClicked ,event);
        break;
      case "History":
        console.log("actionButtonClicked",itemClicked ,event);
        break;
      case "Deselect":
        this.selectedItems = this.flatGrid.deSelectAll();
        break;
      case "Columns":
        this.handleToggle(event);
        break;
      case "Export":
        console.log("actionButtonClicked",itemClicked ,event);
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
    this.props.fetchReportFromDate(this.state.sourceId,this.state.businessDate,this.currentPage);
  }

  handleAdd(event,requestType){
    let isOpen = this.state.showAddForm;
    if(isOpen) {
      this.setState({
        showDataGrid: true,
        showAddForm: false,
        itemEditable: true,
        },
        ()=>{
              if(this.selectedItems){
                this.selectedItems = this.flatGrid.deSelectAll();
              }
            }
      )
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
          showDataGrid: false,
          showAddForm: true,
          itemEditable: itemEditable,
        });
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

  handleFullSelect(items){
    console.log("Selected Items ", items);

    this.selectedItems = items;
    //this.props.setDisplayCols(this.props.gridData.cols,this.props.gridData.table_name);
    //this.props.setDisplayData(this.selectedItems[0]);

  }

  handleDuplicateClick(event){
    if(this.selectedItems.length != 1){
      this.modalAlert.isDiscardToBeShown = false;
      this.modalAlert.open("Please select only one row")
    } else {
      this.modalAlert.isDiscardToBeShown = true;
      this.operationName = "INSERT";
      this.modalAlert.open(`Are you sure to create a copy of this record (ID: ${this.selectedItems[0]['id']}) ?`)
    }
  }

  handleDeleteClick(event){
      if(this.selectedItems.length != 1){
        this.modalAlert.isDiscardToBeShown = false;
        this.modalAlert.open("Please select only one row")
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
        change_reference:`Duplicate of Data: ${this.selectedItems[0]["id"]} of Source: ${data["table_name"]}`,
        maker:this.props.login_details.user,
        business_date:this.state.businessDate
      };
      Object.assign(this.auditInfo,auditInfo);
      data["audit_info"]=this.auditInfo;
      data["update_info"]={...this.selectedItems[0]};
      data["business_date"]=this.state.businessDate;
      data.update_info.id = null;
      this.props.insertSourceData(data,this.selectedIndexOfGrid + 1);
      this.setState({showAuditModal:false});

    }

    if (this.operationName=='DELETE'){
      this.auditInfo={
        table_name:data["table_name"],
        change_type:this.operationName,
        change_reference:`Delete of Data: ${this.selectedItems[0]['id']} of Source: ${data["table_name"]}`,
        maker:this.props.login_details.user,
        business_date:this.state.businessDate
      };
      Object.assign(this.auditInfo,auditInfo);
      data["audit_info"]=this.auditInfo;
      data["update_info"]=this.selectedItems[0];
      data["business_date"]=this.state.businessDate;

      this.props.deleteFromSourceData(this.selectedItems[0]['id'],data, this.selectedIndexOfGrid);
      this.setState({showAuditModal:false});
    }

   if(this.operationName=='UPDATE'){

     this.auditInfo={
       table_name:data["table_name"],
       change_type:this.operationName,
       change_reference:`Update of Data: ${this.updateInfo['id']} of Source: ${data["table_name"]}`,
       maker:this.props.login_details.user,
       business_date:this.state.businessDate
     };
     Object.assign(this.auditInfo,auditInfo);
     data["audit_info"]=this.auditInfo;
     data["update_info"]=this.updateInfo;
     data["business_date"]=this.state.businessDate;
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
                        <h2>View Data <small>Available Business Data</small>
                          <small>{moment(this.state.startDate).format("DD-MMM-YYYY") + ' - ' + moment(this.state.endDate).format("DD-MMM-YYYY")}</small>
                        </h2>
                      }
                      { (this.state.showDataGrid ||
                        this.state.showAddForm ||
                        this.state.showToggleColumns) &&
                        <h2>View Data <small>{' Data for Source '}</small>
                          <small><i className="fa fa-file-text"></i></small>
                          <small>{this.state.sourceId }</small>
                          <small>{' Business Date: ' + moment(this.state.businessDate).format("DD-MMM-YYYY")}</small>
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
                                <Link to="/dashboard/view-data" onClick={()=>{this.setState({ showDataGrid: false, showAddForm: false, });}}>
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
                      </div>
                    <div className="clearfix"></div>
                </div>
                <div className="x_content">
                { !this.state.showDataGrid &&
                  !this.state.showAddForm &&
                  !this.state.showToggleColumns &&
                  <DataCatalogList
                    dataCatalog={this.props.dataCatalog}
                    navMenu={false}
                    handleDataFileClick={this.handleDataFileClick}
                    dateFilter={this.handleDateFilter}
                    />
                }
                { this.state.showDataGrid &&
                  this.props.gridData &&
                  !this.state.showAddForm &&
                  !this.state.showToggleColumns &&
                    <RegOpzFlatGridActionButtons
                      editable={this.writeOnly}
                      buttonClicked={this.actionButtonClicked}
                      checkDisabled={this.checkDisabled}
                      buttons={this.buttons}
                      dataNavigation={true}
                      pageNo={this.currentPage}
                      />
                }
                {
                  !this.state.showDataGrid &&
                  this.props.gridData &&
                  !this.state.showAddForm &&
                  this.state.showToggleColumns &&
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
                    <RegOpzFlatGrid
                     columns={this.selectedViewColumns.length ? this.selectedViewColumns : this.props.gridData.cols}
                     dataSource={this.props.gridData.rows}
                     onSelectRow={this.handleSelectRow.bind(this)}
                     onUpdateRow = {this.handleUpdateRow.bind(this)}
                     onSort = {()=>{}}
                     onFilter = {()=>{}}
                     onFullSelect = {this.handleFullSelect.bind(this)}
                     isMultiSelectAllowed = { false }
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
                    <AddData
                      requestType={this.requestType}
                      form_data={this.form_data}
                      form_cols={this.props.gridData.cols}
                      businessDate={this.state.businessDate}
                      table_name={this.props.gridData.table_name}
                      handleClose={this.handleAdd}
                      readOnly={(!this.writeOnly || !this.state.itemEditable)}
                      updateSourceData={this.updateSourceData}
                      insertSourceData={this.insertSourceData}
                      />
                }
                {
                  this.state.showDataGrid &&
                  !this.props.gridData &&
                  !this.state.showAddForm &&
                  !this.state.showToggleColumns &&
                  <div>
                    <h4>Loading ....</h4>
                  </div>
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
    insertSourceData:(data,at) => {
      dispatch(actionInsertSourceData(data,at));
    },
    updateSourceData:(data) => {
      dispatch(actionUpdateSourceData(data));
    },
    deleteFromSourceData:(id,data, at) => {
      dispatch(actionDeleteFromSourceData(id,data, at));
    },
  }
}

function mapStateToProps(state){
  console.log("On mapState ", state.view_data_store);
  return {
    //data_date_heads:state.view_data_store.dates,
    dataCatalog: state.view_data_store.dataCatalog,
    gridData: state.view_data_store.gridData,
    login_details:state.login_store,
  }
}

const VisibleViewDataComponentV2 = connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewDataComponentV2);

export default VisibleViewDataComponentV2;
