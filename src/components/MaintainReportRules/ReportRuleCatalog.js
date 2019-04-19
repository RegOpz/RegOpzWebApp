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
      startDate: null,
      endDate: null,
      filterText: null,
      navMenu: this.props.navMenu,
      open: false
    }
    this.dataCatalog = this.props.dataCatalog;
    this.constantFilter = this.props.constantFilter ? this.props.constantFilter : null;
    this.linkageData = [];
    this.reportPermissions = this.props.reportPermissions;
    this.getaccTypeColor = this.getaccTypeColor.bind(this);
    this.associateReportPermission = this.associateReportPermission.bind(this);
  }

  componentWillReceiveProps(nextProps) {
      this.dataCatalog = nextProps.dataCatalog;
      this.constantFilter = nextProps.constantFilter ? nextProps.constantFilter : null;
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

  associateReportPermission(linkageData){
      let reportList=[];
      // console.log("this.sourcePermissions...",this.sourcePermissions)
      linkageData.map((country,idx)=>{
        let reports=[];
        country.report.map((report,index)=>{
          let permission = this.reportPermissions ?
                           this.reportPermissions.find(function(p){return p.report_id==report.report_id;})
                           :
                           undefined;
          // console.log("permission...",permission)
          let permission_details = {
                                     access_type: 'No access',
                                   };
          if (permission){
            permission_details = JSON.parse(permission.permission_details);
          }
          reports.push({...report,...permission_details});

        });
        reportList.push({country: country.country, report:reports});
      });

      console.log("Filtertext.....reportList",reportList)


      return reportList;
  }


  handleFilter() {
      if (typeof this.dataCatalog !== 'undefined' && this.dataCatalog !== null) {
          let dataCatalog = this.associateReportPermission(this.dataCatalog), linkageData = [];
          const { filterText } = this.state;

          if (filterText !== null || this.constantFilter !== null) {
              let newFilterText = (filterText ? filterText.replace(/ +/g,' ')
                                                          .replace(/^ +/,'')
                                                          .replace(/\\/g,'\\\\')
                                                : "")
              console.log("Filtertext.....", newFilterText, this.constantFilter, dataCatalog)
              let matchText = RegExp(`(${newFilterText.toString()
                                                      .toLowerCase()
                                                      .replace(/[,+&\:\ ]+$/,'')
                                                      .replace(/[,+&\:\ ]/g,'|')})`,
                                      'i');
              console.log("matchText....",matchText)
              dataCatalog.forEach(item => {
                  let report_list = item.report.filter(item =>
                      item.report_type.toString().match(this.constantFilter) &&
                      (
                        item.report_id.toString().match(matchText) ||
                        moment(item.date_of_change).format("DD-MMM-YYYY").match(matchText) ||
                        (item.last_updated_by ? item.last_updated_by.toString().match(matchText) : null) ||
                        (item.report_description ? item.report_description.match(matchText) : null) ||
                        (item.report_parameters ? item.report_parameters.match(matchText) : null)
                      )
                  );
                  if (report_list.length > 0) {
                      linkageData.push({
                          country: item.country,
                          report: report_list
                      });
                  }
              });
              dataCatalog = linkageData;
          }
          this.linkageData = dataCatalog;
      }
  }

  render() {
    console.log("Available Report Rules:", this.linkageData);
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
              content.push(
                <div>
                  <a href="#">Country: {item.country}</a>
                  { this.renderDataFeedList(item.report, item.country, index) }
                </div>
              );
          } else {
              content.push(
                  <Panel
                    key={index}
                    header={<h3>{item.country}</h3>}
                    collapsible
                    expanded={ linkageData.length ==1 ? true : this.state.open === item.country }
                    onClick={ () => {
                        let flag = this.state.open === item.country ? false : item.country;
                        this.setState({ open: flag })
                    }}
                  >
                    { this.renderDataFeedList(item.report, item.country, index) }
                  </Panel>
              );
          }
      });
      return content;
  }

  renderDataFeedList(linkageData, country, index) {
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
                  <th>Report Description</th>

                </tr>
              </thead>
              <tbody>
              {linkageData.map((item,index) => {
                return (
                  <tr key={index}
                    className={ this.getaccTypeColor(item.access_type)}
                    onClick={
                      (event)=>{
                        this.props.handleReportClick(item)
                      }
                    }>
                    <td>
                      <button
                        className={"btn btn-link btn-xs " + this.getaccTypeColor(item.access_type)}
                        onClick={
                          (event)=>{
                            // this.props.handleReportClick(item)
                          }
                        }
                        >
                        <small>
                          <i className="fa fa-file-text"></i>
                          {' '}{item.report_id}
                        </small>
                      </button>
                    </td>
                    <td>
                      <p
                        className="truncate-text"
                        data-toggle="tooltip"
                        data-placement="top"
                        title={item.report_description}
                        >
                        {item.report_description}
                      </p>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            </table>
          }
          </div>
          {  this.state.navMenu &&
             this.renderNavMenu(linkageData, country)
          }
        </div>
      )
    }
  }

  renderNavMenu(linkageData, country) {
    return(
        <div className="dataTables_wrapper form-inline dt-bootstrap no-footer">
          <div className="row">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>#ID</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {
                linkageData.map((item,index) => (
                    <tr key={index}
                      onClick={
                        (event)=>{
                          this.props.handleReportClick(item)
                        }
                      }>
                      <td>
                        <button
                          className="btn btn-link btn-xs"
                          data-toggle="tooltip"
                          data-placement="top"
                          title={item.report_description}
                          onClick={
                            (event)=>{
                              // this.props.handleReportClick(item)
                            }
                          }
                          >
                          <small>
                            <i className="fa fa-file-text"></i>
                            {' '}{item.report_id}
                          </small>
                        </button>
                      </td>
                      <td>{country}</td>
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
