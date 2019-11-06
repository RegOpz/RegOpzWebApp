import React, {Component} from 'react';
import {connect} from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import { Label, Tabs, Tab } from 'react-bootstrap';
import ReactTable from 'react-table';

import {
  actionFetchReportBusinessRules,
} from '../../actions/ReportRulesRepositoryAction';

require('react-table/react-table.css');

class ReportRepoBusinessRules extends Component {
  constructor(props){
    super(props);
    this.state={
      pageSize: 20,
      selectedTab: 0
    };
    this.linkageData = undefined;
    //this.renderChangeHistory = this.renderChangeHistory.bind(this);
    this.renderAggRules = this.renderAggRules.bind(this);
    this.renderCalcRules = this.renderCalcRules.bind(this);
  }

  componentWillMount(){
    this.props.drillDown(this.props.reportId);
  }

  componentWillReceiveProps(nextProps){
      //TODO
      if(!this.linkageData && this.props.cell_rules !== nextProps.cell_rules)
      {
        this.linkageData = nextProps.cell_rules;
      }
  }

  render(){
    const { handleClose, handleBoxSize, handleBringToFront, allRules, handlePinDndBox } = this.props;
    return(
        <div className="box-content-wrapper">
          <div className="box-tools">
            <ul className="nav navbar-right panel_toolbox">
              <li>
                <a className="close-link"
                  title="Close"
                  onClick={handleClose}><i className="fa fa-close"></i></a>
              </li>
              {
                allRules.position == "DnD" &&
                <li>
                  <a onClick={()=>{
                        let boxSize = {
                          isMaximized: !allRules.isMaximized
                        }
                        handleBoxSize(allRules.id,boxSize)
                    }} title={ history.isMaximized ? "Restore" : "Maximize"}>
                    <small><i className="fa fa-square-o"></i></small>
                  </a>
                </li>
              }
              <li>
                <a onClick={()=>{
                    let id = allRules.id;
                    let position = allRules.position == "DnD" ? "pinnedTop": "DnD";
                    handlePinDndBox(id,position);
                  }} title={ allRules.position == "DnD" ? "Pin Window" : "Float Window"}>
                  <small>
                    <i className={"fa " + (allRules.position == "DnD" ? "fa-thumb-tack" : "fa-external-link" )}></i>
                  </small>
                </a>
              </li>
              <li>
                <a title="Move Box" style={{'cursor':'grabbing'}}>
                  <small>
                    <i className="fa fa-arrows"></i>&nbsp;All Rules
                  </small>
                </a>
              </li>
            </ul>
          </div>
          <div className="x_panel">
            <div className="x_title">
              <h2>Business Rules
                <small>{" for Report "}</small>
              </h2>
              <div className="clearfix"></div>
            </div>
            <div className="x_content dontDragMe">
              { this.renderReportLinkage(this.linkageData)}
              </div>
          </div>
        </div>
    );
  }
  renderReportLinkage(linkageData) {
    console.log("Modal linkage data", linkageData);
    if (!linkageData || typeof (linkageData) == 'undefined' || linkageData == null)
      return (
        <div>
          <h4>Loading.....</h4>
        </div>
      )
      else{
          return(
            <Tabs
            defaultActiveKey={0}
            activeKey={this.state.selectedTab}
            onSelect={(key) => {
                this.setState({selectedTab:key});
            }}
            >
            <Tab
              key={0}
              eventKey={0}
              title={"Caclulation Rules"}
            >
            {this.renderCalcRules(linkageData.cell_rules)}
            </Tab>
            <Tab
              key={1}
              eventKey={1}
              title={"Aggregation Rules"}
            >
            {this.renderAggRules(linkageData.comp_agg_rules)}
            </Tab>
            </Tabs>
          )
      }

  }

  renderCalcRules(calcRules){
    if (calcRules.length == 0)
      return (
        <div>
          <h4>No calculation rules found!</h4>
        </div>
      )
    else{
      let columns = ['sheet_id','cell_id','cell_calc_ref','in_use','cell_business_rules'];
      console.log("Columns of the object.keys() ",columns)
      let reactTableViewColumns=[];
      if (columns){
        columns.map(item =>{
          reactTableViewColumns.push({Header: item.toString().replace(/_/g,' '),
                                      accessor: item})
        })
      }

      return(
        <ReactTable
          data={calcRules}
          filterable={true}
          className="-highlight -striped dontDragMe"
          columns={reactTableViewColumns}
          pivotBy={['sheet_id','cell_id']}
          defaultFilterMethod = {(filter, row, column) => {
            const id = filter.pivotId || filter.id
            let matchText = RegExp(`(${filter.value.toString().toLowerCase().replace(/[,+&\:\ ]$/,'').replace(/[,+&\:\ ]/g,'|')})`,'i');
            return row[id] !== undefined ? String(row[id]).match(matchText) : true
          }}
          SubComponent={(row)=>{
            // console.log("Subcomponent row...", row)
                  let cell_business_rules = row.original.cell_business_rules.toString().split(",");
                  return(
                    <div className="x_panel">
                      <div className="x_content">
                        <div className="col-sm-12 col-xs-12">
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th>Report</th>
                                <th>Sheet</th>
                                <th>Cell</th>
                                <th>InUse</th>
                                <th>Rules</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>{row.original.report_id}</td>
                                <td>{row.original.sheet_id}</td>
                                <td>{row.original.cell_id}</td>
                                <td>
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
                                </td>
                                <td>
                                  <p>
                                    {
                                      ((rules) => {
                                          let rule_list = [];
                                          rules.map(function (rule, index) {
                                            rule_list.push(rule);
                                            rule_list.push(" ");
                                          })
                                          return rule_list;
                                      })(cell_business_rules)
                                    }
                                  </p>
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


  renderAggRules(aggRules){
    if (aggRules.length == 0)
      return (
        <div>
          <h4>No calculation rules found!</h4>
        </div>
      )
    else{
      let columns = ['sheet_id','cell_id','comp_agg_ref','in_use','comp_agg_rule','reporting_scale','rounding_option'];
      console.log("Columns of the object.keys() ",columns)
      let reactTableViewColumns=[];
      if (columns){
        columns.map(item =>{
          reactTableViewColumns.push({Header: item.toString().replace(/_/g,' '),
                                      accessor: item})
        })
      }

      return(
        <ReactTable
          data={aggRules}
          filterable={true}
          className="-highlight -striped"
          columns={reactTableViewColumns}
          pivotBy={['sheet_id']}
          defaultFilterMethod = {(filter, row, column) => {
            const id = filter.pivotId || filter.id
            let matchText = RegExp(`(${filter.value.toString().toLowerCase().replace(/[,+&\:\ ]$/,'').replace(/[,+&\:\ ]/g,'|')})`,'i');
            return row[id] !== undefined ? String(row[id]).match(matchText) : true
          }}
          SubComponent={(row)=>{
            // console.log("Subcomponent row...", row)
                  return(
                    <div className="x_panel">
                      <div className="x_title">
                        <i className={"fa fa-calculator " + (row.original.in_use=="Y"? "green" : "amber")}> </i>
                        <small> Formula</small>
                        <div className="clearfix"></div>
                      </div>
                      <div className="x_content">
                        <i className={row.original.in_use=="Y"? "fa fa-square green" : "fa fa-warning amber"}> </i>
                        {" " + row.original.comp_agg_rule}
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

function mapStateToProps(state){
  console.log("On mapState ReportRepoBusinessRules", state, state.view_data_store, state.report_store);
  return {
    //data_date_heads:state.view_data_store.dates,
    cell_rules: state.report_rules_repo.cellRules,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    drillDown:(report_id,sheet,cell) => {
      dispatch(actionFetchReportBusinessRules(report_id,sheet,cell));
    },
  }
}

const VisibleReportRepoBusinessRules = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportRepoBusinessRules);


export default VisibleReportRepoBusinessRules;
