import React, {Component} from 'react';
import ReactDOM from 'react-dom';
export default class RegOpzDataGridSideMarker extends Component {
    constructor(props) {
        super(props);
        this.heightatMouseEnter = 0;
        this.numberofRows = this.props.numberofRows;
        this.rowAttr = this.props.rowAttr;

        this.handleEnableResize = this.handleEnableResize.bind(this);
        this.handleDisableResize = this.handleDisableResize.bind(this);
    }
    componentWillReceiveProps(nextProps){
      this.rowAttr = nextProps.rowAttr;
      this.numberofRows = nextProps.numberofRows;
    }
    handleEnableResize(event,index){
      console.log("Recorded at event ... ", event.type);
      console.log("Item in row marker Mouse Enter.. ", index+1)
      $(event.target).css("resize","vertical");
      this.element=document.getElementById(index+1)
      this.heightatMouseEnter=this.element.clientHeight;
    }

    handleDisableResize(event,index){
      console.log("Recorded at event ... ", event.type);
      $(event.target).css("resize","none");
      let renderedGridHeight = parseInt(this.rowAttr[(index+1)+""].height) * 2;
      console.log("Item in row marker .. ", index+1)
      this.element=document.getElementById(index+1)
      if(this.element.clientHeight !=this.heightatMouseEnter || renderedGridHeight !=this.element.clientHeight) {
        let height=parseInt(this.element.clientHeight/2)+1;
        console.log("Compare height values...",height,this.element.clientHeight )
        this.props.handleResize(index+1,height,"row");

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
                            onMouseEnter={
                              (event)=>{this.handleEnableResize(event,index)}
                            }
                            onMouseLeave={
                              (event)=>{this.handleDisableResize(event,index)}
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
