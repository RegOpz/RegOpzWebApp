import React, { Component, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';
import _ from 'lodash';
import moment from 'moment';
require('handsontable/dist/handsontable.full.css');
require('./RegOpzDataGrid.css');

class HotTableTab extends PureComponent {
  constructor(props) {
    super(props);
    this.data = [];
    this.mergedCells =[];
    this.hotSettings = {
      data: this.props.data.data,
      readOnly: this.props.readOnly,
      colHeaders: true,
      rowHeaders: true,
      // width: "100%",
      // height: "500",
      colWidths: this.props.data.col_widths
      // Object.keys(this.props.data.col_attr).map((key,index)=>{
      //   let colWidth = parseInt(this.props.data.col_attr[key].width*8);
      //   return colWidth <30 ? 30 : colWidth;
      // })
      ,
      rowHeights: this.props.data.row_heights
      // Object.keys(this.props.data.row_attr).map((key,index)=>{
      //   let rowHeight = parseInt(this.props.data.row_attr[key].height);
      //   return rowHeight < 25 ? 25 : rowHeight;
      // })
      ,
      // className: ' htbody',
      // stretchH: "all",
      // mergeCells: true,
      manualColumnFreeze: true,
      manualRowMove: true,
      manualColumnMove: true,
      outsideClickDeselects:false,
      // comments: true,
      // search: true,
      // fixedRowsTop: 5,
      // fixedRowsBottom: 2,
      // fixedColumnsLeft: this.fixedColumnsLeft,
      // customBorders: this.customBorders,
      contextMenu:  this.props.showToolsMenu ?
        {
          items:{
            'row_above': { key: 'row_above', name: " <i class= 'fa fa-level-up green ' > </i> Insert row above", disabled: this.props.readOnly },
            'row_below': { key: 'row_below', name: " <i class= 'fa fa-level-down green ' > </i> Insert row below", disabled: this.props.readOnly},
            'remove_row': { key: 'remove_row',name: " <i class= 'fa fa-minus red ' > </i> Remove row", disabled: this.props.readOnly},
            'col_left': { key: 'col_left', name: " <i class= 'fa fa-long-arrow-down green ' > </i><i class= 'fa fa-columns ' > </i> Insert column left", disabled: this.props.readOnly},
            'col_right': { key: 'col_right', name: " <i class= 'fa fa-columns ' > </i><i class= 'fa fa-long-arrow-down green ' > </i> Insert column right", disabled: this.props.readOnly},
            'remove_col':{ key: 'remove_col',name: " <i class= 'fa fa-tablet red ' > </i> Remove column", disabled: this.props.readOnly},
            'cut':{disabled: this.props.readOnly},
            'copy': {},
            // 'freezerowcol':{
            //   name: " <i class= 'fa fa-th-list dark ' > </i> Freese Row Column",
            //   callback: function (key, selection, clickEvent) {
            //     // Common callback for all options
            //     let {col,row}=selection[0].start;
            //     console.log("this.hottabledata",key,col,row,selection,this.hottabledata[index].slice(row==0? 0 : row-1,));
            //     this.hotSettings = Object.assign(this.hotSettings,
            //                                     {
            //                                       data: this.hottabledata[index].slice(row==0? 0 : row-1,),
            //                                       fixedRowsTop:1,fixedColumnsLeft: col
            //                                     }
            //                                     )
            //     // this.selectedCell= {row,col};
            //     this.ht.hotInstance.updateSettings(this.hotSettings);
            //     // this.ht.hotInstance.render();
            //
            //   }.bind(this)
            // },
            'freeze_column': {},
            'unfreeze_column': {},
            'hsep1': '---------',
            'alignment':{disabled: this.props.readOnly},
            'hsep2': '---------',
            'mergeCells':{disabled: this.props.readOnly}
          }
        }
        :
        false
      ,
      manualRowResize: true,
      manualColumnResize: true,
      mergeCells: this.props.data.merged_cells ? this.props.data.merged_cells : true,
      // cell:this.cell,
      // beforeRender: function(isForced){
      //   if(!isForced) return(<h4>Loading....</h4>)
      // }
      afterSelectionEnd:(row, column, row2, column2, selectionLayerLevel) => {
        // setting if prevent scrolling after selection
        // console.log("After selection .....",row, column, row2, column2, selectionLayerLevel )
        let startRow = row <= row2 ? row : row2;
        let endRow = row <= row2 ? row2 : row;
        let startCol = column <= column2 ? column : column2;
        let endCol = column <= column2 ? column2 : column;
        this.props.handleSelectCell(this.props.data.sheet,[startRow, startCol, endRow, endCol]);
      }

    }
    this.flag=true;
    this.alphaSequence = this.alphaSequence.bind(this);

  }

  componentWillMount(){
    console.log("Inside dridData map componentWillMount",this.hotSettings.data.length);


    // let cols = Object.keys(this.props.data.col_attr).length;
    // let rows = Object.keys(this.props.data.row_attr).length;
    // this.data=[];
    // this.mergedCells=[];
    // this.data = Array(rows).fill(null).map(x => Array(cols).fill(null))
    // // for(let r=0;r<rows;r++){
    // //   this.data.push([]);
    // //   console.log("data in row ", r);
    // //   for (let c=0; c<cols;c++){
    // //     let value = _.find(this.props.data.matrix,function(v){return v.cell==this.alphaSequence(c)+(r+1).toString();}.bind(this))
    // //     let valueMatrix = value ? value.value : null;
    // //     if(value && value.merged){
    // //       // This is a marged cell lets populate merge Details
    // //       console.log("Value mergedcells",value,this.mergedCells)
    // //       let endCol = (value.merged.replace(/[0-9]*/,'')).charCodeAt(0)-65;
    // //       let endRow = value.merged.replace(/[A-Z]*/,'');
    // //       this.mergedCells.push({row: r, col: c, rowspan: endRow - r, colspan: endCol - c + 1});
    // //     }
    // //     this.data[r].push(valueMatrix);
    // //   }
    // // }
    // console.log("Before hottable matrix loop...",moment().format('h:mm:ss'));
    // this.props.data.matrix.map((value,index)=>{
    //   let valueMatrix = value ? value.value : null;
    //   let r = parseInt(value.cell.replace(/^[A-Z]*/,'')) - 1;
    //   let c = (value.cell.replace(/[0-9]*$/,'')).charCodeAt(0)-65;
    //
    //   if(value && value.merged){
    //     // This is a marged cell lets populate merge Details
    //     // console.log("Value mergedcells",value,this.mergedCells)
    //     let endCol = (value.merged.replace(/[0-9]*/,'')).charCodeAt(0)-65;
    //     let endRow = value.merged.replace(/[A-Z]*/,'');
    //     this.mergedCells.push({row: r, col: c, rowspan: endRow - r, colspan: endCol - c + 1});
    //   }
    //   // console.log("Processing row col ",r,c,valueMatrix)
    //   this.data[r][c] = valueMatrix;
    // })
    // console.log("After hottable matrix loop...",moment().format('h:mm:ss'));

  }


  componentDidMount(){
    this.flag=false;
    console.log("Inside dridData map chot table tab omponentDidUnMount",this.mergedCells);
  }

  componentWillReceiveProps(nextProps){
    // TODO
  }

  alphaSequence(i) {
      return i < 0
          ? ""
          : this.alphaSequence((i / 26) - 1) + String.fromCharCode((65 + i % 26) + "");
  }

  render(){

    // if (this.hotSettings.data.length > 0) {
    // this.hotSettings.data = this.data;
    // this.hotSettings.mergeCells = this.mergedCells;

      // console.log("Inside dridData map render htotable",this.flag,this.mergedCells,this.data,this.ht);
      // if(this.flag){
        return(
          <HotTable
                className={"ht-container"}
                id={"ht"+this.props.index}
                settings={this.hotSettings}
                ref={(HotTable)=>{this.ht=HotTable}}
          />
        )
    //   }
    //
    // } else {
    //   return(
    //     <h4>Loading...</h4>
    //   )
    // }
  }
}

export default HotTableTab;
