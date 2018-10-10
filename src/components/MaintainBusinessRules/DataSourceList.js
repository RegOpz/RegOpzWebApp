import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import _ from 'lodash';
require('./MaintainBusinessRules.css');

class DataSourceList extends Component {
  constructor(props){
    super(props)
    this.state = {
      filterText: null,
      navMenu: this.props.navMenu,
    }
    this.dataCatalog = this.props.dataCatalog;
    this.linkageData = this.dataCatalog;
    this.sourcePermissions = this.props.sourcePermissions;
    this.getaccTypeColor = this.getaccTypeColor.bind(this);
    this.associateRulePermission = this.associateRulePermission.bind(this);
  }

  componentWillReceiveProps(nextProps){
      //TODO
      this.dataCatalog = nextProps.dataCatalog;
      this.linkageData = this.dataCatalog;
      this.sourcePermissions = nextProps.sourcePermissions;
      this.setState ({
        filterText: null
      });
  }

  getaccTypeColor(accType){
    switch(accType){
      case "No access": return "red";
      case "Not restricted": return "green";
      case "Restricted": return "amber";
      case "Search matched": return "purple";
      default: return "red";
    }
  }

  associateRulePermission(linkageData){
      let dataSource=[];
      // console.log("this.sourcePermissions...",this.sourcePermissions)
      linkageData.map((source,index)=>{
        let permission = this.sourcePermissions ?
                         this.sourcePermissions.find(function(p){return p.source_id==source.source_id;})
                         :
                         undefined;
        // console.log("permission...",permission)
        let permission_details = {
                                   access_type: 'No access',
                                   access_condition: '',
                                   ruleaccess_type: 'No access',
                                   access_condition: ''
                                 };
        if (permission){
          permission_details = JSON.parse(permission.permission_details);
          permission_details.ruleaccess_type = permission_details.ruleaccess_type ?
                                               permission_details.ruleaccess_type : 'No access';
          permission_details.ruleaccess_condition = permission_details.ruleaccess_condition ?
                                               permission_details.ruleaccess_condition : '';
        }
        dataSource.push({...source,...permission_details});

      });

      return dataSource;
  }


  handleFilter(){

      if(typeof this.dataCatalog != 'undefined' && this.dataCatalog.length ){
        let linkageData = this.associateRulePermission(this.dataCatalog);
        const { filterText } = this.state;
        if (filterText != null) {
            let matchText = RegExp(`(${filterText.toString().toLowerCase().replace(/[,+&\:\ ]$/,'').replace(/[,+&\:\ ]/g,'|')})`,'i');
            console.log("matchText",matchText, linkageData);
            linkageData = linkageData.filter(element =>
                element.source_id.toString().match(matchText) ||
                element.source_file_name.match(matchText) ||
                (element.ruleaccess_type ? element.ruleaccess_type.match(matchText):null) ||
                element.source_description.match(matchText) ||
                element.source_table_name.match(matchText) ||
                (element.country ? element.country.match(matchText):null)
            );
        }
        this.linkageData = linkageData;
      }
  }

  render(){
    this.handleFilter();
    return(
      <div className="x_panel">
        <div className="x_content">
          <div className="input-group">
              <input
                id="filter"
                className="form-control col-md-9 col-sm-9 col-xs-12"
                placeholder="Enter Filter Text"
                value={this.state.filterText}
                onChange={(event) => {
                    this.setState({ filterText: event.target.value });
                }}
              />
              <span className="input-group-addon">
                <i className="fa fa-filter"></i>
              </span>
          </div>
          <div>
            { this.renderDataFeedList(this.linkageData)}
          </div>
        </div>
      </div>
    );
  }

  renderDataFeedList(linkageData){
    if(!linkageData || typeof(linkageData) == 'undefined' || linkageData == null || linkageData.length == 0) {
      return(
        <div>
          <h4>No Data Feed found! Please try a different date range or search criteria.</h4>
        </div>
      )
    }
    else {
      return(
        <div className="dataTables_wrapper form-inline dt-bootstrap no-footer">
          <div className="row">
            { !this.state.navMenu &&
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Source ID</th>
                  <th>Source File Name</th>
                  <th>Description</th>
                  <th>Country</th>
                </tr>
              </thead>
              <tbody>
              {linkageData.map((item,index) => {
                return (
                  <tr key={index}
                    className={ this.getaccTypeColor(item.ruleaccess_type)}
                    onClick={
                      (event)=>{
                        this.props.handleDataFileClick(item)
                      }
                    }>
                    <td>
                      <i className={"fa fa-tags "}></i>
                      &nbsp;{item.source_id}
                    </td>
                    <td>
                      <button
                        className={"btn btn-link btn-xs " + this.getaccTypeColor(item.ruleaccess_type)}
                        onClick={
                          (event)=>{
                            this.props.handleDataFileClick(item)
                          }
                        }
                        >
                        <small>
                          <i className={"fa fa-file-text "}></i>
                          {' '}{item.source_file_name}
                        </small>
                      </button>
                    </td>
                    <td>
                      <p
                        className="truncate-text"
                        data-toggle="tooltip"
                        data-placement="top"
                        title={item.source_description}
                        >
                        {item.source_description}
                      </p>
                    </td>
                    <td>{item.country}</td>
                  </tr>
                )
              })}
            </tbody>
            </table>
          }
          </div>
          {  this.state.navMenu &&
             this.renderNavMenu(linkageData)
          }
        </div>
      )
    }
  }

  renderNavMenu(linkageData) {
    console.log("renderNavMenu...",linkageData);
    return(
        <div className="dataTables_wrapper form-inline dt-bootstrap no-footer">
          <div className="row">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>#ID</th>
                <th>Source File</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {
                linkageData.map((item,index) => (
                  <tr key={index}
                    className={ this.getaccTypeColor(item.ruleaccess_type) }
                    onClick={
                      (event)=>{
                        this.props.handleDataFileClick(item)
                      }
                    }>
                    <td>
                      <i className={"fa fa-tags "}></i>
                      &nbsp;{item.source_id}
                    </td>
                    <td>
                      <button
                        className={"btn btn-link btn-xs " + this.getaccTypeColor(item.ruleaccess_type)}
                        onClick={
                          (event)=>{
                            this.props.handleDataFileClick(item)
                          }
                        }
                        >
                        <small>
                          <i className="fa fa-file-text"></i>
                          {' '}{item.source_file_name}
                        </small>
                      </button>
                    </td>
                    <td>{item.country}</td>
                  </tr>
                  )
                )
              }
            </tbody>
          </table>
          </div>
        </div>
    );
  }
}

export default DataSourceList;
