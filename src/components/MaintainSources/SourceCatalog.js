import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Panel } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
require('react-datepicker/dist/react-datepicker.css');

class SourceCatalogList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filterText: null,
      navMenu: this.props.navMenu,
      open: {}
    }
    this.sourceCatalog = this.props.sourceCatalog;
    this.linkageData = [];
  }

  componentWillReceiveProps(nextProps) {
      this.sourceCatalog = nextProps.sourceCatalog;
  }

  handleFilter() {
      if (typeof this.sourceCatalog !== 'undefined' && this.sourceCatalog !== null) {
          let sourceCatalog = this.sourceCatalog, linkageData = [];
          const { filterText } = this.state;


          if (filterText !== null) {
              let matchText = RegExp(`(${filterText.toString().toLowerCase().replace(/[,+&\:\ ]$/,'').replace(/[,+&\:\ ]/g,'|')})`,'i');
              sourceCatalog.forEach(item => {
                  let source_list = item.source.filter(item =>
                      item.country.toString().match(matchText)||
                      item.source_description.toString().match(matchText)||
                      item.source_file_name.toString().match(matchText)||
                      item.source_id.toString().match(matchText)||
                      item.source_table_name.toString().match(matchText)
                  );
                  if (source_list.length > 0) {
                      linkageData.push({
                          country: item.country,
                          source: source_list
                      });
                  }
              });
              sourceCatalog = linkageData;
          }
          this.linkageData = sourceCatalog;
      }
  }

  render() {
    console.log("sourceCatalog:", this.linkageData);
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
            { this.renderPanel(this.linkageData) }
          </div>
        </div>
      </div>
    );
  }

  renderPanel(linkageData) {
      // Renders Panel for each country
      if(!linkageData || typeof(linkageData) == 'undefined' || linkageData == null || linkageData.length == 0) {
        return(
          <div>
            <h4>No Source found! Please try a different search criteria.</h4>
          </div>
        );
      }

      let content = [];
      linkageData.map((item, index) => {
          if (this.state.navMenu) {
              content.push(
                <div>
                  { this.renderDataFeedList(item.source, index) }
                </div>
              );
          } else {
              content.push(
                  <Panel
                    key={index}
                    header={item.country}
                    collapsible
                    expanded={ this.state.open === item.country }
                    onClick={ () => {
                        let flag = this.state.open === item.country ? false : item.country;
                        this.setState({ open: flag })
                    }}
                  >
                    { this.renderDataFeedList(item.source, index) }
                  </Panel>
              );
          }
      });
      return content;
  }

  renderDataFeedList(linkageData, index) {
    // Renders Table for Reports
    if(!linkageData || typeof(linkageData) == 'undefined' || linkageData == null || linkageData.length == 0) {
      return(
        <div>
          <h4>No Source found! Please try a different search criteria.</h4>
        </div>
      )
    }
    else {
      return(
        <div key={index} className="dataTables_wrapper form-inline dt-bootstrap no-footer">
          <div className="row">
            { !this.state.navMenu &&
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Source File</th>
                  <th>Description</th>
                  <th>Last Updated by</th>
                  <th>Last Updated on</th>
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
                            this.props.handleSourceClick(item)
                          }
                        }
                        >
                        <small>
                          <i className="fa fa-file-text"></i>
                          {' '}{item.source_file_name}
                        </small>
                      </button>
                    </td>
                    <td><p className="preserve-text">{item.source_description}</p></td>
                    <td>{item.last_updated_by}</td>
                    <td>{moment().format("DD-MMM-YYYY, h:mm:ss a")}</td>
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
                          data-toggle="tooltip"
                          data-placement="top"
                          title={item.source_file_name}
                          onClick={
                            (event)=>{
                              this.props.handleSourceClick(item)
                            }
                          }
                          >
                          <small>
                            <i className="fa fa-file-text"></i>
                            {' '}{item.source_file_name.toString().substring(0,25)}
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

export default SourceCatalogList;
