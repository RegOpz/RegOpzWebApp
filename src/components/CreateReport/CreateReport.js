import React,{Component} from 'react';
import {dispatch} from 'redux';
import {connect} from 'react-redux';
import moment from 'moment';
import {hashHistory} from 'react-router';
import Breadcrumbs from 'react-breadcrumbs';
import {actionCreateReport} from '../../actions/CreateReportAction';
import {actionGenerateReport} from '../../actions/ViewDataAction';
import DatePicker from 'react-datepicker';
import './CreateReport.css';
import ReportParameterTemplate from './ReportParameterTemplate';


 class CreateReport extends Component{
  constructor(props){
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  componentWillMount(){
    // TODO
  }

  componentWillReceiveProps(nextProps) {
    // TODO
  }

  handleSubmit(report_info){
    if(this.props.reGenerateReport){
      this.props.generateReport(report_info);
      this.props.handleCancel();
    }
    else {
      this.props.createReport(report_info);
      hashHistory.push('/dashboard/view-report');
    }
  }

  render(){

    return(
      <ReportParameterTemplate
        {...this.props.reportDetails}
        createReport={this.props.reGenerateReport? false : true }
        handleCancel={this.props.handleCancel}
        handleSubmit={this.handleSubmit}
        />
    );
  }
}

function mapStateToProps(state){
  // return{
    // TODO
  // };
}

const mapDispatchToProps=(dispatch)=>{
  return{
    createReport:(reportInfo)=>{
      dispatch(actionCreateReport(reportInfo));
    },
    generateReport: (report_info) => {
      dispatch(actionGenerateReport(report_info));
    },
  };
}

const VisibleCreateReport=connect(mapStateToProps,mapDispatchToProps)(CreateReport);

export default VisibleCreateReport;
