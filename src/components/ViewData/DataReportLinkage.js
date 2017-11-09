import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Label } from 'react-bootstrap';
import moment from 'moment';


class DataReportLinkage extends Component {
  constructor(props){
    super(props);
    this.state={
      startDate: null,
      endDate: null,
      filterText: null,
      ruleReference: this.props.ruleReference
    };
    this.linkageData = this.props.data;
    //this.renderChangeHistory = this.renderChangeHistory.bind(this);
  }

  componentWillReceiveProps(nextProps){
      //TODO
      this.linkageData = nextProps.data;
  }

  render(){
    return(
          <div className="x_panel">
            <div className="x_title">
              <h2>Report Linkage<small> for Business Data </small><small>{this.state.ruleReference}</small></h2>
              <ul className="nav navbar-right panel_toolbox">
                <li>
                  <a className="close-link" onClick={this.props.handleClose}><i className="fa fa-close"></i></a>
                </li>
              </ul>
              <div className="clearfix"></div>
            </div>
            <div className="x_content">
              { this.renderReportLinkage(this.linkageData, this.state.ruleReference)}
              </div>
          </div>

    );
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
        <div className="dataTables_wrapper form-inline dt-bootstrap no-footer">
          <div className="row">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Record #</th>
                  <th>Report</th>
                  <th>Sheet</th>
                  <th>Cell</th>
                  <th>Cell Rule</th>
                  <th>Rule Condition</th>
                  <th>Record Rules</th>
                  <th>Period</th>
                </tr>
              </thead>
              <tbody>
                {
                  linkageData.map(function (item, index) {
                    return (
                      <tr>
                        <th scope="row">{item.qualifying_key}</th>
                        <td>{item.report_id}</td>
                        <td>{item.sheet_id}</td>
                        <td>{item.cell_id}</td>
                        <td>{item.cell_calc_ref}</td>
                        <td><p>{item.cell_business_rules.toString().replace(/,/g,' ')}</p></td>
                        <td><p>{item.data_qualifying_rules.toString().replace(/,/g,' ')}</p></td>
                        <th scope="row">
                          {moment(item.reporting_date.toString().substring(0,8)).format("DDMMMYYYY")}
                          <br/>
                          {moment(item.reporting_date.toString().substring(8,16)).format("DDMMMYYYY")}
                          </th>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      )
    }
  }

}

export default DataReportLinkage;
