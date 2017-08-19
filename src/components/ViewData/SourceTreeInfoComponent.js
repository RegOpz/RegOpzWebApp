import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { bindActionCreators, dispatch } from 'redux'
import { Button } from 'react-bootstrap';
import moment from 'moment'
import axios from 'axios'
import Collapsible from '../CollapsibleModified/Collapsible'
import {
  actionApplyRules
} from '../../actions/ViewDataAction'
import { BASE_URL } from '../../Constant/constant'
require('./ViewDataComponentStyle.css');

class SourceTreeInfoComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sources: null
    }
    this.selectedSourceId = null;
    this.selectedBusinessDate = null;
  }

  render() {
    return(
      <Collapsible
        dateString={this.props.year + "-" + this.props.month + "-" + this.props.date}
        onOpen={this.dateOnOpen.bind(this)}
        trigger={this.props.date}>
        {this.renderSources()}
      </Collapsible>
    )
  }

  renderSources() {
    if(this.state.sources == null){
      return(
        <h2>Loading...</h2>
      )
    }
    if(this.state.sources.length == 0){
      return(
        <h2>No Data Found</h2>
      )
    } else {
        return(
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Source ID</th>
                <th>Data File Name</th>
                <th>File load status</th>
                <th>Data loaded by</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
            {this.state.sources.map((item,index) => {
              return (
                <tr key={index}>
                  <td>{item.source_id}</td>
                  <td>
                    <button
                      className="btn btn-link btn-xs"
                      onClick={
                        ()=>{
                          console.log("Inside file name click",item.data_file_name)
                        }
                      }
                      >
                      <small>
                        <i className="fa fa-file-text"></i>
                        {' '}{item.data_file_name}
                      </small>
                    </button>
                  </td>
                  <td>{item.file_load_status}</td>
                  <td>{item.data_loaded_by}</td>
                  <td>
                    <div className="ops_icons">
                    <div className="btn-group">
                    <button
                      className="btn btn-primary btn-xs"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Operation Log History"
                    >
                      <i className="fa fa-history" aria-hidden="true"></i>
                    </button>
                    </div>
                    <div className="btn-group">
                    <button
                      className="btn btn-success btn-xs"
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
        )
      }
  }

  dateOnOpen(business_date) {
      let dateString = moment(business_date, 'YYYY-MMMM-D').format('YYYYMMDD');
      axios.get(BASE_URL + "view-data/get-sources?business_date=" + dateString)
      .then(function (response) {
        console.log(response);
        this.setState({
          sources: response.data
        })
      }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    applyRules:(source_info) => {
      dispatch(actionApplyRules(source_info));
    },
  }
}

function mapStateToProps(state){
  return {
    sources: state.sources
  }
}

const VisibleSourceTreeInfoComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(SourceTreeInfoComponent);

export default VisibleSourceTreeInfoComponent;
