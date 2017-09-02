import React,{Component} from 'react';
import {dispatch} from 'redux';
import {connect} from 'react-redux';
import moment from 'moment';
import {hashHistory} from 'react-router';
import Breadcrumbs from 'react-breadcrumbs';
import { actionFetchReportList,
      actionFetchCountryList,
      actionCreateReport } from '../../actions/CreateReportAction';
import DatePicker from 'react-datepicker';
import './CreateReport.css';



 class CreateReport extends Component{
  constructor(props){
    super(props);
    this.todayDate=moment().format("YYYYMMDD");
    this.state={
      businessStartDate:null,
      businessEndDate:null,
      asOfReportingDate:null,
      reportId:null,
      reportCreateStatus:null,
      country:null,
      reportingCurrency:null,
      refDateRate:null,
      rateType:null,
      reportParameters:null,
      reportCreateDate:null
    };


  }

  componentWillMount(){
    this.props.fetchCountryList();
    this.props.fetchReportList('XYZ');
  }

  handleStartDateChange(date){

    this.setState({businessStartDate:date});
  }
  handleEndDateChange(date){

    this.setState({businessEndDate:date});

  }
  handleAsOfDateChange(date){

    this.setState({asOfReportingDate:date});

  }

  handleSubmit(event){
    event.preventDefault();
    const report_info={
      report_id:this.state.reportId,
      reporting_currency:this.state.reportingCurrency,
      business_date_from:this.state.businessStartDate.format("YYYYMMDD"),
      business_date_to:this.state.businessEndDate.format("YYYYMMDD"),
      reporting_date:this.state.businessStartDate.format("YYYYMMDD")+this.state.businessEndDate.format("YYYYMMDD"),
      as_of_reporting_date:this.state.asOfReportingDate.format("YYYYMMDD"),
      ref_date_rate:this.state.refDateRate,
      rate_type:this.state.rateType,
      report_parameters:this.state.reportParameters,
      report_create_status:this.state.reportCreateStatus,
      report_create_date:this.todayDate

    };
    console.log(report_info);
    this.props.createReport(report_info);
    hashHistory.push('/dashboard/view-report');
  }

  render(){

    if(typeof this.props.country_list==='undefined'|| typeof this.props.report_list==='undefined'){
      return <h1> Loading...</h1>;
    }

    //console.log('Business start date',this.state.businessStartDate);

    return(
      <div className="row form-container">
      <div className="x_panel">
          <div className="x_title">
            <h2>Create report <small>Create a new report</small></h2>
            <div className="clearfix"></div>
          </div>
          <div className="x_content">
            <br />
            <form className="form-horizontal form-label-left" onSubmit={this.handleSubmit.bind(this)}>

              <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="country">Country <span className="required">*</span></label>
                  <div className="col-md-2 col-sm-2 col-xs-12">
                    <select
                      className="form-control"
                      onChange={(event)=>{

                        this.setState({country:event.target.value});
                        this.props.fetchReportList(event.target.value);
                      }
                    }
                    >
                      <option>Choose option</option>
                        {this.props.country_list.map(function(item,index){
                            return <option key={index} value={item.country}> {item.country}</option>
                            }
                        )}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="report-id">Report ID <span className="required">*</span></label>
                  <div className="col-md-3 col-sm-3 col-xs-12">
                    <select
                      className="form-control"
                      onChange={(event)=>{
                        this.setState({reportId:event.target.value});
                        }
                      }
                    >
                      <option>Choose option</option>
                      {this.props.report_list.map(function(item,index){
                          return <option key={index} value={item.report_id}> {item.report_id}</option>
                          }
                      )}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="reporting-date">Reporting Date <span className="required">*</span></label>
                    <div className="col-md-6 col-sm-6 col-xs-12">
                        <DatePicker
                            dateFormat="YYYYMMDD"
                            selected={this.state.businessStartDate}
                            onChange={this.handleStartDateChange.bind(this)}
                            placeholderText="Select start date"
                            className="view_data_date_picker_input form-control"
                        />

                        <DatePicker
                            dateFormat="YYYYMMDD"
                            selected={this.state.businessEndDate}
                            onChange={this.handleEndDateChange.bind(this)}
                            placeholderText="Select end date"
                            className="view_data_date_picker_input form-control"
                        />

                    </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="report-create-date">Report Create Date <span className="required">*</span></label>
                  <div className="col-md-3 col-sm-6 col-xs-12">
                    <input
                      placeholder="Enter Start Business Date"
                      value={this.todayDate}
                      readOnly="true"
                      type="text"
                      className="form-control col-md-7 col-xs-12"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="report-create-status">Report Create Status <span className="required">*</span></label>
                  <div className="col-md-3 col-sm-6 col-xs-12">
                    <input
                      placeholder="Enter Report Create Status"
                      type="text"
                      required="required"
                      className="form-control col-md-7 col-xs-12"
                      onChange={(event)=>{
                        this.setState({reportCreateStatus:event.target.value});
                      }

                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="as-of-reporting-date">As of Reporting Date  <span className="required">*</span></label>
                  <div className="col-md-3 col-sm-6 col-xs-12">
                      <DatePicker
                          selected={this.state.asOfReportingDate}
                          onChange={this.handleAsOfDateChange.bind(this)}
                          placeholderText="Select as of date"
                          className="view_data_date_picker_input form-control"
                      />
                  </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="reporting-currency">Reporting Currency <span className="required">*</span></label>
                  <div className="col-md-3 col-sm-6 col-xs-12">
                    <input
                      placeholder="Enter Reporting Currency"
                      type="text"
                      required="required"
                      className="form-control col-md-7 col-xs-12"
                      onChange={(event)=>{
                        this.setState({reportingCurrency:event.target.value});
                      }
                    }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="ref-date-rate">Reference Date Rate <span className="required">*</span></label>
                  <div className="col-md-1 col-sm-1 col-xs-12">
                    <input
                      placeholder="B or R"
                      type="text"
                      required="required"
                      className="form-control col-md-7 col-xs-12"
                      onChange={(event)=>{
                        this.setState({refDateRate:event.target.value});
                      }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="rate-type">Rate Type <span className="required">*</span></label>
                  <div className="col-md-3 col-sm-6 col-xs-12">
                    <input
                      placeholder="Rate Type e.g. MAS or INTERNAL"
                      type="text"
                      required="required"
                      className="form-control col-md-7 col-xs-12"
                      onChange={(event)=>{
                        this.setState({rateType:event.target.value});
                      }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="reporting-parameters">Report Parameters <span className="required">*</span></label>
                  <div className="col-md-3 col-sm-6 col-xs-12">
                    <input
                      placeholder="Enter Report Parameters"
                      type="text"
                      className="form-control col-md-7 col-xs-12"
                      onChange={(event)=>{
                        this.setState({reportParameters:event.target.value});
                      }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">

                    <button type="reset" className="btn btn-primary">Reset</button>
                    <button type="submit" className="btn btn-success">Submit</button>
                  </div>
                </div>



            </form>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state){
  return{
    country_list:state.create_report_store.country_list,
    report_list:state.create_report_store.report_list
  };
}

const mapDispatchToProps=(dispatch)=>{
  return{
    fetchReportList:(country)=>{
      dispatch(actionFetchReportList(country));
    },
    fetchCountryList:()=>{
      dispatch(actionFetchCountryList());
    },
    createReport:(reportInfo)=>{
      dispatch(actionCreateReport(reportInfo));
    }
  };
}

const VisibleCreateReport=connect(mapStateToProps,mapDispatchToProps)(CreateReport);

export default VisibleCreateReport;
