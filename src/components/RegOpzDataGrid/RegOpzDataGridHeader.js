import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class RegOpzDataGridHeader extends Component {
    constructor(props) {
        super(props);
        this.widthAtMouseEnter = 0;
        this.numberofCols = this.props.numberofCols;
        this.colAttr = this.props.colAttr;
        this.columns = [];
        for(let i = 0; i < this.numberofCols; i++){
            this.columns[i] = this.alphaSequence(i);
        }
        this.element=undefined;

        this.handleEnableResize = this.handleEnableResize.bind(this);
        this.handleDisableResize = this.handleDisableResize.bind(this);

    }

    componentWillReceiveProps(nextProps) {
      this.colAttr = nextProps.colAttr;
      this.numberofCols = nextProps.numberofCols;
      this.columns = [];
      for(let i = 0; i < this.numberofCols; i++){
          this.columns[i] = this.alphaSequence(i);
      }
    }

    handleEnableResize(event,item){
      console.log("Recorded at event ... ", event.type);
      $(event.target).css("resize","horizontal");
      this.element=document.getElementById(item);
      this.widthAtMouseEnter = this.element.offsetWidth;
    }

    handleDisableResize(event,item){
      $(event.target).css("resize","none");
      console.log("Recorded at event ... ", event.type);
      let renderedGridWidth = parseInt(this.colAttr[item]['width'])*9 + 1;
      console.log("Width at mouse Leave ... ", item, renderedGridWidth,this.widthAtMouseEnter );
      this.element=document.getElementById(item);
      if (this.element.offsetWidth != this.widthAtMouseEnter || renderedGridWidth !=this.element.offsetWidth){
        let width=this.element.offsetWidth/9;
        this.props.handleResize(item,width,"column");
      }

    }

    render() {
        var _self = this;
        return (
            <div className="reg_header">
                <div id="None" className="reg_col_first">
                  <span></span>
                </div>
                {
                    this.columns.map(function(item, index) {
                        let colStyleForHeader = {};
                        if(typeof(this.colAttr[item]) != 'undefined'){
                          colStyleForHeader.width = parseInt(this.colAttr[item]['width'])*9;
                          colStyleForHeader.overflow = "hidden";
                          // colStyleForHeader.resize = "horizontal";
                          // colStyleForHeader.cursor = "col-resize";
                        }
                        return (
                            <div id={item} key={index} className="reg_col">
                                <span  style={colStyleForHeader}
                                  onMouseEnter={
                                    (event)=>{this.handleEnableResize(event,item)}
                                  }
                                  onMouseLeave={
                                    (event)=>{this.handleDisableResize(event,item)}
                                  }
                                  >{item}
                                </span>
                            </div>
                        )
                    }.bind(this))
                }
            </div>
        )
    }
    alphaSequence(i) {
        return i < 0
            ? ""
            : this.alphaSequence((i / 26) - 1) + String.fromCharCode((65 + i % 26) + "");
    }
    numberFromWord(val) {
        var base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            i,
            j,
            result = 0;

        for (i = 0, j = val.length - 1; i < val.length; i += 1, j -= 1) {
            result += Math.pow(base.length, j) * (base.indexOf(val[i]) + 1);
        }

        return result -1;
    }
    sliptNumbersAndChars(string){
        return string.match(/[A-Z]+|[0-9]+/g);
    }
    getRealCoords(cell){
        let cell_split = this.sliptNumbersAndChars(cell);
        console.log(cell_split);
        let x = this.numberFromWord(cell_split[0]);
        let y = cell_split[1] - 1;
        return {x,y};
    }
}
