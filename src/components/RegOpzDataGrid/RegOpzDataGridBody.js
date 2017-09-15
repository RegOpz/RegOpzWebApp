import React, {Component} from 'react';
import ReactDOM from 'react-dom';
export default class RegOpzDataGridBody extends Component {
    constructor(props) {
        super(props);
        this.data = this.props.data;
        this.delTop = 29;
        this.colAttr = this.props.colAttr;
        this.rowAttr = this.props.rowAttr;
        this.state = {
          contextMenuStyle:{
            display:"none"
          }
        }
        this.selectedCell = null;
    }
    componentWillReceiveProps(nextProps){
      this.data = nextProps.data;
      this.delTop = 29;
      this.colAttr = nextProps.colAttr;
      this.rowAttr = nextProps.rowAttr;
    }
    render(){
        return(
            <div id="gridBody">
                {
                    this.data.map(function(item,index){
                        //console.log("Cell,value,index",item.cell,item.value,index,item);
                        let cell = item.cell;
                        let value = item.value;
                        let coord = this.getRealCoords(cell);
                        let merged = item.merged;
                        var stylex = {};
                        let cellClassName = "reg_cell";
                        var left = 0;
                        var width = 0;
                        var height = 0;
                        var top = 0;
                        if(merged){
                          let marged_coord = this.getRealCoords(merged);
                          for(var i = parseInt(this.numberFromWord(coord.col)) - 1; i >= parseInt(this.numberFromWord('A')); i--){
                            left += (parseInt(this.colAttr[this.alphaSequence(i)].width) * 9 + 1);
                          }
                          for(var i = parseInt(this.numberFromWord(marged_coord.col)); i >= parseInt(this.numberFromWord(coord.col)); i--){
                            width += (parseInt(this.colAttr[this.alphaSequence(i)].width) * 9 + 1);
                          }
                          let currentRow = parseInt(coord.row) + 1;
                          let margedRow = parseInt(marged_coord.row) + 1;
                          for(let j = currentRow -1; j > 0; --j){
                            top += parseInt(this.rowAttr[j + ""].height) * 2;
                          }
                          if(currentRow == margedRow){
                            height = parseInt(this.rowAttr[currentRow+""].height) * 2;
                          } else {
                            for(let j = margedRow; j >= currentRow; j--){
                              height += parseInt(this.rowAttr[j + ""].height) * 2;
                            }
                          }
                          stylex = {
                            top:top,
                            left:left,
                            width:width -1,
                            height:height -1
                          }
                        } else {
                          for(var i = parseInt(this.numberFromWord(coord.col)) - 1; i >= parseInt(this.numberFromWord('A')); i--){
                            left += (parseInt(this.colAttr[this.alphaSequence(i)].width) * 9 + 1);
                          }
                          let currentRow = parseInt(coord.row) + 1
                          for(let j = currentRow -1; j > 0; j--){
                            if(typeof(this.rowAttr[j + ""]) != 'undefined')
                              top += parseInt(this.rowAttr[j + ""].height) * 2;
                            else
                              top += 12.3;
                          }
                          width = parseInt(this.colAttr[coord.col].width) * 9;
                          if(typeof(this.rowAttr[currentRow+""]) != 'undefined')
                            height = parseInt(this.rowAttr[currentRow+""].height) * 2 -1;
                          else
                            height = 12.3;
                            stylex = {
                              top:top,
                              left:left,
                              width:width,
                              height:height
                            }
                        }
                        if (isNaN(value)){
                          cellClassName = cellClassName + " reg_cell_text";
                        } else {
                          cellClassName = cellClassName + " reg_cell_number";
                          //Now format number as per international number format 99,999,999
                          value = Intl.NumberFormat().format(value);
                        }
                        return(
                            <div
                              key={cell+index}
                              className={cellClassName}
                              style={stylex}
                            >
                                <span
                                  onClick={
                                    (event) => {
                                      this.handleCellClick(event,value);
                                    }
                                  }
                                  target={cell}
                                >{value}</span>
                            </div>
                        )
                    }.bind(this))
                }
            </div>
        )
    }
    handleCellClick(event,value){
      $(".reg_cell > span").removeClass("reg_cell_selected");
      $(event.target).addClass("reg_cell_selected");
      this.selectedCell = {
                    cell: event.target.getAttribute("target"),
                    value: value
                  };
      //console.log("handleCellClick",this.selectedCell);
      this.props.onSelect(this.selectedCell);
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
        //console.log(cell_split);
        let x = this.numberFromWord(cell_split[0]);
        let y = cell_split[1] - 1;
        return {x,y,col:cell_split[0],row:cell_split[1] - 1};
    }
}
