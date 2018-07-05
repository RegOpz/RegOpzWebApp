import React,{Component} from 'react';
import {connect} from 'react-redux';
import { Modal } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';
import { bindActionCreators, dispatch } from 'redux';
import { actionCopyReportTemplate,actionFetchReportId } from '../../actions/CopyReportRuleAction';


  const renderField = ({ input, label, type, accept, readOnly, placeholder, meta: { touched, error }}) => {

    return(
      <div className="form-group">
        <label className="control-label col-md-3 col-sm-3 col-xs-12">
          { label }
        </label>
        <div className="col-md-6 col-sm-6 col-xs-12">
          { input.name=="report_id" &&
            <input {...input}
             id={input.name}
             placeholder={placeholder}
             type={type}
             readOnly={readOnly}
             accept={accept}
             disabled={false}
             className="form-control col-md-3 col-sm-3 col-xs-12"
             />
          }
          {
            input.name!="report_id" &&
            <input {...input}
             id={input.name}
             placeholder={placeholder}
             type={type}
             disabled={true}
             className="form-control col-md-4 col-xs-12"
             />
          }
          {
              touched &&
              ((error &&
               <div className="red">
                 { error }
               </div>))
          }
        </div>
      </div>
    );
  }

  const asyncValidate = (values, dispatch) => {
      return dispatch(actionFetchReportId(values.report_id,this.props.country))
        .then((action) => {
            console.log("Inside asyncValidate, promise resolved");
            let error = action.payload.data;
            if (Object.getOwnPropertyNames(error).length > 0) {
                console.log("Inside asyncValidate", error);
                throw { report_id: "Report ID exists, Please try a different ID!" , donotUseMiddleWare: true };
            }
         });
  }
  const validate = (values) => {
    const errors = {};
    console.log("validate starts..");
    if (!values.report_id) {
        errors.report_id = "Report ID can not be empty.";
    }
    return errors;
  }


  class CopyReportTemplate extends Component {
      constructor(props) {
          super(props);
          this.handleFormSubmit = this.handleFormSubmit.bind(this);
      }
      componentDidMount() {
         document.title = "Copy Report Template";
      }

      render() {
            const { handleSubmit, asyncValidating, pristine, message } = this.props;
            return(
              <div className="row form-container">
                <div className="col col-lg-12">
                  <div className='x_panel'>
                    <div className="x_title">
                      <h2>Copy Report Repository Template  <small> {this.props.master_report_details.report_id} </small></h2>
                      <div className="clearfix"></div>
                    </div>
                    <div className="x_content">
                      <form id="uploadForm" className="form-horizontal form-label-left" onSubmit={ handleSubmit(this.handleFormSubmit) } >
                          <Field
                            name="report_type"
                            type="text"
                            component={renderField}
                            label="Report Type"
                            placeholder={this.props.report_type}
                          />
                          <Field
                              name="country"
                              type="text"
                              component={renderField}
                              label="Country"
                              placeholder={this.props.country}
                            />
                          <Field
                            name="report_id"
                            type="text"
                            component={renderField}
                            label="Report ID"
                            readOnly={asyncValidating}
                            placeholder="Enter Report Id"
                          />
                          <Field
                            name="report_description"
                            type="textarea"
                            component={renderField}
                            label="Report Description"
                            placeholder={this.props.master_report_details.report_description}
                          />
                          <div className="form-group">
                            <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
                              <button type="button" className="btn btn-danger" onClick={ this.props.handleCancel }>Cancel</button>
                              <button type="submit" className="btn btn-success" disabled={ pristine }>Submit</button>
                            </div>
                         </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            );
        }
        handleFormSubmit(data) {

           let newData= {country:this.props.master_report_details.country,
                          report_type:this.props.master_report_details.report_type,
                          ref_report_id: this.props.master_report_details.report_id,
                          target_report_id: data.report_id,
                          ref_name:"master",
                          target_name:"tenant",
                          target_groupId:this.props.groupId};
            console.log("Data Submitted.....",newData);
            //this.props.copyReportTemplate(newData);
            this.props.handleOnSubmit();
        }
}


//function mapStateToProps(state) {}

//const mapDispatchToProps = (dispatch) => {
//    return {
//        copyReportTemplate: (formElement) => {
//            dispatch(actionCopyReportTemplate(formElement));
//        },
//    };
//}

//const VisibleCopyReportTemplate = connect(
//    mapStateToProps,
//    mapDispatchToProps
//)(CopyReportTemplate);

export default reduxForm({
    form: 'CopyAllTemplate',
    validate,
//     asyncValidate,
//     asyncBlurFields: ['report_id']
})(CopyReportTemplate);
