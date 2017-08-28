import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Label } from 'react-bootstrap';


class DrillDownRules extends Component {
  constructor(props){
    super(props);
    this.cellRules = this.props.cellRules;
    this.readOnly = this.props.readOnly;
    this.selectedCell = this.props.selectedCell;
    this.reportingDate = this.props.reportingDate;
    this.showRulesPanel = true;
    this.collapseIcon = "fa-chevron-up";
    //this.renderChangeHistory = this.renderChangeHistory.bind(this);
    this.renderAggRules = this.renderAggRules.bind(this);
    this.renderCalcRules = this.renderCalcRules.bind(this);

    this.handleCollapse = this.handleCollapse.bind(this);
  }

  componentWillReceiveProps(nextProps){
      //TODO
      this.cellRules = nextProps.cellRules;
      this.readOnly = nextProps.readOnly;
      this.selectedCell = nextProps.selectedCell;

  }

  handleCollapse(event) {
    this.showRulesPanel=!this.showRulesPanel;
    if(this.showRulesPanel) {
      this.collapseIcon = "fa-chevron-up";
    }
    else {
      this.collapseIcon = "fa-chevron-down";
    }
    console.log("Clicked in the collapse-link",this.showRulesPanel);
    this.forceUpdate();
  }

  render(){
    return(
          <div className="x_panel">
            <div className="x_title">
              <h2>Report Cell Rules
              <small> for <b>{this.selectedCell.cell}</b> of <b>{this.selectedCell.sheetName}</b></small>
              </h2>
              <ul className="nav navbar-right panel_toolbox">
                <li>
                  <a className="close-link" onClick={this.props.handleClose}><i className="fa fa-close"></i></a>
                </li>
                <li>
                  <a className="collapse-link"
                    onClick={ this.handleCollapse }><i className= { "fa " + this.collapseIcon}></i></a>
                </li>
              </ul>
              <div className="clearfix"></div>
            </div>
            {
              this.showRulesPanel &&
              <div>
                <div className="x_content">
                  <div className="x_panel">
                    <div className="x_title">
                      <h2>Agrregation Details</h2>
                      <div className="clearfix"></div>
                    </div>
                    <div className="x_content">
                    { this.renderAggRules(this.cellRules)}
                    </div>
                  </div>
                </div>
                <div className="x_content">
                  <div className="x_panel">
                    <div className="x_title">
                      <h2>Source Calculation Details</h2>
                      <div className="clearfix"></div>
                    </div>
                    <div className="x_content">
                    { this.renderCalcRules(this.cellRules)}
                    </div>
                  </div>
                </div>
                </div>
              }
          </div>

    );
  }
  renderAggRules(cellRules) {
    console.log("Modal linkage data", cellRules);
    if (cellRules.comp_agg_rules.length == 0 )
      return (
        <div>
          <h5>No Agrregation Rule defined for  {this.selectedCell.cell} of {this.selectedCell.sheetName}!</h5>
        </div>
      )
    else {
      let item = cellRules.comp_agg_rules[0];
      return (
      <div className="dataTables_wrapper form-inline dt-bootstrap no-footer">
        <div className="row">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Aggregation Ref</th>
              <th>Rounding Option</th>
              <th>Reporting Scale</th>
              <th>In Use</th>
            </tr>
          </thead>
          <tbody>

            <tr>
              <td>1</td>
              <td>
                <small>{item.comp_agg_ref}</small>
                  <button
                    type="button"
                    className="btn btn-link btn-xs"
                    onClick={
                      (event)=>{
                        this.props.handleAggeRuleClicked(event,item);
                        this.showRulesPanel=!this.showRulesPanel;
                      }
                    }>
                    <i className="fa fa-bank" data-toggle="tooltip" title="Aggegartion Details"></i>
                  </button>
              </td>
              <td>{item.rounding_option}</td>
              <td>{item.reporting_scale}</td>
              <td>
                {
                  ((in_use) => {
                    if (in_use == 'Y') {
                      return (
                        <Label bsStyle="success">{in_use}</Label>
                      );
                    } else {
                      return (<Label bsStyle="warning">{in_use}</Label>);
                    }
                  })(item.in_use)
                }
              </td>
            </tr>

          </tbody>
        </table>
        </div>
      </div>
      )
    }
  }

  renderCalcRules(cellRules) {
    console.log("Modal linkage data renderCalcRules", cellRules);
    if (cellRules.cell_rules.length == 0 )
      return (
        <div>
          <h5>No Source Calculation Rule defined for  {this.selectedCell.cell} of {this.selectedCell.sheetName}!</h5>
        </div>
      )
    else {
      let item = cellRules.cell_rules;
      return (
      <div className="dataTables_wrapper form-inline dt-bootstrap no-footer">
        <div className="row">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Source#</th>
              <th>Calculation Ref</th>
              <th>Calculation Logic</th>
              <th>Business Rules</th>
              <th>In Use</th>
            </tr>
          </thead>
          <tbody>
          {
            item.map((item,index)=>{
              return(
                <tr>
                  <td>{item.source_id}</td>
                  <td>
                    <small>{item.cell_calc_ref}</small>
                    <button
                      type="button"
                      className="btn btn-link btn-xs"
                      onClick={
                        (event)=>{
                          let calcRuleFilter = {
                                  params:{
                                    drill_kwargs: {
                                      report_id: item.report_id,
                                      sheet_id: item.sheet_id,
                                      cell_id: item.cell_id,
                                      reporting_date: this.reportingDate,
                                      source_id: item.source_id,
                                      cell_calc_ref: item.cell_calc_ref,
                                      page: 0
                                    }
                                  }
                                }
                          this.props.handleCalcRuleClicked(event,calcRuleFilter);
                          this.showRulesPanel=!this.showRulesPanel;
                        }
                      }>
                      <i className="fa fa-cube" data-toggle="tooltip" title="Data Details"></i>
                    </button>
                  </td>
                  <td><Label>{item.aggregation_func}</Label> <b>of</b> <small>{item.aggregation_ref.replace(/,/g,', ')}</small></td>
                  <td>
                    <small>{item.cell_business_rules.replace(/,/g,' ')}</small>
                    <button
                      type="button"
                      className="btn btn-link btn-xs"
                      onClick={
                        (event)=>{
                          let calcBusinessRuleFilter = {
                                  report_id: item.report_id,
                                  sheet_id: item.sheet_id,
                                  cell_id: item.cell_id,
                                  reporting_date: this.reportingDate,
                                  source_id: item.source_id,
                                  cell_calc_ref: item.cell_calc_ref,
                                  rules: item.cell_business_rules,
                                  page: 0
                                }
                          this.props.handleBusinessRuleClicked(event,calcBusinessRuleFilter);
                          this.showRulesPanel=!this.showRulesPanel;
                        }
                      }>
                      <i className="fa fa-bank" data-toggle="tooltip" title="Rule Details"></i>
                    </button>
                  </td>
                  <td>
                    {
                      ((in_use) => {
                        if (in_use == 'Y') {
                          return (
                            <Label bsStyle="success">{in_use}</Label>
                          );
                        } else {
                          return (<Label bsStyle="warning">{in_use}</Label>);
                        }
                      })(item.in_use)
                    }
                  </td>
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

export default DrillDownRules;
