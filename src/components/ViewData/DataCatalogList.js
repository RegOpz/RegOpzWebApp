import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import _ from 'lodash';
import DatePicker from 'react-datepicker';
import moment from 'moment';
require('react-datepicker/dist/react-datepicker.css');
require('./ViewDataComponentStyle.css');

class DataCatalogList extends Component {
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
                let audit_date = moment(item.business_date);
                let start_date = moment(startDate);
                return audit_date >= start_date;
            });
        }
        if (endDate != null) {
            linkageData = linkageData.filter(item => {
                let audit_date = moment(item.business_date);
                let end_date = moment(endDate);
                return audit_date <= end_date;
            });
        }
        if (filterText != null) {
            let matchText = RegExp(`(${filterText.toString().toLowerCase().replace(/[,+&\:\ ]$/,'').replace(/[,+&\:\ ]/g,'|')})`,'i');
            console.log("matchText",matchText);
            linkageData = linkageData.filter(element =>
                element.source_id.toString().match(matchText) ||
                element.data_file_name.match(matchText) ||
                element.country.match(matchText) ||
                element.source_description.match(matchText) ||
                (element.file_load_status ? element.file_load_status : "").match(matchText) ||
                (element.data_loaded_by ? element.data_loaded_by : "").match(matchText) ||
                moment(element.business_date).format("DD-MMM-YYYY").match(matchText)
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
                  <th>Business Date</th>
                  <th>Source ID</th>
                  <th>Country</th>
                  <th>Data File Name</th>
                  <th>File load status</th>
                  <th>Data loaded by</th>
                  <th>Operations</th>
                </tr>
              </thead>
              <tbody>
              {linkageData.map((item,index) => {
                return (
                  <tr key={index}>
                    <td>{moment(item.business_date).format("DD-MMM-YYYY")}</td>
                    <td>{item.source_id}</td>
                    <td>{item.country}</td>
                    <td>
                      <button
                        className="btn btn-link btn-xs"
                        data-toggle="tooltip"
                        data-placement="top"
                        title={item.source_description}
                        onClick={
                          (event)=>{
                            this.props.handleDataFileClick(item)
                          }
                        }
                        >
                        <small>
                          <i className="fa fa-file-text"></i>
                          {' '}{item.data_file_name}
                        </small>
                      </button>
                    </td>
                    <td>{item.file_load_status}</td>
                    <td>{item.data_loaded_by}</td>
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
                          onClick={
                            (event) => {
                              let source_info = {
                                source_id: item.source_id,
                                business_date: item.business_date,
                                business_or_validation: "ALL"
                              }
                              this.props.applyRules(source_info);
                            }
                          }
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Apply Rules"
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
                <th>Data File Name</th>
                <th>Business Date</th>
              </tr>
            </thead>
            <tbody>
              {
                linkageData.map((item,index) => (
                    <tr key={index}>
                      <td>{item.source_id}</td>
                      <td><button
                        className="btn btn-link btn-xs"
                        data-toggle="tooltip"
                        data-placement="top"
                        title={item.data_file_name}
                        onClick={
                          (event)=>{
                            this.props.handleDataFileClick(item)
                          }
                        }
                        >
                        <small>
                          <i className="fa fa-file-text"></i>
                          {' '}{item.data_file_name.toString().substring(0,25)}
                        </small>
                      </button>
                      </td>
                      <td>{moment(item.business_date).format("DD-MMM-YYYY")}</td>
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

export default DataCatalogList;
