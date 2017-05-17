import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'
import {bindActionCreators, dispatch} from 'redux'
import TreeView from 'react-treeview'
import moment from 'moment'
import axios from 'axios'
import Collapsible from '../CollapsibleModified/Collapsible'
import {
  actionFetchSource,
  actionFetchReportFromDate ,
  actionApplyRules
} from '../../actions/ViewDataAction'
import {BASE_URL} from '../../Constant/constant'
class SourceTreeInfoComponent extends Component {
  constructor(props){
    super(props);
    this.state = {
      sources:null
    }
    this.selectedSourceId = null;
    this.selectedBusinessDate = null;

  }
  render(){
    return(
      <Collapsible
        dateString={this.props.year + "-" + this.props.month + "-" + this.props.date}
        onOpen={this.dateOnOpen.bind(this)}
        trigger={this.props.date}>
        {this.renderSources()}
      </Collapsible>
    )
  }
  renderSources(){
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
      if(this.props.apiFor == 'report'){
        return(
          <table className="table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Report Creation Date</th>
              </tr>
            </thead>
            <tbody>
            {this.state.sources.map((item,index) => {
              return (
                <tr>
                  <td><a href={`#/dashboard/data-grid?report_id=${item.report_id}&reporting_date=${item.reporting_date}`}>{item.report_id}</a></td>
                  <td>{item.report_create_date}</td>
                </tr>
              )
            })}
          </tbody>
          </table>
        )
      } else {
        return(
          <table className="table">
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
                  <td><a href={`#/dashboard/view-data-on-grid?business_date=${item.business_date}&source_id=${item.source_id}`}>{item.data_file_name}</a></td>
                  <td>{item.file_load_status}</td>
                  <td>{item.data_loaded_by}</td>
                  <td>
                    <button className="btn btn-default"><span className="glyphicon glyphicon-eye-open" aria-hidden="true"></span></button>
                    <button
                      className="btn btn-default"
                      onClick={
                        (event) => {
                          this.props.applyRules(item.source_id,item.business_date,"ALL");
                        }
                      }
                    >
                      <span className="glyphicon glyphicon-plane" aria-hidden="true"></span>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
          </table>
        )
      }
    }
  }

  dateOnOpen(business_date){
    if(this.props.apiFor == 'report'){
      let dateString = moment(business_date, 'YYYY-MMMM-D').format('YYYYMMDD');
      axios.get(BASE_URL + "document/get-report-list?reporting_date=" + dateString)
      .then(function (response) {
        console.log(response);
        this.setState({
          sources:response.data
        })
      }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
    } else {
      let dateString = moment(business_date, 'YYYY-MMMM-D').format('YYYYMMDD');
      axios.get(BASE_URL + "view-data/get-sources?business_date=" + dateString)
      .then(function (response) {
        console.log(response);
        this.setState({
          sources:response.data
        })
      }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
    }
  }


}
const mapDispatchToProps = (dispatch) => {
  return {
    fetchSource:(business_date) => {
      dispatch(actionFetchSource(business_date));
    },
    fetchReportFromDate:(source_id,business_date,page) => {
      dispatch(actionFetchReportFromDate(source_id,business_date,page));
    },
    applyRules:(source_id, business_date, option) => {
      dispatch(actionApplyRules(source_id,business_date,option));
    }
  }
}
function mapStateToProps(state){
  return {
    sources:state.sources
  }
}
const VisibleSourceTreeInfoComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(SourceTreeInfoComponent);
export default VisibleSourceTreeInfoComponent;
