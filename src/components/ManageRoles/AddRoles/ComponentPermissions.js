import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router';
import { Label, Checkbox, Tab, Tabs } from 'react-bootstrap';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import { bindActionCreators, dispatch } from 'redux';
import moment from 'moment';
require('./AddRoles.css');

class ComponentPermissions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            role: this.props.role,
            permissions: this.props.componentPermissions,
            rowIndex: -1,
            component: null,
            selectedRecordDetails: null,
        };

        this.columnList = this.columnList.bind(this);
        this.renderComponentPermissions = this.renderComponentPermissions.bind(this);
        this.renderPermissionDetails = this.renderPermissionDetails.bind(this);
        this.onPermissionSelect = this.onPermissionSelect.bind(this);
        this.renderComponentCell = this.renderComponentCell.bind(this);
        this.isDisabled = this.isDisabled.bind(this);
    }

    componentWillMount() {
        //TODO
    }

    componentWillReceiveProps(nextProps){
      if (this.state.role != nextProps.role){
        this.setState({
          role: nextProps.role,
          permissions: nextProps.componentPermissions,
          rowIndex: -1,
          component: null,
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
                this.renderComponentPermissions()
              }
            </div>
            <div className={ "component-list " + (this.props.viewSummary ? "" : "col-md-6 col-sm-6 col-xs-12")}>
              <div className="x_panel">
                {
                  !this.props.viewSummary &&
                  <div className="x_title">
                    <h2>
                      <i className="fa fa-key">  </i>
                      {this.state.component ? ' ' + this.state.component : ' No Component Selected '}
                      <small>Access Permision Details</small>
                    </h2>
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
                                    <i className="fa fa-support">  </i>{' Available Components'}
                                      <small>Select a component to view permissions</small>
                                  </h2>
                                  <div className="clearfix"/>
                                </div>
                              )},
          accessor: 'component',
          Cell: row=>(this.renderComponentCell(row))
        },
      ];

      return columns;
    }

    renderComponentCell(row){
      let edited = JSON.stringify(row.original.permissions).match(/(EDITED)/);
      // let edited = JSON.stringify(row.original.permissions).match(/(CHECKED|UNCHECKED)/);
      // console.log("edited .... ", JSON.stringify(row.original.permissions),edited);
      return(
        <span>
            <i className={ edited != null ? "fa fa-edit blue" : "" }></i>
              &nbsp;{ ' ' + row.original.component}
        </span>
      );
    }

    isDisabled(item){
      return this.state.permissions ?
             (this.props.viewSummary ||
             item.status=="PENDING")
             :false
    }

    isChecked(item){
      return    item.granted
    }

    renderComponentPermissions() {
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
                                         JSON.stringify(row._original.permissions).match(matchText)) : true}
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
                                        let {permissions} = this.state;
                                        let permissionList = permissions.filter(p=>(p.component==rowInfo.original.component));
                                        this.setState({rowIndex:rowInfo.index,
                                                       component: rowInfo.original.component,
                                                       selectedRecordDetails: permissionList[0].permissions,
                                                      },
                                                      ()=>{
                                                          e.target={name : rowInfo.original.component};
                                                          //this.onComponentSelect()
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
      return(
          <div>
          {
            this.state.selectedRecordDetails &&
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Permission</th>
                </tr>
              </thead>
              <tbody>
              {
                  (() => {
                      let permission_list = [];
                      this.state.selectedRecordDetails.map((item, index) => {
                        let pending_approval = item.status == "PENDING";
                        let edited = item.status == "EDITED";
                          permission_list.push(
                            <tr>
                              <td>
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    id={ index }
                                    name={ item.permission }
                                    value={ item.permission }
                                    disabled={ this.isDisabled(item) }
                                    onChange={ (e)=>{this.onPermissionSelect(e)} }
                                    checked={ this.isChecked(item) }
                                  />
                                  <span className="slider round"
                                    title={ item.status=="PENDING"?
                                            "Pending Approval"
                                            :
                                            (item.granted ?
                                              "Granted": "Not Granted")}></span>
                                </label>
                              </td>
                              <td>
                                {item.permission}
                                {
                                  (edited || pending_approval) &&
                                  !this.props.viewSummary &&
                                  <span className={"right " + (pending_approval ? "amber" : "blue")}>
                                    &nbsp;&nbsp;<i className={"fa "+ (pending_approval ? "fa-thumb-tack" : "fa-edit")}></i>
                                  <small>{ pending_approval ?" Pending review":" To be Submitted"}</small>
                                  </span>
                                }
                              </td>
                              </tr>
                          );
                      })
                      permission_list.push(
                        <tr>
                          <td></td>
                          <td></td>
                          </tr>
                        );
                      return permission_list;
                  })(this)
              }
              </tbody>
            </table>
          }
          </div>
      );
    }

    onPermissionSelect(e) {
        let index = e.target.id;
        let {rowIndex,component,permissions,selectedRecordDetails} = this.state;
        let targetName = selectedRecordDetails[index].permission;
        console.log(rowIndex,"Clicked:", targetName, "on", component,permissions[rowIndex]);
        selectedRecordDetails[index].granted = ! selectedRecordDetails[index].granted;
        selectedRecordDetails[index].status = selectedRecordDetails[index].granted != selectedRecordDetails[index].original_granted ?
                                              'EDITED':
                                              null;
        permissions[rowIndex].permissions=selectedRecordDetails;
        console.log(permissions[rowIndex])
        this.setState({permissions,permissions})
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

const VisibleComponentPermissions = connect(
    mapStateToProps,
    mapDispatchToProps
)(ComponentPermissions);

export default VisibleComponentPermissions;
