import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router';
import { Label, Checkbox, Tab, Tabs } from 'react-bootstrap';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { bindActionCreators, dispatch } from 'redux';
import moment from 'moment';
require('./AddRoles.css');

class ReportPermissions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            role: this.props.role,
            permissions: this.props.reportPermissions,
            rowIndex: -1,
            report_id: null,
            selectedRecordDetails: this.props.viewSummary ?
                                    null
                                    :
                                    {
                                     access_type: 'No access',
                                     },
            setDefault: true,
            setDefaultAll: false,
            setDefaultRemaining: true,
        };

        this.columnList = this.columnList.bind(this);
        this.renderReportPermissions = this.renderReportPermissions.bind(this);
        this.renderPermissionDetails = this.renderPermissionDetails.bind(this);
        this.renderSourceCell = this.renderSourceCell.bind(this);
        this.getaccTypeColor = this.getaccTypeColor.bind(this);
        this.isDisabled = this.isDisabled.bind(this);
        this.saveDefaultAccess = this.saveDefaultAccess.bind(this);
        this.resetAccess = this.resetAccess.bind(this);
    }

    componentWillMount() {
        //TODO
    }

    componentWillReceiveProps(nextProps){
      if (this.state.role != nextProps.role){
        this.setState({
          role: nextProps.role,
          permissions: nextProps.reportPermissions,
          rowIndex: -1,
          report_id: null,
          selectedRecordDetails: null,
        });
      }
    }

    render() {
        return(
          <div>
            <br/>
            <div className={ "component-list " + (this.props.viewSummary ? "" : "col-md-6 col-sm-6 col-xs-12")}>
              {
                this.renderReportPermissions()
              }
            </div>
            <div className={ "component-list " + (this.props.viewSummary ? "" : "col-md-6 col-sm-6 col-xs-12")}>
              <div className="x_panel">
                {
                  !this.props.viewSummary &&
                  <div className="x_title">
                    <h2>
                      <i className="fa fa-file-excel-o">  </i>
                      {this.state.report_id ? ' ' + this.state.report_id : ' Set Default Access '}
                      <small>Access Permision Details</small>
                    </h2>
                    <ul className="nav navbar-right panel_toolbox">
                    {
                      !this.state.setDefault &&
                      <li>
                        <button
                          className="btn btn-default btn-xs"
                          type="button"
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Set Default Access for Reports"
                          onClick={()=>{
                            this.setState({
                                           rowIndex: -1,
                                           report_id: null,
                                           setDefault: !this.state.setDefault,
                                           selectedRecordDetails: {
                                                        access_type: 'No access',
                                                        },
                                            setDefaultAll: false,
                                            setDefaultRemaining: true,
                                            });
                              }
                            }
                          >
                          <i className="fa fa-magic" title="Set Default"></i>
                        </button>
                      </li>
                    }
                    {
                      this.state.setDefault &&
                      <li>
                        <button
                          type="button"
                          className="btn btn-success btn-xs col-md-offset-10."
                          onClick={
                            ()=>{ this.saveDefaultAccess()}
                          }
                          >
                          <i className="fa fa-save" title="Propagate Default Access"></i>
                        </button>
                      </li>
                    }
                      <li>
                        <button
                          type="button"
                          className="btn btn-default btn-xs col-md-offset-10."
                          onClick={
                            ()=>{ this.resetAccess()}
                          }
                          >
                          <i className="fa fa-undo" title="Reset Changes"></i>
                        </button>
                      </li>
                    </ul>
                    <div className="clearfix"/>
                  </div>
                }
                <div className="x_content">
                  {
                    this.renderPermissionDetails()
                  }
                </div>
              </div>
            </div>
          </div>
        );
    }

    columnList(){
      let columns= [
        {
          Header: () => { if (this.props.viewSummary){
                            return(<div></div>)
                          }

                          return(
                                <div className="x_title">
                                  <h2>
                                    <i className="fa fa-file-text">  </i>{' Available Reports'}
                                      <small>Select a Report to view permissions</small>
                                  </h2>
                                  <div className="clearfix"/>
                                </div>
                              )},
          accessor: 'report_id',
          Cell: row=>(this.renderSourceCell(row))
        },
      ];

      return columns;
    }

    getaccTypeColor(accType,row){
      switch(accType){
        case "No access": return "red";
        case "Not restricted": return "green";
        default: return "red";
      }
    }

    isDisabled(){
      return this.state.permissions && this.state.rowIndex != -1 ?
             (this.props.viewSummary ||
             this.state.permissions[this.state.rowIndex].status=="PENDING")
             :false
    }

    saveDefaultAccess(){
      let {rowIndex, permissions,selectedRecordDetails} = this.state;
      permissions.map((source,index)=>{

        if (rowIndex == -1){
          let permissionDetails = JSON.parse(source.permission_details);
          if ( (
                  (source.status != "PENDING" &&  source.in_use !='Y' && this.state.setDefaultRemaining) ||
                  (source.status != "PENDING" && this.state.setDefaultAll)
                )
              ) {
                console.log("report permission...",source);
                permissions[index].status = ! _.isEqual(JSON.parse(source.original_permission_details),selectedRecordDetails) ?
                                                      'EDITED':
                                                      null;
                permissions[index].permission_details=JSON.stringify(selectedRecordDetails)
          }
        }
      });
      this.setState({permissions})
    }

    resetAccess(){
      let {permissions} = this.state;
      permissions.map((source,index)=>{

        if (source.status != 'PENDING'){
            let permissionDetails = JSON.parse(source.original_permission_details);
            permissions[index].status = permissions[index].status !='EDITED' ?
                                                        permissions[index].status:
                                                        null;
            permissions[index].permission_details=JSON.stringify(permissionDetails)
        }
      });
      this.setState({
                      rowIndex: -1,
                      report_id: null,
                      permissions: permissions,
                      selectedRecordDetails: this.props.viewSummary ?
                                              null
                                              :
                                              {
                                               access_type: 'No access',
                                               },
                      setDefault: true,
                      setDefaultAll: false,
                      setDefaultRemaining: true,
                    })
    }

    renderSourceCell(row){
      let rec = JSON.parse(row.original.permission_details);
      let pending_approval = row.original.status == "PENDING";
      let edited = row.original && ! _.isEqual(JSON.parse(row.original.original_permission_details),rec);
      let accessTypeColor = this.getaccTypeColor(rec.access_type);

      return(
        <span className="wrap-text">
            <i className={"fa fa-file-excel-o " + accessTypeColor}></i>&nbsp;
            <i className={ pending_approval ? "fa fa-thumb-tack amber" :""}></i>
            <i className={ edited ? "fa fa-edit blue" :""}></i>
              &nbsp;Report ID
              <strong> {' ' + row.original.report_id } </strong>
              of format <strong> {' ' + row.original.report_type}</strong>
          </span>
      );
    }

    renderReportPermissions() {
        //if (this.state.permissions != null) {
            return(
                <div className="">
                  {
                    this.state.permissions &&
                    <ReactTable
                      data={ this.state.permissions }
                      filterable={true}
                      pageSize={this.props.viewSummary? 3 : 7}
                      showPageSizeOptions= {false}
                      showPageJump = { false }
                      className="-highlight -striped"
                      columns={this.columnList()}
                      defaultFilterMethod = {(filter, row, column) => {
                        const id = filter.pivotId || filter.id
                        console.log("row in filter",row)
                        let matchText = RegExp(`(${filter.value.toString().toLowerCase().replace(/[,+&\:]$/,'').replace(/[,+&\:]/g,'|')})`,'i');
                        return row[id] !== undefined ?
                                        (String(row[id]).match(matchText) ||
                                         String(row._original.status).match(matchText) ||
                                         String(row._original.permission_details).match(matchText) ||
                                         String(row._original.report_description).match(matchText) ||
                                         String(row._original.report_type).match(matchText)) : true}
                      }
                      getTrProps={(state, rowInfo, column) => {
                                    let isSelected = rowInfo && rowInfo.index==this.state.rowIndex;
                                    // console.log("isSelected..", this.state.rowIndex, rowInfo.index)
                                    return {
                                        style : {
                                            background: isSelected  ? '#4682b4' : '',
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
                                        console.log("rowInfo...",rowInfo)
                                        this.setState({rowIndex:rowInfo.index,
                                                       report_id: rowInfo.original.report_id,
                                                       selectedRecordDetails: JSON.parse(rowInfo.original.permission_details),
                                                       setDefault: false,
                                                      },
                                                      ()=>{
                                                          e.target={name : rowInfo.original.report_type};
                                                          // this.onComponentSelect(e)
                                                        }
                                                      )


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
                  }
                </div>
          );
      //}
    }

    renderPermissionDetails(){
      let accessType = this.state.selectedRecordDetails ? this.state.selectedRecordDetails.access_type : "";
      return(
          <div>
          {
            this.state.selectedRecordDetails &&
            <div className="form-horizontal form-label-left">
              <div className="form-group">
                <label className="control-label col-md-6 col-sm-6 col-xs-12" htmlFor="table-accessType">
                  <i className={"fa fa-file-excel-o " + this.getaccTypeColor(accessType)}></i>{' Access Type '}
                  <span className="required">*</span>
                </label>
                {
                  this.props.viewSummary &&
                  <div className="col-md-6 col-sm-6 col-xs-12">{ this.state.selectedRecordDetails ? this.state.selectedRecordDetails.access_type: "No access" }</div>
                }
                {
                  !this.props.viewSummary &&
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <select
                      name="accessType"
                      placeholder="Access Type"
                      value={ this.state.selectedRecordDetails ? this.state.selectedRecordDetails.access_type: "No access" }
                      type="text"
                      id="table-accessType"
                      required={"required"}
                      className="form-control col-md-7 col-xs-12"
                      disabled={this.isDisabled()}
                      onChange={
                        (e)=>{
                          let {rowIndex,permissions,selectedRecordDetails} = this.state;
                          selectedRecordDetails.access_type = e.target.value;
                          if(rowIndex != -1) {
                            permissions[rowIndex].status = ! _.isEqual(JSON.parse(permissions[rowIndex].original_permission_details),selectedRecordDetails)?
                                                                  'EDITED':
                                                                  null;
                            permissions[this.state.rowIndex].permission_details=JSON.stringify(selectedRecordDetails)
                          }
                          this.setState({permissions,selectedRecordDetails})
                        }
                      }
                    >
                    <option key={"No access"} value={"No access"}>No access</option>
                    <option key={"Not restricted"} value={"Not restricted"}>Not restricted</option>
                  </select>
                  </div>
                }
              </div>
              {
                this.state.setDefault &&
                <div className="form-group">
                  <label className="switch control-label col-md-3 col-sm-3 col-xs-12">
                    <input
                      type="checkbox"
                      id={ "setDefaultOption" }
                      name={ "setDefaultOption" }
                      value={ this.state.setDefaultAll }
                      onChange={ (e)=>{this.setState({setDefaultAll: !this.state.setDefaultAll,
                                                      setDefaultRemaining: !this.state.setDefaultRemaining})} }
                      checked={ this.state.setDefaultAll }
                    />
                    <span className="slider round"></span>

                  </label>
                  <div className="control-label col-md-9 col-sm-9 col-xs-12 ">
                    &nbsp;&nbsp;&nbsp;{"Set default permission for ALL Reports, overrides all existing access permissions"}
                  </div>
                </div>
              }
              {

                this.state.setDefault &&
                <div className="form-group">
                  <label className="switch control-label col-md-3 col-sm-3 col-xs-12">
                    <input
                      type="checkbox"
                      id={ "setDefaultOptionRemaining" }
                      name={ "setDefaultOptionRemaining" }
                      value={ this.state.setDefaultRemaining }
                      onChange={ (e)=>{this.setState({setDefaultAll: !this.state.setDefaultAll,
                                                      setDefaultRemaining: !this.state.setDefaultRemaining})} }
                      checked={ this.state.setDefaultRemaining }
                    />
                    <span className="slider round"></span>
                  </label>
                  <div className="control-label col-md-9 col-sm-9 col-xs-12">
                    &nbsp;&nbsp;&nbsp;{"Set default permission for REMAINING Reports which do not have any access permission defined"}
                  </div>
                </div>
              }
              <div className="x_content">
                <div className="left">
                  <i className="fa fa-info-circle blue"></i>
                </div>
                <div className="right">&nbsp;<strong>Report Description</strong>
                  <p className={"preserve-text overflow_auto " + (this.props.viewSummary ? "fixed_height_100" : "fixed_height_200")}>
                    {
                      this.state.rowIndex == -1 ?
                      "This will set the default permission for the selected Reports."
                      :
                      this.state.permissions[this.state.rowIndex].report_description
                    }
                  </p>
                </div>
              </div>
            </div>
          }
          </div>
      );
    }

}

function mapStateToProps(state) {
    return {
        login_details:state.login_store,
    };
}

const mapDispatchToProps = (dispatch) => {
  return {
    //TODO
  };
};

const VisibleReportPermissions = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportPermissions);

export default VisibleReportPermissions;
