import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import ReactDOM from 'react-dom';
import moment from 'moment';
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
  actionFetchReportLinkage
} from '../../actions/BusinessRulesAction';
import {
  actionFetchSources
} from '../../actions/MaintainReportRuleAction';
import { actionFetchAuditList } from '../../actions/DefChangeAction';
import RightSlidePanel from '../RightSlidePanel/RightSlidePanel';
import ModalAlert from '../ModalAlert/ModalAlert';
import AuditModal from '../AuditModal/AuditModal';
import RegOpzFlatGrid from '../RegOpzFlatGrid/RegOpzFlatGrid';
import { Button, Modal, Media, Label, Badge } from 'react-bootstrap';
import ReactLoading from 'react-loading';
import Breadcrumbs from 'react-breadcrumbs';
import _ from 'lodash';
import { BASE_URL } from '../../Constant/constant';
import axios from 'axios';
import ShowToggleColumns from './ShowToggleColumns';
import RuleAssist from './RuleAssist';
import DefAuditHistory from '../AuditModal/DefAuditHistory';
import RuleReportLinkage from './RuleReportLinkage';
import AddBusinessRule from './AddBusinessRule/AddBusinessRule';
require('react-datagrid/dist/index.css');
require('./MaintainBusinessRules.css');

class MaintainBusinessRules extends Component {
  constructor(props) {
    super(props);
    this.cols = [];
    this.data = [];
    this.selectedViewColumns = [];
    this.newItem = {
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
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
      }
    };
    this.state = {
      itemEditable: true,
      isModalOpen: false,
      showAuditModal: false,
      showToggleColumns: false,
      showRuleAssist: false,
      showDefAuditHistory: false,
      showRuleReportLinkage: false,
      showAddRule: false,
    };

    this.msg = "";
    this.modalInstance = null;
    this.linkageData = null;
    this.defAuditData = null;
    this.flatGrid = null;
    this.filterConditions = {};
    this.selectedRows = [];
    this.source_table = null;
    this.selectedRulesAsString = null;
    this.selectedRulesIdAsString = null;
    this.modalType = "";
    this.operationName = "";
    this.auditInfo = {};
    this.updateInfo = null;
    this.viewOnly = _.find(this.props.privileges, { permission: "View Business Rules" }) ? true : false;
    this.writeOnly = _.find(this.props.privileges, { permission: "Edit Business Rules" }) ? true : false;

    this.handleToggle = this.handleToggle.bind(this);
    this.displaySelectedColumns = this.displaySelectedColumns.bind(this);
    this.toggleRuleAssist = this.toggleRuleAssist.bind(this);
    this.showHistory = this.showHistory.bind(this);
    this.handleDefAuditHistory = this.handleDefAuditHistory.bind(this);
    this.showLinkage = this.showLinkage.bind(this);
    this.handleRuleLinkage = this.handleRuleLinkage.bind(this);
    this.handleUpdateClick = this.handleUpdateClick.bind(this);
    this.handleInsertClick = this.handleInsertClick.bind(this);
    this.handleAddRule = this.handleAddRule.bind(this);
  }

  componentWillMount() {
    this.props.fetchSources();
    this.props.fetchBusinesRules(this.currentPage);
  }

  handleToggle() {
    let toggleValue = this.state.showToggleColumns;
    if (!toggleValue) {
      this.setState({
        showToggleColumns: true,
        showRuleAssist: false,
        showDefAuditHistory: false,
        showRuleReportLinkage: false,
        showAddRule: false,
      });
    }
    else {
      this.setState({ showToggleColumns: false });
    }
  }

  handleDefAuditHistory() {
    let isOpen = this.state.showDefAuditHistory;
    //console.log("Inside handleDefAuditHistory",this.state.showDefAuditHistory);
    if (!isOpen) {
      this.showHistory(event);
      this.setState({
        showToggleColumns: false,
        showRuleAssist: false,
        showDefAuditHistory: true,
        showRuleReportLinkage: false,
        showAddRule: false,
      });
    }
    else {
      this.setState({
        showDefAuditHistory: false,
        itemEditable: true,
      });
      this.selectedRows = [];
      this.selectedRowItem = null;
      this.selectedRow = null;
    }
  }

  handleAddRule() {
    let isOpen = this.state.showAddRule;
    console.log("Inside handleAddRule",this.state.itemEditable);
    if (!isOpen) {
      this.setState({
        showToggleColumns: false,
        showRuleAssist: false,
        showDefAuditHistory: false,
        showRuleReportLinkage: false,
        showAddRule: true,
      });
    }
    else {
      this.setState({
        showAddRule: false,
        itemEditable: true,
       });
      this.selectedRows = [];
      this.selectedRowItem = null;
      this.selectedRow = null;
    }
    this.props.fetchBusinesRules(this.currentPage);
  }

  handleRuleLinkage() {
    let isOpen = this.state.showRuleReportLinkage;
    console.log("Inside handleDefAuditHistory",this.state.showRuleReportLinkage);
    if (!isOpen) {
      if (this.selectedRows.length == 0) {
        this.modalInstance.open("Please select at least one row")
      } else {
        this.showLinkage(event);

        this.setState({
          showToggleColumns: false,
          showRuleAssist: false,
          showDefAuditHistory: false,
          showRuleReportLinkage: true,
          showAddRule: false,
        });
      }
    }
    else {
      this.setState({
        showRuleReportLinkage: false,
        itemEditable: true,
      });
      this.selectedRows = [];
      this.selectedRowItem = null;
      this.selectedRow = null;
    }
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
  }

  toggleRuleAssist() {
    let isOpen = this.state.showRuleAssist;
    if (!this.selectedRowItem) {
      this.modalInstance.isDiscardToBeShown = false;
      this.modalInstance.open("Please select a row");
      this.operationName = "";
    } else if (this.selectedRows.length > 1) {
      this.modalInstance.open("Please select only one row");
    } else if ($("button[title='Rule Assist']").prop('disabled')) {
      // do nothing;
    } else {
      if (!isOpen) {
        this.setState({
          showToggleColumns: false,
          showRuleAssist: true,
          showDefAuditHistory: false,
          showRuleReportLinkage: false,
          showAddRule: false,
        });
      }
      else {
        this.setState({
          showRuleAssist: false,
          itemEditable: true,
        });
        this.selectedRows = [];
        this.selectedRowItem = null;
        this.selectedRow = null;
      }
    }
    this.props.fetchBusinesRules(this.currentPage);

  }

  render() {
    console.log("Inside render MaintianBusinessRule........", this.props.login_details);
    if (this.props.business_rules.length) {
      this.cols = this.props.business_rules[0].cols;
      if (!this.selectedViewColumns.length) {
        this.selectedViewColumns = this.cols;
      }
      this.data = this.props.business_rules[0].rows;
      this.count = this.props.business_rules[0].count;
      this.pages = Math.ceil(this.count / 100);
      //if (this.modalType == "Report Linkage") {
        this.linkageData = this.props.report_linkage;
      //}
      //if (this.modalType == "Rule Audit") {
        this.defAuditData = this.props.audit_list;
      //}
      console.log("Linkage data ", this.linkageData);
      return (
        <div className="maintain_business_rules_container form-container x_panel">
          <div className="row">
            <ul className="nav navbar-left">
              <h4>Maintain Business Rules</h4>
            </ul>
            <ul className="nav navbar-right panel_toolbox">
              <li>
                <a className="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                  <i className="fa fa-cubes"></i>
                  <small>{' Sources '}</small>
                  <i className="fa fa-caret-down"></i>
                </a>
                <ul className="dropdown-menu dropdown-usermenu pull-right" style={{ "zIndex": 9999 }}>
                  <li>
                    <ShowToggleColumns
                        columns={this.cols}
                        saveSelection={this.displaySelectedColumns}
                        selectedViewColumns={this.selectedViewColumns}
                        handleClose={this.handleToggle}
                      />
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        {
          this.state.showAddRule ||
          this.state.showRuleReportLinkage ||
          this.state.showDefAuditHistory ||
          this.state.showToggleColumns ||
          this.state.showRuleAssist ||
          <div className="ops_icons">
            <div className="btn-group">
              <button
                data-toggle="tooltip"
                data-placement="top"
                title="Refresh"
                className="btn btn-circle btn-link btn-primary business_rules_ops_buttons btn-xs"
                onClick={
                  (event) => {
                    this.setState({
                      showToggleColumns: false,
                      showRuleAssist: false,
                      showDefAuditHistory: false,
                      showRuleReportLinkage: false,
                    });
                    if ( this.flatGrid ){
                      this.selectedRows = this.flatGrid.deSelectAll();
                    } else {
                      this.selectedRows = [];
                    }
                    this.selectedRowItem = null;
                    this.selectedRow = null;
                    this.selectedRulesAsString = null;
                    //this.currentPage = 0;

                    this.props.fetchBusinesRules(this.currentPage);
                    $("button[title='Rule Details']").prop('disabled', false);
                    if (this.writeOnly) {
                      $("button[title='Delete']").prop('disabled', false);
                      $("button[title='Duplicate']").prop('disabled', false);
                    }
                  }
                }
              >
                <i className="fa fa-refresh"></i>{' Refresh'}
              </button>
            </div>
            <div className="btn-group">
              <button
                data-toggle="tooltip"
                data-placement="top"
                title="Insert"
                onClick={
                  this.handleInsertClick
                }
                className="btn btn-circle btn-link business_rules_ops_buttons btn-xs"
                disabled={!this.writeOnly}
              >
                <i className="fa fa-plus"></i>{' Add'}
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
                className="btn btn-circle btn-link business_rules_ops_buttons btn-xs"
                disabled={!this.writeOnly}
              >
                <i className="fa fa-copy"></i>{' Duplicate'}
              </button>
            </div>
            <div className="btn-group">
              <button
                data-toggle="tooltip"
                data-placement="top"
                title="Rule Details"
                onClick={
                  this.handleUpdateClick
                }
                className="btn btn-circle btn-link business_rules_ops_buttons btn-xs"
              >
                <i className="fa fa-pencil"></i>{' Details'}
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
                className="btn btn-circle btn-link business_rules_ops_buttons btn-xs"
                disabled={!this.writeOnly}
              >
                <i className="fa fa-remove"></i>{' Delete'}
              </button>
            </div>

            <div className="btn-group">
              <button
                onClick={this.handleRuleLinkage}
                data-toggle="tooltip"
                data-placement="top"
                title="Report Link"
                className="btn btn-circle btn-link business_rules_ops_buttons btn-xs"
                disabled={!this.viewOnly}
              >
                <i className="fa fa-link"></i>{' Report Link'}
              </button>
            </div>


            <div className="btn-group">
              <button
                onClick={this.handleDefAuditHistory}
                data-toggle="tooltip"
                data-placement="top"
                title="History"
                className="btn btn-circle btn-link business_rules_ops_buttons btn-xs"
                disabled={!this.viewOnly}
              >
                <i className="fa fa-history"></i>{' History'}
              </button>
            </div>

            <div className="btn-group">
              <button
                data-toggle="tooltip"
                data-placement="top"
                title="Export CSV"
                className="btn btn-circle btn-link business_rules_ops_buttons btn-xs"
                disabled={!this.viewOnly}
                onClick={
                  (event) => {
                    axios.get(`${BASE_URL}business-rule/export_to_csv`)
                      .then(function (response) {
                        console.log("export csv", response);
                        window.location.href = BASE_URL + "../../static/" + response.data.file_name;
                      })
                      .catch(function (error) {
                        console.log(error);
                      });
                  }
                }
              >
                <i className="fa fa-table"></i>{' Export'}
              </button>
            </div>

            <div className="btn-group">
              <button
                data-toggle="tooltip"
                data-placement="top"
                title="Deselect All"
                className="btn btn-circle btn-link business_rules_ops_buttons btn-xs"
                disabled={!this.viewOnly}
                onClick={
                  (event) => {
                    if ( this.flatGrid ){
                      this.selectedRows = this.flatGrid.deSelectAll();
                    } else {
                      this.selectedRows = [];
                    }
                    this.selectedRowItem = null;
                    this.selectedRow = null;
                    this.selectedRulesAsString = null;
                    $("button[title='Rule Details']").prop('disabled', false);
                    if (this.writeOnly) {
                      $("button[title='Delete']").prop('disabled', false);
                      $("button[title='Duplicate']").prop('disabled', false);
                    }
                  }
                }
              >
                <i className="fa fa-window-maximize"></i>{' Deselect'}
              </button>
            </div>

            <div className="btn-group">
              <button
                data-toggle="tooltip"
                data-placement="top"
                title="Select Display Columns"
                className="btn btn-circle btn-link business_rules_ops_buttons btn-xs"
                onClick={this.handleToggle}
              >
                <i className="fa fa-th-large"></i>{' Columns'}
              </button>
            </div>

            <div className="btn-group">
              <button
                data-toggle="tooltip"
                data-placement="top"
                title="Rule Assist"
                className="btn btn-circle btn-link business_rules_ops_buttons btn-xs"
                onClick={this.toggleRuleAssist}
                disabled={!this.writeOnly}
              >
                <i className="fa fa-superscript"></i>{' Rule Assist'}
              </button>
            </div>

            <div>
            <div className="btn-group">
              <button data-toggle="tooltip" data-placement="top" title="First" onClick={(event) => {
                this.currentPage = 0;
                this.props.fetchBusinesRules(this.currentPage, this.orderBy);
                this.forceUpdate();
              }}
                className="btn btn-circle btn-link business_rules_ops_buttons btn-xs">
                <i className="fa fa-fast-backward"></i>
              </button>
            </div>

            <div className="btn-group">
              <button data-toggle="tooltip" data-placement="top" title="Prev" onClick={(event) => {
                if (this.currentPage > 0) {
                  this.currentPage--;
                  this.props.fetchBusinesRules(this.currentPage, this.orderBy);
                  this.forceUpdate();
                }

              }}
                className="btn btn-circle btn-link business_rules_ops_buttons btn-xs">
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
                    if (event.key == "Enter") {
                      if (this.isInt(event.target.value)) {
                        if (event.target.value > this.pages) {
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
                className="form-control btn btn-circle btn-xs" />
            </div>

            <div className="btn-group">
              <button data-toggle="tooltip" data-placement="top" title="Next" onClick={(event) => {
                if (this.currentPage < this.pages - 1) {
                  this.currentPage++;
                  this.props.fetchBusinesRules(this.currentPage, this.orderBy);
                  this.forceUpdate();
                }
              }} className="btn btn-circle btn-link business_rules_ops_buttons btn-xs">
                <i className="fa fa-chevron-right"></i>
              </button>
            </div>


            <div className="btn-group">
              <button data-toggle="tooltip" data-placement="top" title="End" onClick={(event) => {
                this.currentPage = this.pages - 1;
                this.props.fetchBusinesRules(this.currentPage, this.orderBy);
                this.forceUpdate();
              }} className="btn btn-circle btn-link business_rules_ops_buttons btn-xs">
                <i className="fa fa-fast-forward"></i>
              </button>
            </div>
          </div>

          </div>
          }
          {
            this.state.showAddRule &&
            !this.state.showRuleReportLinkage &&
            !this.state.showDefAuditHistory &&
            !this.state.showToggleColumns &&
            !this.state.showRuleAssist &&
            <AddBusinessRule
              businessRule={this.selectedRowItem}
              handleCancel={this.handleAddRule}
              handleClose={this.handleAddRule}
              editable={ this.writeOnly && this.state.itemEditable }
              />
          }
          {
            !this.state.showAddRule &&
            this.state.showRuleReportLinkage &&
            !this.state.showDefAuditHistory &&
            !this.state.showToggleColumns &&
            !this.state.showRuleAssist &&
            <RuleReportLinkage
              data={ this.linkageData }
              ruleReference={ this.selectedRulesAsString }
              handleClose={this.handleRuleLinkage}
              />
          }
          {
            !this.state.showAddRule &&
            !this.state.showRuleReportLinkage &&
            this.state.showDefAuditHistory &&
            !this.state.showToggleColumns &&
            !this.state.showRuleAssist &&
            <DefAuditHistory
              data={ this.defAuditData }
              historyReference={ this.selectedRulesAsString }
              handleClose={this.handleDefAuditHistory}
              />
          }
          {
            !this.state.showAddRule &&
            !this.state.showRuleReportLinkage &&
            !this.state.showDefAuditHistory &&
            this.state.showToggleColumns &&
            !this.state.showRuleAssist &&
              <ShowToggleColumns
                  columns={this.cols}
                  saveSelection={this.displaySelectedColumns}
                  selectedViewColumns={this.selectedViewColumns}
                  handleClose={this.handleToggle}
                />
          }
          {
            !this.state.showAddRule &&
            !this.state.showRuleReportLinkage &&
            !this.state.showDefAuditHistory &&
            !this.state.showToggleColumns &&
            this.state.showRuleAssist &&
              <RuleAssist
                rule={this.selectedRowItem}
                sourceTable={this.source_table[0]}
                cancelEditing={this.toggleRuleAssist}
                handleSaveEditing={this.handleSaveEditing.bind(this)}
                handleClose={this.toggleRuleAssist}
                editable={ this.writeOnly && this.state.itemEditable }
              />
          }
          {
            !this.state.showAddRule &&
            !this.state.showRuleReportLinkage &&
            !this.state.showDefAuditHistory &&
            !this.state.showToggleColumns &&
            !this.state.showRuleAssist &&
            <RegOpzFlatGrid
              columns={this.selectedViewColumns}
              dataSource={this.data}
              onSelectRow={this.handleSelectRow.bind(this)}
              onUpdateRow={this.handleUpdateRow.bind(this)}
              onSort={this.handleSort.bind(this)}
              onFilter={this.handleFilter.bind(this)}
              onFullSelect={this.handleFullSelect.bind(this)}
              readOnly={!this.writeOnly}
              ref={(flatGrid) => { this.flatGrid = flatGrid }}
            />
          }
          <ModalAlert
            onClickOkay={
              () => {
                if (this.operationName == "DELETE") {
                  this.setState({ showAuditModal: true });
                }

                if (this.operationName == "INSERT") {
                  console.log("this.operationName........Inside if condition........", this.operationName);
                  this.setState({ showAuditModal: true });
                }

                if (this.operationName == "UPDATE") {
                  console.log("this.operationName........Inside if condition........", this.operationName);
                  this.setState({ showAuditModal: true });

                }
              }
            }
            onClickDiscard={
              () => {
                //  TODO:
              }
            }
            ref={
              (modal) => {
                this.modalInstance = modal
              }
            }
          />

          < AuditModal showModal={this.state.showAuditModal}
            onClickOkay={this.handleAuditOkayClick.bind(this)}
          />
        </div>
      )
    } else {
      return (
        <h1>Loading...</h1>
      )
    }
  }

  handlePageClick(event) {
    event.preventDefault();
    this.props.fetchBusinesRules($(event.target).text());
  }
  handleSelectRow(rownum, item) {
    if (this.selectedRows.length > 0) {
      console.log("I am called at ", item, rownum);
      this.selectedRow = rownum;
      this.selectedRowItem = item;
      this.setState({itemEditable: item.dml_allowed == "Y"});
      this.source_table = this.props.sources.source_suggestion.filter((element) => {
          return (element.source_id == this.selectedRowItem['source_id']);
      })
      console.log("table_name",this.source_table);
    }
    else {
      console.log("I am called at else ", item, rownum);
      this.selectedRow = 0;
      this.selectedRowItem = null;
    }

    if (this.selectedRows.length > 1) {
      console.log($("button [title='Delete']"));
      $("button[title='Delete']").prop('disabled', true);
      $("button[title='Rule Details']").prop('disabled', true);
      $("button[title='Duplicate']").prop('disabled', true);
      //console.log("Button property........:",$("button[title='Delete']").prop('disabled'));

    }
    else {
      if (this.selectedRows.length == 1 && this.selectedRows[0]['dml_allowed'] == 'N') {
        $("button[title='Delete']").prop('disabled', true);
        //$("button[title='Rule Details']").prop('disabled', true);
        $("button[title='Duplicate']").prop('disabled', true);
      }
      else {
        $("button[title='Rule Details']").prop('disabled', false);
        if (this.writeOnly) {
          $("button[title='Delete']").prop('disabled', false);
          $("button[title='Duplicate']").prop('disabled', false);
        }
      }
    }
  }
  handleInsertClick(event) {
    //this.props.insertBusinessRule(this.newItem, this.selectedRow);
    //hashHistory.push(`/dashboard/maintain-business-rules/add-business-rule?request=add`);
    this.setState({itemEditable: true});
    this.selectedRows = [];
    this.selectedRowItem = null;
    this.selectedRow = null;
    this.handleAddRule(event);
  }
  handleDuplicateClick(event) {
    if (this.selectedRows.length == 0) {
      this.modalInstance.isDiscardToBeShown = false;
      this.modalInstance.open("Please select at least one row");
    } else if (this.selectedRows.length > 1) {
      this.modalInstance.isDiscardToBeShown = false;
      this.modalInstance.open("Please select only one row");
    } else if ($("button[title='Duplicate']").prop('disabled')) {
      // do nothing;
    } else {
      // let data = {
      //   table_name:"business_rules",
      //   update_info:this.selectedRows[0]
      // };
      this.operationName = "INSERT";
      this.updateInfo = this.selectedRows[0];
      this.modalInstance.isDiscardToBeShown = true;
      this.modalInstance.open(`Are you sure to duplicate this row (business rule: ${this.selectedRowItem['business_rule']}) ?`);
      // this.props.insertBusinessRule(data, this.selectedRow);
    }
  }

  handleDeleteClick(event) {
    if (!this.selectedRowItem) {
      this.modalInstance.isDiscardToBeShown = false;
      this.modalInstance.open("Please select a row");
      this.operationName = "";
    } else if (this.selectedRows.length > 1) {
      this.modalInstance.open("Please select only one row");
    } else if ($("button[title='Delete']").prop('disabled')) {
      // do nothing;
    } else {
      this.modalInstance.isDiscardToBeShown = true;
      this.operationName = "DELETE";
      this.modalInstance.open(`Are you sure to delete this row (business rule: ${this.selectedRowItem['business_rule']}) ?`)
      //this.props.deleteBusinessRule(this.selectedRowItem['id'], this.selectedRow);
    }
  }
  handleUpdateClick(event) {
    if (!this.selectedRowItem) {
      this.modalInstance.isDiscardToBeShown = false;
      this.modalInstance.open("Please select a row");
      this.operationName = "";
    } else if (this.selectedRows.length > 1) {
      this.modalInstance.open("Please select only one row");
    } else if ($("button[title='Rule Details']").prop('disabled')) {
      // do nothing;
    } else {
      console.log("Before handleAddRule call");
      this.handleAddRule(event);
    }
  }
  handleSaveEditing(currentFormula){
    console.log('inside saveEditing');
    this.setState({ showRuleAssist: false });
    if(this.selectedRowItem.python_implementation != currentFormula){
      this.updateInfo = this.selectedRowItem;
      this.updateInfo.python_implementation = currentFormula;
      this.operationName = "UPDATE";
      this.modalInstance.isDiscardToBeShown = true;
      this.modalInstance.open(
        <div>
          Are you sure to update the logic for: {this.selectedRowItem.business_rule}?
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Old Logic</th>
                <th>New Logic</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{this.selectedRowItem.python_implementation}</td>
                <td>{currentFormula}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }
    this.selectedRows = null;
    this.selectedRowItem = null;
    this.selectedRow = null;
  }

  handleUpdateRow(item) {
    console.log("The final value in MaintainBusinessRules component", item);
    this.operationName = "UPDATE";
    this.updateInfo = item;
    this.setState({ showAuditModal: true });
    //this.props.updateBusinessRule(data);
  }

  handleSort(colName, direction) {
    this.orderBy = { colName: colName, direction: direction };
    this.props.fetchBusinesRules(this.currentPage, { colName: colName, direction: direction });
    $(".flat_grid_header_sort_button > i").removeClass("fa-caret-up");
    $(".flat_grid_header_sort_button > i").addClass("fa-caret-down");
  }

  showLinkage(event) {

    var params = {};
    params.business_rule_list = [];
    params.rule_id_list = [];
    for (let i = 0; i < this.selectedRows.length; i++) {
      params.source_id = this.selectedRows[0].source_id;
      params.business_rule_list.push(this.selectedRows[i].business_rule);
      params.rule_id_list.push(this.selectedRows[i].id);
    }
    this.modalType = "Report Linkage";
    this.selectedRulesAsString = params.business_rule_list.toString();
    this.selectedRulesIdAsString = params.rule_id_list.toString();
    this.props.fetchReportLinkage(params);
    //this.setState({ isModalOpen: true })

  }
  showHistory(event) {
    //console.log("Inside showHistory",this.selectedRows.length);
    if (this.selectedRows.length == -1) {
      this.modalInstance.open("Please select at least one row")
    } else {
      var params = {};
      params.business_rule_list = [];
      params.rule_id_list = [];
      for (let i = 0; i < this.selectedRows.length; i++) {
        params.source_id = this.selectedRows[0].source_id;
        params.business_rule_list.push(this.selectedRows[i].business_rule);
        params.rule_id_list.push(this.selectedRows[i].id);
      }
      this.modalType = "Rule Audit";
      this.selectedRulesAsString = params.business_rule_list.toString();
      this.selectedRulesIdAsString = params.rule_id_list.length > 0 ? params.rule_id_list.toString() : "id";
      this.props.fetchAuditList(this.selectedRulesIdAsString, "business_rules");
      //this.setState({ isModalOpen: true })
    }
  }

  handleFilter(condition) {
    this.filterConditions[condition.field_name] = condition.value;
    if (condition.field_name == "rule_execution_order") {
      this.filterConditions[condition.field_name] = parseInt(condition.value);
    }
    if (condition.field_name == "id") {
      this.filterConditions[condition.field_name] = parseInt(condition.value);
    }
    if (condition.value == "") {
      delete this.filterConditions[condition.field_name];
    }
    console.log("Filter condition", this.filterConditions)
    this.flatGrid.filterData(this.filterConditions);
  }
  handleFullSelect(selectedItems) {
    if (selectedItems.length > 0) {
      console.log("Full selected items are ", selectedItems);
      this.selectedRows = selectedItems;
    }
    if (this.selectedRows.length > 1) {
      console.log($("button [title='Delete']"));
      $("button[title='Delete']").prop('disabled', true);
      $("button[title='Rule Details']").prop('disabled', true);
      $("button[title='Duplicate']").prop('disabled', true);
      //console.log("Button property........:",$("button[title='Delete']").prop('disabled'));

    }
    else {
      if (this.selectedRows.length == 1 && this.selectedRows[0]['dml_allowed'] != 'N') {
        $("button[title='Delete']").prop('disabled', true);
        $("button[title='Rule Details']").prop('disabled', true);
        $("button[title='Duplicate']").prop('disabled', true);
      }
      else {
        $("button[title='Rule Details']").prop('disabled', false);
        if (this.writeOnly) {
          $("button[title='Delete']").prop('disabled', false);
          $("button[title='Duplicate']").prop('disabled', false);
        }
      }
    }
  }

  isInt(value) {
    return !isNaN(value) &&
      parseInt(Number(value)) == value &&
      !isNaN(parseInt(value, 10));
  }

  handleAuditOkayClick(auditInfo) {
    let data = {};
    data["change_type"] = this.operationName;
    data["table_name"] = "business_rules";

    if (this.operationName == "DELETE") {
      this.auditInfo = {
        table_name: data["table_name"],
        id: this.selectedRowItem["id"],
        change_type: this.operationName,
        change_reference: `Rule: ${this.selectedRowItem["business_rule"]} of Source: ${this.selectedRowItem["source_id"]}`,
        maker: this.props.login_details.user
      };
      Object.assign(this.auditInfo, auditInfo);
      data["audit_info"] = this.auditInfo;

      this.props.deleteBusinessRule(data, this.selectedRowItem['id'], this.selectedRow);
      this.selectedRowItem = null;
      this.selectedRow = null;
      this.setState({ showAuditModal: false });
    }

    if (this.operationName == "UPDATE") {
      this.auditInfo = {
        table_name: data["table_name"],
        id: this.updateInfo["id"],
        change_type: this.operationName,
        change_reference: `Rule: ${this.updateInfo["business_rule"]} of Source: ${this.updateInfo["source_id"]}`,
        maker: this.props.login_details.user
      };
      Object.assign(this.auditInfo, auditInfo);
      data["audit_info"] = this.auditInfo;
      data["update_info"] = this.updateInfo;

      this.props.updateBusinessRule(data);
      this.setState({ showAuditModal: false });
    }

    if (this.operationName == "INSERT") {
      this.auditInfo = {
        table_name: data["table_name"],
        id: null,
        change_type: this.operationName,
        change_reference: `Duplicate of Rule: ${this.selectedRowItem["business_rule"]} of Source: ${this.selectedRowItem["source_id"]}`,
        maker: this.props.login_details.user
      };
      Object.assign(this.auditInfo, auditInfo);
      data["audit_info"] = this.auditInfo;
      data["update_info"] = this.updateInfo;

      this.props.insertBusinessRule(data, this.selectedRow);
      this.setState({ showAuditModal: false });
    }


  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchBusinesRules: (page, order) => {
      dispatch(actionFetchBusinessRules(page, order))
    },
    insertBusinessRule: (item, at) => {
      dispatch(actionInsertBusinessRule(item, at))
    },
    deleteBusinessRule: (data, item, at) => {
      dispatch(actionDeleteBusinessRule(data, item, at))
    },
    updateBusinessRule: (item) => {
      dispatch(actionUpdateBusinessRule(item))
    },
    fetchReportLinkage: (params) => {
      dispatch(actionFetchReportLinkage(params))
    },
    fetchAuditList: (idList, tableName) => {
      dispatch(actionFetchAuditList(idList, tableName));
    },
    fetchSources:(sourceId) => {
      dispatch(actionFetchSources(sourceId));
    },

  }
}

function mapStateToProps(state) {
  return {
    business_rules: state.business_rules,
    report_linkage: state.report_linkage,
    audit_list: state.def_change_store.audit_list,
    login_details: state.login_store,
    sources: state.maintain_report_rules_store.sources,
  }
}

const VisibleMaintainBusinessRules = connect(
  mapStateToProps,
  mapDispatchToProps
)(MaintainBusinessRules);

export default VisibleMaintainBusinessRules;
