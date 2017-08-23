import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import RegOpzDataGridHeader from './RegOpzDataGridHeader';
import RegOpzDataGridSideMarker from './RegOpzGridSideMarker';
import RegOpzDataGridHorizontalLines from './RegOpzDataGridHorizontalLines';
import RegOpzDataGridVerticalLines from './RegOpzDataGridVerticalLines';
import RegOpzDataGridBody from './RegOpzDataGridBody';
require('./RegOpzDataGrid.css');

class RegOpzReportGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen:false
    };
    this.numberofCols = 52;
    this.numberofRows = 1000;
    this.data = [];
    this.selectedSheet = 0;
    this.report_id = this.props.report_id;
    this.reporting_date = this.props.reporting_date;
    this.gridData = this.props.gridData;
    this.cell_format_yn = 'Y';
    this.selectedCell = null;
    this.selectedSheetName = null;
    this.gridHight = 0;
    this.gridWidth = 0;
    this.rulesIdAsSubQuery = "";
    this.linkageData = null;
  }

  componentWillReceiveProps(nextProps){
      //TODO
      this.gridData = nextProps.gridData;
  }

  alphaSequence(i) {
      return i < 0
          ? ""
          : this.alphaSequence((i / 26) - 1) + String.fromCharCode((65 + i % 26) + "");
  }

  render(){
    if (this.gridData.length > 0) {
      this.data = this.gridData[this.selectedSheet].matrix;
      this.selectedSheetName = this.gridData[this.selectedSheet]['sheet'];
      let row_attr = this.gridData[this.selectedSheet].row_attr;
      let col_attr = this.gridData[this.selectedSheet].col_attr;
      console.log('no of rows...', row_attr, row_attr.length);
      this.numberofRows = Object.keys(row_attr).length;
      this.numberofCols = Object.keys(col_attr).length;
      this.gridHight = 0;
      this.gridWidth = 0;
      [... Array(parseInt(this.numberofRows))].map(function(item,index){
          //var stylex = {};
          if(typeof(row_attr[(index+1)+""]) != 'undefined') {
            this.gridHight += parseInt(row_attr[(index+1)+""].height) * 2;
          }
      }.bind(this));
      [... Array(parseInt(this.numberofCols))].map(function(item,index){
          //var stylex = {};
          if(typeof(col_attr[this.alphaSequence(index)]) != 'undefined'){
            this.gridWidth += parseInt(col_attr[this.alphaSequence(index)]['width']) * 9 + 1;
          }
      }.bind(this));
      console.log('grid hight',this.gridHight);
      if( typeof this.props.audit_list != 'undefined' && this.props.audit_list.length ){
        this.linkageData = this.props.audit_list;
      }
      return(
        <div className="reg_gridHolder">
          <div>
            <div className="row">
              <div className="row reg_sheet_buttons_holder">
                <div className="btn-group">
                  <button className="btn btn-success btn-sm">Showing <i className="fa fa-cube"></i> {this.selectedSheetName}</button>
                  {
                    this.gridData.map((item,index) => {
                      return(
                        <button
                          key={index}
                          target={index}
                          type="button"
                          className="btn btn-warning btn-xs"
                          onClick={(event) => {
                            this.selectedSheet = event.target.getAttribute("target");
                            this.forceUpdate();
                          }}
                        >
                          {item['sheet']}
                        </button>
                      )
                    })
                  }
                </div>
              </div>
            </div>
          </div>
        <div className="data_grid_container">
          <RegOpzDataGridHeader
            numberofCols={this.numberofCols}
            colAttr={this.gridData[this.selectedSheet].col_attr}
          />
          <div className="clearfix"></div>
          <RegOpzDataGridSideMarker
            numberofRows={this.numberofRows}
            rowAttr={this.gridData[this.selectedSheet].row_attr}
          />
          <div className="reg_grid_drawing_container">
              <RegOpzDataGridHorizontalLines
                numberofRows={this.numberofRows}
                height={this.gridHight}
                width={this.gridWidth}
                rowAttr={this.gridData[this.selectedSheet].row_attr}
              />
              <RegOpzDataGridVerticalLines
                numberofCols={this.numberofCols}
                height={this.gridHight}
                width={this.gridWidth}
                colAttr={this.gridData[this.selectedSheet].col_attr}
              />
              <RegOpzDataGridBody
                data={this.data}
                colAttr={this.gridData[this.selectedSheet].col_attr}
                rowAttr={this.gridData[this.selectedSheet].row_attr}
                onSelect = {
                  (item) => {
                    this.selectedCell = item;
                    console.log("On select",item);
                  }
                }
              />
          </div>
        </div>
      </div>
      )
    } else {
      return(
        <h1>Loading...</h1>
      )
    }
  }
}

export default RegOpzReportGrid;
