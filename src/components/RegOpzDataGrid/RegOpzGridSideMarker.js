import React, {Component} from 'react';
import ReactDOM from 'react-dom';
export default class RegOpzDataGridSideMarker extends Component {
    constructor(props) {
        super(props);
        this.heightatMouseEnter = 0;
        this.numberofRows = this.props.numberofRows;
        this.rowAttr = this.props.rowAttr;
        this.isResizing = false;
        this.item=0;
        this.height=0
        this.elementVS=0;
        this.elementVE=0;

        this.handleResizeRow = this.handleResizeRow.bind(this);
    }
    componentWillReceiveProps(nextProps){
      this.rowAttr = nextProps.rowAttr;
      this.numberofRows = nextProps.numberofRows;
    }

    handleResizeRow(event,index){
      // console.log("cursor resize .... element ....",event.type,event.pageY, index, "wh:"+ event.nativeEvent.which, "R:"+ (this.elementVE-event.clientY),this.item,"Y:" + event.clientY,"VE:"+this.elementVE,"VS:"+this.elementVS,$(event.target).height())
      if(!this.isResizing){
        this.elementVS=$(event.target).offset().top;
        this.elementVE= this.elementVS + $(event.target).height();
      }
      if( this.elementVE - event.pageY < 9 && !this.isResizing){
        $(event.target).css("cursor","row-resize");
        // console.log("cursor resize .... element ....",index, this.item)
        // this.item=index+1;
      }
      else {
        if(!this.isResizing){
          $(event.target).css("cursor","default");
          this.item=0;
        }
        else{
          $(event.target).css("cursor","row-resize");
          this.height=parseInt((event.pageY - this.elementVS)/2)+1;
          this.height=this.height>=12 ? this.height : 12;
          console.log("Native event values ...", this.item,this.height, event.pageY, this.elementVS,this.elementVE,event.clientY, event.clientY,event.nativeEvent.which)
          this.props.handleResize(this.item,this.height,"row");
        }

      }
    }
    render() {
        return (
            <div className="reg_grid_row_marker_holder">
                {
                    [...Array(parseInt(this.numberofRows))].map(function(item,index){
                        //console.log(`Height of ${index+1} is`,this.props.rowAttr[(index+1)+""]);
                        var stylex = {};
                        if(typeof(this.rowAttr[(index+1)+""]) != 'undefined') {
                          stylex.height = parseInt(this.rowAttr[(index+1)+""].height) * 2;
                        }
                        return (
                          <div id={index+1}
                            className="rowMarker"
                            style={stylex}
                            key={index}
                            onMouseMove={
                              (event)=>{this.handleResizeRow(event,index)}
                            }
                            onMouseDown={
                              (event)=>{
                                // console.log("onMouseDown evenet for ", index+1,event.pageY,this.elementVE,event.type)
                                this.isResizing = true;
                                // this.elementVS=$(event.target).offset().top;
                                // this.elementVE= this.elementVS + $(event.target).height();
                                this.item=index+1;
                              }
                            }
                            onMouseUp={
                              (event)=>{
                                this.isResizing = false;
                                this.item=0;
                                // console.log("onMouseUp evenet for ", event.pageY,this.elementVE,event.type)
                              }
                            }
                            >
                            <span style={stylex}>{index+1}</span>
                            <div className="clearfix"></div>
                          </div>
                        )
                    }.bind(this))
                }
            </div>
        );
    }
}
