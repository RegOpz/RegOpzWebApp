import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router';
import { routerContext } from 'react-router';
import Breadcrumbs from 'react-breadcrumbs';
import {BASE_URL} from '../../Constant/constant';
import npro from '../../../bower_components/nprogress/nprogress';
import ModalAlert from '../ModalAlert/ModalAlert';
require('../../../bower_components/nprogress/nprogress.css');
export default class RightPane extends Component {
  constructor(props){
    super(props);
    this.fileInput = null;
    this.uploadForm = null;
    this.state = {
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
              <h2>Drop Report Template File <small>Capture Report Template</small></h2>
              <div className="clearfix"></div>
            </div>
            <div className="x_content">
              <p>Supported files are .xlsx .xlx, .csv, .odt</p>
            <form encType="multipart/form-data" id="uploadForm" ref={(uploadForm) => {this.uploadForm = uploadForm}} onSubmit={this.handleFormSubmit.bind(this)} className="dropzone">
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
                className="form-control"
                placeholder="Country code"
                value={this.state.country}
                 />
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
                className="form-control"
                placeholder="Report Id"
                value={this.state.report_id}
                 />
               <input
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
                className="form-control"
                placeholder="Report Description"
                value={this.state.report_description}
                 />
              <input id="file"
                onChange={
                  ()=>{
                    this.handleFileSelect(this.modalInstance)
                  }
                }
                ref={
                  (fileInput) => {
                    this.fileInput = fileInput
                  }
                }
                type="file"
                className="form-control" />
              <div className="fileUploadIconHolder">
                <i className="fa fa-file-excel-o" aria-hidden="true" onClick={this.handleFileInputClick.bind(this)}></i>
                <div className="clearfix"></div>
                <div className="dz-default dz-message"><span>No File Selected</span></div>
              </div>
            </form>
              <br />
              <br />
              <br />
              <br />
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
  handleFormSubmit(event){
    event.preventDefault();
  }
  handleFileSelect(modalInstance){
    var report_id = this.state.report_id;
    var country = this.state.country;
    var report_description = this.state.report_description;
    npro.start();
    var data = new FormData($("#uploadForm")[0]);
    $.each($('#file')[0].files, function(i, file) {
        data.append('file', file);
    });
    $.ajax({
      type: 'POST',
      crossDomain: true,
      async: true,
      cache: false,
      contentType: false,
      processData: false,
      data:data,
      url: BASE_URL + 'document',
      success: function(response) {
        npro.done();
        hashHistory.push("/dashboard/maintain-report-rules"); //?report_id="+report_id+"&country="+country+"&report_description="+report_description);
        console.log(response);
      },
      error:function(response){
        let modalMsg="";
        npro.done();
        console.log(response);
        modalMsg = (typeof response.responseJSON == 'undefined' ? "Unknown error!No response from API server!": response.responseJSON.msg);
        modalMsg = `${modalMsg} [${response.status}:${response.statusText}]`;
        modalInstance.isDiscardToBeShown = false;
        modalInstance.open(modalMsg);
        //alert(response.responseJSON.msg);
      }
    });
  }
}
