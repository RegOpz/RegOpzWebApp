import React, {Component} from 'react';
import ReactDOM from 'react-dom';
export default class RegOpzDataGridBody extends Component {
    constructor(props) {
        super(props);
        this.data = this.props.data;
        this.delTop = 29;
        this.colAttr = this.props.colAttr;
        this.rowAttr = this.props.rowAttr;
        this.cellStyle = this.props.cellStyle;
        this.state = {
          contextMenuStyle:{
            display:"none"
          }
        }
        this.selectedCell = null;
        this.cellSpan = this.cellSpan.bind(this);
    }
    componentWillReceiveProps(nextProps){
      this.data = nextProps.data;
      this.delTop = 29;
      this.colAttr = nextProps.colAttr;
      this.rowAttr = nextProps.rowAttr;
      this.cellStyle = nextProps.cellStyle;
    }

    cellSpan(title,value, stylex,item){
      if (item.origin =='TEMPLATEIMAGE')
      {
        // console.log("Image style values...",stylex.height,stylex.width,(stylex.height/stylex.width)*100,Object.keys(stylex))
        let imgStyle={
          height: stylex.height < stylex.width?  stylex.height : "auto",
          width: stylex.width < stylex.height ? stylex.width : "auto",
          "max-height": stylex.height <= stylex.width ? "100%":"auto",
          "max-width": stylex.width < stylex.height ? "100%" : "auto",
        }
        return(<img style={imgStyle} src="./images/logo.png"></img>);
      } else {
        return(value);
      }

    }
    render(){
        return(
            <div id="gridBody">
                {
                    this.data.map(function(item,index){
                        //console.log("Cell,value,index",item.cell,item.value,index,item);
                        let cell = item.cell;
                        let cellStyle = this.cellStyle[cell];
                        let value = item.displayattribute ? item[item.displayattribute] : item.value; // this will be based on the props which attribute to show
                        let title = "[" + item['cell'] + "] "+ (item.title ? item.title : ""); // this is again prop based tool tip help
                        let spanClassName = item.classname ? item.classname : "";
                        let coord = this.getRealCoords(cell);
                        let merged = item.merged;
                        var stylex = this.getCellStyle(cellStyle);
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
                            // console.log('Column ', this.alphaSequence(i))
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

                          stylex["top"]=top;
                          stylex["left"]=left;
                          stylex["width"]=width - 1;
                          stylex["height"]=height - 1;
                          stylex["white-space"]= "pre-wrap";
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
                            stylex["top"]=top;
                            stylex["left"]=left;
                            stylex["width"]=width;
                            stylex["height"]=height;
                            stylex["white-space"]= "pre-wrap";
                        }
                        if (isNaN(value) || item.origin == "TEMPLATE" ){
                          cellClassName = cellClassName + " reg_cell_text";
                        } else {
                          cellClassName = cellClassName + " reg_cell_number";
                          //Now format number as per international number format 99,999,999
                          value = Intl.NumberFormat().format(value);
                        }
                        // TODO : This is done poorly!!! There must be a betterway to implement this.
                        // The challanges are: Seemlee mouse move for edge resize, both width and height
                        // (height) particularly challanging because:
                        // 1. This is to support multiline text, for which width length may vary for each text arrayline
                        // 2. Ensuring the height is properly reflected based on font size
                        // Now check the cell width and legth and check how to organise the display value
                        const noOfLines = parseInt(stylex.height/20);
                        const noOfCharPerLine = parseInt(stylex.width/9);
                        let maxCharacter = noOfLines*noOfCharPerLine;
                        let arrValue=value.split(/\r\n|\r|\n/g);
                        let valueLines = arrValue.length;
                        if (valueLines > noOfLines) {
                          value=value.replace(/\r\n|\r|\n/g," ");
                        }
                        if (value.length > maxCharacter ||  valueLines > noOfLines){
                          // console.log("No fo lines "+ noOfLines + " " + maxCharacter + " " + noOfCharPerLine + " " + valueLines + " " + value.length + " " + value)
                          stylex['white-space']="nowrap";
                          value = value.length > noOfCharPerLine ? value.substring(0,noOfCharPerLine-3)+"..." : value;
                        }

                        return(
                            <div
                              key={cell+index}
                              className={cellClassName}
                              style={stylex}
                              data-toggle="tooltip"
                              data-placement="top"
                              title={title}
                            >
                                <span
                                  className={spanClassName}
                                  contentEditable = {true}
                                  onCopy={
                                    (event)=>{
                                      $(event.target).select()
                                      // console.log("onCopy....",$(event.target).text())
                                    }
                                  }
                                  onPaste={
                                    (event)=>{
                                      //console.log("OnPaste....",event.clipboardData)
                                    }
                                  }
                                  onKeyUp={
                                    (event)=>{
                                      let newText=$(event.target).text()
                                      // console.log("OnPaste....",newText,event.ctrlKey,event.key)
                                    }
                                  }
                                  onKeyDown={
                                    (event)=>{
                                      if(event.ctrlKey && event.key=='c'){
                                        // console.log("ctrlKey+" + event.key)
                                        let newText=$(event.target).text()
                                      }
                                    }
                                  }
                                  onClick={
                                    (event) => {
                                      //Make content of span element editable
                                      // event.target.contentEditable = true;
                                      // console.log("OnClick....",$(event.target).text())
                                      this.handleCellClick(event,value,item);
                                    }
                                  }
                                  target={cell}
                                >{
                                  this.cellSpan(title,value,stylex,item)

                                }</span>
                            </div>
                        )
                    }.bind(this))
                }
            </div>
        )
    }
    handleCellClick(event,value,item){
      // this condition to check is to prevent selecting the <span> and <i> content in the cell
      if(event.target.getAttribute("target")){
        if ((!event.ctrlKey && this.props.multiSelectAllowed) || (!this.props.multiSelectAllowed)){
          $(".reg_cell > span").removeClass("reg_cell_selected");
        }
        $(event.target).addClass("reg_cell_selected");
        this.selectedCell = {
                      cell: event.target.getAttribute("target"),
                      value: value,
                      item: item,
                      multiSelect: event.ctrlKey
                    };
        //console.log("handleCellClick",this.selectedCell);
        this.props.onSelect(this.selectedCell);
      }
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
    getCellStyle(cellStyle){
        let stylex = {};
        // console.log("cellStyle.....",cellStyle)
        if (cellStyle && this.props.renderStyle){
            let _font=(cellStyle.font.italic ? "italic " : " ") +
                  (cellStyle.font.bold ? "bold " : " ") +
                  cellStyle.font.size + "px " +
                  "\"" + cellStyle.font.name + "\"";
            let _color = cellStyle.font.colour=="None"? "black" : "#"+cellStyle.font.colour.substring(2,);
            let _textAlign = cellStyle.alignment.horizontal;
            let _verticalAlign = cellStyle.alignment.vertical;
            let _backgroundColor = cellStyle.fill.type ? "#"+cellStyle.fill.colour.substring(2,) : "#ffffff";
            let _borderRight = cellStyle.border.right.style ?
                                  ("solid " + cellStyle.border.right.style +
                                           (cellStyle.border.right.colour=="None"? " black" : " #" + cellStyle.border.right.colour.substring(2,))
                                  ) : "";
            let _borderLeft = cellStyle.border.left.style ?
                                  ("solid " + cellStyle.border.left.style +
                                           (cellStyle.border.left.colour=="None"? " black" : " #" + cellStyle.border.left.colour.substring(2,))
                                  ) : "";
            let _borderTop = cellStyle.border.top.style ?
                                  ("solid " + cellStyle.border.top.style +
                                           (cellStyle.border.top.colour=="None"? " black" : " #" + cellStyle.border.top.colour.substring(2,))
                                  ) : "";
            let _borderBottom = cellStyle.border.bottom.style ?
                                  ("solid " + cellStyle.border.bottom.style +
                                           (cellStyle.border.bottom.colour=="None"? " black" : " #" + cellStyle.border.bottom.colour.substring(2,))
                                  ) : "";
            stylex = {
                            font: _font,
                            color: _color,
                            "text-align": _textAlign,
                            "vertical-align": _verticalAlign,
                            "background-color": _backgroundColor,
                            "border-right" : _borderRight,
                            "border-left" : _borderLeft,
                            "border-top" : _borderTop,
                            "border-bottom" : _borderBottom,
            };
        }

        return stylex;
    }
}
