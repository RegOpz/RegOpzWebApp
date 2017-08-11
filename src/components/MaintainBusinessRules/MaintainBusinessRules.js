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
      isModalOpen: false,
      showAuditModal: false,
      showToggleColumns: false,
      showRuleAssist: false
    };

    this.msg = "";
    this.modalInstance = null;
    this.linkageData = null;
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
        showRuleAssist: false
      });
    }
    else {
      this.setState({ showToggleColumns: false });
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
          showRuleAssist: true
        });
      }
      else {
        this.setState({ showRuleAssist: false });
      }
    }

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
      if (this.modalType == "Report Linkage") {
        this.linkageData = this.props.report_linkage;
      }
      if (this.modalType == "Rule Audit") {
        this.linkageData = this.props.audit_list;
      }
      console.log("Linkage data ", this.linkageData);
      return (
        <div className="maintain_business_rules_container">
          <Breadcrumbs
            routes={this.props.routes}
            params={this.props.params}
            wrapperClass="breadcrumb"
          />
          <h1>Maintain Business Rules</h1>
          <div className="ops_icons">
            <div className="btn-group">
              <button
                data-toggle="tooltip"
                data-placement="top"
                title="Refresh"
                className="btn btn-circle btn-primary business_rules_ops_buttons btn-xs"
                onClick={
                  (event) => {
                    this.selectedRows = this.flatGrid.deSelectAll();
                    this.selectedRowItem = null;
                    this.selectedRow = null;
                    //this.currentPage = 0;
                    this.props.fetchBusinesRules(this.currentPage);
                    if (this.writeOnly) {
                      $("button[title='Delete']").prop('disabled', false);
                      $("button[title='Update']").prop('disabled', false);
                      $("button[title='Duplicate']").prop('disabled', false);
                    }
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
                className="btn btn-circle btn-success business_rules_ops_buttons btn-xs"
                disabled={!this.writeOnly}
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
                  this.handleDuplicateClick.bind(this)
                }
                className="btn btn-circle btn-success business_rules_ops_buttons btn-xs"
                disabled={!this.writeOnly}
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
                className="btn btn-circle btn-primary business_rules_ops_buttons btn-xs"
                disabled={!this.writeOnly}
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
                className="btn btn-circle btn-warning business_rules_ops_buttons btn-xs"
                disabled={!this.writeOnly}
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
                className="btn btn-circle btn-primary business_rules_ops_buttons btn-xs">
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
                className="btn btn-circle btn-primary business_rules_ops_buttons btn-xs">
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
                className="form-control" />
            </div>

            <div className="btn-group">
              <button data-toggle="tooltip" data-placement="top" title="Next" onClick={(event) => {
                if (this.currentPage < this.pages - 1) {
                  this.currentPage++;
                  this.props.fetchBusinesRules(this.currentPage, this.orderBy);
                  this.forceUpdate();
                }
              }} className="btn btn-circle btn-primary business_rules_ops_buttons btn-xs">
                <i className="fa fa-chevron-right"></i>
              </button>
            </div>


            <div className="btn-group">
              <button data-toggle="tooltip" data-placement="top" title="End" onClick={(event) => {
                this.currentPage = this.pages - 1;
                this.props.fetchBusinesRules(this.currentPage, this.orderBy);
                this.forceUpdate();
              }} className="btn btn-circle btn-primary business_rules_ops_buttons btn-xs">
                <i className="fa fa-fast-forward"></i>
              </button>
            </div>


            <div className="btn-group">
              <button
                onClick={this.showLinkage.bind(this)}
                data-toggle="tooltip"
                data-placement="top"
                title="Report Link"
                className="btn btn-circle btn-info business_rules_ops_buttons btn-xs"
                disabled={!this.viewOnly}
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
                className="btn btn-circle btn-primary business_rules_ops_buttons btn-xs"
                disabled={!this.viewOnly}
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
                <i className="fa fa-table"></i>
              </button>
            </div>

            <div className="btn-group">
              <button
                data-toggle="tooltip"
                data-placement="top"
                title="Deselect All"
                className="btn btn-circle btn-default business_rules_ops_buttons btn-xs"
                disabled={!this.viewOnly}
                onClick={
                  (event) => {
                    this.selectedRows = this.flatGrid.deSelectAll();
                    this.selectedRowItem = null;
                    this.selectedRow = null;
                    if (this.writeOnly) {
                      $("button[title='Delete']").prop('disabled', false);
                      $("button[title='Update']").prop('disabled', false);
                      $("button[title='Duplicate']").prop('disabled', false);
                    }
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
                title="Select Dsiplay Columns"
                className="btn btn-circle btn-default business_rules_ops_buttons btn-xs"
                onClick={this.handleToggle}
              >
                <i className="fa fa-th-large"></i>
              </button>
            </div>

            <div className="btn-group">
              <button
                data-toggle="tooltip"
                data-placement="top"
                title="Rule Assist"
                className="btn btn-circle btn-default business_rules_ops_buttons btn-xs"
                onClick={this.toggleRuleAssist}
              >
                <i className="fa fa-superscript"></i>
              </button>
            </div>

          </div>
          {
            this.state.showToggleColumns && !this.state.showRuleAssist &&
              <ShowToggleColumns
                columns={this.cols}
                saveSelection={this.displaySelectedColumns}
              />
          }
          {
            this.state.showRuleAssist && !this.state.showToggleColumns &&
              <RuleAssist
                rule={this.selectedRowItem}
                sourceTable={this.source_table[0]}
                cancelEditing={this.toggleRuleAssist}
                handleSaveEditing={this.handleSaveEditing.bind(this)}
              />
          }
          {
            !this.state.showRuleAssist && !this.state.showToggleColumns &&
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
          <Modal
            show={this.state.isModalOpen}
            container={this}
            onHide={(event) => {
              this.setState({ isModalOpen: false });
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>{this.modalType} for <h6>{this.selectedRulesAsString}</h6></Modal.Title>
            </Modal.Header>

            <Modal.Body>
              {this.renderModalBody(this.modalType, this.linkageData, this.selectedRulesAsString)}
            </Modal.Body>

            <Modal.Footer>
              <Button onClick={(event) => {
                this.setState({ isModalOpen: false })
              }}>Ok</Button>
            </Modal.Footer>
          </Modal>

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
  renderModalBody(modalType, modalData, selectedRulesAsString) {
    console.log("Modal type", modalType, modalData);
    if (modalType == "Report Linkage") {
      return this.renderReportLinkage(modalData, selectedRulesAsString);
    }
    if (modalType == "Rule Audit") {
      return this.renderChangeHistory(modalData);
    }
  }
  renderReportLinkage(linkageData, selectedRulesAsString) {
    console.log("Modal linkage data", linkageData);
    if (!linkageData || typeof (linkageData) == 'undefined' || linkageData == null || linkageData.length == 0)
      return (
        <div>
          <h4>No linked report found!</h4>
        </div>
      )
    else {
      return (
        <table className="table table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Report</th>
              <th>Sheet</th>
              <th>Cell</th>
              <th>InUse</th>
              <th>Rules</th>
            </tr>
          </thead>
          <tbody>
            {
              linkageData.map(function (item, index) {
                let cell_business_rules = item.cell_business_rules.toString().split(",");
                const selectedRules = selectedRulesAsString.toString().split(",");
                return (
                  <tr>
                    <th scope="row">{index + 1}</th>
                    <td>{item.report_id}</td>
                    <td>{item.sheet_id}</td>
                    <td>{item.cell_id}</td>
                    <td>
                      {
                        ((in_use) => {
                          if (in_use == 'Y') {
                            return (
                              <Label bsStyle="success">{in_use}</Label>
                            );
                          } else {
                            return (<Label bsStyle="warning">{in_use}</Label>);
                          }
                        })(item.in_use)
                      }
                    </td>
                    <td><p>{
                      ((rules, selectedRules) => {
                        let rule_list = [];
                        rules.map(function (rule, index) {
                          if (selectedRules.indexOf(rule) == -1) {
                            rule_list.push(rule);
                            rule_list.push(" ");
                          } else {
                            rule_list.push(<Label bsStyle="primary">{rule}</Label>);
                            rule_list.push(" ");
                          }
                        })
                        return rule_list;
                      })(cell_business_rules, selectedRules)
                    }</p></td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      )
    }
  }
  renderChangeHistory(linkageData) {
    if (!linkageData || typeof (linkageData) == 'undefined' || linkageData == null || linkageData.length == 0)
      return (
        <div>
          <h4>No audit change report found!</h4>
        </div>
      )
    else {
      return (
        <div className="dashboard-widget-content">
          <ul className="list-unstyled timeline widget">
            {
              linkageData.map(function (item, index) {
                return (
                  <li>
                    <div className="block">
                      <div className="block_content">
                        <h2 className="title"></h2>
                        <Media>
                          <Media.Left>
                            <h3>{moment(item.date_of_change ? item.date_of_change : "20170624T203000").format('DD')}</h3>
                            <h6>{moment(item.date_of_change ? item.date_of_change : "20170624").format('MMM')},
                              <small>{moment(item.date_of_change ? item.date_of_change : "20170624").format('YYYY')}</small></h6>
                          </Media.Left>
                          <Media.Body>
                            <Media.Heading>Buisness Rule Change for id: {item.id} <small>[{item.change_reference}]</small></Media.Heading>
                            <h6>
                              <Badge>{item.change_type}</Badge> by {item.maker} on {moment(item.date_of_change).format('ll')} {moment(item.date_of_change).format('LTS')}
                            </h6>
                            <p>{item.maker_comment}</p>
                            <div><h5>Change Summary</h5>

                              {((item) => {
                                if (item.change_type == "UPDATE") {
                                  console.log("Update Info........", item.update_info);
                                  const update_list = item.update_info.map((uitem, uindex) => {
                                    console.log("Uitem.....", uitem);
                                    return (
                                      <tr>
                                        <th scope="row">{uindex + 1}</th>
                                        <td><h6><Label bsStyle="warning">{uitem.field_name}</Label></h6></td>
                                        <td>{uitem.new_val}</td>
                                        <td>{uitem.old_val}</td>
                                      </tr>
                                    );
                                  });
                                  return (
                                    <table className="table table-hover table-content-wrap">
                                      <thead>
                                        <tr>
                                          <th>#</th>
                                          <th>Column</th>
                                          <th>New Value</th>
                                          <th>Old Value</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {update_list}
                                      </tbody>
                                    </table>
                                  );
                                } else {
                                  return (<table className="table table-hover table-content-wrap">
                                    <thead>
                                      <tr>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr><td>This is a {item.change_type} request</td></tr>
                                    </tbody>
                                  </table>
                                  )
                                }
                              })(item)}

                            </div>
                            <div className="clearfix" />
                            <Media>
                              <Media.Left>
                                {
                                  ((status) => {
                                    if (status == "PENDING") {
                                      return (<Label bsStyle="primary">{status}</Label>)
                                    } else if (status == "REJECTED") {
                                      return (<Label bsStyle="warning">{status}</Label>)
                                    } else if (status == "APPROVED") {
                                      return (<Label bsStyle="success">{status}</Label>)
                                    } else {
                                      return (<Label>{status}</Label>)
                                    }
                                  }
                                  )(item.status)}
                              </Media.Left>
                              <Media.Body>
                                <Media.Heading>Verification details</Media.Heading>
                                {
                                  ((status) => {
                                    if (status != "PENDING") {
                                      return (
                                        <h6>
                                          by {item.checker} on {moment(item.date_of_checking).format('ll')} {moment(item.date_of_checking).format('LTS')}
                                        </h6>
                                      )
                                    }
                                  }
                                  )(item.status)}
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
  handlePageClick(event) {
    event.preventDefault();
    this.props.fetchBusinesRules($(event.target).text());
  }
  handleSelectRow(rownum, item) {
    if (this.selectedRows.length > 0) {
      console.log("I am called at ", item, rownum);
      this.selectedRow = rownum;
      this.selectedRowItem = item;
      this.source_table = this.props.sources.source_suggestion.filter((element) => {
          return (element.source_id == this.selectedRowItem['source_id']);
      })
      console.log("table_name",this.source_table);
    }
    else {
      console.log("I am called at ", item, rownum);
      this.selectedRow = 0;
      this.selectedRowItem = null;
    }

    if (this.selectedRows.length > 1) {
      console.log($("button [title='Delete']"));
      $("button[title='Delete']").prop('disabled', true);
      $("button[title='Update']").prop('disabled', true);
      $("button[title='Duplicate']").prop('disabled', true);
      //console.log("Button property........:",$("button[title='Delete']").prop('disabled'));

    }
    else {
      if (this.selectedRows.length == 1 && this.selectedRows[0]['dml_allowed'] == 'N') {
        $("button[title='Delete']").prop('disabled', true);
        $("button[title='Update']").prop('disabled', true);
        $("button[title='Duplicate']").prop('disabled', true);
      }
      else {
        if (this.writeOnly) {
          $("button[title='Delete']").prop('disabled', false);
          $("button[title='Update']").prop('disabled', false);
          $("button[title='Duplicate']").prop('disabled', false);
        }
      }
    }
  }
  handleInsertClick(event) {
    //this.props.insertBusinessRule(this.newItem, this.selectedRow);
    hashHistory.push(`/dashboard/maintain-business-rules/add-business-rule?request=add`);
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
    } else if ($("button[title='Update']").prop('disabled')) {
      // do nothing;
    } else {
      hashHistory.push(`/dashboard/maintain-business-rules/add-business-rule?request=update&index=${this.selectedRow}`)
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
    if (this.selectedRows.length == 0) {
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
      this.modalType = "Report Linkage";
      this.selectedRulesAsString = params.business_rule_list.toString();
      this.selectedRulesIdAsString = params.rule_id_list.toString();
      this.props.fetchReportLinkage(params);
      this.setState({ isModalOpen: true })
    }
  }
  showHistory(event) {
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
      this.setState({ isModalOpen: true })
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
      $("button[title='Update']").prop('disabled', true);
      $("button[title='Duplicate']").prop('disabled', true);
      //console.log("Button property........:",$("button[title='Delete']").prop('disabled'));

    }
    else {
      if (this.selectedRows.length == 1 && this.selectedRows[0]['dml_allowed'] != 'N') {
        $("button[title='Delete']").prop('disabled', true);
        $("button[title='Update']").prop('disabled', true);
        $("button[title='Duplicate']").prop('disabled', true);
      }
      else {
        if (this.writeOnly) {
          $("button[title='Delete']").prop('disabled', false);
          $("button[title='Update']").prop('disabled', false);
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
