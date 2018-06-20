import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import _ from 'lodash';
import DatePicker from 'react-datepicker';
import moment from 'moment';
require('react-datepicker/dist/react-datepicker.css');

class ReportCatalogList extends Component {
  constructor(props){
    super(props)
    this.state = {
      startDate:moment(this.props.dataCatalog.start_date),
      endDate:moment(this.props.dataCatalog.end_date),
      filterText: null,
      navMenu: this.props.navMenu,
    }
    this.dataCatalogStartDate = this.props.dataCatalog.start_date;
    this.dataCatalogEndDate = this.props.dataCatalog.end_date;
    this.dataCatalog = this.props.dataCatalog.data_sources;
    this.linkageData = this.dataCatalog;
    this.handleFilter = this.handleFilter.bind(this);
  }

  componentWillReceiveProps(nextProps){
      //TODO
      this.dataCatalog = nextProps.dataCatalog.data_sources;
      this.dataCatalogStartDate = nextProps.dataCatalog.start_date;
      this.dataCatalogEndDate = nextProps.dataCatalog.end_date;
      this.linkageData = this.dataCatalog;
      this.setState ({
        startDate:moment(this.dataCatalogStartDate),
        endDate:moment(this.dataCatalogEndDate),
        filterText: null
      });
  }

  handleStartDateChange(date) {
    if ( moment(date) < moment(this.dataCatalogStartDate) || moment(date) < moment(this.dataCatalogEndDate).subtract(4,'months')){
      console.log("start date",moment().subtract(1,'months'),date,this.dataCatalogStartDate);
      let dates={
        startDate: moment(date).format("YYYYMMDD"),
        endDate: moment(this.state.endDate ? this.state.endDate : this.dataCatalogEndDate ).format("YYYYMMDD")
      }
      this.props.dateFilter(dates);
    }
    this.setState({ startDate: date });
  }

  handleEndDateChange(date) {
    if ( moment(date) > moment(this.dataCatalogEndDate) || moment(date) > moment(this.dataCatalogStartDate).add(4,'months')){
      console.log("end date",moment(),date,this.dataCatalogEndDate);
      let dates={
        startDate: moment(this.state.startDate? this.state.startDate : this.dataCatalogStartDate).format("YYYYMMDD"),
        endDate: moment(date).format("YYYYMMDD")
      }
      this.props.dateFilter(dates);
    }
    this.setState({ endDate: date });
  }

  handleFilter(){

      if(typeof this.dataCatalog != 'undefined' && this.dataCatalog.length ){
        let linkageData = this.dataCatalog;
        const { startDate, endDate, filterText } = this.state;
        if (startDate != null) {
            linkageData = linkageData.filter(item => {
                let audit_date = moment(item.as_of_reporting_date);
                let start_date = moment(startDate);
                return audit_date >= start_date;
            });
        }
        if (endDate != null) {
            linkageData = linkageData.filter(item => {
                let audit_date = moment(item.as_of_reporting_date);
                let end_date = moment(endDate);
                return audit_date <= end_date;
            });
        }
        if (filterText != null) {
            let matchText = RegExp(`(${filterText.toString().toLowerCase().replace(/[,+&\:\ ]$/,'').replace(/[,+&\:\ ]/g,'|')})`,'i');
            console.log("matchText",matchText);
            linkageData = linkageData.filter(element =>
                element.report_id.toString().match(matchText) ||
                element.reporting_date.toString().match(matchText) ||
                element.country.match(matchText) ||
                element.report_description.match(matchText) ||
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
    console.log("ReportCatalogList....",this.linkageData);
    this.handleFilter();
    return(
      <div className="x_panel">
        <div className="x_content">
          <DatePicker
            dateFormat="DD-MMM-YYYY"
            selected={this.state.startDate}
            onChange={this.handleStartDateChange.bind(this)}
            showMonthDropdown
            showYearDropdown
            placeholderText="Select start date"
            className="view_data_date_picker_input form-control"
            />

          <DatePicker
              dateFormat="DD-MMM-YYYY"
              selected={this.state.endDate}
              onChange={this.handleEndDateChange.bind(this)}
              showMonthDropdown
              showYearDropdown
              placeholderText="Select end date"
              className="view_data_date_picker_input form-control "
              />
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
            { !this.state.navMenu &&
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
                        <div className="btn-group">
                        <button
                          className="btn btn-circle btn-link btn-xs"
                          data-toggle="tooltip"
                          data-placement="top"
                          title="View Report Versions"
                          onClick={
                            (event)=>{
                              this.props.viewReportVersions(item)
                            }
                          }
                        >
                          <i className="fa fa-bars" aria-hidden="true"></i>
                        </button>
                        </div>
                        <div className="btn-group">
                        <button
                          className="btn btn-circle btn-link btn-xs"
                          onClick={
                            (event) => {
                              let report_info = {
                                report_id: item.report_id,
                                report_parameters: item.report_parameters,
                                reporting_date: item.reporting_date,
                                ref_date_rate:item.ref_date_rate,
                                rate_type: item.rate_type,
                                reporting_currency: item.reporting_currency,
                                report_create_date: moment().format("DD-MMM-YYYY h:mm:ss a"),
                                report_type: item.report_type,
                                as_of_reporting_date: item.as_of_reporting_date,
                              }
                              //console.log(report_info);
                              this.props.generateReport(report_info);
                            }
                          }
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Re-Generate Report"
                        >
                          <i className="fa fa-flash" aria-hidden="true"></i>
                        </button>
                        </div>
                      </div>
                    </td>
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
    return(
        <div className="dataTables_wrapper form-inline dt-bootstrap no-footer">
          <div className="row">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>#ID</th>
                <th>Reporting Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {
                linkageData.map((item,index) => (
                    <tr key={index}>
                      <td>
                        <button
                          className="btn btn-link btn-xs"
                          onClick={
                            (event)=>{
                              this.props.handleReportClick(item)
                            }
                          }
                          >
                          <small>
                            <i className="fa fa-file-text"></i>
                            {' '}{item.report_id}
                          </small>
                        </button>
                      </td>
                      <td>{moment(item.as_of_reporting_date).format("DD-MMM-YYYY")}</td>
                      <td>{item.report_create_status}</td>
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

export default ReportCatalogList;
