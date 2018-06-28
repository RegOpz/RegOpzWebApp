import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import _ from 'lodash';
import DatePicker from 'react-datepicker';
import moment from 'moment';
require('react-datepicker/dist/react-datepicker.css');

class ReportVersionsList extends Component {
  constructor(props){
    super(props)
    this.state = {
      filterText: null,
    }
    this.dataCatalog = this.props.dataCatalog.data_sources;
    this.linkageData = this.dataCatalog;
    this.handleFilter = this.handleFilter.bind(this);
  }

  componentWillReceiveProps(nextProps){
      //TODO
      this.dataCatalog = nextProps.dataCatalog.data_sources;
      this.linkageData = this.dataCatalog;
      this.setState ({
        filterText: null
      });
  }

  handleFilter(){

      if(typeof this.dataCatalog != 'undefined' && this.dataCatalog.length ){
        let linkageData = this.dataCatalog;
        const { filterText } = this.state;

        if (filterText != null) {
            let matchText = RegExp(`(${filterText.toString().toLowerCase().replace(/[,+&\:\ ]$/,'').replace(/[,+&\:\ ]/g,'|')})`,'i');
            console.log("matchText",matchText);
            linkageData = linkageData.filter(element =>
                element.version.toString().match(matchText) ||
                element.country.match(matchText) ||
                (element.report_create_status ? element.report_create_status : "").match(matchText) ||
                (element.report_created_by ? element.report_created_by : "").match(matchText) ||
                moment(element.as_of_reporting_date).format("DD-MMM-YYYY").match(matchText) ||
                moment(element.report_create_date).format("DD-MMM-YYYY").match(matchText)
            );
        }
        this.linkageData = linkageData;
      }
  }

  render(){
    console.log("ReportVersionsList....",this.linkageData);
    this.handleFilter();
    return(
      <div className="x_panel">
        <div className="x_title">
          <h2>Available Versions <small> for the selected report</small></h2>
          <ul className="nav navbar-right panel_toolbox">
            <li>
              <a className="close-link"
                data-toggle="tooltip"
                data-placement="top"
                title="Close"
                onClick={()=>{this.props.handleClose(event)}}>
                <i className="fa fa-close"></i>
              </a>
            </li>
          </ul>
          <div className="clearfix"></div>
        </div>
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
          <h4>No Reports found! Please try a different date range or search criteria.</h4>
        </div>
      )
    }
    else {
      return(
        <div className="dataTables_wrapper form-inline dt-bootstrap no-footer">
          <div className="row">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Version</th>
                  <th>Reporting Date</th>
                  <th>Data Period</th>
                  <th>Report status</th>
                  <th>Prepared by</th>
                  <th>Prepared on</th>
                  <th>Operations</th>
                </tr>
              </thead>
              <tbody>
              {linkageData.map((item,index) => {
                return (
                  <tr key={index}>
                    <td>
                      <button
                        className="btn btn-link btn-xs"
                        data-toggle="tooltip"
                        data-placement="top"
                        title={item.report_description}
                        onClick={
                          (event)=>{
                            this.props.handleReportClick(item)
                          }
                        }
                        >
                        <small>
                          <i className="fa fa-file-text" aria-hidden="true"></i>
                          {' '}{item.report_id}
                        </small>
                      </button>
                    </td>
                    <td>{item.version}</td>
                    <td>{moment(item.as_of_reporting_date).format("DD-MMM-YYYY")}</td>
                    <td>
                      {moment(item.reporting_date.toString().substring(0,8)).format("DD-MMM-YYYY") + " to " + moment(item.reporting_date.toString().substring(8,16)).format("DD-MMM-YYYY")}
                    </td>
                    <td>{item.report_create_status}</td>
                    <td>{item.report_created_by}</td>
                    <td><small>{item.report_create_date}</small></td>
                    <td>
                      <div className="ops_icons">
                        <div className="btn-group">
                        <button
                          className="btn btn-circle btn-link btn-xs"
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Operation Log History"
                          onClick={
                            (event)=>{
                              this.props.viewOperationLog({...item,versions: this.dataCatalog})
                            }
                          }
                        >
                          <i className="fa fa-history" aria-hidden="true"></i>
                        </button>
                        </div>
                        <div className="btn-group">
                        <button
                          className="btn btn-circle btn-link btn-xs"
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Edit Report Parameters"
                          onClick={
                            (event)=>{
                              this.props.editParameter(item)
                            }
                          }
                        >
                          <i className="fa fa-code" aria-hidden="true"></i>
                        </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            </table>
          </div>
        </div>
      )
    }
  }

}

export default ReportVersionsList;
