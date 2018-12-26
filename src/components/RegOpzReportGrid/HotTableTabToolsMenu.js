import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  SketchPicker, CompactPicker, GithubPicker,
  SwatchesPicker } from 'react-color';
require('./RegOpzDataGrid.css');

class HotTableTabToolsMenu extends Component {
  constructor(props) {
    super(props);
    this.setTdStyle = this.props.setTdStyle;
    this.saveTdStyle = this.props.saveTdStyle;
    this.showToolsMenu = this.props.showToolsMenu;
  }

  render(){
        return(
        <div className="row">
          <div className="col-md-12 col-xs-12 col-sm-12 " >
            {
              this.showToolsMenu &&
              <div className="btn-group htEdittools">
                <button type="button" className="btn btn-xs btn-link"
                  title="Save Changes"
                  onClick={(event)=>{
                    console.log("Save changes....")
                    this.saveTdStyle();
                    // $('#border').addClass('open');
                  }}
                  >
                  <i className="fa fa-save"></i>
                </button>
              </div>
            }
            {
              this.showToolsMenu &&
              <div id="borderWeight" className="btn-group htEdittools">
                <button type="button" className="btn btn-xs btn-link dropdown-toggle"
                  data-toggle="dropdown" aria-expanded="false"
                  title="Manage Sheets">
                  <i className="fa fa-folder-o dark"></i>
                  <sup><small><i className="fa fa-star dark"></i></small></sup>
                </button>
                <ul className="dropdown-menu" role="menu" style={{width:"50px"}}>
                  <li>
                    <a className="btn btn-xs btn-link"
                      title="Add New Sheet"
                      onClick={(event)=>{
                        this.props.handleSheet("Add")
                      }}
                      >
                      <i className="fa fa-folder-o green"></i>
                      <sup><i className="fa fa-plus green"></i></sup>
                      &nbsp;Add New Sheet
                    </a>
                  </li>
                  <li>
                    <a className="btn btn-xs btn-link "
                      title="Remove Sheet"
                      onClick={(event)=>{
                        this.props.handleSheet("Remove")
                      }}
                      >
                      <i className="fa fa-folder-o red"></i>
                      <sup><i className="fa fa-minus red"></i></sup>
                      &nbsp;Remove Sheet
                    </a>
                  </li>
                  <li>
                    <a className="btn btn-xs btn-link"
                      title="Rename Sheet"
                      onClick={(event)=>{
                        this.props.handleSheet("Rename")
                      }}
                      >

                      <i className="fa fa-folder-o amber"></i>
                      <sup><i className="fa fa-pencil amber"></i></sup>
                      &nbsp;Rename Sheet
                    </a>
                  </li>
                </ul>
              </div>
            }
            <div id="background" className="btn-group htEdittools">
              <button type="button" className="btn btn-xs btn-link dropdown-toggle"
                data-toggle="dropdown" aria-expanded="false"
                title="Background Colour">
                <i className="fa fa-square green"></i>
              </button>
              <ul className="dropdown-menu" role="menu">
                <li>
                  <SwatchesPicker
                    onChangeComplete={(color,event)=>{
                      console.log("color....",color)
                      // let rgb = "rgb("+Object.values(color.rgb).toString()+")";
                      this.setTdStyle(color.hex,'background-color','add');
                      // $('#background').addClass('open');
                    }}
                  />
                </li>
              </ul>
            </div>
            <div id="fontfamily" className="btn-group htEdittools">
              <button type="button" className="btn btn-xs btn-link dropdown-toggle"
                data-toggle="dropdown" aria-expanded="false"
                title="Font Name">
                <i className="fa fa-font dark"></i>
              </button>
              <ul className="dropdown-menu" role="menu">
                <li>
                  <select id="fontfamily-sel" className="form-control"
                    onChange={
                      (event)=>{
                        console.log("selected value",event.target.value)
                        this.setTdStyle(event.target.value,'font-family','add');
                        event.target.value = ""
                      }
                    }
                    >
                    <option value="" >Select Font Name</option>
                    <option value="Times New Roman" style={{fontFamily:"Times New Roman"}}>Times New Roman</option>
                    <option value="Arial" style={{fontFamily:"Arial"}}>Arial</option>
                    <option value="Arial Black" style={{fontFamily:"Arial Black"}}>Arial Black</option>
                    <option value="Courier New" style={{fontFamily:"Courier New"}}>Courier New</option>
                    <option value="Georgia" style={{fontFamily:"Georgia"}}>Georgia</option>
                    <option value="system-ui" style={{fontFamily:"system-ui"}}>System Ui</option>
                    <option value="Tahoma" style={{fontFamily:"Tahoma"}}>Tahoma</option>
                    <option value="Verdana" style={{fontFamily:"Verdana"}}>Verdana</option>
                  </select>
                </li>
              </ul>
            </div>
            <div className="btn-group htEdittools">
              <button type="button" className="btn btn-xs btn-link dropdown-toggle"
                data-toggle="dropdown" aria-expanded="false"
                title="Font Colour">
                <i className="fa fa-font dark" ></i>
                <sup><small><i className="fa fa-square green" ></i></small></sup>
                <sub><small><i className="fa fa-square amber" ></i></small></sub>

              </button>
              <ul className="dropdown-menu" role="menu">
                <li>
                  <SwatchesPicker
                    onChangeComplete={(color,event)=>{
                      console.log("color....",color)
                      // let rgb = "rgb("+Object.values(color.rgb).toString()+")";
                      this.setTdStyle(color.hex,'color','add')}}
                    />
                </li>
              </ul>
            </div>
            <div id="fontsize" className="btn-group htEdittools">
              <button type="button" className="btn btn-xs btn-link dropdown-toggle"
                data-toggle="dropdown" aria-expanded="false"
                title="Font size">
                <i className="fa fa-text-height dark" ></i>
              </button>
              <ul className="dropdown-menu" role="menu">
                <li>
                  <select id="fontsize-sel" className="form-control"
                    onChange={
                      (event)=>{
                        console.log("selected value",event.target.value)
                        this.setTdStyle(event.target.value,'font-size','add');
                        event.target.value = ""
                      }
                    }
                    >
                    <option value="" >Choose Font Size</option>
                    {
                      [...Array(44)].map(function(size,index){
                        console.log("Array element processing...",size)
                        return(<option value={ (index+6) + "px"}>{index+6}</option>)
                      })
                    }
                  </select>
                </li>
              </ul>
            </div>
            <div className="btn-group htEdittools">
              <button type="button" className="btn btn-xs btn-link"
                title="Bold"
                onClick={(event)=>{
                  console.log("Bold....")
                  this.setTdStyle('bold','font-weight','toggle');
                  // $('#border').addClass('open');
                }}
                >
                <i className="fa fa-bold dark"></i>
              </button>
            </div>
            <div className="btn-group htEdittools">
              <button type="button" className="btn btn-xs btn-link"
                title="Italic"
                onClick={(event)=>{
                  console.log("Italic....")
                  this.setTdStyle('italic','font-style','toggle');
                  // $('#border').addClass('open');
                }}
                >
                <i className="fa fa-italic dark"></i>
              </button>
            </div>
            <div id="border" className="btn-group htEdittools">
              <button type="button" className="btn btn-xs btn-link dropdown-toggle"
                data-toggle="dropdown" aria-expanded="false"
                title="Border Colour">
                <i className="fa fa-th-large blue"></i>
              </button>
              <ul className="dropdown-menu" role="menu">
                <li>
                  <SwatchesPicker
                    onChangeComplete={(color,event)=>{
                      console.log("color....",color)
                      let rgb = "rgb("+Object.values(color.rgb).toString()+")";
                      this.setTdStyle(color.hex,'border-color','replace');
                      // $('#border').addClass('open');
                    }} />
                </li>
              </ul>
            </div>
            <div id="borderWeight" className="btn-group htEdittools">
              <button type="button" className="btn btn-xs btn-link dropdown-toggle"
                data-toggle="dropdown" aria-expanded="false"
                title="Border Thickness">
                <i className="fa fa-table " style={{color:"#FFFFFF", "border": "thin solid blue"}}></i>
              </button>
              <ul className="dropdown-menu" role="menu" style={{width:"50px"}}>
                <li>
                  <button className="btn btn-xs btn-link dark"
                    title="Thin"
                    onClick={(event)=>{
                      this.setTdStyle('thin','border-width','replace');
                    }}
                    >
                    <i className="fa fa-table" style={{color:"#FFFFFF", "border": "thin solid black"}}></i>
                  </button>
                  <button className="btn btn-xs btn-link dark"
                    title="Medium"
                    onClick={(event)=>{
                      this.setTdStyle('medium','border-width','replace');
                    }}
                    >
                    <i className="fa fa-table" style={{color:"#FFFFFF", "border": "medium solid black"}}></i>
                  </button>
                  <button className="btn btn-xs btn-link dark"
                    title="Thick"
                    onClick={(event)=>{
                      this.setTdStyle('thick','border-width','replace');
                    }}
                    >
                    <i className="fa fa-table" style={{color:"#FFFFFF", "border": "thick solid black"}}></i>
                  </button>
                </li>
              </ul>
            </div>
            <div id="borderWeight" className="btn-group htEdittools">
              <button type="button" className="btn btn-xs btn-link dropdown-toggle"
                data-toggle="dropdown" aria-expanded="false"
                title="Border Style">
                <i className="fa fa-table " style={{color: "#FFFFFF", "border": "thin dashed blue"}}></i>
              </button>
              <ul className="dropdown-menu" role="menu" style={{width:"50px"}}>
                <li>
                  <button className="btn btn-xs btn-link dark"
                    title="Dotted"
                    onClick={(event)=>{
                      this.setTdStyle('dotted','border-style','replace');
                    }}
                    >
                    <i className="fa fa-table " style={{color: "#FFFFFF", "border": "thin dotted black"}}></i>
                  </button>
                  <button className="btn btn-xs btn-link dark"
                    title="Dashed"
                    onClick={(event)=>{
                      this.setTdStyle('dashed','border-style','replace');
                    }}
                    >
                    <i className="fa fa-table " style={{color: "#FFFFFF", "border": "thin dashed black"}}></i>
                  </button>
                  <button className="btn btn-xs btn-link dark"
                    title="Solid"
                    onClick={(event)=>{
                      this.setTdStyle('solid','border-style','replace');
                    }}
                    >
                    <i className="fa fa-table " style={{color: "#FFFFFF", "border": "thin solid black"}}></i>
                  </button>
                </li>
              </ul>
            </div>
            <div id="border" className="btn-group htEdittools">
              <button type="button" className="btn btn-xs btn-link dropdown-toggle"
                data-toggle="dropdown" aria-expanded="false"
                title="Borders">
                <i className="fa fa-table blue"></i>
              </button>
              <ul className="dropdown-menu" role="menu">
                <li>
                  <button className="btn btn-xs btn-link dark"
                    title="All"
                    onClick={(event)=>{
                      this.setTdStyle('default','border-all','nooverwrite');
                    }}
                  >
                    <i className="fa fa-table" style={{color:"#FFFFFF", "border": "2px solid black"}}></i>
                  </button>
                  <button className="btn btn-xs btn-link dark"
                    title="Top"
                    onClick={(event)=>{
                      this.setTdStyle('default','border-top','nooverwrite');
                    }}
                    >
                    <i className="fa fa-table" style={{color:"#FFFFFF", "border": "1px solid #cccccc82", "borderTop": "2px solid black"}}></i>
                  </button>
                  <button className="btn btn-xs btn-link dark"
                    title="Bottom"
                    onClick={(event)=>{
                      this.setTdStyle('default','border-bottom','nooverwrite');
                    }}
                    >
                    <i className="fa fa-table" style={{color:"#FFFFFF", "border": "1px solid #cccccc82", "borderBottom": "2px solid black"}}></i>
                  </button>
                  <button className="btn btn-xs btn-link dark"
                    title="Left"
                    onClick={(event)=>{
                      this.setTdStyle('default','border-left','nooverwrite');
                    }}
                    >
                    <i className="fa fa-table" style={{color:"#FFFFFF", "border": "1px solid #cccccc82", "borderLeft": "2px solid black"}}></i>
                  </button>
                  <button className="btn btn-xs btn-link dark"
                    title="Right"
                    onClick={(event)=>{
                      this.setTdStyle('default','border-right','nooverwrite');
                    }}
                    >
                    <i className="fa fa-table" style={{color:"#FFFFFF", "border": "1px solid #cccccc82", "borderRight": "2px solid black"}}></i>
                  </button>
                  <button className="btn btn-xs btn-link dark"
                    title="None"
                    onClick={(event)=>{
                      this.fixedColumnsLeft = 6;
                      this.setTdStyle('default','border-all','remove');
                    }}
                    >
                    <i className="fa fa-table" style={{color:"#FFFFFF", "border": "1px solid #cccccc82"}}></i>
                  </button>
                </li>
              </ul>
            </div>
            {
              this.showToolsMenu &&
              <div id="sections" className="btn-group htEdittools">
                <button type="button" className="btn btn-xs btn-link dropdown-toggle"
                  data-toggle="dropdown" aria-expanded="false"
                  title="Manage Sections"
                  onClick={(event)=>{
                    this.props.handleShowEditSection()
                  }}
                  >
                  <i className="fa fa-crop amber"></i>
                </button>
              </div>
            }

          </div>
        </div>
        )

  }
}

export default HotTableTabToolsMenu;
