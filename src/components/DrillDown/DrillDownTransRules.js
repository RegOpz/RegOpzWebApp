import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Label } from 'react-bootstrap';
import moment from 'moment';


class DrillDownTransRules extends Component {
  constructor(props){
    super(props);
    this.secDetails = this.props.cellRules;
    this.cellRules = this.props.cellRules.secRules;
    this.secOrders = this.props.cellRules.secOrders;
    this.section = this.props.cellRules.section;
    this.sectionColumns = this.props.cellRules.secColumns;
    this.readOnly = this.props.readOnly;
    this.selectedCell = this.props.selectedCell;
    this.reportingDate = this.props.reportingDate;
    this.state={showRulesPanel : true};
    this.collapseIcon = "fa-chevron-up";
    //this.renderChangeHistory = this.renderChangeHistory.bind(this);
    this.renderOrderBy = this.renderOrderBy.bind(this);
    this.renderCalcRules = this.renderCalcRules.bind(this);
    this.renderCalcRulesBtn = this.renderCalcRulesBtn.bind(this);
    this.handleCollapse = this.handleCollapse.bind(this);
    this.disabledelete=(this.secOrders.length == 0 && this.cellRules.length ==0)||
                        (this.secOrders.length > 0 && this.secOrders.findIndex(x=>x.dml_allowed=='N')!=-1)||
                        (this.cellRules.length > 0 && this.cellRules.findIndex(x=>x.dml_allowed=='N')!=-1)
                        ?
                        true:false;
  }

  componentWillReceiveProps(nextProps){
      //TODO
      this.secDetails = nextProps.cellRules;
      console.log("nextProps cellRules",nextProps.cellRules)
      //this.cellRules = nextProps.cellRules.secRules;
      //this.secOrders = nextProps.cellRules.secOrders;
      this.readOnly = nextProps.readOnly;
      this.selectedCell = nextProps.selectedCell;
      this.section = nextProps.cellRules.section;
      if(nextProps.cellRules)
      {
        this.sectionColumns = nextProps.cellRules.secColumns;
        this.secOrders = nextProps.cellRules.secOrders;
        this.cellRules = nextProps.cellRules.secRules;
        this.disabledelete=(this.secOrders.length == 0 && this.cellRules.length ==0)||
                            (this.secOrders.length > 0 && this.secOrders.findIndex(x=>x.dml_allowed=='N')!=-1)||
                            (this.cellRules.length > 0 && this.cellRules.findIndex(x=>x.dml_allowed=='N')!=-1)
                            ?
                            true:false;
      }
  }

  handleCollapse(event) {
    if(this.state.showRulesPanel) {
      this.collapseIcon = "fa-chevron-down";
    }
    else {
      this.collapseIcon = "fa-chevron-up";
    }
    this.setState({showRulesPanel:!this.state.showRulesPanel},
      ()=>{
        console.log("Clicked in the collapse-link",this.state.showRulesPanel);
      }
    );

    // this.forceUpdate();
  }

  render(){
    return(
          (this.secOrders.length != 0 || this.cellRules.length !=0 || !this.props.showOnlyData) &&
          <div className="x_panel">
            <div className="x_title">
              <h2>Report Cell Rules
              <small> for Section <b>{this.section}</b> of Sheet <b>{this.selectedCell.sheetName}</b></small>
              </h2>
              {!this.props.showOnlyData &&
                <ul className="nav navbar-right panel_toolbox">
                <li>
                  <a className="close-link" onClick={this.props.handleClose}><i className="fa fa-close"></i></a>
                </li>
                <li>
                  <a className="collapse-link"
                    onClick={ this.handleCollapse }><i className= { "fa " + this.collapseIcon}></i></a>
                </li>
              </ul>
             }
              <div className="clearfix"></div>
            </div>
            {
              this.state.showRulesPanel &&
              <div>
                <div className="x_content">
                  {
                    this.props.showOnlyData && !this.disabledelete &&
                    <div>
                      <h5 className="">
                        <i className="fa fa-warning"></i>
                        There are existing rules! The section can only be reset after deleting all existing rules for the selected section!
                      </h5>
                      <button type ="button"
                        className="btn btn-danger btn-sm"
                        data-toggle="tooltip"
                        title="Delete Agg and Calc Rules"
                        onClick={(event)=>{this.props.handleDeleteRules();}}>
                        <i className="fa fa-trash"></i>
                        {" Delete Section Rules"}
                       </button>
                    </div>
                  }
                  {
                    this.props.showOnlyData &&
                    this.disabledelete &&
                    <div>
                      <h5 className="amber">
                        <i className="fa fa-warning"></i>
                        There are section rules pending review! Can not reset the selected section!
                      </h5>
                    </div>
                  }
                  {!this.props.showOnlyData &&
                    <button
                      className="btn btn-primary btn-circle btn-sm"
                      data-toggle="tooltip"
                      title="Cell Rules Change History"
                      onClick={
                        (event)=>{
                          let item = {
                              report_id: this.selectedCell.reportId,
                              section_id: this.section,
                              sheet_name: this.selectedCell.sheetName,
                          };
                          this.props.handleCellHistoryClicked(event, item);
                          this.handleCollapse(event);
                        }
                      }
                      >
                      <i className="fa fa-history"></i>
                      {" Change History"}
                    </button>
                  }
                  <div className="x_panel">
                    <div className="x_title">
                      <h2>Section Order Condition</h2>
                      <div className="clearfix"></div>
                    </div>
                    <div className="x_content">
                    { this.renderOrderBy(this.secDetails)}
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

  renderOrderBy(secDetails) {
    console.log("Modal linkage data", secDetails);
    if (secDetails.secOrders && secDetails.secOrders.length == 0 )
    {
      return (
        <div>
          <h5>No Ordering Details defined for  {this.selectedCell.cell} of {this.selectedCell.sheetName}!</h5>
          {
              !this.props.showOnlyData&&
              ((addRulesBtn) => {
                  if (addRulesBtn) {
                      return(
                          <button
                            type="button"
                            disabled={this.disabled}
                            className="btn btn-primary btn-sm"
                            onClick={
                              (event)=>{
                                this.props.handleAggeRuleClicked(event, secDetails);
                                this.handleCollapse();
                              }
                            }
                          >
                              Add Ordering
                          </button>
                      );
                  }
              })(this.props.addRulesBtn)
          }
        </div>
      );
    }
    else {
      // TODO
      let secOrders = secDetails.secOrders;
      return (
              <div className="dataTables_wrapper form-inline dt-bootstrap no-footer">
                <div className="row">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>SL#</th>
                      <th>Order Ref</th>
                      <th>Order Logic</th>
                      <th>In Use</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      secOrders.length > 0 && secOrders.map((item,index)=>{
                        return(
                          (item.in_use =="Y" ||
                          (item.in_use !="X" && item.dml_allowed != 'X') ||
                          this.reportingDate ) &&
                          <tr>
                            <td><strong>{index+1}</strong></td>
                            <td>
                              <small>{item.cell_agg_ref}</small>
                              <div>
                                {!this.props.showOnlyData&&
                                  <button
                                  type="button"
                                  className="btn btn-link btn-xs"
                                  onClick={
                                      (event)=>{
                                        let secDetailsRule = {...secDetails};
                                        secDetailsRule.secOrders = item;
                                        this.props.handleAggeRuleClicked(event, secDetailsRule);
                                        this.handleCollapse();
                                      }
                                    }
                                  >
                                  <i className="fa fa-cube" data-toggle="tooltip" title="Order Details"></i>
                                </button>
                              }
                              </div>
                            </td>
                            <td>
                              <small>
                              {
                                ((cell_agg_render_ref)=>{
                                  let orderDetails = JSON.parse(cell_agg_render_ref);
                                  let elements=[];
                                  Object.keys(orderDetails).map((element,index)=>{
                                    if (element == "sortorder"){
                                      orderDetails.sortorder.map((col,index)=>{
                                        elements.push(<div>{col.column + " : " + (col.order=="ASC"? "Ascending":"Descending")}</div>)
                                      })
                                    } else {
                                      elements.push(<div>{element + " : " + orderDetails[element]}</div>)
                                    }
                                  })
                                  return elements;
                                })(item.cell_agg_render_ref)
                              }
                              </small>
                            </td>
                            <td>
                              <Label bsStyle={item.in_use == "Y" ? "success": "warning"}>{item.in_use}</Label>
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
                </div>
              </div>
          );
    }
  }

  renderCalcRules(cellRules) {
    console.log("Modal linkage data renderCalcRules", cellRules);
    if (cellRules.length == 0 ){
      return (
        <div>
          <h5>No Source Calculation Rule defined for  {this.selectedCell.cell} of {this.selectedCell.sheetName}!</h5>
          <div>
          {
            this.renderCalcRulesBtn()
          }
          </div>
        </div>
      );
      ///this.setState({calc_rules:false});
    }
    else {
      let item = cellRules;
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
              let cellCalc = JSON.parse(item.cell_calc_render_ref)
              console.log("After parsing JSON string...", cellCalc);
              return(
                (item.in_use=="Y" ||
                (item.in_use !="X" && item.dml_allowed != 'X') ||
                this.reportingDate ) &&
                <tr>
                  <td>{item.source_id}</td>
                  <td>
                    <small>{item.cell_calc_ref}</small>
                    <div>
                      {
                        !this.props.showOnlyData &&
                        <button
                          type="button"
                          className="btn btn-link btn-xs "
                          onClick={
                            (event)=>{
                              this.props.handleCalcRuleClicked(event, item,this.sectionColumns, "edit");
                              //this.showRulesPanel=!this.showRulesPanel;
                              this.handleCollapse(event);
                            }
                          }>
                          <i className="fa fa-cube" data-toggle="tooltip" title="Data Details"></i>
                        </button>
                      }
                      {
                        this.props.addRulesBtn &&
                        <button
                          type="button"
                          className="btn btn-link green btn-xs"
                          onClick={
                            (event)=>{
                              let newItem = item;
                              newItem.cell_calc_ref = moment().format('YYYYMMDDHHMMSS');
                              this.props.handleCalcRuleClicked(event, item,this.sectionColumns, "copy");
                              //this.showRulesPanel=!this.showRulesPanel;
                              this.handleCollapse(event);
                            }
                          }>
                          <i className="fa fa-copy" data-toggle="tooltip" title="Copy Rule"></i>
                        </button>
                      }
                      {
                        this.props.addRulesBtn &&
                        item.dml_allowed == 'Y' &&
                        item.in_use == 'Y' &&
                        <button
                          type="button"
                          className="btn btn-link amber btn-xs"
                          onClick={
                            (event)=>{
                              // let newItem = item;
                              // newItem.cell_calc_ref = moment().format('YYYYMMDDHHMMSS');
                              // this.props.handleCalcRuleClicked(event, item,this.sectionColumns, "copy");
                              //this.showRulesPanel=!this.showRulesPanel;
                              // TODO Delete rule to be added later
                              let toDeleteItem = {
                                rule: item,
                                table_name: "report_dyn_trans_calc_def"
                              }
                              this.props.handleDeleteClick(toDeleteItem);
                              // this.handleCollapse(event);
                            }
                          }>
                          <i className="fa fa-close" data-toggle="tooltip" title="Delete Rule"></i>
                        </button>
                      }
                    </div>
                  </td>
                  <td>
                    <small>
                      {
                        Object.keys(cellCalc.calc).map(col=>{
                          return(cellCalc.calc[col].column && <p>{col} : {cellCalc.calc[col].column}</p>)
                        })
                      }
                    </small>
                  </td>
                  <td>
                    <small>{cellCalc.rule}</small>
                    {
                      !this.props.showOnlyData&&
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
                                    rules: cellCalc.rule,
                                    page: 0
                                  }
                            this.props.handleBusinessRuleClicked(event,calcBusinessRuleFilter);
                            //this.showRulesPanel=!this.showRulesPanel;
                            this.handleCollapse(event);
                          }
                        }>
                        <i className="fa fa-bank" data-toggle="tooltip" title="Rule Details"></i>
                      </button>
                    }
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
        {
            this.renderCalcRulesBtn()
        }
        </div>
      </div>
      )
    }
  }

  renderCalcRulesBtn(){
    console.log("Inside renderCalcRulesBtn",this.props.addRulesBtn);
    let cellCalcRef='';
    if (this.cellRules.length ==0){
        // cellCalcRef=this.cellRules.comp_agg_ref.replace('AGG','CALC')+'.000';
    }
    else {
        // let seq=[];
        // let i=0;
        // let existingCellCalcRefs=this.cellRules.cell_rules.map(e=>e.cell_calc_ref);
        // console.log("Inside renderCalcRulesBtn cellCalcRefs",existingCellCalcRefs)
        // for(let cellRef of existingCellCalcRefs){
        //   seq[i]=cellRef.split(/\./g)[1]
        //   console.log("Inside renderCalcRulesBtn",seq)
        //   i++;
        // }
        // let maxCellRef=Math.max(...seq)+1;
        // if(maxCellRef > 999){ console.log("Error:Number can't be greater than 1000");}
        // cellCalcRef=this.cellRules.comp_agg_ref.replace('AGG','CALC')+'.'+
        //                      ((num,size)=>{
        //                           var s = num+"";
        //                           while (s.length < size) s = "0" + s;
        //                           return s;
        //                         })(maxCellRef,3);

    }

    if (this.props.addRulesBtn) {
        return(
            <button
              type="button"
              disabled={this.disabled}
              className="btn btn-primary btn-sm"
              onClick={
                (event) => {
                    let rule = {
                      report_id: this.selectedCell.reportId,
                      cell_id: this.selectedCell.cell,
                      sheet_id: this.selectedCell.sheetName,
                      section_id: this.section,
                    };
                    console.log("add rule trnas ",rule)
                    this.props.handleCalcRuleClicked(event, rule, this.sectionColumns,"add");
                    //this.showRulesPanel=!this.showRulesPanel;
                    this.handleCollapse(event);
                 }
              }
            >
                Add New Rule
            </button>
        );
    }
  }

}

export default DrillDownTransRules;
