import React,{Component} from 'react';
import DatePicker from 'react-datepicker';
import {Panel,Button} from 'react-bootstrap';
import {hashHistory,Link} from 'react-router';
import {connect} from 'react-redux';
import {dispatch} from 'redux';
import {
  actionInsertRuleData,
  actionUpdateRuleData
} from '../../actions/MaintainReportRuleAction';
import {
  actionDrillDown
} from '../../actions/CaptureReportAction';
import AggRuleAssist from './AggRuleAssist';
require('../MaintainReportRules/MaintainReportRules.css');

class AddReportAggRules extends Component {
    constructor(props) {
        super(props);
        this.state = {
          display:null,
          requestType: null,
          form: this.props.form,
          audit_form:{
            comment:null
          },
        }

        this.ruleIndex = this.props.requestType;
        this.dml_allowed = this.props.form.dml_allowed === 'Y' ? true : false;
        this.writeOnly = this.props.writeOnly;

        this.handleEditAggRule=this.handleEditAggRule.bind(this);
        this.handleChangeAggRule=this.handleChangeAggRule.bind(this);
    }

    componentWillMount() {
      console.log("Inside componentWillMount of AddReportRules",this.props.aggRuleData);
        this.setState({form: this.props.form});
    }

    componentWillReceiveProps(nextProps) {
          this.setState({form: nextProps.form});
          this.dml_allowed = nextProps.form.dml_allowed === 'Y' ? true : false;
  }


  render() {
    this.viewOnly = ! (this.writeOnly && this.dml_allowed);

    if(typeof this.state.form == 'undefined') {
      return(
        <h4>Loading...</h4>
      )
    }
    return(

      <div className="row form-container" >
      {!this.state.display &&
        <div className="x_panel">
          <div className="x_title">
            <h2>{this.state.form.comp_agg_ref}<small>{ this.props.requestType + " Aggegration Rule "}</small></h2>
            <div className="clearfix"></div>
          </div>
          <div className="x_content">
           <form className="form-horizontal form-label-left" onSubmit={this.handleSubmit.bind(this)}>
            <div className="form-group">
              <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">External Reference <span className="required">*</span></label>
              <div className="col-md-6 col-sm-6 col-xs-12">
                <input
                  type="text"
                  placeholder="Enter Agg External Ref"
                  readOnly={this.viewOnly}
                  required="required"
                  className="form-control col-md-7 col-xs-12"
                  value={this.state.form.comp_agg_extern_ref}
                  onChange={
                    (event) => {
                      let form=this.state.form;
                      form.comp_agg_extern_ref = event.target.value;
                      this.setState({form:form});
                    }
                  }
                />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="calc-description">Summary Description <span className="required">*</span></label>
              <div className="col-md-6 col-sm-6 col-xs-12">
                <textarea
                  type="text"
                  required="requried"
                  className="form-control col-md-6 col-sm-6 col-xs-12"
                  placeholder="Enter Summary Description"
                  value={this.state.form.cell_agg_decsription}
                  readonly={true}
                  disabled={this.viewOnly}
                  onChange={
                    (event) => {
                      let form=this.state.form;
                      form.cell_agg_decsription = event.target.value;
                      this.setState({form:form});
                    }
                  }
                  />
              </div>
            </div>
            <div className="form-group">
               <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="comp-agg-ref">Aggregation Logic <span className="required">*</span></label>
               <div className="col-md-6 col-sm-6 col-xs-12">
                 <textarea
                   value={this.state.form.comp_agg_rule}
                   type="text"
                   className="form-control col-md-7 col-xs-12"
                   readonly={true}
                   disabled={this.viewOnly}
                 />
               </div>
               <button
                   type="button"
                   disabled={this.viewOnly}
                   className="btn btn-primary btn-xs"
                   onClick={this.handleEditAggRule}
                 >
                Edit
              </button>
             </div>
             <div className="form-group">
              <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="reporting-scale">Reporting Scale<span className="required">*</span></label>
              <div className="col-md-6 col-sm-6 col-xs-12">
                <input
                  value={this.state.form.reporting_scale}
                  readOnly={this.viewOnly}
                  type="number"
                  className="form-control col-md-6 col-xs-12"
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
              <div className="col-md-6 col-sm-6 col-xs-12">
                <select
                  defaultValue = {this.state.form.rounding_option}
                  className="form-control"
                  readOnly={this.viewOnly}
                  disabled={this.viewOnly}
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
              <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="comment">Comment<span className="required">*</span></label>
              <div className="col-md-6 col-sm-6 col-xs-12">
                <textarea
                  value={this.state.audit_form.comment}
                  minLength="20"
                  maxLength="1000"
                  required="true"
                  type="text"
                  readOnly={this.viewOnly}
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
              <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
                {!this.viewOnly &&
                  <button type="submit" className="btn btn-success btn-sm" >Submit</button>
                }
              </div>
            </div>
          </form>
         </div>
         </div>
       }
       { this.state.display=="editAggRule" &&
         <AggRuleAssist
           {...this.state.form}
           reportGrid = { this.props.reportGrid }
           handleEditAggRule={this.handleEditAggRule}
           handleChangeAggRule={this.handleChangeAggRule}
           reportGrid={this.props.reportGrid}
           />
       }
      </div>



    );
  }

  handleChangeAggRule(formula){

    let newState={...this.state};
    newState.form.comp_agg_rule=formula;
    this.setState(newState);

  }

  handleEditAggRule(){
    console.log("handleEditAggRule:",this);
    let isOpen = (this.state.display == "editAggRule");
    if(isOpen){
        this.setState({display: null});
    }
    else{
      this.setState({display: "editAggRule"});
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log("compAggRule handleSubmit.....",this.state.form);
    let data = {
      table_name: "report_comp_agg_def",
      update_info: this.state.form
    };
    data['change_type'] = this.props.requestType=="Edit" ? "UPDATE" : "INSERT";

    let audit_info={
      table_name:data["table_name"],
      change_type:data["change_type"],
      change_reference:`Aggregation Rule of : ${this.state.form.report_id}->${this.state.form.sheet_id}->${this.state.form.cell_id}`,
      maker: this.props.login_details.user,
      maker_tenant_id: this.props.login_details.domainInfo.tenant_id,
      group_id: this.props.groupId,
    };

    Object.assign(audit_info,this.state.audit_form);

    data['audit_info']=audit_info;

    if (data['change_type'] == "INSERT") {
      this.props.insertRuleData(data);
    } else {
      this.props.updateRuleData(this.state.form.id,data);
    }

    // this.props.handleClose();
  }
}

function mapStateToProps(state) {
  return{
    //cell_rules: state.report_store.cell_rules,
    login_details: state.login_store
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
