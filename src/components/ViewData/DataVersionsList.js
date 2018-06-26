import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import moment from 'moment';
require('./ViewDataComponentStyle.css');

class DataVersionsList extends Component {
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
        // No filter for now to be added later if required
        this.linkageData = linkageData;
      }
  }

  render(){
    this.handleFilter();
    return(
      <div className="x_panel">
      <div className="x_title">
        <h2>Available Versions <small> for the selected data feed</small></h2>
        <ul className="nav navbar-right panel_toolbox">
          <li>
            <a className="close-link"
              data-toggle="tooltip"
              data-placement="top"
              title="Close"
              onClick={()=>{this.props.handleClose(event)}}>
              <i className="fa fa-close"></i>
            </a>
          </li>
        </ul>
        <div className="clearfix"></div>
      </div>
        <div className="x_content">
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
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Business Date</th>
                  <th>Version ID</th>
                  <th>Data File Name</th>
                  <th>Data loaded by</th>
                  <th>Operations</th>
                </tr>
              </thead>
              <tbody>
              {linkageData.versions.map((item,index) => {
                return (
                  <tr key={index}>
                    <td>{moment(item.business_date.toString()).format("DD-MMM-YYYY")}</td>
                    <td>{item.version}</td>
                    <td>
                      <button
                        className="btn btn-link btn-xs"
                        data-toggle="tooltip"
                        data-placement="top"
                        title={linkageData.source_description}
                        onClick={
                          (event)=>{
                            let newItem = {...item,
                                            source_description:linkageData.source_description,
                                            data_file_name: linkageData.data_file_name
                                          };
                            this.props.handleDataFileClick(newItem)
                          }
                        }
                        >
                        <small className="truncate-text">
                          <i className="fa fa-file-text"></i>
                          {' '}{linkageData.data_file_name}
                        </small>
                      </button>
                    </td>
                    <td>{linkageData.data_loaded_by}</td>
                    <td>
                      <div className="ops_icons">
                        <div className="btn-group">
                        <button
                          className="btn btn-circle btn-link btn-xs"
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Operation Log History"
                        >
                          <i className="fa fa-history" aria-hidden="true"></i>
                        </button>
                        </div>
                        <div className="btn-group">
                        <button
                          className="btn btn-circle btn-link btn-xs"
                          onClick={
                            (event) => {
                              let source_info = {
                                source_id: item.source_id,
                                business_date: item.business_date,
                                business_or_validation: "ALL"
                              }
                              this.props.applyRules(source_info);
                            }
                          }
                          data-toggle="tooltip"
                          data-placement="top"
                          title="Apply Rules"
                        >
                          <i className="fa fa-flash" aria-hidden="true"></i>
                        </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            </table>
          </div>
        </div>
      )
    }
  }

}

export default DataVersionsList;
