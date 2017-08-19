import React,{ Component } from 'react';
import { Field,reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import {
  actionInsertSourceData,
  actionUpdateSourceData,
  actionDeleteFromSourceData,
  actionResetDisplayData
} from '../../actions/ViewDataAction';

require('./ViewDataComponentStyle.css');

const renderField = ({ input, label, type, readOnly, meta: { touched, error }}) => (
    <div className="form-group">
      <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor={label}>
        { label }
        <span className="required">*</span>
      </label>
      <div className="col-md-6 col-sm-6 col-xs-12">
        <input {...input}
         placeholder={label}
         type={type}
         id={label}
         readOnly={ readOnly }
         className="form-control col-md-6 col-sm-6 col-xs-12"/>
      </div>
    </div>
);

class AddData extends Component {

  constructor(props){
    super(props);
    this.requestType=this.props.requestType;
    this.businessDate=this.props.businessDate;
    this.form_data=this.props.form_data;
    this.form_cols=this.props.form_cols;
    this.table_name=this.props.table_name;
    this.readOnly=this.props.readOnly;
    this.state={
      audit_form:{comment:null}
    }
  }

  componentDidMount(){
    if(this.requestType=='update'){
        this.props.initialize(this.form_data);
    }

    if(this.requestType=='add'){
      this.props.initialize({'business_date': this.businessDate});
    }
  }

  render(){
   const { handleSubmit, pristine, dirty, submitting } = this.props;

   console.log("Inside render AddData...",this.table_name, this.requestType,this.form_data);

    return (
            <div className="row form-container">
            <div className="x_panel">
              <div className="x_title">
                <h2>
                  {this.readOnly ? "View Details" : this.requestType=="add" ? "Add Data" : "Edit Data"}
                  <small>Details of Selected Record attributes</small>
                </h2>
                  <ul className="nav navbar-right panel_toolbox">
                    <li>
                      <a className="close-link" onClick={()=>{this.props.handleClose("Add")}}><i className="fa fa-close"></i></a>
                    </li>
                  </ul>
                <div className="clearfix"></div>
              </div>
              <div className="x_content">
                <form className="form-horizontal form-label-left" onSubmit={ handleSubmit(this.handleFormSubmit.bind(this)) }>
                  { this.renderFields(this.form_cols) }

                  { this.form_cols &&
                    //Create Audit form comment seperately to keep it seperate from update info columns,
                    //so that not to pollute what to send to the backend for updating

                    <div className="form-group">
                      <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor={Comment}>
                        Comment
                        <span className="required">*</span>
                      </label>
                      <div className="col-md-6 col-sm-6 col-xs-12">
                        <textarea
                         value={this.state.audit_form.comment}
                         required={true}
                         minLength="20"
                         maxLength="1000"
                         placeholder="Please provide a comment"
                         id="Comment"
                         className="form-control col-md-6 col-xs-12"
                         onChange={(event)=>{
                            let audit_form={...this.state.audit_form};
                            audit_form.comment=event.target.value;
                            this.setState({audit_form});
                            //console.log(this.state.audit_form.comment);
                          }
                        }
                         />
                      </div>
                    </div>
                  }


                  <div className="form-group">
                    <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
                      <button type="button" className="btn btn-primary" onClick={ ()=>{this.props.handleClose("Add")} } disabled={ submitting }>
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

  handleFormSubmit(submitData){
    let data={};
    data['table_name']=this.table_name;
    data['change_type']=this.requestType=='add'?'INSERT':'UPDATE';

    let audit_info={
      id:submitData.id,
      table_name:data.table_name,
      change_type:data.change_type,
      change_reference:`Data: ${submitData.id} of Source: ${this.table_name}`,
      maker:this.props.login_details.user,
      business_date:submitData.business_date
    };

    Object.assign(audit_info,this.state.audit_form);

    data['audit_info']=audit_info;


    //update in sending all columns
    if(this.requestType=='update'){
        data['update_info']=submitData;
        data['business_date']=submitData.business_date;
        this.props.updateSourceData(data);
    }

    //insert is sending only changed column,so we need to expand for all columns
    if(this.requestType=='add'){

        data['update_info']={};

        for (let col of this.form_cols){
          data['update_info'][col]=submitData[col]?submitData[col]:"";
        }
        data['business_date']=data['update_info']['business_date'];
        this.props.insertSourceData(data,0);
      }


      console.log("Inside handleFormSubmit......",data);
      this.props.resetDisplayData();
      hashHistory.push('/dashboard/view-data');



  }

  handleCancel(){
    this.props.resetDisplayData();
    hashHistory.push('/dashboard/view-data');
  }

  renderFields(colsList){
    let fieldArray=[];
    if(!colsList){
      return null;
    }
    colsList.map((item,index)=>{
      fieldArray.push(
          <Field
            key={index}
            name={ item }
            type="text"
            component={renderField}
            label={ item }
            readOnly={item == "id" || item=="business_date" || this.readOnly}
          />
      );
    });

  return fieldArray;
  }


}

function mapStateToProps(state){
  return {
    //form_data:state.view_data_store.form_data,
    //form_cols:state.view_data_store.form_cols,
    //table_name:state.view_data_store.table_name,
    login_details:state.login_store
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
   insertSourceData:(data,at) => {
      dispatch(actionInsertSourceData(data,at));
    },
    updateSourceData:(data) => {
      dispatch(actionUpdateSourceData(data));
    },
    deleteFromSourceData:(id,business_date,table_name, at) => {
      dispatch(actionDeleteFromSourceData(id,business_date,table_name, at));
    },
    resetDisplayData:()=>{
      dispatch(actionResetDisplayData());
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
