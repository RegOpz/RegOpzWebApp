import React,{Component} from 'react';
import {dispatch} from 'redux';
import {connect} from 'react-redux';
import moment from 'moment';
import {hashHistory} from 'react-router';
import Breadcrumbs from 'react-breadcrumbs';
import { actionFetchReportList,
      actionFetchCountryList,
      actionCreateReport} from '../../actions/CreateReportAction';
import {actionGenerateReport} from '../../actions/ViewDataAction';
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
    this.disabled = this.props.report_parameters ? true : false;
    this.addNewParameter = this.addNewParameter.bind(this);
    this.removeParameter = this.removeParameter.bind(this);
    this.handleParameterChange = this.handleParameterChange.bind(this);

  }

  componentWillMount(){
    if(this.props.report_parameters){
        this.populateParameters();
    }
    else {
        this.props.fetchCountryList();
        this.props.fetchReportList('XYZ');
    }
  }

  componentWillReceiveProps(nextProps) {
    // TODO
  }

  handleStartDateChange(date){
    if(this.state.businessEndDate && date > this.state.businessEndDate){
      this.setState({businessStartDate:null});
    }
    else{
      this.setState({businessStartDate:date});
    }

  }
  handleEndDateChange(date){

    if(this.state.businessStartDate && date < this.state.businessStartDate){
      this.setState({businessEndDate:null});
    }
    else {
      this.setState({businessEndDate:date});
    }

  }
  handleAsOfDateChange(date){

    if(this.state.businessStartDate && date < this.state.businessStartDate){
      this.setState({asOfReportingDate:null});
    }
    else {
      this.setState({asOfReportingDate:date});
    }

  }

  populateParameters(){
    let newState = {...this.state};
    let reportParameters=JSON.parse("{"+this.props.report_parameters.replace(/'/g,'"')+"}")
    // console.log("populateParameters....",this.props,reportParameters)
    newState.reportId=this.props.report_id;
    newState.country=this.props.country;
    newState.reportCreateStatus=this.props.report_create_status;
    newState.asOfReportingDate=moment(this.props.as_of_reporting_date,"YYYYMMDD");
    this.todayDate=this.props.report_create_timestamp
    Object.keys(reportParameters).map((item,index)=>{
      // console.log("Inside map of switch...",item)
      // Poorly written code for now, need to cleanup this piece to be inline with the parameters expected in API call as well
      switch(item){
        case "business_date_from":
          newState.businessStartDate=moment(reportParameters.business_date_from,"YYYYMMDD");
          break;
        case "business_date_to":
          newState.businessEndDate=moment(reportParameters.business_date_to,"YYYYMMDD");
          break;
        case "as_of_reporting_date":
          newState.asOfReportingDate=moment(reportParameters.as_of_reporting_date,"YYYYMMDD");
          break;
        case "country":
          newState.country=reportParameters.country;
          break;
        case "report_id":
          newState.reportId=reportParameters.report_id;
          break;
        case "reporting_currency":
          newState.reportingCurrency=reportParameters.reporting_currency;
          break;
        case "ref_date_rate":
          newState.refDateRate=reportParameters.ref_date_rate;
          break;
        case "rate_type":
          newState.rateType=reportParameters.rate_type;
          break;
        default:
          newState.additionalParameters.push({
              parameterTag: item,
              keyValue: reportParameters[item],
              disabled: false
          });
          break;
      }
    })
    // console.log("populateParameters post mapping",newState)
    this.setState(
      newState,
      ()=>{
        // console.log("populateParameters inside setstate....",this.state)
        this.props.fetchCountryList();
        this.props.fetchReportList(this.props.country);
      }
    );
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
              value= value.length>0 & value[0]!='_' ? "_" + value : value;
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
    let report_info={
      report_id:this.state.reportId,
      reporting_currency:this.state.reportingCurrency,
      business_date_from:this.state.businessStartDate.format("YYYYMMDD"),
      business_date_to:this.state.businessEndDate.format("YYYYMMDD"),
      reporting_date:this.state.businessStartDate.format("YYYYMMDD")+this.state.businessEndDate.format("YYYYMMDD"),
      as_of_reporting_date:this.state.asOfReportingDate.format("YYYYMMDD"),
      ref_date_rate:this.state.refDateRate,
      rate_type:this.state.rateType,
      report_parameters:null,
      report_create_status:this.state.reportCreateStatus,
      report_create_date:this.todayDate
    };
    report_info.report_parameters='"business_date_from":"' + report_info.business_date_from + '",' +
                                '"business_date_to":"' + report_info.business_date_to + '",' +
                                '"reporting_currency":"' + report_info.reporting_currency + '",' +
                                '"ref_date_rate":"' + report_info.ref_date_rate + '",' +
                                '"rate_type":"' + report_info.rate_type +'"'
    this.state.additionalParameters.map((item,index)=>{
        report_info.report_parameters=report_info.report_parameters+',"'+item.parameterTag+'":"'+item.keyValue+'"'
    })
    console.log(report_info);
    if(this.props.report_parameters){
      this.props.generateReport(report_info);
      this.props.handleCancel();
    }
    else {
      this.props.createReport(report_info);
      hashHistory.push('/dashboard/view-report');
    }

  }

  render(){

    // console.log("This props log",this.state)
    if(typeof this.props.country_list==='undefined'|| typeof this.props.report_list==='undefined'){
      return <h4> Loading...</h4>;
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
                    {
                      this.props.report_parameters &&
                      <input
                        placeholder="Report creation Date"
                        value={this.state.country}
                        readOnly="true"
                        type="text"
                        className="form-control col-md-7 col-xs-12"
                      />
                    }
                    {
                      !this.props.report_parameters &&
                      <select
                        className="form-control"
                        required="required"
                        readOnly={this.disabled}
                        value={this.state.country}
                        onChange={(event)=>{
                          if(this.props.report_id){
                            // DO NOTHING
                          }
                          else {
                            this.setState({
                              country:event.target.value,
                              reportId: null
                            });
                            document.getElementById("reportId").value="";
                            this.props.fetchReportList(event.target.value);
                          }
                        }
                      }
                      >
                        <option value="">Choose a Country</option>
                          {this.props.country_list.map(function(item,index){
                              return <option key={index} value={item.country}> {item.country}</option>
                              }
                          )}
                      </select>
                    }
                  </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="report-id">Report ID <span className="required">*</span></label>
                  <div className="col-md-3 col-sm-3 col-xs-12">
                    {
                      this.props.report_parameters &&
                      <input
                        placeholder="Report creation Date"
                        value={this.state.reportId}
                        readOnly="true"
                        type="text"
                        className="form-control col-md-7 col-xs-12"
                      />
                    }
                    {
                      !this.props.report_parameters &&
                      <select
                        id="reportId"
                        className="form-control"
                        required="required"
                        readOnly={this.disabled}
                        value={this.state.reportId}
                        onChange={(event)=>{
                            if(this.props.report_id){
                              // DO NOTHING
                            }
                            else {
                              this.setState({reportId:event.target.value});
                            }
                          }
                        }
                      >
                        <option value="">Choose a Report</option>
                        {this.props.report_list.map(function(item,index){
                            return <option key={index} value={item.report_id}> {item.report_id}</option>
                            }
                        )}
                      </select>
                    }
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
                            disabled={this.disabled}
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
                            disabled={this.disabled}
                        />

                    </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="report-create-date">Report Create Date <span className="required">*</span></label>
                  <div className="col-md-3 col-sm-6 col-xs-12">
                    <input
                      placeholder="Report creation Date"
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
                      value={this.state.reportCreateStatus}
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
                          disabled={this.disabled}
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
                      value={this.state.refDateRate}
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
                      value={this.state.rateType}
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
                        <div className="x_panel">
                          <div className="x_title">
                            <h2>Additional Parameters <small> for report {this.state.reportId}</small></h2>
                          <div className="clearfix"></div>
                          </div>
                          <div className="x_content">
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
                      </div>
                    </div>
                }
                <div className="form-group">
                  <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">

                    {
                      this.props.report_parameters &&
                      <button type="button" className="btn btn-primary"
                        onClick={this.props.handleCancel}>Cancel</button>
                    }
                    {
                      !this.props.report_parameters &&
                      <button type="reset" className="btn btn-primary"
                        onClick={
                          ()=>{
                            let newState={
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
                            this.setState(newState);
                          }
                        }>Reset</button>
                    }
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
    },
    generateReport: (report_info) => {
      dispatch(actionGenerateReport(report_info));
    },
  };
}

const VisibleCreateReport=connect(mapStateToProps,mapDispatchToProps)(CreateReport);

export default VisibleCreateReport;
