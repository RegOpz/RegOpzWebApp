import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import _ from 'lodash';
require('./MaintainBusinessRules.css');

class DataSourceList extends Component {
  constructor(props){
    super(props)
    this.state = {
      filterText: null,
      navMenu: this.props.navMenu,
    }
    this.dataCatalog = this.props.dataCatalog;
    this.linkageData = this.dataCatalog;
  }

  componentWillReceiveProps(nextProps){
      //TODO
      this.dataCatalog = nextProps.dataCatalog;
      this.linkageData = this.dataCatalog;
      this.setState ({
        filterText: null
      });
  }


  handleFilter(){

      if(typeof this.dataCatalog != 'undefined' && this.dataCatalog.length ){
        let linkageData = this.dataCatalog;
        const { filterText } = this.state;
        if (filterText != null) {
            let matchText = RegExp(`(${filterText.toString().toLowerCase().replace(/[,+&\:\ ]$/,'').replace(/[,+&\:\ ]/g,'|')})`,'i');
            console.log("matchText",matchText);
            linkageData = linkageData.filter(element =>
                element.source_id.toString().match(matchText) ||
                element.source_file_name.match(matchText) ||
                element.source_description.match(matchText) ||
                element.source_table_name.match(matchText) ||
                (element.country ? element.country.match(matchText):null)
            );
        }
        this.linkageData = linkageData;
      }
  }

  render(){
    this.handleFilter();
    return(
      <div className="x_panel">
        <div className="x_content">
          <div className="input-group">
              <input
                id="filter"
                className="form-control col-md-9 col-sm-9 col-xs-12"
                placeholder="Enter Filter Text"
                value={this.state.filterText}
                onChange={(event) => {
                    this.setState({ filterText: event.target.value });
                }}
              />
              <span className="input-group-addon">
                <i className="fa fa-filter"></i>
              </span>
          </div>
          <div>
            { this.renderDataFeedList(this.linkageData)}
          </div>
        </div>
      </div>
    );
  }

  renderDataFeedList(linkageData){
    if(!linkageData || typeof(linkageData) == 'undefined' || linkageData == null || linkageData.length == 0) {
      return(
        <div>
          <h4>No Data Feed found! Please try a different date range or search criteria.</h4>
        </div>
      )
    }
    else {
      return(
        <div className="dataTables_wrapper form-inline dt-bootstrap no-footer">
          <div className="row">
            { !this.state.navMenu &&
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Source ID</th>
                  <th>Source File Name</th>
                  <th>Description</th>
                  <th>Country</th>
                </tr>
              </thead>
              <tbody>
              {linkageData.map((item,index) => {
                return (
                  <tr key={index}>
                    <td>{item.source_id}</td>
                    <td>
                      <button
                        className="btn btn-link btn-xs"
                        onClick={
                          (event)=>{
                            this.props.handleDataFileClick(item)
                          }
                        }
                        >
                        <small>
                          <i className="fa fa-file-text"></i>
                          {' '}{item.source_file_name}
                        </small>
                      </button>
                    </td>
                    <td>{item.source_description}</td>
                    <td>{item.country}</td>
                  </tr>
                )
              })}
            </tbody>
            </table>
          }
          </div>
          {  this.state.navMenu &&
             this.renderNavMenu(linkageData)
          }
        </div>
      )
    }
  }

  renderNavMenu(linkageData) {
    return(
        <div className="dataTables_wrapper form-inline dt-bootstrap no-footer">
          <div className="row">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>#ID</th>
                <th>Source File</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {
                linkageData.map((item,index) => (
                  <tr key={index}>
                    <td>{item.source_id}</td>
                    <td>
                      <button
                        className="btn btn-link btn-xs"
                        onClick={
                          (event)=>{
                            this.props.handleDataFileClick(item)
                          }
                        }
                        >
                        <small>
                          <i className="fa fa-file-text"></i>
                          {' '}{item.source_file_name}
                        </small>
                      </button>
                    </td>
                    <td>{item.country}</td>
                  </tr>
                  )
                )
              }
            </tbody>
          </table>
          </div>
        </div>
    );
  }
}

export default DataSourceList;
