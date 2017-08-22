import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import RegOpzFlatGridHeader from './RegOpzFlatGridHeader';
import RegOpzFlatGridRow from './RegOpzFlatGridRow';
import _ from 'lodash';
require('./RegOpzFlatGridStyle.css');

class RegOpzFlatGridActionButtons extends Component {
    constructor(props) {
        super(props);
        this.writeOnly = this.props.editable;
        this.currentPage = this.props.pageNo;
        this.buttons = this.props.buttons;
        this.buttonClicked = this.props.buttonClicked;
        this.checkDisabled = this.props.checkDisabled;
        this.dataNavigation = this.props.dataNavigation;
        //None: Use supplied className
        //Simplified: Use className as btn-link
        //Else use override className for all buttons
        this.buttonClassOverride = this.props.buttonClassOverride ? this.props.buttonClassOverride : "None";

        this.handleClassName = this.handleClassName.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        //TODO
        this.writeOnly = nextProps.editable;
        this.currentPage = nextProps.pageNo;
        this.buttons = nextProps.buttons;
        this.buttonClicked = nextProps.buttonClicked;
        this.checkDisabled = nextProps.checkDisabled;
        this.buttonClassOverride = nextProps.buttonClassOverride ? nextProps.buttonClassOverride : "None";
    }

    handleClassName(item){
      let className="btn btn-circle business_rules_ops_buttons btn-xs ";
      switch(this.buttonClassOverride){
        case "None":
          className = item.className ? className + item.className : className + "btn-link";
          break;
        case "Simplified":
          className = className + "btn-link";
          break;
        default:
          className = className + this.buttonClassOverride;
      }
      console.log("className",className,this.buttonClassOverride);
      return className;
    }

    render() {
      console.log("Inside Render RegOpzFlatGridActionButtons....",this.props);
        return(
            <div className="ops_icons">
              {
                  this.buttons.map((item,index)=>{
                    return(
                      <div className="btn-group">
                        <button
                          key={index}
                          data-toggle="tooltip"
                          data-placement="top"
                          title={item.title}
                          onClick={
                            (event)=>{
                              this.buttonClicked(event,item.title);
                            }
                          }
                          className={ this.handleClassName(item) }
                          disabled={ item.checkDisabled=="Yes" ? this.checkDisabled(item.title) : false}
                        >
                          <i className={'fa '+ item.iconClass }></i>{' ' + item.title }
                        </button>
                      </div>
                    );
                  })
              }
              { this.dataNavigation &&
                <div>
                <div className="btn-group">
                  <button data-toggle="tooltip" data-placement="top" title="First"
                    onClick={
                      (event)=>{
                        this.buttonClicked(event,"FirstPage");
                      }
                    }
                    className="btn btn-circle btn-link business_rules_ops_buttons btn-xs">
                    <i className="fa fa-fast-backward"></i>
                  </button>
                </div>

                <div className="btn-group">
                  <button data-toggle="tooltip" data-placement="top" title="Prev"
                    onClick={
                      (event)=>{
                        this.buttonClicked(event,"PrevPage");
                      }
                    }
                    className="btn btn-circle btn-link business_rules_ops_buttons btn-xs">
                    <i className="fa fa-chevron-left"></i>
                  </button>
                </div>


                <div className="btn-group reg_flat_grid_page_input">
                  <input
                    onChange={
                      (event)=>{
                        this.currentPage = Math.trunc(event.target.value);
                        this.forceUpdate();
                      }
                    }
                    onKeyPress={
                      (event)=>{
                        if(event.key == "Enter"){
                          this.buttonClicked(event,'PageOkay');
                        }
                      }
                    }
                    type="number"
                    min="0"
                    value={this.currentPage}
                    className="form-control btn btn-circle btn-xs" />
                </div>

                <div className="btn-group">
                  <button data-toggle="tooltip" data-placement="top" title="Next"
                    onClick={
                      (event)=>{
                        this.buttonClicked(event,"NextPage");
                      }
                    }
                    className="btn btn-circle btn-link business_rules_ops_buttons btn-xs">
                    <i className="fa fa-chevron-right"></i>
                  </button>
                </div>


                <div className="btn-group">
                  <button data-toggle="tooltip" data-placement="top" title="End"
                    onClick={
                      (event)=>{
                        this.buttonClicked(event,"LastPage");
                      }
                    }
                    className="btn btn-circle btn-link business_rules_ops_buttons btn-xs">
                    <i className="fa fa-fast-forward"></i>
                  </button>
                </div>
              </div>
            }

            </div>
        );
    }

}

export default RegOpzFlatGridActionButtons;
