import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Label } from 'react-bootstrap';
import moment from 'moment';
import ReactTable from 'react-table';
require('react-table/react-table.css');

class DataReportLinkage extends Component {
  constructor(props){
    super(props);
    this.state={
      startDate: null,
      endDate: null,
      filterText: null,
      ruleReference: this.props.ruleReference,
      pageSize : 20
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
    if (!linkageData || typeof (linkageData) == 'undefined' || linkageData == null)
      return (
        <div>
          <h4>Loading.....</h4>
        </div>
      )
    else if (linkageData.length == 0)
      return (
        <div>
          <h4>No linked report found!</h4>
        </div>
      )
    else {
      let columns = ['report_id','sheet_id','cell_id','qualifying_key','reporting_date','version'];
      console.log("Columns of the object.keys() ",columns)
      let reactTableViewColumns=[];
      if (columns){
        columns.map(item =>{
          reactTableViewColumns.push({Header: item.toString().replace(/_/g,' '), accessor: item})
        })
      }

      return (
        <ReactTable
          data={linkageData}
          filterable={true}
          className="-highlight -striped"
          columns={reactTableViewColumns}
          pivotBy={['qualifying_key','report_id','reporting_date','version','sheet_id']}
          defaultFilterMethod = {(filter, row, column) => {
            const id = filter.pivotId || filter.id
            let matchText = RegExp(`(${filter.value.toString().toLowerCase().replace(/[,+&\:\ ]$/,'').replace(/[,+&\:\ ]/g,'|')})`,'i');
            return row[id] !== undefined ? String(row[id]).match(matchText) : true
          }}
          SubComponent={(row)=>{
            // console.log("Subcomponent row...", row)
                  let cell_business_rules = row.original.data_qualifying_rules.toString().split(",");
                  const selectedRules = row.original.cell_business_rules.toString().split(",");
                  return(
                    <div className="x_panel">
                      <div className="x_content">
                        <div className="col-sm-12 col-xs-12">
                          <div className="dataTables_wrapper form-inline dt-bootstrap no-footer">
                            <div className="row">
                              <table className="table table-hover">
                                <thead>
                                  <tr>
                                    <th>Key #</th>
                                    <th>Report</th>
                                    <th>Sheet</th>
                                    <th>Cell</th>
                                    <th>Rule Ref</th>
                                    <th>Record Rules</th>
                                    <th>Period</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <th scope="row">{row.original.qualifying_key}</th>
                                    <td>{row.original.report_id}</td>
                                    <td>{row.original.sheet_id}</td>
                                    <td>{row.original.cell_id}</td>
                                    <td>{row.original.cell_calc_ref}</td>
                                    <td>
                                      <p>
                                        <p>
                                          {
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
                                          }
                                        </p>
                                      </p>
                                    </td>
                                    <th scope="row">
                                      {moment(row.original.reporting_date.toString().substring(0,8)).format("DDMMMYYYY")}
                                      <br/>
                                      {moment(row.original.reporting_date.toString().substring(8,16)).format("DDMMMYYYY")}
                                      </th>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
              }
            }
          onPageSizeChange={(pageSize)=>{
              // console.log("Inside link style2...",pageSize);
              this.setState({pageSize : pageSize});
            }
          }
          style={{height: this.state.pageSize >= 20 ? "74vh" : "100%"}}
          />
      )
    }
  }

}

export default DataReportLinkage;
