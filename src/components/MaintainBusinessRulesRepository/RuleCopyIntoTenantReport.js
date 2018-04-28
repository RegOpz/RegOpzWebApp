import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Label } from 'react-bootstrap';
import ReactTable from 'react-table';
import { Tab, Tabs } from 'react-bootstrap';
require('react-table/react-table.css');

class RuleCopyIntoTenantReport extends Component {
  constructor(props){
    super(props);
    this.state={
      startDate: null,
      endDate: null,
      filterText: null,
      pageSize: 20,
      selectedTab: 0,
    };
    this.linkageData = this.props.data;
    this.renderCopyReport = this.renderCopyReport.bind(this);
  }

  componentWillReceiveProps(nextProps){
      //TODO
      this.linkageData = nextProps.data;
  }

  render(){
    return(
          <div className="x_panel">
            <div className="x_title">
              <h2>Repository Rule Copy Result<small> for Business Rules </small></h2>
              <ul className="nav navbar-right panel_toolbox">
                <li>
                  <a className="close-link" onClick={this.props.handleClose}><i className="fa fa-close"></i></a>
                </li>
              </ul>
              <div className="clearfix"></div>
            </div>
            <div className="x_content">
              <Tabs
                defaultActiveKey={0}
                activeKey={this.state.selectedTab}
                onSelect={(key) => {
                    this.setState({selectedTab:key
                      });
                }}
                >
                <Tab
                  key={0}
                  eventKey={0}
                  title={"Successfully Copied"}
                >
                  { this.renderCopyReport(this.linkageData ? this.linkageData.successfully_copied : null, " was Successful")}
                </Tab>
                <Tab
                  key={1}
                  eventKey={1}
                  title={"Rejected Records"}
                >
                  <div className="x_content">
                    <h5>
                      {"Following Rule TAGs rejected because these TAG references already exist in the source rule mapping."}
                    </h5>
                  </div>
                  { this.renderCopyReport(this.linkageData ? this.linkageData.not_copied : null, " failed")}
                </Tab>
              </Tabs>
            </div>
          </div>
    );
  }
  renderCopyReport(linkageData, copystatus) {
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
          <div className="x_panel">
            <h5>{"No Repository Rule Copy " + copystatus + " !"}</h5>
          </div>
        </div>
      )
    else {

      let columns = Object.keys(linkageData[0]) // ['report_id','sheet_id','cell_id','in_use','cell_business_rules'];
      console.log("Columns of the Object.keys() ",columns)
      let reactTableViewColumns=[];
      if (columns){
        columns.map(item =>{
          if (item != "rule_string"){
            reactTableViewColumns.push({Header: item.toString().replace(/_/g,' '),
                                        accessor: item})
          }
        })
      }

      return(
        <ReactTable
          data={linkageData}
          filterable={true}
          className="-highlight -striped"
          columns={reactTableViewColumns}
          pivotBy={['business_rule','in_use_tenant']}
          defaultFilterMethod = {(filter, row, column) => {
            const id = filter.pivotId || filter.id
            let matchText = RegExp(`(${filter.value.toString().toLowerCase().replace(/[,+&\:\ ]$/,'').replace(/[,+&\:\ ]/g,'|')})`,'i');
            return row[id] !== undefined ? String(row[id]).match(matchText) : true
          }}
          SubComponent={(row)=>{
            // console.log("Subcomponent row...", row)
                  return(
                    <div className="x_panel">
                      <div className="x_content">
                        <div className="col-sm-12 col-xs-12">
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th>Rule</th>
                                <th>Rule Description</th>
                                <th>Tenant Rule Logic</th>
                                <th>In use</th>
                                <th>Reference</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>{row.original.business_rule}</td>
                                <td>{row.original.rule_description}</td>
                                <td>{row.original.logical_condition}</td>
                                <td>
                                  <div>
                                    <span>Repo.: </span>
                                    {
                                      ((in_use) => {
                                        if (in_use == 'Y') {
                                          return (
                                            <Label bsStyle="success">In Use</Label>
                                          );
                                        } else {
                                          return (<Label bsStyle="warning">Not Being Used</Label>);
                                        }
                                      })(row.original.in_use)
                                    }
                                  </div>
                                  <div>
                                    <span>Tenant: </span>
                                    {
                                      ((tenant_in_use) => {
                                        if (tenant_in_use == 'Y') {
                                          return (
                                            <Label bsStyle="success">In Use</Label>
                                          );
                                        } else {
                                          return (<Label bsStyle="warning">Not Being Used</Label>);
                                        }
                                      })(row.original.in_use_tenant)
                                    }
                                  </div>
                                </td>
                                <td>
                                  <div>
                                    <span>{"Repo.: "+ row.original.id}</span>
                                  </div>
                                  <div>
                                    <span>{"Tenant.: "+ row.original.id_tenant}</span>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
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

export default RuleCopyIntoTenantReport;
