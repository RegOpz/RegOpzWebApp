import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import _ from 'lodash';
require('./MaintainBusinessRulesRepository.css');

class CountryList extends Component {
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
                element.country.toString().match(matchText) ||
                element.country_name.match(matchText) ||
                (element.country_information ? element.country_information.match(matchText):null)
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
            { this.renderCountryList(this.linkageData)}
          </div>
        </div>
      </div>
    );
  }

  renderCountryList(linkageData){
    if(!linkageData || typeof(linkageData) == 'undefined' || linkageData == null || linkageData.length == 0) {
      return(
        <div>
          <h4>No Rules Data found! Please try a different search criteria.</h4>
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
                  <th>Country</th>
                  <th>Country Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
              {linkageData.map((item,index) => {
                return (
                  <tr key={index}
                    onClick={
                      (event)=>{
                        this.props.handleCountryClick(item)
                      }
                    }>
                    <td>
                      <button
                        className="btn btn-link btn-sm"
                        onClick={
                          (event)=>{
                            this.props.handleCountryClick(item)
                          }
                        }
                        >
                        <small>
                          <i className="fa fa-bank"></i>
                          {' '}{item.country}
                        </small>
                      </button>
                    </td>
                    <td>{item.country_name}</td>
                    <td>
                      <p
                        className="truncate-text"
                        data-toggle="tooltip"
                        data-placement="top"
                        title={item.country_information}
                        >
                        {item.country_information}
                      </p>
                    </td>
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
                <th>#</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>
              {
                linkageData.map((item,index) => (
                  <tr key={index}
                    onClick={
                      (event)=>{
                        this.props.handleCountryClick(item)
                      }
                    }>
                    <td>{index + 1}</td>
                    <td>
                      <button
                        className="btn btn-link btn-xs"
                        onClick={
                          (event)=>{
                            this.props.handleCountryClick(item)
                          }
                        }
                        >
                        <small>
                          <i className="fa fa-bank"></i>
                          {' '}{item.country}
                        </small>
                      </button>
                    </td>
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

export default CountryList;
