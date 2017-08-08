import React,{ Component } from 'react';
import { Field,reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import {
  actionFetchDates,
  actionFetchReportFromDate,
  actionFetchDrillDownReport,
  actionFetchDrillDownRulesReport,
  actionFetchTableData,
  actionFetchSource,
  actionFetchReportLinkage,
  actionInsertSourceData,
  actionUpdateSourceData,
  actionDeleteFromSourceData
} from '../../actions/ViewDataAction';

require('./ViewDataComponentStyle.css');

const renderField = ({ input, label, type, readOnly, meta: { touched, error }}) => (
    <div className="form-group">
      <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor={label}>
        { label }
        <span className="required">*</span>
      </label>
      <div className="col-md-5 col-sm-5 col-xs-12">
        <input {...input}
         placeholder={label}
         type={type}
         id={label}
         readOnly={ readOnly }
         className="form-control col-md-4 col-xs-12"/>
      </div>
    </div>
);

class AddData extends Component {

  constructor(props){
    super(props);
    this.requestType=this.props.location.query['request'];
  }

  componentWillMount(){
    if(this.requestType=='update'){
      console.log("Inside componentWillMount.....",this.props.form_data);
      this.props.initialize(this.props.form_data);
    }
  }

  componentWillUpdate(){

    if(this.requestType=='update'){
      console.log("Inside componentWillUpdate.....",this.props.form_data);
      this.props.initialize(this.props.form_data);
    }

  }

  render(){
   const { handleSubmit, pristine, dirty, submitting } = this.props;

    return (
            <div className="row form-container">
            <div className="col col-lg-12">
              <div className="x_title">
                <h2>Add Data <small>Add and Update a data entry</small></h2>
                <div className="clearfix"></div>
              </div>
              <div className="x_content">
                <form className="form-horizontal form-label-left" onSubmit={ handleSubmit(this.handleFormSubmit.bind(this)) }>
                  { this.renderFields(this.props.form_cols) }

                  <div className="form-group">
                    <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
                      <button type="button" className="btn btn-primary" onClick={ this.handleCancel.bind(this) } disabled={ submitting }>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-success" disabled={ pristine || submitting }>
                        Submit
                      </button>
                    </div>
                 </div>
                </form>
                <div className="clearfix"></div>
              </div>
            </div>
          </div>
    );
  }

  handleFormSubmit(data){

  }

  handleCancel(){

  }

  renderFields(colsList){
    let fieldArray=[];
    colsList.map((item,index)=>{
      fieldArray.push(
          <Field
            key={index}
            name={ item }
            type="text"
            component={renderField}
            label={ item }
            readOnly={item == "id" }
          />
      );
    });

  return fieldArray;
  }


}

function mapStateToProps(state){
  return {
    form_data:state.view_data_store.form_data,
    form_cols:state.view_data_store.form_cols
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchDates:(startDate,endDate)=>{
      dispatch(actionFetchDates(startDate,endDate))
    },
    fetchReportFromDate:(source_id,business_date,page)=>{
      dispatch(actionFetchReportFromDate(source_id,business_date,page))
    },
    fetchDrillDownReport:(drill_info)=>{
      console.log('Inside dispatch to props',drill_info)
      dispatch(actionFetchDrillDownReport(drill_info))
    },
    fetchTableData:(table,filter,page)=>{
      console.log('Inside dispatch to props',table,filter,page)
      dispatch(actionFetchTableData(table,filter,page));
    },
    fetchDrillDownRulesReport:(rules,source_id,page)=>{
      console.log('Inside dispatch to props',rules,source_id,page)
      dispatch(actionFetchDrillDownRulesReport(rules,source_id,page))
    },
    fetchSource:(business_date) => {
      dispatch(actionFetchSource(business_date))
    },
    fetchReportLinkage:(source_id,qualifying_key,business_date) => {
      dispatch(actionFetchReportLinkage(source_id,qualifying_key,business_date));
    },
    insertSourceData:(data,at) => {
      dispatch(actionInsertSourceData(data,at));
    },
    updateSourceData:(data) => {
      dispatch(actionUpdateSourceData(data));
    },
    deleteFromSourceData:(id,business_date,table_name, at) => {
      dispatch(actionDeleteFromSourceData(id,business_date,table_name, at));
    }
  }
}

const VisibleAddData = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddData);


export default reduxForm({
    form: 'edit-data'
})(VisibleAddData);
