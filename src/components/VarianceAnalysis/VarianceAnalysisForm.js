import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, dispatch} from 'redux';
import {actionFetchCountryList,
        actionFetchReportList,
        actionFetchDateList
        } from '../../actions/VarianceAnalysisAction';
import {
  actionLeftMenuClick,
} from '../../actions/LeftMenuAction';
import {hashHistory} from 'react-router';
import './VarianceAnalysis.css';

class VarianceAnalysisForm extends Component{
  constructor(props){
    super(props);
    this.state={
      variance_percentage: 0,
    }
    this.country=null;
    this.report_id=null;
    this.first_date=null;
    this.subsequent_date=null;

  }
  componentDidUpdate(){
    this.props.leftMenuClick(false);
  }
  componentDidMount(){
    this.props.fetchCountryList();
    // 'XYZ' is an arbitary string for getting empty array in return
    this.props.fetchReportList('XYZ');
    this.props.fetchDateListFirst('XYZ');
    this.props.fetchDateListSubsequent('XYZ','XYZ');
  }

  render(){
    if(typeof this.props.country_list=='undefined'||
       typeof this.props.report_list=='undefined' ||
       typeof this.props.date_list_first=='undefined'||
       typeof this.props.date_list_subsequent=='undefined'

     ){
      return <h1>Loading...</h1>;
    }

    return(
      <div className="row form-container">
        <div className="x_panel">
          <div className="x_title">
            <h2>Generate Variance Report <small>Select a report </small></h2>
            <div className="clearfix"></div>
            </div>
            <div className="x_content">
              <br />
              <form className="form-horizontal form-label-left" onSubmit={this.handleSubmit.bind(this)}>

              <div className="form-group">
                <label className="control-label col-md-3 col-sm-3 col-xs-12"
                        htmlFor="report-id">Country <span className="required">*</span>
                </label>
                <div className="col-md-2 col-sm-6 col-xs-12">
                  <select className="form-control"
                    onChange={(event)=>{
                        this.country=event.target.value;
                        this.props.fetchReportList(this.country);

                      }
                    }
                    >
                    <option value='XYZ'> Choose a country</option>
                    {
                      this.props.country_list.map((item,index)=>{
                        return(
                          <option key={index} value={item.country}> {item.country}</option>
                        );
                      }
                  )}
                  </select>
                </div>
              </div>

                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12"
                          htmlFor="report-id">Report Id <span className="required">*</span>
                  </label>
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <select className="form-control"
                      onChange={(event)=>{
                          this.report_id=event.target.value;
                          this.props.fetchDateListFirst(this.report_id);
                        }
                      }
                    >
                      <option> Choose a report</option>
                        {
                            this.props.report_list.map((item,index)=>{
                              return(
                                <option key={index} value={item.report_id}> {item.report_id}</option>
                              );
                          }

                      )}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                    <label className="control-label col-md-3 col-sm-3 col-xs-12"
                            htmlFor="first-period">First period or date <span className="required">*</span>
                    </label>
                    <div className="col-md-4 col-sm-6 col-xs-12">
                      <select className="form-control"
                        onChange={(event)=>{
                            this.first_date=event.target.value;
                            this.props.fetchDateListSubsequent(this.report_id,this.first_date);
                          }
                        }
                      >
                        <option value='XYZ'> Choose first period</option>
                          {
                            this.props.date_list_first.map((item,index)=>{
                              return(
                                <option key={index} value={item.reporting_date}>
                                    {item.reporting_date} - as of {item.as_of_reporting_date}
                               </option>
                              );

                            })
                          }

                      </select>
                    </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12"
                          htmlFor="second-period">Second period or date <span className="required">*</span>
                  </label>
                  <div className="col-md-4 col-sm-6 col-xs-12">
                    <select className="form-control"
                      onChange={(event)=>{
                        this.subsequent_date=event.target.value;

                        }
                      }
                    >
                      <option> Choose second period</option>
                        {
                          this.props.date_list_subsequent.map((item,index)=>{
                            return(
                              <option key={index} value={item.reporting_date}>
                                  {item.reporting_date} - as of {item.as_of_reporting_date}
                             </option>
                            );

                          })
                        }

                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12"
                          htmlFor="variance-percentage">Variance Tolerance percentage <span className="required">*</span>
                  </label>
                  <div className="col-md-3 col-sm-6 col-xs-12">
                    <input
                      value={this.state.variance_percentage}
                      type="number"
                      className="form-control col-md-7 col-xs-12"
                      onChange={(event) => {
                          let newState = {...this.state};
                          newState.variance_percentage = event.target.value;
                          this.setState(newState);
                        }
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
                    <button type="submit" className="btn btn-success">Submit</button>
                  </div>
                </div>


              </form>
            </div>

        </div>
      </div>
    );

  }

handleSubmit(event){
  event.preventDefault();
  console.log("Inside handleSubmit.......",event);
  const obj={country:this.country,
            report_id:this.report_id,
            first_date:this.first_date,
            subsequent_date:this.subsequent_date,
            variance_tolerance:this.state.variance_percentage
          };
  this.props.onSubmitForm(obj);
}

}

const mapDispatchToProps=(dispatch)=>{
  return{
    fetchCountryList:()=>{
       dispatch(actionFetchCountryList());
     },
    fetchReportList:(country)=>{
      dispatch(actionFetchReportList(country));
    },
    fetchDateListFirst:(report_id)=>{
      dispatch(actionFetchDateList(report_id));
    },
    fetchDateListSubsequent:(report_id,excluded_date)=>{
      dispatch(actionFetchDateList(report_id,excluded_date));
    },
    leftMenuClick:(isLeftMenu) => {
      dispatch(actionLeftMenuClick(isLeftMenu));
    },
 };
}


function mapStateToProps(state){
  return{
    country_list:state.variance_analysis_store.country_list,
    report_list:state.variance_analysis_store.report_list,
    date_list_first:state.variance_analysis_store.date_list_first,
    date_list_subsequent:state.variance_analysis_store.date_list_subsequent,
    leftmenu: state.leftmenu_store.leftmenuclick,
  };
}

const VisibleVarianceAnalysisForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(VarianceAnalysisForm);

export default VisibleVarianceAnalysisForm;
