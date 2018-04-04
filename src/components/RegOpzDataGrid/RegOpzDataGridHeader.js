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
        this.item="";
        this.width=0;
        this.elementHS=0;
        this.elementHE=0;
        this.isResizing = false;

        this.handleResizeColumn = this.handleResizeColumn.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);

    }

    componentWillReceiveProps(nextProps) {
      this.colAttr = nextProps.colAttr;
      this.numberofCols = nextProps.numberofCols;
      this.columns = [];
      for(let i = 0; i < this.numberofCols; i++){
          this.columns[i] = this.alphaSequence(i);
      }
    }

    componentDidMount() {
      window.addEventListener('mouseup', this.handleMouseUp); //notice .bind
    }

    componentWillUnmount() {
      window.removeEventListener('mouseup', this.handleMouseUp);
    }

    handleMouseUp(){
      this.isResizing = false;
      this.item="";
      console.log("Mouseup for header .....")
    }

    handleResizeColumn(event,item){
      if(!this.isResizing){
        this.elementHS=$(event.target).offset().left;
        this.elementHE= this.elementHS + $(event.target).width();
      }
      if( this.elementHE - event.pageX < 15 && !this.isResizing){
        $(event.target).css("cursor","col-resize");
        // console.log("cursor resize .... element ....",item, this.item)
      }
      else {
        if(!this.isResizing){
          $(event.target).css("cursor","default");
          this.item="";
        }
        else{
          $(event.target).css("cursor","col-resize");
          this.width=parseInt((event.pageX - this.elementHS)/9);
          this.width=this.width>=2 ? this.width : 2;
          // console.log("Native event values ...", this.item,this.width, this.elementHS,this.elementHE,event.clientX, event.clientY,event.nativeEvent.which)
          this.props.handleResize(this.item,this.width,"column");
        }

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
                                  onMouseMove={
                                    (event)=>{
                                      // this.handleResizeColumn(event,item);
                                      // if(event.type=="mousedown")
                                      this.handleResizeColumn(event,item);
                                      // console.log("onMouseMove evenet for ", event.nativeEvent.which,event.pageX,this.elementHE,event.type)
                                    }
                                  }
                                  onMouseDown={
                                    (event)=>{
                                      this.isResizing = true;
                                      // this.elementHS=$(event.target).offset().left;
                                      // this.elementHE= this.elementHS + $(event.target).width();
                                      this.item=item;
                                    }
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
        // console.log(cell_split);
        let x = this.numberFromWord(cell_split[0]);
        let y = cell_split[1] - 1;
        return {x,y};
    }
}
