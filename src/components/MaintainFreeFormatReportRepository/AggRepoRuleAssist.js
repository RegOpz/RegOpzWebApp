import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Panel,Button} from 'react-bootstrap';
import { actionRepoDrillDown } from '../../actions/ReportRulesRepositoryAction';
import RegOpzFlatGridActionButtons from '../RegOpzFlatGrid/RegOpzFlatGridActionButtons';
import RegOpzReportGrid from './../RegOpzDataGrid/RegOpzReportGrid';


class AggRepoRuleAssist extends Component{

  constructor(props){
    super(props);
    this.state={
      evaluating:false,
      formula:this.props.comp_agg_rule,
      openDataGridCollapsible: true,
      buttons: []
    };

    this.cell = null;
    this.alphaSequence = this.alphaSequence.bind(this);
    this.handleRefreshSelectCell=this.handleRefreshSelectCell.bind(this);
    this.handleFormFieldClick=this.handleFormFieldClick.bind(this);
  }

  componentWillReceiveProps(nextProps){
    console.log("Next props of select cell....", nextProps.selectedCell)
    let buttons=[];
    if (nextProps.cell_options){
      nextProps.cell_options.comp_agg_rules.map((item,index)=>{
        console.log("inside if handleSelectCell data.drillDown.comp_agg_rules.map",this.props.cell_id , this.props.sheet_id,item.cell_id + item.sheet_id);
          if(this.props.cell_id + this.props.sheet_id != item.cell_id + item.sheet_id){
            buttons.push({
                title: item.cell_id + " Aggregation Rule: " + item.comp_agg_rule,
                name: item.comp_agg_ref,
                iconClass: 'fa-bullhorn green',
                checkDisabled: 'No',
                className: "btn-default",
              })
          }
        });

        nextProps.cell_options.cell_rules.map((item,index)=>{
          console.log("inside if handleSelectCell data.drillDown.cell_rules.map");
            buttons.push({
                title: item.cell_id + " Rule: " + item.cell_business_rules + " Aggregation: " + item.aggregation_func + "(" + item.aggregation_ref +")",
                name: item.cell_calc_ref,
                iconClass: 'fa-tag blue',
                checkDisabled: 'No',
                className: "btn-default",
              })
          });

         this.setState({buttons:buttons},()=>{console.log("At the end of setState select",this.state.buttons);});
         if(!this.formulaInput)
           return;
        //  if (this.state.formula){
        //    this.formulaInput.selectionStart = this.state.formula.length;
        //    this.formulaInput.selectionEnd = this.state.formula.length;
        //  }
         this.formulaInput.focus();
      }

  }

  alphaSequence(i) {
      return i < 0
          ? ""
          : this.alphaSequence((i / 26) - 1) + String.fromCharCode((65 + i % 26) + "");
  }

  handleRefreshSelectCell(event){
    event.stopPropagation();
    const { reportGrid } = this.props;
    let sheetName = reportGrid.gridData[reportGrid.key].sheet;
    let reportId = reportGrid.report_id;
    let selectedCell = reportGrid.ht.hotInstance.getSelectedLast();
    this.cell = null;
    let cellRef = null;
    selectedCell = selectedCell ? selectedCell : [undefined,undefined,undefined,undefined];
    if(selectedCell){
      let [startrow,startcol,endrow,endcol]=selectedCell;
      this.cell = this.alphaSequence(startcol)+(startrow+1);
      // console.log("Inside handleRefreshSelectCell",this.cell, cellRef, selectedCell,startrow,startcol,endrow,endcol,reportGrid.key);
      cellRef = reportGrid.gridData[reportGrid.key].cell_refs[startrow][startcol]
      // console.log("Selected cell ref...", this.selectedCell.cellRef);
      this.props.drillDown(reportId,sheetName,cellRef);
    }
    // console.log("Inside handleRefreshSelectCell",this.cell, cellRef, selectedCell);

}

  handleFormFieldClick(event,element){
    let formula = this.state.formula ? this.state.formula : "";
    if ( formula != "" && (this.formulaInput.selectionStart || this.formulaInput.selectionStart == '0')) {
        let startPos = this.formulaInput.selectionStart;
        let endPos = this.formulaInput.selectionEnd;
        formula = formula.substring(0, startPos) +
            element +
            formula.substring(endPos, this.state.formula.length);
        this.formulaInput.selectionStart = startPos + element.length;
        this.formulaInput.selectionEnd = startPos + element.length;
    }
    else
        formula += element;

    this.setState({formula: formula});
    this.formulaInput.focus();

  }


  render(){
    const { reportGrid } = this.props;
    console.log("Inside render AggRepoRuleAssist");
    return (
      <div className="row form-container">
        <div className="x_panel">
          <div className="col col-lg-12">
              <div className="x_title">
                  <h2>Aggregation Rule Managament <small>Edit aggregation rule</small></h2>
                    <ul className="nav navbar-right panel_toolbox">
                      <li>
                        <a className="close-link" onClick={this.props.handleEditAggRule}><i className="fa fa-close"></i></a>
                      </li>
                    </ul>
                  <div className="clearfix"></div>
              </div>

              <div className="col-md-12 col-sm-12 col-xs-12">
                <div className="x_content">
                  <div className="form-group">
                    <textarea
                        className="form-control"
                        type="text"
                        disabled={false}
                        value={this.state.formula}
                        onChange={(event)=> {
                          console.log("On change text area:",this.formulaInput.selecttionStart,this.formulaInput.selecttionEnd);
                          this.setState({formula:event.target.value});}}
                        placeholder='Enter a formula here...'
                        ref={(textArea) => { this.formulaInput = textArea }}
                    />
                  </div>
                  <div className="form-group">
                    <button
                      type="button"
                      className="btn btn-success btn-xs"
                      onClick={(event)=>{
                        this.props.handleChangeAggRule(this.state.formula);
                        this.props.handleEditAggRule();
                      }}
                      >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-default btn-xs"
                      onClick={this.props.handleEditAggRule}
                      >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-xs"
                      onClick={()=>{}}
                      >
                      Validate
                    </button>
                    <button
                      type="button"
                      className="btn btn-dark btn-xs"
                      onClick={this.handleRefreshSelectCell}
                      >
                      <i className="fa fa-refresh"></i>
                       &nbsp;References
                    </button>
                  </div>


                </div>
              </div>

              {this.state.evaluating &&
                 <div className="col-md-4 col-sm-4 col-xs-12">
                  <div className="x_panel">
                    <div className="x_title">
                      <h5>Enter values<small> for evaluation</small></h5>
                      <div className="clearfix"></div>
                    </div>
                  </div>
                </div>
              }
              <div className="col col-md-12 col-xs-12">
                <div className="form-group">
                  <Panel
                    collapsible
                    bsClass=""
                    expanded={this.state.openDataGridCollapsible}
                    >
                    {
                      this.cell &&
                      <p>{"Available calculations and aggegations of cell " + this.cell
                         + " which can be used to create formula for "+ this.props.comp_agg_ref }</p>
                    }
                      <RegOpzFlatGridActionButtons
                        editable={this.writeOnly}
                        checkDisabled={this.checkDisabled}
                        buttons={this.state.buttons}
                        dataNavigation={false}
                        buttonClicked={this.handleFormFieldClick.bind(this)}
                      />
                  </Panel>
                </div>
              </div>
            </div>
          </div>
        </div>
    );

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    drillDown:(report_id,sheet,cell) => {
      dispatch(actionRepoDrillDown(report_id,sheet,cell));
    },
  };
}

function mapStateToProps(state) {
  return{
    //cell_rules: state.report_store.cell_rules,
    cell_options: state.report_rules_repo.cellRules,
    };
}

const VisibleAggRepoRuleAssist = connect(
  mapStateToProps,
  mapDispatchToProps
)(AggRepoRuleAssist);

export default VisibleAggRepoRuleAssist;
