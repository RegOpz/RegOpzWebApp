import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, dispatch} from 'redux';
import ReactDOM from 'react-dom';
import DataGrid from 'react-datagrid';
import {
  Link,
  hashHistory
} from 'react-router';
import {
  actionFetchBusinessRules,
  actionInsertBusinessRule,
  actionDeleteBusinessRule,
  actionUpdateBusinessRule,
  actionFetchReportLinkage } from '../../actions/BusinessRulesAction';
import {actionFetchAuditList} from '../../actions/DefChangeAction';
import RightSlidePanel from '../RightSlidePanel/RightSlidePanel';
import ModalAlert from '../ModalAlert/ModalAlert';
import AuditModal from '../AuditModal/AuditModal';
import RegOpzFlatGrid from '../RegOpzFlatGrid/RegOpzFlatGrid';
import { Button, Modal, Media } from 'react-bootstrap';
import ReactLoading from 'react-loading';
import _ from 'lodash';
import {BASE_URL} from '../../Constant/constant';
import axios from 'axios';
require('react-datagrid/dist/index.css');
require('./MaintainBusinessRules.css');
class MaintainBusinessRules extends Component {
    constructor(props) {
        super(props);
        this.cols = [

        ];
        this.data = [

        ]
        this.newItem =  {
          "business_or_validation": "",
          "business_rule": "",
          "data_attributes": "",
          "data_fields_list": "",
          "id": "",
          "logic": "",
          "logical_condition": "",
          "python_implementation": "",
          "rule_description": "",
          "rule_execution_order": 0,
          "rule_type": "",
          "source_id": "",
          "technical_implementation": "",
          "valid_from": "",
          "valid_to": ""
        }
        this.selectedRow = 0;
        this.selectedRowItem = null;
        this.currentPage = 0;
        this.orderBy = null;
        this.customStyles = {
          content : {
            top                   : '50%',
            left                  : '50%',
            right                 : 'auto',
            bottom                : 'auto',
            marginRight           : '-50%',
            transform             : 'translate(-50%, -50%)'
          }
        };
        this.state = {
          isModalOpen:false,
          showAuditModal:false
        };
        this.msg = "";
        this.modalInstance = null;
        this.linkageData = null;
        this.flatGrid = null;
        this.filterConditions = {};
        this.selectedRows = [];
        this.selectedRulesAsString = null;
        this.selectedRulesIdAsString = null;
        this.modalType = "";
        this.operationName = "";
        this.auditInfo={};
        this.updateInfo=null;

    }
    componentWillMount(){
      this.props.fetchBusinesRules(this.currentPage);
    }
    render() {
      if(this.props.business_rules.length){
        this.cols = this.props.business_rules[0].cols;
        this.data = this.props.business_rules[0].rows;
        this.count = this.props.business_rules[0].count;
        this.pages = Math.ceil(this.count / 100);
        if(this.modalType=="Report Linkage"){
          this.linkageData = this.props.report_linkage;
        }
        if(this.modalType=="Rule Audit"){
          this.linkageData = this.props.audit_list;
        }
        console.log("Linkage data ", this.linkageData);
        return (
          <div className="maintain_business_rules_container">
            <h1>Maintain Business Rules</h1>
            <div className="ops_icons">
                <div className="btn-group">
                    <button
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Refresh"
                      className="btn btn-circle btn-primary business_rules_ops_buttons"
                      onClick={
                        (event) => {
                          this.selectedRows = this.flatGrid.deSelectAll();
                          this.selectedRowItem = null;
                          this.selectedRow = null;
                          this.currentPage = 0;
                          this.props.fetchBusinesRules(this.currentPage);
                          $("button[title='Delete']").prop('disabled',false);
                          $("button[title='Update']").prop('disabled',false);
                          $("button[title='Duplicate']").prop('disabled',false);
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
                        this.handleInsertClick.bind(this)
                      }
                      className="btn btn-circle btn-primary business_rules_ops_buttons"
                    >
                      <i className="fa fa-newspaper-o"></i>
                    </button>
                </div>
                <div className="btn-group">
                    <button
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Duplicate"
                      onClick={
                        this.handleDuplicateClick.bind(this)
                      }
                      className="btn btn-circle btn-primary business_rules_ops_buttons"
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
                        this.handleUpdateClick.bind(this)
                      }
                      className="btn btn-circle btn-primary business_rules_ops_buttons"
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
                        this.handleDeleteClick.bind(this)
                      }
                      className="btn btn-circle btn-primary business_rules_ops_buttons"
                    >
                      <i className="fa fa-remove"></i>
                    </button>
                </div>
                <div className="btn-group">
                    <button data-toggle="tooltip" data-placement="top" title="First" onClick={(event) => {
                      this.currentPage = 0;
                      this.props.fetchBusinesRules(this.currentPage, this.orderBy);
                      this.forceUpdate();
                    }}
                      className="btn btn-circle btn-primary business_rules_ops_buttons">
                      <i className="fa fa-fast-backward"></i>
                    </button>
                </div>
                <div className="btn-group">
                    <button data-toggle="tooltip" data-placement="top" title="Prev" onClick={(event) => {
                      if(this.currentPage > 0){
                        this.currentPage--;
                        this.props.fetchBusinesRules(this.currentPage, this.orderBy);
                        this.forceUpdate();
                      }

                    }}
                     className="btn btn-circle btn-primary business_rules_ops_buttons">
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
                                this.modalInstance.open("Page does not exists");
                              } else {
                                this.props.fetchBusinesRules(this.currentPage);
                              }
                            } else {
                              this.modalInstance.open("Please Enter a valid integer value");
                            }
                          }
                        }
                      }
                      type="text"
                      value={this.currentPage}
                      className="form-control" />
                </div>
                <div className="btn-group">
                    <button data-toggle="tooltip" data-placement="top" title="Next" onClick={(event) => {
                      if(this.currentPage < this.pages - 1){
                        this.currentPage++;
                        this.props.fetchBusinesRules(this.currentPage, this.orderBy);
                        this.forceUpdate();
                      }
                    }} className="btn btn-circle btn-primary business_rules_ops_buttons">
                      <i className="fa fa-chevron-right"></i>
                    </button>
                </div>
                <div className="btn-group">
                    <button data-toggle="tooltip" data-placement="top" title="End" onClick={(event) => {
                      this.currentPage = this.pages - 1;
                      this.props.fetchBusinesRules(this.currentPage, this.orderBy);
                      this.forceUpdate();
                    }} className="btn btn-circle btn-primary business_rules_ops_buttons">
                      <i className="fa fa-fast-forward"></i>
                    </button>
                </div>
                <div className="btn-group">
                    <button
                      onClick={this.showLinkage.bind(this)}
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Report Link"
                      className="btn btn-circle btn-primary business_rules_ops_buttons"
                    >
                      <i className="fa fa-link"></i>
                    </button>
                </div>
                <div className="btn-group">
                    <button
                      onClick={this.showHistory.bind(this)}
                      data-toggle="tooltip"
                      data-placement="top"
                      title="History"
                      className="btn btn-circle btn-primary business_rules_ops_buttons"
                    >
                      <i className="fa fa-history"></i>
                    </button>
                </div>
                <div className="btn-group">
                    <button
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Export CSV"
                      className="btn btn-circle btn-primary business_rules_ops_buttons"
                      onClick={
                        (event) => {
                            axios.get(`${BASE_URL}business-rule/export_to_csv`)
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
                      className="btn btn-circle btn-primary business_rules_ops_buttons"
                      onClick={
                        (event) => {
                          this.selectedRows = this.flatGrid.deSelectAll();
                          this.selectedRowItem = null;
                          this.selectedRow = null;
                          $("button[title='Delete']").prop('disabled',false);
                          $("button[title='Update']").prop('disabled',false);
                          $("button[title='Duplicate']").prop('disabled',false);
                        }
                      }
                    >
                      <i className="fa fa-window-maximize"></i>
                    </button>
                </div>
            </div>
            <RegOpzFlatGrid
               columns={this.cols}
               dataSource={this.data}
               onSelectRow={this.handleSelectRow.bind(this)}
               onUpdateRow = {this.handleUpdateRow.bind(this)}
               onSort = {this.handleSort.bind(this)}
               onFilter = {this.handleFilter.bind(this)}
               onFullSelect = {this.handleFullSelect.bind(this)}
               ref={(flatGrid) => {this.flatGrid = flatGrid}}
            />
            <ModalAlert
              onClickOkay={
                () => {
                  if(this.operationName == "DELETE"){
                    this.setState({showAuditModal:true});
                  }
                }
              }
              onClickDiscard={
                () => {

                }
              }
              ref={
                (modal) => {
                  this.modalInstance = modal
                }
              }
            />
            <Modal
              show={this.state.isModalOpen}
              container={this}
              onHide={(event) => {
                  this.setState({isModalOpen:false});
                }}
            >
              <Modal.Header closeButton>
                <Modal.Title>{this.modalType} for <h6>{this.selectedRulesAsString}</h6></Modal.Title>
              </Modal.Header>

              <Modal.Body>
                {this.renderModalBody(this.modalType,this.linkageData)}
              </Modal.Body>

              <Modal.Footer>
                <Button onClick={(event) => {
                    this.setState({isModalOpen:false})
                  }}>Ok</Button>
              </Modal.Footer>
            </Modal>

            < AuditModal showModal={this.state.showAuditModal}
              onClickOkay={this.handleAuditOkayClick.bind(this)}
            />
          </div>
        )
      } else {
        return(
          <h1>Loading...</h1>
        )
      }
    }
    renderModalBody(modalType,modalData){
      console.log("Modal type",modalType,modalData);
      if(modalType == "Report Linkage"){
        return this.renderReportLinkage(modalData);
      }
      if(modalType == "Rule Audit"){
        return this.renderChangeHistory(modalData);
      }
    }
    renderReportLinkage(linkageData){
      console.log("Modal linkage data",linkageData);
      if(!linkageData || typeof(linkageData) == 'undefined' || linkageData == null || linkageData.length == 0)
        return(
          <div>
            <h4>No linked report found!</h4>
          </div>
        )
      else {
        return(
          <ul>
            {
              linkageData.map(function(item,index){
                return(
                  <li key={index}>
                    <a href="">
                      {item.report_id + ", " + item.sheet_id + ", " + item.cell_id + ", " + item.cell_business_rules}
                    </a>
                  </li>
                )
              })
            }

          </ul>
        )
      }
    }
    renderChangeHistory(linkageData){
      if(!linkageData || typeof(linkageData) == 'undefined' || linkageData == null || linkageData.length == 0)
        return(
          <div>
            <h4>No linked report found!</h4>
          </div>
        )
      else {
        return(
          <div className="dashboard-widget-content">
            <ul className="list-unstyled timeline widget">
            {
              linkageData.map(function(item,index){
                return(
                  <li>
                    <div className="block">
                      <div className="block_content">
                        <h2 className="title"></h2>
                          <Media>
                            <Media.Left>
                              <h3>24</h3><h6>Jun</h6>
                            </Media.Left>
                            <Media.Body>
                              <Media.Heading>Buisness Rule Change for {item.id}</Media.Heading>
                              <h6>{item.change_type} by {item.maker}</h6>
                              <p>{item.maker_comment}</p>
                                <Media>
                                  <Media.Left>
                                    {item.status}
                                  </Media.Left>
                                  <Media.Body>
                                    <Media.Heading>Verification details</Media.Heading>
                                    <p>{item.checker_comment}</p>
                                  </Media.Body>
                                </Media>
                            </Media.Body>
                          </Media>
                        </div>
                    </div>
                  </li>
                )
              })
            }
          </ul>
          </div>
        )
      }
    }
    handlePageClick(event){
      event.preventDefault();
      this.props.fetchBusinesRules($(event.target).text());

    }
    handleSelectRow(rownum, item){
      if(this.selectedRows.length > 0){
        console.log("I am called at ", item,rownum);
        this.selectedRow = rownum;
        this.selectedRowItem = item;
      }
      else {
        console.log("I am called at ", item,rownum);
        this.selectedRow = 0;
        this.selectedRowItem = null;
      }

      if(this.selectedRows.length > 1){
        console.log($("button [title='Delete']"));
        $("button[title='Delete']").prop('disabled',true);
        $("button[title='Update']").prop('disabled',true);
        $("button[title='Duplicate']").prop('disabled',true);
        //console.log("Button property........:",$("button[title='Delete']").prop('disabled'));

      }
      else{
        if(this.selectedRows.length ==1 && this.selectedRows[0]['approval_status'] != 'A'){
          $("button[title='Delete']").prop('disabled',true);
          $("button[title='Update']").prop('disabled',true);
          $("button[title='Duplicate']").prop('disabled',true);
        }
        else {
          $("button[title='Delete']").prop('disabled',false);
          $("button[title='Update']").prop('disabled',false);
          $("button[title='Duplicate']").prop('disabled',false);
        }
      }
    }
    handleInsertClick(event){
      //this.props.insertBusinessRule(this.newItem, this.selectedRow);
      hashHistory.push(`/dashboard/maintain-business-rules/add-business-rule?request=add`);
    }
    handleDuplicateClick(event){
      if(this.selectedRows.length == 0){
        this.modalInstance.open("Please select at least one row");
      } else if (this.selectedRows.length > 1) {
        this.modalInstance.open("Please select only one row");
      } else if($("button[title='Duplicate']").prop('disabled')){
        // do nothing;
      } else {
        // let data = {
        //   table_name:"business_rules",
        //   update_info:this.selectedRows[0]
        // };
        this.operationName="INSERT";
        this.updateInfo=this.selectedRows[0];
        this.setState({showAuditModal:true});
        // this.props.insertBusinessRule(data, this.selectedRow);
      }
    }
    handleDeleteClick(event){
      if(!this.selectedRowItem){
        this.modalInstance.isDiscardToBeShown = false;
        this.modalInstance.open("Please select a row");
        this.operationName = "";
      } else if (this.selectedRows.length > 1) {
        this.modalInstance.open("Please select only one row");
      } else if($("button[title='Delete']").prop('disabled')){
        // do nothing;
      } else {
        this.modalInstance.isDiscardToBeShown = true;
        this.operationName = "DELETE";
        this.modalInstance.open(`Are you sure to delete this row (business rule: ${this.selectedRowItem['business_rule']}) ?`)
        //this.props.deleteBusinessRule(this.selectedRowItem['id'], this.selectedRow);
      }
    }
    handleUpdateClick(event){
      if(!this.selectedRowItem){
        this.modalInstance.isDiscardToBeShown = false;
        this.modalInstance.open("Please select a row");
        this.operationName = "";
      } else if (this.selectedRows.length > 1) {
        this.modalInstance.open("Please select only one row");
      } else if($("button[title='Update']").prop('disabled')){
        // do nothing;
      } else {
        hashHistory.push(`/dashboard/maintain-business-rules/add-business-rule?request=update&index=${this.selectedRow}`)
      }
    }
    handleUpdateRow(item){
      console.log("The final value in MaintainBusinessRules component",item);
      this.operationName="UPDATE";
      this.updateInfo=item;
      this.setState({showAuditModal:true});
      //this.props.updateBusinessRule(data);
    }
    handleSort(colName, direction){
      this.orderBy = {colName:colName, direction:direction};
      this.props.fetchBusinesRules(this.currentPage, {colName:colName, direction:direction});
      $(".flat_grid_header_sort_button > i").removeClass("fa-caret-up");
      $(".flat_grid_header_sort_button > i").addClass("fa-caret-down");
    }
    showLinkage(event){
      if(this.selectedRows.length == 0){
        this.modalInstance.open("Please select at least one row")
      } else {
        var params = {};
        params.business_rule_list = [];
        params.rule_id_list = [];
        for(let i = 0; i < this.selectedRows.length; i++){
          params.source_id = this.selectedRows[0].source_id;
          params.business_rule_list.push(this.selectedRows[i].business_rule);
          params.rule_id_list.push(this.selectedRows[i].id);
        }
        this.modalType = "Report Linkage";
        this.selectedRulesAsString = params.business_rule_list.toString();
        this.selectedRulesIdAsString = params.rule_id_list.toString();
        this.props.fetchReportLinkage(params);
        this.setState({isModalOpen:true})
      }
    }
    showHistory(event){
      if(this.selectedRows.length == -1){
        this.modalInstance.open("Please select at least one row")
      } else {
        var params = {};
        params.business_rule_list = [];
        params.rule_id_list = [];
        for(let i = 0; i < this.selectedRows.length; i++){
          params.source_id = this.selectedRows[0].source_id;
          params.business_rule_list.push(this.selectedRows[i].business_rule);
          params.rule_id_list.push(this.selectedRows[i].id);
        }
        this.modalType = "Rule Audit";
        this.selectedRulesAsString = params.business_rule_list.toString();
        this.selectedRulesIdAsString = params.rule_id_list.length > 0 ? params.rule_id_list.toString():"id";
        this.props.fetchAuditList(this.selectedRulesIdAsString,"business_rules");
        this.setState({isModalOpen:true})
      }
    }
    handleFilter(condition){
      this.filterConditions[condition.field_name] = condition.value;
      if(condition.field_name == "rule_execution_order") {
        this.filterConditions[condition.field_name] = parseInt(condition.value);
      }
      if(condition.field_name == "id") {
        this.filterConditions[condition.field_name] = parseInt(condition.value);
      }
      if(condition.value == ""){
        delete this.filterConditions[condition.field_name];
      }
      console.log("Filter condition", this.filterConditions)
      this.flatGrid.filterData(this.filterConditions);
    }
    handleFullSelect(selectedItems){
      if(selectedItems.length > 0){
        console.log("Full selected items are ", selectedItems);
        this.selectedRows = selectedItems;
      }
      if(this.selectedRows.length > 1){
        console.log($("button [title='Delete']"));
        $("button[title='Delete']").prop('disabled',true);
        $("button[title='Update']").prop('disabled',true);
        $("button[title='Duplicate']").prop('disabled',true);
        //console.log("Button property........:",$("button[title='Delete']").prop('disabled'));

      }
      else{
        if(this.selectedRows.length ==1 && this.selectedRows[0]['approval_status'] != 'A'){
          $("button[title='Delete']").prop('disabled',true);
          $("button[title='Update']").prop('disabled',true);
          $("button[title='Duplicate']").prop('disabled',true);
        }
        else {
          $("button[title='Delete']").prop('disabled',false);
          $("button[title='Update']").prop('disabled',false);
          $("button[title='Duplicate']").prop('disabled',false);
        }
      }
    }
    isInt(value) {
      return !isNaN(value) &&
             parseInt(Number(value)) == value &&
             !isNaN(parseInt(value, 10));
    }

   handleAuditOkayClick(auditInfo){
     let data={};
     data["change_type"]=this.operationName;
     data["table_name"]="business_rules";

     if(this.operationName == "DELETE"){
       this.auditInfo={
         table_name:data["table_name"],
         id:this.selectedRowItem["id"],
         change_type:this.operationName,
       };
       Object.assign(this.auditInfo,auditInfo);
       data["audit_info"]=this.auditInfo;

       this.props.deleteBusinessRule(data,this.selectedRowItem['id'], this.selectedRow);
       this.selectedRowItem = null;
       this.selectedRow = null;
       this.setState({showAuditModal:false});
     }

     if(this.operationName == "UPDATE"){
       this.auditInfo={
         table_name:data["table_name"],
         id:this.selectedRowItem["id"],
         change_type:this.operationName,
       };
       Object.assign(this.auditInfo,auditInfo);
       data["audit_info"]=this.auditInfo;
       data["update_info"]=this.updateInfo;

       this.props.updateBusinessRule(data);
       this.setState({showAuditModal:false});
     }

     if(this.operationName == "INSERT"){
       this.auditInfo={
         table_name:data["table_name"],
         id:null,
         change_type:this.operationName,
       };
       Object.assign(this.auditInfo,auditInfo);
       data["audit_info"]=this.auditInfo;
       data["update_info"]=this.updateInfo;

       this.props.insertBusinessRule(data, this.selectedRow);
       this.setState({showAuditModal:false});
     }


   }
}
const mapDispatchToProps = (dispatch) => {
  return {
    fetchBusinesRules: (page,order) => {
      dispatch(actionFetchBusinessRules(page, order))
    },
    insertBusinessRule: (item, at) => {
      dispatch(actionInsertBusinessRule(item, at))
    },
    deleteBusinessRule: (data,item,at) => {
      dispatch(actionDeleteBusinessRule(data,item,at))
    },
    updateBusinessRule:(item) => {
      dispatch(actionUpdateBusinessRule(item))
    },
    fetchReportLinkage :(params) => {
      dispatch(actionFetchReportLinkage(params))
    },
    fetchAuditList:(idList,tableName)=>{
      dispatch(actionFetchAuditList(idList,tableName));
    }

  }
}
function mapStateToProps(state){
  return {
    business_rules:state.business_rules,
    report_linkage: state.report_linkage,
    audit_list:state.def_change_store.audit_list
  }
}
const VisibleMaintainBusinessRules = connect(
  mapStateToProps,
  mapDispatchToProps
)(MaintainBusinessRules);
export default VisibleMaintainBusinessRules;
