import React, { Component, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';
import _ from 'lodash';
import moment from 'moment';
import AddSection from './AddSection';
require('handsontable/dist/handsontable.full.css');
require('./RegOpzDataGrid.css');

class HotTableSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSection: null,
    };
    this.ht = this.props.ht;
    this.selectedCellRange = this.props.selectedCellRange;
    this.data = this.props.data;
    this.alphaSequence = this.alphaSequence.bind(this);
    this.renderSections = this.renderSections.bind(this);
    this.handleSave = this.handleSave.bind(this);

  }

  componentDidMount(){
    console.log("Inside report section def omponentDidUnMount");
  }

  componentWillReceiveProps(nextProps){
    // TODO
    if(this.ht != nextProps.ht){
      console.log("Inside hottablesection next props")
      this.selectedCellRange=[];
      this.setState({selectedSection: null});
    } else {
      this.selectedCellRange = nextProps.selectedCellRange;
    }
    this.data = nextProps.data;
    this.ht = nextProps.ht;
  }

  alphaSequence(i) {
      return i < 0
          ? ""
          : this.alphaSequence((i / 26) - 1) + String.fromCharCode((65 + i % 26) + "");
  }

  handleSave(section){
    // this.ht.hotInstance.selectCells([[8,2,50,4]])
    console.log("handleSave section details ", section)
    if(section){
      // null section if nothing created or existing section being updated
      this.data.sections.push(section);
    }
    // This setState to force rerender of the sections information
    this.ht.hotInstance.deselectCell();
    this.selectedCellRange=[];
    this.setState({selectedSection: null});
  }

  renderSections(){
    let sections =[];
    this.data.sections.map((sec,index)=>{
      sections.push(
        <tr
          onClick={
            ()=>{
              this.ht.hotInstance.deselectCell();
              this.selectedCellRange=[];
              this.ht.hotInstance.selectCells([sec.ht_range])
              this.setState({selectedSection: sec });
            }
          }>
          <td>{sec.range}</td>
          <td>{sec.section_id}</td>
          <td>{sec.section_type}</td>
          <td>{sec.section_position.map((pos,index)=>{return(<li>{pos}</li>)})}</td>
        </tr>
      )
    });
    if(sections.length == 0){
      sections.push(<tr><td colSpan="4">No section defined for report sheet <strong>{this.data.sheet}</strong></td></tr>)
    }

    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th><i className="fa fa-crop"></i></th>
            <th><i className="fa fa-paperclip"></i></th>
            <th><i className="fa fa-cubes"></i></th>
            <th><i className="fa fa-code-fork"></i></th>
          </tr>
        </thead>
        <tbody>
          {
            sections
          }
        </tbody>
      </table>
    );
  }

  render(){

        return(
          <div className="x_panel">
            <div className="x_title">
              <h2>Edit Sections <small>{"for " + this.data.sheet}</small></h2>
                <ul className="nav navbar-right panel_toolbox">
                  <li>
                    <a className="fa fa-close" onClick={this.props.handleClose} title="Close"></a>
                  </li>
                  <li>
                    <a className="fa fa-plus" onClick={
                        ()=>{
                          this.ht.hotInstance.deselectCell();
                          this.selectedCellRange=[];
                          let selectedSection={section_id:'',section_type:'',range:'',section_position:[],ht_range:[]}
                          this.setState({selectedSection});
                        }
                      }
                      title="Add New Section"></a>
                  </li>
                </ul>
              <div className="clearfix"></div>
            </div>
            <div className="x_content">
              <div className="col-md-6 col-sm-6 col-xs-12">
              {
                this.renderSections()
              }
              </div>
              <div className="col-md-6 col-sm-6 col-xs-12">
                <AddSection
                  selectedCellRange={this.selectedCellRange}
                  handleSave = { this.handleSave}
                  sections={ this.data.sections}
                  selectedSection = { this.state.selectedSection }
                  />
              </div>
            </div>
          </div>
        )

  }
}

export default HotTableSection;
