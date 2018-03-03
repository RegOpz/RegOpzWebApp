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
import Parameter from './Parameter';


 class CreateReport extends Component{
  constructor(props){
    super(props);
    this.todayDate=moment().format("DD-MMM-YYYY h:mm:ss a");
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
      reportCreateDate:null,
      additionalParameters:[]
    };

    this.addNewParameter = this.addNewParameter.bind(this);
    this.removeParameter = this.removeParameter.bind(this);
    this.handleParameterChange = this.handleParameterChange.bind(this);

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

  addNewParameter(parameterTag, keyValue, disabled) {

      let additionalParameters = this.state.additionalParameters;

      additionalParameters.push({
          parameterTag: parameterTag ? parameterTag : '',
          keyValue: keyValue ? keyValue : '',
          disabled: disabled ? true : false
      });
      this.setState({ additionalParameters: additionalParameters });
  }

  removeParameter(index) {
      var additionalParameters = [...this.state.additionalParameters];
      additionalParameters.splice(index, 1);
      this.setState({ additionalParameters: additionalParameters });
  }

  handleParameterChange(event, eventType, index) {
      var additionalParameters = [...this.state.additionalParameters];
      var value;
      var checked;
      switch (eventType) {
          case 'parameterTag':
              value = event.target.value;
              value = value.replace(/[^A-Za-z0-9_]/g, "");
              additionalParameters[index].parameterTag = value;
              this.setState({ additionalParameters: additionalParameters });
              break;
          case 'keyValue':
              value = event.target.value;
              value = value.replace(/[:]/g, "");
              additionalParameters[index].keyValue = value;
              this.setState({ additionalParameters: additionalParameters });
              break;
      }
  }

  handleSubmit(event){
    event.preventDefault();
    this.todayDate=moment().format("DD-MMM-YYYY h:mm:ss a");
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
                  <div className="col-md-3 col-sm-3 col-xs-12">
                    <select
                      className="form-control"
                      required="required"
                      onChange={(event)=>{
                        this.setState({country:event.target.value, reportId: null});
                        document.getElementById("reportId").value=null;
                        this.props.fetchReportList(event.target.value);
                      }
                    }
                    >
                      <option value="">Choose a Country</option>
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
                      id="reportId"
                      className="form-control"
                      required="required"
                      onChange={(event)=>{
                        this.setState({reportId:event.target.value});
                        }
                      }
                    >
                      <option value="">Choose a Report</option>
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
                            dateFormat="DD-MMM-YYYY"
                            selected={this.state.businessStartDate}
                            onChange={this.handleStartDateChange.bind(this)}
                            placeholderText="Start date (DD-MMM-YYYY)"
                            showMonthDropdown
                            showYearDropdown
                            monthsShown={2}
                            className="view_data_date_picker_input form-control"
                            required="required"
                        />

                        <DatePicker
                            dateFormat="DD-MMM-YYYY"
                            selected={this.state.businessEndDate}
                            onChange={this.handleEndDateChange.bind(this)}
                            placeholderText="End date (DD-MMM-YYYY)"
                            showMonthDropdown
                            showYearDropdown
                            monthsShown={2}
                            className="view_data_date_picker_input form-control"
                            required="required"
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
                      placeholder="CREATE NEW"
                      type="text"
                      readOnly="true"
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
                          dateFormat="DD-MMM-YYYY"
                          selected={this.state.asOfReportingDate}
                          onChange={this.handleAsOfDateChange.bind(this)}
                          placeholderText="DD-MMM-YYYY"
                          showMonthDropdown
                          showYearDropdown
                          className="view_data_date_picker_input form-control"
                          required="required"
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
                      value={this.state.reportingCurrency}
                      onChange={(event)=>{
                        this.setState({reportingCurrency:event.target.value.toLocaleUpperCase()});
                      }
                    }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="ref-date-rate">Reference Date Rate <span className="required">*</span></label>
                  <div className="col-md-3 col-sm-3 col-xs-12">
                    <select
                      className="form-control"
                      required="required"
                      onChange={(event)=>{
                        this.setState({refDateRate:event.target.value});
                        }
                      }
                    >
                      <option value="">Choose Reference Rate</option>
                      <option key={1} value={"B"}> Business Date Rate</option>
                      <option key={2} value={"R"}> Reporting Date Rate</option>
                    </select>
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
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="reporting-parameters"> <span className="required"></span></label>
                  <div className="col-md-3 col-sm-6 col-xs-12">
                    <button
                      type="button"
                      className="btn btn-sm btn-default"
                      onClick={() => { this.addNewParameter(); }}
                      >
                      <i className="fa fa-cogs"></i> Add Parameters</button>
                  </div>
                </div>
                {
                    this.state.additionalParameters.length > 0 &&
                    <div className="form-group">
                      <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="reporting-parameters">Additional Parameters <span className="required"></span></label>
                      <div className="col-md-6 col-sm-6 col-xs-12">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Parameter <span className="required">*</span></th>
                                    <th>Value <span className="required">*</span></th>
                                    <th>Clear</th>
                                </tr>
                            </thead>
                            <tbody>
                              {
                                this.state.additionalParameters.map((element, index) => {
                                    return (
                                        <Parameter
                                          {...element}
                                          index={index}
                                          maxIndex={this.state.additionalParameters.length - 1}
                                          handleChange={this.handleParameterChange}
                                          removeRow={this.removeParameter}
                                          key={index}
                                        />
                                    )
                                })
                              }
                            </tbody>
                          </table>
                      </div>
                    </div>
                }
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
