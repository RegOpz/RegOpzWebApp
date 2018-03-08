import React, {Component} from 'react';
import ReactDOM from 'react-dom';
export default class RegOpzDataGridSideMarker extends Component {
    constructor(props) {
        super(props);
        this.heightatMouseEnter = 0;
        this.numberofRows = this.props.numberofRows;
        this.rowAttr = this.props.rowAttr;
    }
    componentWillReceiveProps(nextProps){
      this.rowAttr = nextProps.rowAttr;
      this.numberofRows = nextProps.numberofRows;
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
                              ()=>{
                                console.log("Item in row marker Mouse Enter.. ", index+1)
                                this.element=document.getElementById(index+1)
                                // if(!item){
                                //   item = this.element.getAttribute('id')
                                // }
                                this.heightatMouseEnter=this.element.clientHeight;
                              }
                            }
                            onMouseLeave={
                              ()=>{
                                console.log("Item in row marker .. ", index+1)
                                this.element=document.getElementById(index+1)
                                if(this.element.clientHeight !=this.heightatMouseEnter) {
                                  let height=this.element.clientHeight/2;
                                  console.log("Compare height values...",height,this.element.clientHeight )
                                  this.props.handleResize(index+1,height,"row");
                                }
                              }
                            }>
                            <span>{index+1}</span>
                            <div className="clearfix"></div>
                          </div>
                        )
                    }.bind(this))
                }
            </div>
        );
    }
}
