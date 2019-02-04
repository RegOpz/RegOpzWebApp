import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  SketchPicker, CompactPicker, GithubPicker,
  SwatchesPicker, ChromePicker } from 'react-color';
require('./RegOpzDataGrid.css');

class HotTableTabToolsMenu extends Component {
  constructor(props) {
    super(props);
    this.setTdStyle = this.props.setTdStyle;
    this.saveTdStyle = this.props.saveTdStyle;
    this.showToolsMenu = this.props.showToolsMenu;

    this.fontFamilyOptions = this.fontFamilyOptions.bind(this);
    this.fontSizeOptions = this.fontSizeOptions.bind(this);
  }

  fontFamilyOptions(){
    const fontFamilies = ["Times New Roman","Arial","Arial Black", "Courier New",
                          "Georgia", "system-ui", "Tahoma", "Verdana"];
    let options =[];
    fontFamilies.map((fnt,index)=>{
      options.push(
        <li key={"ff"+index}>
          <a
            title={fnt}
            onClick={(event)=>{
              // console.log("selected value",fnt, this.setTdStyle);
              this.setTdStyle(fnt,'font-family','add');
            }}
            >
            &nbsp;<span style={{fontFamily:fnt}}>{fnt}</span>
          </a>
        </li>
      )
    })
    return options;
  }

  fontSizeOptions(){
    const fontSizes = [...Array(40)];
    let options =[];
    fontSizes.map((value,index)=>{
      let size = index + 6;
      options.push(
        <li key={"fs"+index}>
          <a
            title={size}
            onClick={(event)=>{
              // console.log("selected value",size, this.setTdStyle);
              this.setTdStyle(size + "px",'font-size','add');
            }}
            >
            &nbsp;<span>{size}</span>
          </a>
        </li>
      )
    })
    return options;
  }

  render(){
        return(
        <div className="row">
          <div className="col-md-12 col-xs-12 col-sm-12 " >
            {
              this.showToolsMenu &&
              <div className="btn-group " title="Save Changes">
                <ul className="dropdown btn-xs btn-link htEdittools">
                  <a href="#" className="dropdown-toggle"
                    data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                    <i className="fa fa-save"></i>
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a
                      title="Save Changes"
                      onClick={(event)=>{
                        console.log("Save changes....")
                        this.saveTdStyle();
                        // $('#border').addClass('open');
                      }}
                      >
                        <i className="fa fa-save"></i>&nbsp; Save
                      </a>
                    </li>
                    <li>
                      <a
                      title="Save Changes"
                      onClick={(event)=>{
                        console.log("Save changes....")
                        this.saveTdStyle();
                        // $('#border').addClass('open');
                      }}
                      >
                        <i className="fa fa-save"></i>&nbsp; Save as ...
                      </a>
                    </li>
                  </ul>
                </ul>
              </div>
            }
            {
              this.showToolsMenu &&
              <div id="borderWeight" className="btn-group " title="Manage Sheets">
                <ul className="dropdown btn-xs btn-link htEdittools">
                  <a href="#" className="dropdown-toggle"
                    data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"
                    >
                    <i className="fa fa-folder-o dark"></i>
                    <sup><small><i className="fa fa-star dark"></i></small></sup>
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a
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
                      <a
                        title="Remove Sheet"
                        onClick={(event)=>{
                          this.props.handleSheet("Remove")
                        }}
                        >
                        <i className="fa fa-folder-o red"></i>
                        <sup><i className="fa fa-close red"></i></sup>
                        &nbsp;Remove Sheet
                      </a>
                    </li>
                    <li>
                      <a
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
                </ul>
              </div>
            }
            <div id="background" className="btn-group">
              <ul className="dropdown btn-xs btn-link htEdittools" title="Background Colour">
                <a href="#" className="dropdown-toggle"
                  data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"
                  >
                  <i className="fa fa-square green"></i>
                </a>
                <ul className="dropdown-menu">
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
              </ul>
            </div>
            <div id="fontfamily" className="btn-group" title="Font Name">
              <ul className="dropdown btn-xs btn-link htEdittools">
                <a href="#" className="dropdown-toggle"
                  data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"
                  >
                  <i className="fa fa-font dark"></i>
                </a>
                <ul className="dropdown-menu">
                  {
                    this.fontFamilyOptions()
                  }
                </ul>
              </ul>
            </div>
            <div className="btn-group" title="Font Colour">
              <ul className="dropdown btn-xs btn-link htEdittools">
                <a href="#" className="dropdown-toggle"
                  data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"
                  >
                  <i className="fa fa-font dark" ></i>
                  <sup><small><i className="fa fa-square green" ></i></small></sup>
                  <sub><small><i className="fa fa-square amber" ></i></small></sub>
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <SwatchesPicker
                      onChangeComplete={(color,event)=>{
                        console.log("color....",color)
                        // let rgb = "rgb("+Object.values(color.rgb).toString()+")";
                        this.setTdStyle(color.hex,'color','add')}}
                      />
                  </li>
                </ul>
              </ul>
            </div>
            <div id="fontsize" className="btn-group" title="Font Size">
              <ul className="dropdown btn-xs btn-link htEdittools">
                <a href="#" className="dropdown-toggle"
                  data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"
                  >
                  <i className="fa fa-text-height dark" ></i>
                </a>
                <ul className="dropdown-menu" style={{"height":"180px", "overflow-y": "auto"}}>
                  {
                    this.fontSizeOptions()
                  }
                </ul>
              </ul>
            </div>
            <div className="btn-group " title="Bold">
              <ul className="dropdown btn-xs btn-link htEdittools">
                <a className="dropdown-toggle"
                  data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"
                  onClick={(event)=>{
                    console.log("Bold....")
                    this.setTdStyle('bold','font-weight','toggle');
                    // $('#border').addClass('open');
                  }}
                  >
                  <i className="fa fa-bold dark"></i>
                </a>
              </ul>
            </div>
            <div className="btn-group" title="Italic">
              <ul className="dropdown btn-xs btn-link htEdittools">
                <a className="dropdown-toggle"
                  data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"
                  onClick={(event)=>{
                    console.log("Italic....")
                    this.setTdStyle('italic','font-style','toggle');
                    // $('#border').addClass('open');
                  }}
                  >
                  <i className="fa fa-italic dark"></i>
                </a>
              </ul>
            </div>
            <div id="border" className="btn-group" title="Border Colour">
              <ul className="dropdown btn-xs btn-link htEdittools">
                <a href="#" className="dropdown-toggle"
                  data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"
                  >
                  <i className="fa fa-th-large blue"></i>
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <SwatchesPicker
                      onChangeComplete={(color,event)=>{
                        console.log("color....",color)
                        // let rgb = "rgb("+Object.values(color.rgb).toString()+")";
                        this.setTdStyle(color.hex,'border-color','replace');
                      }}
                      />
                  </li>
                </ul>
              </ul>
            </div>

            <div id="borderWeight" className="btn-group" title="Border Thickness">
              <ul className="dropdown btn-xs btn-link htEdittools">
                <a href="#" className="dropdown-toggle"
                  data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"
                  >
                  <i className="fa fa-table " style={{color:"#FFFFFF", "border": "thin solid blue"}}></i>
                </a>
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
              </ul>
            </div>
            <div id="borderWeight" className="btn-group" title="Border Style">
              <ul className="dropdown btn-xs btn-link htEdittools">
                <a href="#" className="dropdown-toggle"
                  data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"
                  >
                  <i className="fa fa-table " style={{color: "#FFFFFF", "border": "thin dashed blue"}}></i>
                </a>
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
              </ul>
            </div>
            <div id="border" className="btn-group" title="Borders">
              <ul className="dropdown btn-xs btn-link htEdittools">
                <a href="#" className="dropdown-toggle"
                  data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"
                  >
                  <i className="fa fa-table blue"></i>
                </a>
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
              </ul>
            </div>
            {
              this.showToolsMenu &&
              <div id="sections" className="btn-group" title="Manage Sections">
                <ul className="dropdown btn-xs btn-link htEdittools">
                  <a className="dropdown-toggle"
                    data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"
                    onClick={(event)=>{
                      this.props.handleShowEditSection()
                    }}
                    >
                    <i className="fa fa-crop amber"></i>
                  </a>
                </ul>
              </div>
            }

          </div>
        </div>
        )

  }
}

export default HotTableTabToolsMenu;
