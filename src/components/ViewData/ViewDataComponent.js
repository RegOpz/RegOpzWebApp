import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import Breadcrumbs from 'react-breadcrumbs';
import { hashHistory } from 'react-router';
import _ from 'lodash';
import {
  actionFetchDates,
  actionFetchReportFromDate,
  actionFetchDrillDownReport,
  actionFetchDrillDownRulesReport,
  actionFetchTableData,
  actionFetchSource,
  actionFetchReportLinkage,
  actionInsertSourceData,
  actionUpdateSourceData,
  actionDeleteFromSourceData,
  actionSetDisplayData,
  actionSetDisplayCols
} from '../../actions/ViewDataAction';
import DatePicker from 'react-datepicker';
import { BASE_URL } from '../../Constant/constant';
import axios from 'axios';
import moment from 'moment';
import RegOpzFlatGrid from '../RegOpzFlatGrid/RegOpzFlatGrid';
import SourceTreeInfoComponent from './SourceTreeInfoComponent';
import InfoModal from '../InfoModal/InfoModal';
import ModalAlert from '../ModalAlert/ModalAlert';
import ShowToggleColumns from '../MaintainBusinessRules/ShowToggleColumns';
require('react-datepicker/dist/react-datepicker.css');
require('./ViewDataComponentStyle.css');

class ViewDataComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: null,
      endDate: null
    }

    this.isMenuPanelOpen = 0;
    this.dataSource = null;
    this.currentPage = 0;
    this.currentSourceId = null;
    this.currentBusinessDate = null;
    this.pages = -1;
    this.infoModal = null;
    this.selectedItems = [];
    this.flatGrid = null;
    this.selectedIndexOfGrid = 0;
    this.sourceTableName = "";
    this.currentSourceId = this.props.location.query['source_id'];
    this.currentBusinessDate = this.props.location.query['business_date'];
    this.origin = this.props.location.query['origin'];
    this.source_id = this.props.location.query['source_id'];
    this.report_id = this.props.location.query['report_id'];
    this.sheet_id = this.props.location.query['sheet_id'];
    this.cell_id = this.props.location.query['cell_id'];
    this.reporting_date = this.props.location.query['reporting_date'];
    this.cell_calc_ref = this.props.location.query['cell_calc_ref'];
    this.rules = this.props.location.query['rules'];
    this.table = this.props.location.query['table'];
    this.filter = this.props.location.query['filter'];

    this.selectedViewColumns=[];
    this.handleToggle = this.handleToggle.bind(this);
    this.displaySelectedColumns = this.displaySelectedColumns.bind(this);
  }

  componentWillMount() {
    //this.props.fetchDates(this.state.startDate ? moment(this.state.startDate).format('YYYYMMDD') : "19000101",this.state.endDate ? moment(this.state.endDate).format('YYYYMMDD') : "30200101");
    this.fetchDataToGrid();
  }

  componentDidMount() {
    console.log('inside component did mount',this.props.report)
    if(this.props.report.length != 0){
      if(this.props.report[0].cols.length != 0){
        this.pages = Math.ceil(this.props.report[0].count / 100);
      }
    }
    else{
      this.pages = 0;
    }
  }

  handleToggle() {
    let toggleValue = this.state.showToggleColumns;
    this.setState({ showToggleColumns: !toggleValue });
  }

  displaySelectedColumns(columns) {
    var selectedColumns = [];
    for (let i = 0; i < columns.length; i++)
      if (columns[i].checked)
        selectedColumns.push(columns[i].name);

    this.selectedViewColumns = selectedColumns;
    console.log(selectedColumns);
    console.log(this.selectedViewColumns);
    this.setState({ showToggleColumns: false });

    // The commented part is apparently not working need to look into it
  }

  fetchDataToGrid() {
    //this.props.fetchDates(this.state.startDate ? moment(this.state.startDate).format('YYYYMMDD') : "19000101",this.state.endDate ? moment(this.state.endDate).format('YYYYMMDD') : "30200101");
    if (this.origin == 'drilldown') {
      let drill_info = {
              params:{
                drill_kwargs: {
                  report_id: this.report_id,
                  sheet_id: this.sheet_id,
                  cell_id: this.cell_id,
                  reporting_date: this.reporting_date,
                  source_id: this.source_id,
                  cell_calc_ref: this.cell_calc_ref,
                  page: this.currentPage
                }
              }
            }
      console.log('drill info',drill_info['params']);
      console.log('this.props.report.length',this.props.report.length);
      console.log('this.pages',this.pages);
      this.export_csv_business_ref = `${this.reporting_date}.${this.report_id}.${this.sheet_id}.${this.cell_id}.${this.cell_calc_ref}`
      if (this.table) {
        console.log('Inside table of fetch data to grid')
        this.props.fetchTableData(this.table,this.filter,this.currentPage);
        this.export_csv_business_ref = `${this.export_csv_business_ref}.rules`
        console.log('Inside table of fetch data to grid props',this.props.report)
      } else if (this.rules) {
        this.props.fetchDrillDownRulesReport(this.rules,this.source_id,this.currentPage);
        this.export_csv_business_ref = `${this.export_csv_business_ref}.rules`
      } else {
        this.props.fetchDrillDownReport(drill_info);
      }
    } else {
      this.props.fetchReportFromDate(this.currentSourceId,this.currentBusinessDate,this.currentPage);
      this.export_csv_business_ref = `${this.currentBusinessDate}`
    }
  }

  renderGridAtRightPane() {
    console.log(this.props.report.length, this.pages)
    if (this.props.report.length != 0 && this.pages != -1) {
      if (this.props.report[0].cols.length != 0) {
        this.pages = Math.ceil(this.props.report[0].count / 100);
        this.sourceTableName = this.props.report[0].table_name;
        this.sourceTableCols = this.props.report[0].cols;
        if (!this.selectedViewColumns.length){
          this.selectedViewColumns = this.sourceTableCols;
        }
        this.sql = this.props.report[0].sql;
        return(
          <div>
            <Breadcrumbs
              routes={this.props.routes}
              params={this.props.params}
              wrapperClass="breadcrumb"
            />
            <div className="ops_icons">
                <div className="btn-group">
                    <button
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Refresh"
                      className="btn btn-circle btn-primary business_rules_ops_buttons btn-xs"
                      onClick={
                        (event) => {
                          this.selectedItems = this.flatGrid.deSelectAll();
                          this.currentPage = 0;
                          this.fetchDataToGrid();
                        }
                      }
                    >
                      <i className="fa fa-refresh"></i>
                    </button>
                </div>
                <div className="btn-group">
                    <button
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Insert"
                      onClick={
                          (event) => {

                                  this.props.setDisplayCols(this.props.report[0].cols,this.props.report[0].table_name);
                                  hashHistory.push(`/dashboard/view-data/add-data?request=add&business_date=${this.currentBusinessDate}`);
                                }
                      }
                      className="btn btn-circle btn-success business_rules_ops_buttons btn-xs"
                    >
                      <i className="fa fa-plus"></i>
                    </button>
                </div>
                <div className="btn-group">
                    <button
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Duplicate"
                      onClick={
                        (event) => {
                          if(this.selectedItems.length != 1){
                            this.modalAlert.open("Please select only one row")
                          } else {

                            this.modalAlert.isDiscardToBeShown = true;
                            this.operationName = "INSERT";
                            this.modalAlert.open(`Are you sure to duplicate this row (ID: ${this.selectedItems[0]['id']}) ?`)

                          }
                        }
                      }
                      className="btn btn-circle btn-success business_rules_ops_buttons btn-xs"
                    >
                      <i className="fa fa-copy"></i>
                    </button>
                </div>
                <div className="btn-group">
                    <button
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Update"
                      onClick={
                        () => {
                            if(this.selectedItems.length==0){
                                this.modalAlert.open("Please select a row")
                            }else{
                              this.props.setDisplayCols(this.props.report[0].cols,this.props.report[0].table_name);
                              hashHistory.push('/dashboard/view-data/add-data?request=update');

                            }

                        }
                      }
                      className="btn btn-circle btn-primary business_rules_ops_buttons btn-xs"
                    >
                      <i className="fa fa-pencil"></i>
                    </button>
                </div>
                <div className="btn-group">
                    <button
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Delete"
                      onClick={
                        (event) => {
                          if(this.selectedItems.length != 1){
                            this.modalAlert.open("Please select only one row")
                            console.log("Inside OnClick delete ......",this.selectedItems);
                          } else {
                            this.modalAlert.isDiscardToBeShown = true;
                            this.operationName = "DELETE";
                            this.modalAlert.open(`Are you sure to delete this row (ID: ${this.selectedItems[0]['id']}) ?`)
                          }
                        }
                      }
                      className="btn btn-circle btn-warning business_rules_ops_buttons btn-xs"
                    >
                      <i className="fa fa-remove"></i>
                    </button>
                </div>
                <div className="btn-group">
                    <button
                      data-toggle="tooltip"
                      data-placement="top"
                      title="First"
                      onClick={
                        (event) => {
                            this.currentPage = 0;
                            this.fetchDataToGrid();
                        }
                      }
                      className="btn btn-circle btn-primary business_rules_ops_buttons btn-xs">
                      <i className="fa fa-fast-backward"></i>
                    </button>
                </div>
                <div className="btn-group">
                    <button
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Prev"
                      onClick={
                        (event) => {
                          if(this.currentPage > 0){
                            this.currentPage--;
                            this.fetchDataToGrid();
                          }
                        }
                      }
                     className="btn btn-circle btn-primary business_rules_ops_buttons btn-xs"
                     >
                      <i className="fa fa-chevron-left"></i>
                    </button>
                </div>
                <div className="btn-group reg_flat_grid_page_input">
                    <input
                      onChange={
                        (event) => {
                          this.currentPage = event.target.value;
                          this.forceUpdate();
                        }
                      }
                      onKeyPress={
                        (event) => {
                          if(event.key == "Enter"){
                            if(this.isInt(event.target.value)){
                              if(event.target.value > this.pages){
                                this.modalAlert.open("Page does not exists");
                              } else {
                                this.fetchDataToGrid();
                              }
                            } else {
                              this.modalAlert.open("Please Enter a valid integer value");
                            }
                          }
                        }
                      }
                      type="text"
                      value={this.currentPage}
                      className="form-control" />
                </div>
                <div className="btn-group">
                    <button
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Next"
                      onClick={
                        (event) => {
                          if(this.currentPage < this.pages - 1){
                            this.currentPage++;
                            this.fetchDataToGrid();
                          }
                        }
                      }
                      className="btn btn-circle btn-primary business_rules_ops_buttons btn-xs"
                    >
                      <i className="fa fa-chevron-right"></i>
                    </button>
                </div>
                <div className="btn-group">
                    <button
                      data-toggle="tooltip"
                      data-placement="top"
                      title="End"
                      onClick={
                        (event) => {
                          this.currentPage = this.pages - 1;
                          this.fetchDataToGrid();
                        }
                      }
                      className="btn btn-circle btn-primary business_rules_ops_buttons btn-xs">
                      <i className="fa fa-fast-forward"></i>
                    </button>
                </div>
                <div className="btn-group">
                    <button
                      onClick={
                        (event) => {
                          if(this.selectedItems.length > 0){
                            let lastItem = this.selectedItems[this.selectedItems.length - 1];
                            this.props.fetchReportLinkage(this.currentSourceId,lastItem['id'],lastItem['business_date']);
                            this.infoModal.open();
                          } else {
                            this.modalAlert.open("Please select a row");
                          }

                        }
                      }
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Report Link"
                      className="btn btn-circle btn-info business_rules_ops_buttons btn-xs"
                    >
                      <i className="fa fa-link"></i>
                    </button>
                </div>
                <div className="btn-group">
                    <button
                      onClick={
                        (event) => {

                        }
                      }
                      data-toggle="tooltip"
                      data-placement="top"
                      title="History"
                      className="btn btn-circle btn-primary business_rules_ops_buttons btn-xs"
                    >
                      <i className="fa fa-history"></i>
                    </button>
                </div>
                <div className="btn-group">
                    <button
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Export CSV"
                      className="btn btn-circle btn-success business_rules_ops_buttons btn-xs"
                      onClick={
                        (event) => {
                            axios.get(`${BASE_URL}view-data/report/export-csv?table_name=${this.sourceTableName}&business_ref=${this.export_csv_business_ref}&sql=${this.sql}`)
                            .then(function(response){
                              console.log("export csv",response);
                              window.location.href = BASE_URL + "../../static/" + response.data.file_name;
                            })
                            .catch(function (error) {
                              console.log(error);
                            });
                        }
                      }
                    >
                      <i className="fa fa-table"></i>
                    </button>
                </div>
                <div className="btn-group">
                    <button
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Deselect All"
                      className="btn btn-circle btn-default business_rules_ops_buttons btn-xs"
                      onClick={
                        (event) => {
                          this.selectedItems = this.flatGrid.deSelectAll();
                          this.forceUpdate();
                        }
                      }
                    >
                      <i className="fa fa-window-maximize"></i>
                    </button>
                </div>
                <div className="btn-group">
                  <button
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Select Display Columns"
                    className="btn btn-circle btn-default business_rules_ops_buttons btn-xs"
                    onClick={this.handleToggle}
                  >
                    <i className="fa fa-th-large"></i>
                  </button>
                </div>
            </div>
            {
              this.state.showToggleColumns ?
                <ShowToggleColumns
                  columns={this.props.report[0].cols}
                  saveSelection={this.displaySelectedColumns}
                  selectedViewColumns={this.selectedViewColumns}
                /> :
                <RegOpzFlatGrid
                   columns={this.selectedViewColumns}
                   dataSource={this.props.report[0].rows}
                   onSelectRow={this.handleSelectRow.bind(this)}
                   onUpdateRow = {this.handleUpdateRow.bind(this)}
                   onSort = {this.handleSort.bind(this)}
                   onFilter = {this.handleFilter.bind(this)}
                   onFullSelect = {this.handleFullSelect.bind(this)}
                   ref={
                         (flatGrid) => {
                           this.flatGrid = flatGrid;
                         }
                       }
                />
            }
          </div>
        )
      }
    } else {
      return (
        <h1>Loading...</h1>
      )
    }
  }

  handleSelectRow(indexOfGrid){
    console.log("Inside Single select....",this.selectedItems.length);
    if(this.selectedItems.length == 1){
      this.selectedIndexOfGrid = indexOfGrid;
      console.log("Inside Single select ", indexOfGrid);
    }
    console.log("Single select ", this.selectedIndexOfGrid);

  }

  handleUpdateRow(row){
    console.log("On update row ",row);
    let data = {
      table_name:this.sourceTableName,
      update_info:row,
      business_date:this.currentBusinessDate
    }
    this.props.updateSourceData(data);
  }

  handleFullSelect(items){
    console.log("Selected Items ", items);
    if(this.selectedItems.length==0 || (this.selectedItems[0].id != items[0].id)) {
      console.log("Inside Selected Items ", items);
      this.selectedItems = items;
      this.props.setDisplayCols(this.props.report[0].cols,this.props.report[0].table_name);
      this.props.setDisplayData(this.selectedItems[0]);
    } else {
      this.selectedItems = this.flatGrid.deSelectAll();
    }
  }

  handleSort(){

  }

  handleFilter(){

  }

  isInt(value) {
    return !isNaN(value) &&
           parseInt(Number(value)) == value &&
           !isNaN(parseInt(value, 10));
  }

  render() {
    console.log("report linkage",this.props.report_linkage);
    this.dataSource = this.props.data_date_heads;
    console.log('in render ',this.pages);
    return (
      <div className="view_data_dummy_area">
        {this.renderGridAtRightPane()}
        <InfoModal
            showDiscard={false}
            title={"Report Linkage"}
            ref={(infoModal) => {this.infoModal = infoModal}}
        >
          {this.renderReportLinkageModal()}
        </InfoModal>
        <ModalAlert
          ref={(modalAlert) => {this.modalAlert = modalAlert}}
          onClickOkay={this.handleModalOkayClick.bind(this)}
        />
      </div>
    )
  }

  handleModalOkayClick(){

    if(this.selectedItems.length==1 && this.operationName=='INSERT'){
      let data = {
        table_name:this.sourceTableName,
        update_info:{...this.selectedItems[0]},
        business_date:this.currentBusinessDate
      }
      data.update_info.id = null;
      this.props.insertSourceData(data,this.selectedIndexOfGrid + 1);

    }

    if (this.selectedItems.length==1 && this.operationName=='DELETE'){
      this.props.deleteFromSourceData(this.selectedItems[0]['id'],this.currentBusinessDate, this.sourceTableName, this.selectedIndexOfGrid);
    }

  }

  renderReportLinkageModal() {
    console.log("report linkage on modal",this.props.report_linkage);
    let recordId =  ((this.selectedItems.length >0) ? this.selectedItems[this.selectedItems.length -1]['id'] : "" )
    if(typeof(this.props.report_linkage) != 'undefined'){
      if(this.props.report_linkage.length > 0 ){
        return(
          <ul className="list-unstyled msg_list">
            <span>{"ID: "+recordId}</span>
            <h6 className="view_data_qualifying_rules_h6">Qualified Business Rules</h6>
            <p className="view_data_qualifying_rules">{this.props.report_linkage[0]['data_qualifying_rules']}</p>
            {this.props.report_linkage.map(function(item,index){
              return(
                <li key={index}>
                  <a href="#">
                    <span>{item['report_id']}</span>
                    <span className="message">{`${item['sheet_id']} : ${item['cell_id']} (${item['cell_business_rules']})`}</span>
                  </a>
                </li>
              )
            })}

          </ul>
        )
      }else{
        return(
          <ul className="list-unstyled msg_list">
            <span>{"ID: "+recordId}</span>
            <h6 className="view_data_qualifying_rules_h6">No report linkage found</h6>
          </ul>
        )
      }

    } else {
      return(
        <h2>Loading...</h2>
      )
    }

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchDates:(startDate,endDate)=>{
      dispatch(actionFetchDates(startDate,endDate))
    },
    fetchReportFromDate:(source_id,business_date,page)=>{
      dispatch(actionFetchReportFromDate(source_id,business_date,page))
    },
    fetchDrillDownReport:(drill_info)=>{
      console.log('Inside dispatch to props',drill_info)
      dispatch(actionFetchDrillDownReport(drill_info))
    },
    fetchTableData:(table,filter,page)=>{
      console.log('Inside dispatch to props',table,filter,page)
      dispatch(actionFetchTableData(table,filter,page));
    },
    fetchDrillDownRulesReport:(rules,source_id,page)=>{
      console.log('Inside dispatch to props',rules,source_id,page)
      dispatch(actionFetchDrillDownRulesReport(rules,source_id,page))
    },
    fetchSource:(business_date) => {
      dispatch(actionFetchSource(business_date))
    },
    fetchReportLinkage:(source_id,qualifying_key,business_date) => {
      dispatch(actionFetchReportLinkage(source_id,qualifying_key,business_date));
    },
    insertSourceData:(data,at) => {
      dispatch(actionInsertSourceData(data,at));
    },
    updateSourceData:(data) => {
      dispatch(actionUpdateSourceData(data));
    },
    deleteFromSourceData:(id,business_date,table_name, at) => {
      dispatch(actionDeleteFromSourceData(id,business_date,table_name, at));
    },
    setDisplayData:(selectedItem)=>{
      dispatch(actionSetDisplayData(selectedItem));
    },
    setDisplayCols:(cols,table_name)=>{
      dispatch(actionSetDisplayCols(cols,table_name));
    }
  }
}

function mapStateToProps(state){
  console.log("On mapState ", state.view_data_store);
  console.log("On mapState report ", state.report_store);
  return {
    data_date_heads:state.view_data_store.dates,
    report:state.report_store,
    report_linkage:state.view_data_store.report_linkage
  }
}

const VisibleViewDataComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewDataComponent);

export default VisibleViewDataComponent;
