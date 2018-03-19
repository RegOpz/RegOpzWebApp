import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router';
import { routerContext } from 'react-router';
import Breadcrumbs from 'react-breadcrumbs';
import { connect } from 'react-redux';
import { actionLoadTemplateFile } from '../../actions/CaptureReportTemplateAction';
import {BASE_URL} from '../../Constant/constant';
import npro from '../../../bower_components/nprogress/nprogress';
import ModalAlert from '../ModalAlert/ModalAlert';
require('../../../bower_components/nprogress/nprogress.css');
class CaptureTemplate extends Component {
  constructor(props){
    super(props);
    this.fileInput = null;
    this.uploadForm = null;
    this.state = {
      report_type: "",
      report_id:"",
      country:"",
      report_description:"",
    };
  }


  render(){
    return(
      <div className="row form-container">
        <div className="col-md-12 col-sm-12 col-xs-12">
          <div className="x_panel">
            <div className="x_title">
              <h2>Capture Report Template <small>Upload Report Template File</small></h2>
              <div className="clearfix"></div>
            </div>
            <div className="x_content">
              <p>Supported files are .xlsx .xls </p>
              <form encType="multipart/form-data"
                  id="uploadForm"
                  ref={(uploadForm) => {this.uploadForm = uploadForm}}
                  onSubmit={this.handleFormSubmit.bind(this)}
                  className="form-horizontal form-label-left">
                  <div className="form-group">
                      <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Report Type <span className="required">*</span> </label>
                      <div className="col-md-6 col-sm-6 col-xs-12">
                        <select
                          name="report_type"
                          value = {this.state.report_type}
                          className="form-control col-md-7 col-xs-12"
                          required="required"
                          onChange={
                            (event) => {
                              let report_type = event.target.value;
                              this.setState({report_type: report_type});
                            }
                          }
                        >
                          <option value="">Choose option</option>
                          <option value="FIXEDFORMAT">Fixed Format</option>
                          <option value="TRANSACTION">Transactional</option>
                          <option value="DYNAGG">Dynamic Aggregation</option>
                          <option value="COMPOSIT">Composit</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Country <span className="required">*</span> </label>
                      <div className="col-md-6 col-sm-6 col-xs-12">

                          <input
                            type="text"
                            name="country"
                            maxLength="2"
                            required="required"
                            onChange={
                              (event) => {
                                this.setState( {
                                  country:event.target.value.toLocaleUpperCase()
                                });
                              }
                            }
                            className="form-control col-md-7 col-xs-12"
                            placeholder="Country code"
                            value={this.state.country}
                             />
                         </div>
                    </div>

                    <div className="form-group">
                        <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Report Id <span className="required">*</span></label>
                        <div className="col-md-6 col-sm-6 col-xs-12">

                          <input
                           type="text"
                           name="report_id"
                           maxLength="32"
                           required="required"
                           onChange={
                             (event) => {
                               this.setState( {
                                 report_id:event.target.value
                               });
                             }
                           }
                           className="form-control col-md-7 col-xs-12"
                           placeholder="Report Id"
                           value={this.state.report_id}
                            />
                           </div>
                      </div>

                      <div className="form-group">
                          <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Report Description <span className="required">*</span></label>
                          <div className="col-md-6 col-sm-6 col-xs-12">

                            <textarea
                             type="text"
                             name="report_description"
                             maxLength="1000"
                             onChange={
                               (event) => {
                                 this.setState( {
                                   report_description:event.target.value
                                 });
                               }
                             }
                             className="form-control col-md-7 col-xs-12"
                             placeholder="Report Description"
                             value={this.state.report_description}
                             required="required"
                              />
                             </div>
                        </div>

                        <div className="form-group">
                            <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Template File <span className="required">*</span></label>
                            <div className="col-md-6 col-sm-6 col-xs-12">

                              <input id="file"
                                ref={
                                  (fileInput) => {
                                    this.fileInput = fileInput
                                  }
                                }
                                required="required"
                                type="file"
                                accept=".xlsx, .xls, .xlx"
                                className="col-md-7 col-xs-12" />
                               </div>
                          </div>

                          <div className="form-group">
                              <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
                                  <button type="submit" className="btn btn-success">Submit</button>
                                  <button type="button" className="btn btn-primary" onClick={this.handleCancel}> Cancel</button>
                              </div>
                          </div>
                    </form>

            </div>
          </div>
        </div>
        <ModalAlert
          onClickOkay={
            () => {

            }
          }
          onClickDiscard={
            () => {

            }
          }
          ref={
            (modal) => {
              this.modalInstance = modal
            }
          }
        />
      </div>
    )
  }
  componentDidMount(){
    document.title = "RegOpz Dashboard | Capture Report Template ";
  }
  handleFileInputClick(event){
    this.fileInput.value = null;
    this.fileInput.click();
  }
  resetForm(){
    this.setState({report_type: "",report_id:"",country:"",report_description:""});
    document.getElementById("file").value = "";

  }
  handleFormSubmit(event){
    this.modalInstance.open("Template file has been submitted.")
    event.preventDefault();
    this.handleFileSelect();
    this.resetForm();
  }

  handleCancel(){
    hashHistory.push('/dashboard');
  }
  handleFileSelect(){
    var report_type = this.state.report_type;
    var report_id = this.state.report_id;
    var country = this.state.country;
    var report_description = this.state.report_description;
    var data = new FormData($("#uploadForm")[0]);
    $.each($('#file')[0].files, function(i, file) {
        data.append('file', file);
    });
   this.props.loadTemplate(data,report_type);
  }
}

function mapStateToProps(state){
  return {
      captureTemplateMsg: state.capture_template
  };
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadTemplate: (formElement,reportType) => {
            dispatch(actionLoadTemplateFile(formElement,reportType));
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(CaptureTemplate);
