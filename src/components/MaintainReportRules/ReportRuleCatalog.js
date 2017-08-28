import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Panel } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
require('react-datepicker/dist/react-datepicker.css');

class ReportCatalogList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      startDate: moment(this.props.dataCatalog.start_date),
      endDate: moment(this.props.dataCatalog.end_date),
      filterText: null,
      navMenu: this.props.navMenu,
      open: {}
    }
    this.dataCatalogStartDate = this.props.dataCatalog.start_date;
    this.dataCatalogEndDate = this.props.dataCatalog.end_date;
    this.dataCatalog = this.props.dataCatalog;
    this.linkageData = this.dataCatalog;
  }

  componentWillReceiveProps(nextProps) {
      //TODO
      this.dataCatalog = nextProps.dataCatalog.data_sources;
      this.dataCatalogStartDate = nextProps.dataCatalog.start_date;
      this.dataCatalogEndDate = nextProps.dataCatalog.end_date;
      this.linkageData = this.dataCatalog;
      this.setState ({
        startDate: moment(this.dataCatalogStartDate),
        endDate: moment(this.dataCatalogEndDate),
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

  handleFilter() {

    //   if(typeof this.dataCatalog != 'undefined' && this.dataCatalog.length ){
    //     let linkageData = this.dataCatalog;
    //     const { startDate, endDate, filterText } = this.state;
    //     if (startDate != null) {
    //         linkageData = linkageData.filter(item => {
    //             let audit_date = moment(item.as_of_reporting_date);
    //             let start_date = moment(startDate);
    //             return audit_date >= start_date;
    //         });
    //     }
    //     if (endDate != null) {
    //         linkageData = linkageData.filter(item => {
    //             let audit_date = moment(item.as_of_reporting_date);
    //             let end_date = moment(endDate);
    //             return audit_date <= end_date;
    //         });
    //     }
    //     if (filterText != null) {
    //         let matchText = RegExp(`(${filterText.toString().toLowerCase().replace(/[,+&\:\ ]$/,'').replace(/[,+&\:\ ]/g,'|')})`,'i');
    //         console.log("matchText",matchText);
    //         linkageData = linkageData.filter(element =>
    //             element.report_id.toString().match(matchText) ||
    //             element.reporting_date.match(matchText) ||
    //             (element.report_create_status ? element.report_create_status : "").match(matchText) ||
    //             (element.report_created_by ? element.report_created_by : "").match(matchText) ||
    //             moment(element.as_of_reporting_date).format("DD-MMM-YYYY").match(matchText) ||
    //             moment(element.report_create_date).format("DD-MMM-YYYY").match(matchText)
    //         );
    //     }
    //     this.linkageData = linkageData;
    //   }
  }

  render() {
    //console.log("Available Report Rules:", this.props);
    this.handleFilter();
    return(
      <div className="x_panel">
        <div className="x_content">
          <DatePicker
            dateFormat="DD-MMM-YYYY"
            selected={this.state.startDate}
            onChange={this.handleStartDateChange.bind(this)}

            placeholderText="Select start date"
            className="view_data_date_picker_input form-control"
            />

          <DatePicker
              dateFormat="DD-MMM-YYYY"
              selected={this.state.endDate}
              onChange={this.handleEndDateChange.bind(this)}

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
            { this.renderPanel(this.linkageData) }
          </div>
        </div>
      </div>
    );
  }

  renderPanel(linkageData) {
      // Renders Panel for each country
      if(!linkageData || typeof(linkageData) == 'undefined' || linkageData == null || linkageData.length == 0) {
        return(
          <div>
            <h4>No Report Rule found! Please try a different date range or search criteria.</h4>
          </div>
        );
      }

      let content = [];
      linkageData.map((item, index) => {
          if (this.state.navMenu) {
              content.push(this.renderDataFeedList(item.report, index));
          } else {
              content.push(
                  <Panel
                    key={index}
                    header={<h3>{item.country}</h3>}
                    collapsible
                    expanded={ this.state.open === item.country }
                    onClick={ () => {
                        let flag = this.state.open === item.country ? false : item.country;
                        this.setState({ open: flag })
                    }}
                  >
                    { this.renderDataFeedList(item.report, index) }
                  </Panel>
              );
          }
      });
      return content;
  }

  renderDataFeedList(linkageData, index) {
    // Renders Table for Reports
    if(!linkageData || typeof(linkageData) == 'undefined' || linkageData == null || linkageData.length == 0) {
      return(
        <div>
          <h4>No Reports found! Please try a different date range or search criteria.</h4>
        </div>
      )
    }
    else {
      return(
        <div key={index} className="dataTables_wrapper form-inline dt-bootstrap no-footer">
          <div className="row">
            { !this.state.navMenu &&
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Valid From</th>
                  <th>Valid Upto</th>
                  <th>Last Updated by</th>
                  <th>Last Updated on</th>
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
                    <td>{moment(item.valid_from).format("DD-MMM-YYYY")}</td>
                    <td>{moment(item.valid_to).format("DD-MMM-YYYY")}</td>
                    <td>{item.last_updated_by}</td>
                    <td>{moment().format("DD-MMM-YYYY, h:mm:ss a")}</td>
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
                        >
                          <i className="fa fa-code" aria-hidden="true"></i>
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
                                reporting_date: item.reporting_date
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
                <th>Valid From</th>
                <th>Valid Upto</th>
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
                      <td>{moment(item.valid_from).format("DD-MMM-YYYY")}</td>
                      <td>{moment(item.valid_to).format("DD-MMM-YYYY")}</td>
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
