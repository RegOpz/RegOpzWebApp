import React,{Component} from 'react';
import {connect} from 'react-redux';
import { Modal } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';
import { bindActionCreators, dispatch } from 'redux';
import { actionCopyReportTemplate,actionFetchReportId } from '../../actions/MaintainReportRuleAction';
import { actionCheckReportId } from '../../actions/CaptureReportTemplateAction';

  const renderField = ({ input, label, type, accept, readOnly, placeholder, meta: { touched, error }}) => {

    return(
      <div className="form-group">
        <label className="control-label col-md-3 col-sm-3 col-xs-12">
          { label }
        </label>
        <div className="col-md-6 col-sm-6 col-xs-12">
          { type=="textarea" &&
            <textarea {...input}
             id={input.name}
             placeholder={placeholder}
             className="form-control col-md-4 col-xs-12"/>
          }
          { type=="input" &&
            <input {...input}
             id={input.name}
             placeholder={placeholder}
             readOnly={readOnly}
             disabled={readOnly}
             className="form-control col-md-3 col-sm-3 col-xs-12"
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
    return dispatch(actionCheckReportId(values.report_id,values.country,'tenant'))
      .then((action) => {
          console.log("Inside asyncValidate, promise resolved");
          let error = action.payload.data;
          if (Object.getOwnPropertyNames(error).length > 0) {
              console.log("Inside asyncValidate", error);
              throw { report_id: "Report ID exists, please try a different Report ID!" , donotUseMiddleWare: true };
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
          this.toInitialise = true;
          this.handleFormSubmit = this.handleFormSubmit.bind(this);
      }
      componentDidUpdate(){
        // To initialise the redux form values
        if (this.toInitialise) {
          // TODO: Initialise will be based on the new structure to be formed
            this.props.initialize(this.props.master_report_details);
            this.toInitialise = false;
        }
      }
      componentDidMount() {
         document.title = "Copy Report Template";
         if (this.toInitialise) {
           // TODO: Initialise will be based on the new structure to be formed
             this.props.initialize(this.props.master_report_details);
             this.toInitialise = false;
         }
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
                            type="input"
                            component={renderField}
                            label="Report Type"
                            readOnly={true}
                            placeholder={this.props.report_type}
                          />
                          <Field
                              name="country"
                              type="input"
                              component={renderField}
                              label="Country"
                              readOnly={true}
                              placeholder={this.props.country}
                            />
                          <Field
                            name="report_id"
                            type="input"
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
                            placeholder="Report Description"
                          />
                          <div className="form-group">
                            <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
                              <button type="button" className="btn btn-primary" onClick={ this.props.handleCancel }>Cancel</button>
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
           let newData= {country:data.country,
                          report_type:data.report_type,
                          ref_report_id: this.props.master_report_details.report_id,
                          target_report_id: data.report_id,
                          report_description: data.report_description,
                          ref_domain:"MASTER",
                          target_domain:"TENANT",
                          target_groupId:this.props.groupId,
                          table_list: this.props.tableList
                        };

            console.log("Data Submitted.....",newData);
            this.props.copyReportTemplate(newData);
            this.props.handleOnSubmit();
        }
}


const mapDispatchToProps = (dispatch) => {
    return {
        copyReportTemplate : (newData) => {
            dispatch(actionCopyReportTemplate(newData));
        },
    };
}

function mapStateToProps(state) {
    console.log("Inside mapStateToProps",state.login_store.domainInfo.country);
    return {
        initialValues:{country:state.login_store.domainInfo.country}
    };
}

const VisibleCopyReportTemplate = connect(
    mapStateToProps,
    mapDispatchToProps
)(CopyReportTemplate);

export default reduxForm({
    form: 'CopyAllTemplate',
    validate,
    asyncValidate,
    asyncBlurFields: ['report_id']
})(VisibleCopyReportTemplate);
