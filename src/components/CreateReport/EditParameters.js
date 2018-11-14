import React,{Component} from 'react';
import {dispatch} from 'redux';
import {connect} from 'react-redux';
import moment from 'moment';
import {hashHistory} from 'react-router';
import Breadcrumbs from 'react-breadcrumbs';
import { actionFetchReportTemplate } from '../../actions/MaintainReportRuleAction';
import DatePicker from 'react-datepicker';
import './CreateReport.css';
import ReportParameterTemplate from './ReportParameterTemplate';


 class EditParameters extends Component{
  constructor(props){
    super(props);
    this.country=this.props.reportDetails.country;
    this.reportId=this.props.reportDetails.report_id;
    this.reportDetails = this.props.maintainReportParameter? undefined : this.props.reportDetails;
    this.domain_type = this.props.domainType ? this.props.domainType : undefined;

  }

  componentWillMount(){
    // TODO
    if(this.props.maintainReportParameter){
      this.props.fetchReportTemplateList(this.reportId, this.country, this.domain_type);
    }
  }

  componentWillReceiveProps(nextProps) {
    // TODO
    if(nextProps.reportDefCatalog){
      this.reportDetails=nextProps.reportDefCatalog[0].report[0];
    }
  }

  render(){
    if(this.props.maintainReportParameter && !this.reportDetails){
      return(<h4>Loading...</h4>)
    }
    return(
      <ReportParameterTemplate
        {...this.reportDetails}
        createReport={false}
        maintainReportParameter={true}
        handleCancel={this.props.handleCancel}
        handleSubmit={this.props.handleSubmit}
        />
    );
  }
}

function mapStateToProps(state){
  return{
    reportDefCatalog: state.maintain_report_rules_store.report_template_list,
  };
}

const mapDispatchToProps=(dispatch)=>{
  return{
    fetchReportTemplateList:(reports,country,domain_type)=>{
        dispatch(actionFetchReportTemplate(reports,country,domain_type))
    },
  };
}

const VisibleEditParameters=connect(mapStateToProps,mapDispatchToProps)(EditParameters);

export default VisibleEditParameters;
