import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import {
  actionLoadTemplateFile
} from '../../actions/CaptureReportTemplateAction';
import {
  actionFetchCountries
} from '../../actions/SharedDataAction';

const renderField = ({ input, label, type, accept, readOnly, selectList, meta: { touched, error }}) => {

  if (type=="file"){delete input.value;}

  return(
    <div className="form-group">
      <label className="control-label col-md-3 col-sm-3 col-xs-12">
        { label }
      </label>
      <div className="col-md-6 col-sm-6 col-xs-12">
        { type=="textarea" &&
          <textarea {...input}
           placeholder={label}
           readOnly={readOnly}
           className="form-control col-md-4 col-xs-12"/>
        }
        {
          type=="select" &&
          <select {...input}
           placeholder={label}
           type={type}
           id={label}
           readOnly={ readOnly }
           className="form-control col-md-3 col-sm-3 col-xs-12">
            {
               ((options) => {
                   let optionList = [];
                   options.map((item, index) => {
                       optionList.push(
                           <option key={index} value={item.value}>
                               { item.value ? item.value + " - " + item.description : item.description }
                           </option>
                       );
                   });
                   return optionList;
               })(selectList)
             }
          </select>
        }
        {
          !["textarea","select"].includes(type) &&
          <input {...input}
           id={input.name}
           placeholder={label}
           type={type}
           readOnly={readOnly}
           accept={accept}
           className={type=="file" ? "" : "form-control col-md-3 col-sm-3 col-xs-12" }
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

// const asyncValidate = (values, dispatch) => {
//   return dispatch(actionFetchTenant(values.report_id,'Y'))
//     .then((action) => {
//         console.log("Inside asyncValidate, promise resolved");
//         let error = action.payload.data;
//         if (Object.getOwnPropertyNames(error).length > 0) {
//             console.log("Inside asyncValidate", error);
//             throw { report_id: "Subscriber ID exists, please try a different ID!" , donotUseMiddleWare: true };
//         }
//      });
// }

const normaliseContactNumber = value => value && value.replace(/[^\d]/g, '')

const validate = (values) => {
    const errors = {};
    console.log("validate starts..",values.fileInput,values.fileInput?values.fileInput.length:null);
    if (!values.report_type) {
        errors.report_type = "Report type can not be empty.";
    }
    if (!values.report_id) {
        errors.report_id = "Report ID can not be empty.";
    }
    if (!values.country) {
        errors.country = "Country can not be empty.";
    }
    if (!values.fileInput || values.fileInput.length==0) {
        errors.fileInput = "Select a valid file to capture Report Template.";
    }
    if (!values.report_description) {
        errors.report_description = "Report description can not be empty.";
    }

    return errors;
}

class CaptureTemplate extends Component {
    constructor(props) {
        super(props);
        this.state={
          isSubmitted: false,
          isOverRide: false,
          isModalOpen: false,
        }
        this.domainInfo = this.props.login_details.domainInfo;
        this.reportFormatList=[ {'value':'', 'description':'Pleaes choose a format'},
                                {'value':'FIXEDFORMAT', 'description':'Fixed Format'},
                                {'value':'TRANSACTION', 'description':'Transactional'},
                                {'value':'DYNAGG', 'description':'Dynamic Aggregation'},
                                {'value':'COMPOSIT', 'description':'Combination Format'}];
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    componentWillMount() {
        // TODO
        this.props.fetchCountries();
    }

    componentWillReceiveProps(nextProps){

      if(!nextProps.captureTemplateMsg.error && this.state.isSubmitted){
          // Successfully captured report template thus reset all fields
          this.props.reset();
          document.getElementById('fileInput').value = null;
          this.setState({isSubmitted:false});
      } else if(nextProps.captureTemplateMsg.error && this.state.isSubmitted){
          this.setState({isSubmitted:false});
      }
    }

    componentDidMount() {
        // document.body.classList.add('subscribe');
        document.title = "RegOpz Dashbord | Capture Report Template";
    }

    render() {
        const { tenant_id, country } = this.domainInfo;
        const { isSubmitted } = this.state;
        const { handleSubmit, asyncValidating, pristine, reset, submitting, countries, message } = this.props;
        let countryList=[{'value':'', 'description':'Choose a country'}]
        countries && countries.map((item,index)=>{
          if(tenant_id !="regopz"){
            // If tenant (other than regopz master manager), only the subscribed country will be available for selection
            if (country==item.country) countryList.push({'value':item.country, 'description':item.country_name});
          } else {
            countryList.push({'value':item.country, 'description':item.country_name});
          }
        })

        return(
          <div className="row form-container">
            <div className="col col-lg-12">
              <div className='x_panel'>
                <div className="x_title">
                  <h2>Capture Report Template <small>Upload Report Template File</small></h2>
                  <div className="clearfix"></div>
                </div>
                <div className="x_content">
                  <p>Supported files are .xlsx .xls </p>
                  <form id="uploadForm" className="form-horizontal form-label-left" onSubmit={ handleSubmit(this.handleFormSubmit) } >
                      <Field
                        name="report_type"
                        type="select"
                        component={renderField}
                        label="Report Type"
                        selectList={this.reportFormatList}
                      />
                      <Field
                          name="country"
                          type="select"
                          component={renderField}
                          label="Country"
                          selectList={countryList}
                        />
                      <Field
                        name="report_id"
                        type="text"
                        component={renderField}
                        label="Report ID"
                        readOnly={asyncValidating}
                      />
                      <Field
                        name="fileInput"
                        type="file"
                        accept=".xlsx, .xls, .xlx"
                        component={renderField}
                        label="Template File"
                        normalize={null}
                      />

                      <Field
                        name="report_description"
                        type="textarea"
                        component={renderField}
                        label="Description"
                      />
                      <div className="form-group">
                        <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
                          <button type="button" className="btn btn-primary" onClick={ this.handleReset } disabled={ pristine || submitting || isSubmitted }>Reset</button>
                          <button type="submit" className="btn btn-success" disabled={ pristine || submitting || isSubmitted }>Submit</button>
                        </div>
                     </div>
                  </form>
                </div>
              </div>
            </div>
            <Modal
              show={this.state.isModalOpen}
              container={this}
              onHide={(event) => {
                  this.setState({isModalOpen:false});
                }}
            >
              <Modal.Header closeButton >
                <h2>Re-capture  <small>document.getElementById('report_id').value</small></h2>
              </Modal.Header>

              <Modal.Body>
                Report currently exists, do you want to override?
              </Modal.Body>
            </Modal>
          </div>
        );
    }

    handleFormSubmit(data) {
        // console.log("inside handleFormSubmit",data,$("#uploadForm")[0],data.fileInput[0]);
        const { reset } = this.props;
        var newData = new FormData($("#uploadForm")[0]);
        newData.append('domain_type', this.domainInfo.tenant_id=='regopz' ? 'master': '')
        newData.append('file', data.fileInput[0]);
        this.setState({isSubmitted:true},
                      this.props.loadTemplate(newData,data.report_type));
    }

    handleReset() {
        // console.log("inside handleFormSubmit",data,$("#uploadForm")[0],data.fileInput[0]);
        const { reset } = this.props;
        reset();
        document.getElementById('fileInput').value = null;
    }

}

function mapStateToProps(state) {
    return {
        message: state.tenant_details.message,
        countries: state.sharedData.countries,
        login_details: state.login_store,
        captureTemplateMsg: state.capture_template,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadTemplate: (formElement,reportType) => {
            dispatch(actionLoadTemplateFile(formElement,reportType));
        },
        fetchCountries: (country) => {
            dispatch(actionFetchCountries(country));
        },
    };
}

const VisibleCaptureTemplate = connect(
    mapStateToProps,
    mapDispatchToProps
)(CaptureTemplate);

export default reduxForm({
    form: 'CaptureTemplate',
    validate,
    // asyncValidate,
    // asyncBlurFields: ['report_id']
})(VisibleCaptureTemplate);
