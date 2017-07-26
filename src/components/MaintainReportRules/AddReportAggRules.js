import React,{Component} from 'react';
import DatePicker from 'react-datepicker';
import {hashHistory,Link} from 'react-router';
import {connect} from 'react-redux';
import {dispatch} from 'redux';
import {
  actionInsertRuleData,
  actionUpdateRuleData
} from '../../actions/MaintainReportRuleAction';

require('./MaintainReportRules.css');

class AddReportAggRules extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestType: this.props.location.query['request'],
      viewOnly:null,
      form: {
        id: null,
        report_id: this.props.location.query['report_id'],
        sheet_id: this.props.location.query['sheet_id'],
        cell_id: this.props.location.query['cell_id'],
        comp_agg_ref: null,
        reporting_scale: null,
        rounding_option: null,
        valid_from: null,
        valid_to: null,
        last_updated_by: null
      },
      audit_form:{
        comment:null
      }
    }
    // this.aggRulesList = new RegExp('[A-Z0-9]+') Options are included
    //this.aggRulesPattern = /(\w+([\+\-\*\/]\w+)?)|(\(\w+\))/g;
    this.aggRulesPattern = /[\+\-\*\/\(\)\[\]\{\}\^]/g;
    this.state.viewOnly=this.props.location.query['request']=='view'?"true":"";
  }

 componentWillMount(){
  //console.log('Before assignment.....',this.state.form);
  Object.assign(this.state.form, this.props.drill_down_result.comp_agg_rules[0]);
  //console.log(this.props.drill_down_result.comp_agg_rules[0]);
  //console.log(this.state.form);
 }

  render() {
    return(
      <div className="row form-container" >
        <div className="col col-lg-12">
          <div className="x_title">
            <h2>Maintain report rule <small>Add a new aggregation rule</small></h2>
            <div className="clearfix"></div>
          </div>
          <form className="form-horizontal form-label-left" onSubmit={this.handleSubmit.bind(this)}>

            <div className="form-group">
              <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="report-id">Report ID <span className="required">*</span></label>
              <div className="col-md-3 col-sm-3 col-xs-12">
                <input
                  value={this.state.form.report_id}
                  type="text"
                  className="form-control col-md-7 col-xs-12"
                  readOnly="true"
                />
              </div>
              </div>

              <div className="form-group">
                <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="sheet-id">Sheet ID <span className="required">*</span></label>
                <div className="col-md-3 col-sm-3 col-xs-12">
                  <input
                    value={this.state.form.sheet_id}
                    type="text"
                    className="form-control col-md-7 col-xs-12"
                    readOnly="true"
                  />
                </div>
                </div>

                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="cell-id">Cell ID <span className="required">*</span></label>
                  <div className="col-md-3 col-sm-3 col-xs-12">
                    <input
                      value={this.state.form.cell_id}
                      type="text"
                      className="form-control col-md-7 col-xs-12"
                      readOnly="true"
                    />
                  </div>
                  </div>

                  <div className="form-group">
                    <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="comp-agg-ref">Composite Aggregation Reference <span className="required">*</span></label>
                    <div className="col-md-6 col-sm-6 col-xs-12">
                      <input
                        value={this.state.form.comp_agg_ref}
                        type="text"
                        className="form-control col-md-7 col-xs-12"
                        readOnly={this.state.viewOnly}
                        onChange={(event) => {
                          let newState = {...this.state};
                          if(this.checkRuleValidity(event) == "valid") {
                            newState.form.comp_agg_ref = event.target.value;
                            this.setState(newState);
                          }
                          else {
                            alert("Invalid formula, please check");
                            this.setState(newState);
                          }
                         }
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="reporting-scale">Reporting Scale<span className="required">*</span></label>
                    <div className="col-md-2 col-sm-2 col-xs-12">
                      <input
                        value={this.state.form.reporting_scale}
                        readOnly={this.state.viewOnly}
                        type="number"
                        className="form-control col-md-7 col-xs-12"
                        onChange={(event) => {
                            let newState = {...this.state};
                            newState.form.reporting_scale = event.target.value;
                            this.setState(newState);
                          }
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="rounding-option">Rounding Option<span className="required">*</span></label>
                    <div className="col-md-3 col-sm-3 col-xs-12">
                      <select
                        defaultValue = {this.state.form.rounding_option}
                        className="form-control"
                        readOnly={this.state.viewOnly}
                        onChange={
                          (event) => {
                            let newState = {...this.state};
                            newState.form.rounding_option = event.target.value;
                            this.setState(newState);
                          }
                        }
                      >
                        <option>Choose option</option>
                        <option value="NONE">NONE</option>
                        <option value="CEIL">CEIL</option>
                        <option value="FLOOR">FLOOR</option>
                        <option value="TRUNC">TRUNC</option>
                        <option value="DECIMAL0">DECIMAL0</option>
                        <option value="DECIMAL1">DECIMAL1</option>
                        <option value="DECIMAL2">DECIMAL2</option>
                        <option value="DECIMAL3">DECIMAL3</option>
                        <option value="DECIMAL4">DECIMAL4</option>
                        <option value="DECIMAL5">DECIMAL5</option>
                        <option value="DECIMAL6">DECIMAL6</option>
                        <option value="DECIMAL7">DECIMAL7</option>
                        <option value="DECIMAL8">DECIMAL8</option>
                        <option value="DECIMAL9">DECIMAL9</option>
                        <option value="DECIMAL10">DECIMAL10</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Valid from <span className="required"> </span></label>
                    <div className="col-md-6 col-sm-6 col-xs-12">
                      <DatePicker
                          dateFormat="YYYYMMDD"
                          selected={this.state.form.valid_from}
                          onChange={console.log("this.handleValidFromDateChange.bind(this)")}
                          placeholderText="Rule Valid From"
                          readOnly="readonly"
                          className="view_data_date_picker_input form-control"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Valid till <span className="required"> </span></label>
                    <div className="col-md-6 col-sm-6 col-xs-12">
                      <DatePicker
                          dateFormat="YYYYMMDD"
                          selected={this.state.form.valid_to}
                          onChange={console.log("this.handleValidTillDateChange.bind(this)")}
                          placeholderText="Rule Valid Till"
                          readOnly="readonly"
                          className="view_data_date_picker_input form-control"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="comment">Comment<span className="required">*</span></label>
                    <div className="col-md-5 col-sm-5 col-xs-12">
                      <textarea
                        value={this.state.audit_form.comment}
                        minLength="20"
                        maxLength="1000"
                        required="true"
                        type="text"
                        readOnly={this.state.viewOnly}
                        className="form-control col-md-7 col-xs-12"
                        onChange={(event) => {
                          let newState = {...this.state};
                          newState.audit_form.comment = event.target.value;
                          this.setState(newState);
                          }
                        }
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="last-update-by">Last Updated By<span className="required">*</span></label>
                    <div className="col-md-3 col-sm-3 col-xs-12">
                      <input
                        value={this.state.form.last_updated_by}
                        type="text"
                        readOnly={this.state.viewOnly}
                        className="form-control col-md-7 col-xs-12"
                        onChange={(event) => {
                          let newState = {...this.state};
                          newState.form.last_updated_by = event.target.value;
                          this.setState(newState);
                          }
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
                      <button type="button" className="btn btn-primary" onClick={this.handleCancel.bind(this)}>
                        Cancel</button>
                      {
                        (()=>{
                          console.log(this.state.requestType);
                          if(this.state.requestType!="view"){
                            return(<button type="submit" className="btn btn-success" >Submit</button>);
                          }
                        })()
                      }

                    </div>
                  </div>


          </form>

        </div>
      </div>
    );
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state.form);
    let data = {
      table_name: "report_comp_agg_def",
      update_info: this.state.form
    };
    data["change_type"]=this.state.requestType == "add"?"INSERT":"UPDATE";

    let audit_info={
      table_name:data["table_name"],
      change_type:data["change_type"],
      change_reference:`Aggregation Rule of : ${this.state.form.report_id}->${this.state.form.sheet_id}->${this.state.form.cell_id}`,
    };

    Object.assign(audit_info,this.state.audit_form);

    data['audit_info']=audit_info;

    if (this.state.requestType == "add") {
      this.props.insertRuleData(data);
    } else {
      this.props.updateRuleData(this.state.form.id,data);
    }

    hashHistory.push(`/dashboard/drill-down?report_id=${this.state.form.report_id}&sheet=${encodeURI(this.state.form.sheet_id)}&cell=${this.state.form.cell_id}`);
  }

  handleCancel() {
    const url=`/dashboard/drill-down?report_id=${this.state.form.report_id}&sheet=${this.state.form.sheet_id}&cell=${this.state.form.cell_id}`;
    const encodedUrl = encodeURI(url);
    hashHistory.push(encodedUrl);
  }
  checkRuleValidity(event){
    var nstr = ''
    var str = event.target.value;
    var str1 = event.target.value;
    var nnstr=''
    var aggRulesPattern = /[\+\-\*\/\(\)\[\]\{\}\^]/g;
    //do {
      //nstr = str.replace(this.aggRulesPattern, '0');
      nstr = str.replace(aggRulesPattern, ',');
      nstr = nstr.split(",");
      nstr.map(function(item,index){
          this.state.form.cell_business_rules += `${item.text},`;
        }.bind(this));
      console.log('inside while...',nstr,str);
    //} while (nstr !== str && ((str = nstr) || 1));
    nnstr = str1.replace(/(AB\b|A\b|ABC\b)/g,'2');
    console.log('outside while...',nnstr,nstr,str);
    if (str === '0') {
      console.log("valid");
      return "valid";
    } else {
      console.log("invalid");
      return "invalid";
    }
  }

}

function mapStateToProps(state) {
  return{
    drill_down_result:state.captured_report.drill_down_result
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    insertRuleData:(data) => {
      dispatch(actionInsertRuleData(data));
    },
    updateRuleData:(id, data) => {
      dispatch(actionUpdateRuleData(id, data));
    }
  };
}

const VisibleAddReportAggRules = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddReportAggRules);

export default VisibleAddReportAggRules;
