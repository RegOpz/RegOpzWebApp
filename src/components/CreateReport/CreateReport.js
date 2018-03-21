import React,{Component} from 'react';
import {dispatch} from 'redux';
import {connect} from 'react-redux';
import moment from 'moment';
import {hashHistory} from 'react-router';
import Breadcrumbs from 'react-breadcrumbs';
import {actionCreateReport} from '../../actions/CreateReportAction';
import {actionGenerateReport} from '../../actions/ViewDataAction';
import {actionCreateTransReport} from '../../actions/TransactionReportAction';
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
      if(report_info.report_type=="TRANSACTION"){
        this.props.createTransReport(report_info);
      } else {
        this.props.generateReport(report_info);
      }
      this.props.handleCancel();

    }
    else {
      if(report_info.report_type=="TRANSACTION"){
        this.props.createTransReport(report_info);
      } else {
        this.props.createReport(report_info);
      }
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
    createTransReport:(reportInfo)=>{
      dispatch(actionCreateTransReport(reportInfo));
    },
  };
}

const VisibleCreateReport=connect(mapStateToProps,mapDispatchToProps)(CreateReport);

export default VisibleCreateReport;
