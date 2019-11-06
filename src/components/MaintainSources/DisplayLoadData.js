import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import { Panel, Button } from 'react-bootstrap';
import _ from 'lodash';
import ModalAlert from '../ModalAlert/ModalAlert';
import moment from 'moment';

class DisplayLoadData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reRender: true,
        }

        this.sourceList = this.props.sourceList;

        this.renderSourceList = this.renderSourceList.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleBusinessDateChange = this.handleBusinessDateChange.bind(this);
        this.handleApplyRuleCheckBox = this.handleApplyRuleCheckBox.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps){
      this.sourceList = nextProps.sourceList;
    }

    handleFileChange(feed,event) {
        console.log('Run handleFileChange');
        let file = event.target.files[0];
        let isAlreadyAdded = _.find(this.sourceList,
                                    { selectedFileAttr:
                                        { name: file.name, size: file.size, type: file.type, lastModified: file.lastModified }
                                      }
                                    )
        if(isAlreadyAdded){
          this.modalAlert.isDiscardToBeShown = false;
          this.modalAlert.open(
              <div className="mid_center">
                <h1><small><i className="fa fa-warning amber"></i></small></h1>
                Please note that
                <br/><b className="red">{file.name}</b>
                &nbsp;already selected for source
                &nbsp;<b className="blue">{isAlreadyAdded.source_file_name}</b>
                <br/> Please check!
              </div>
            );
          feed.selectedFile = null;
          feed.selectedFileAttr = null;
          event.target.value = null;
        } else {
          feed.selectedFile = file;
          feed.selectedFileAttr = { name: file.name, size: file.size, type: file.type, lastModified: file.lastModified };
          this.setState({ reRender: true });
        }
    }

    handleBusinessDateChange(feed,date) {

        let isAlreadyAdded = _.find(this.sourceList, { source_id: feed.source_id, businessDate: date })
        if(isAlreadyAdded){
          this.modalAlert.isDiscardToBeShown = false;
          this.modalAlert.open(
              <div className="mid_center">
                <h1><small><i className="fa fa-warning amber"></i></small></h1>
                Please note that souce feed already added for
                <br/><b className="red">{date.format('DD-MMM-YYYY')}</b>
                &nbsp;for source
                &nbsp;<b className="blue">{feed.source_file_name}</b>
                <br/> Please check!
              </div>
            );
        } else {
          feed.businessDate = date;
          this.setState({ reRender: true });
        }

    }

    handleApplyRuleCheckBox(e) {
        feed.applyRules = !feed.applyRules;
        this.setState({ reRender: true });
    }

    handleOnSubmit(event){
      // alert("alert handleOnSubmit")
      event.preventDefault(); // to prevent unnecessary page refresh due to submit form event
      this.props.handleLoadFile(this.sourceList);
    }

    renderSourceList(){
      return(
        <div>
          {
            !this.sourceList.length &&
            <span>Please select required source feed from the list for processing</span>
          }
          {
            this.sourceList.length > 0 &&
            <table className="table table-hover">
              <thead>
                <th>#</th>
                <th>Feed Details</th>
                <th><i className="fa fa-edit"></i></th>
              </thead>
              <tbody>
                {
                  this.sourceList.map((feed,index)=>{
                    return(
                      <tr className="">
                        <td>
                          <b>{index+1}</b>
                        </td>
                        <td>
                          <div>
                            <div className="wrap-2-line ">
                              <i className="fa fa-rss-square dark"  style={{'cursor':'pointer'}}
                                title={"Show Details"}
                                onClick={
                                  ()=>{
                                    this.props.handleShowDetailsClick(feed);
                                    // feed.showAll = !feed.showAll;
                                    // this.setState({reRender: true})
                                  }
                                }></i>
                              &nbsp;{feed.source_file_name}&nbsp;for &nbsp;
                              <DatePicker
                                  dateFormat="DD-MMM-YYYY"
                                  selected={feed.businessDate}
                                  onChange={(date)=>{this.handleBusinessDateChange(feed,date);}}
                                  onChangeRaw={(e) => {e.target.value=null}}
                                  placeholderText="dd-mon-yyyy"
                                  showYearDropdown
                                  showMonthDropdown
                                  required="required"
                                  className="form col-md-6 col-xs-6 datepicker-border-bottom "
                              />
                              <input
                                  type="file"
                                  className={ (feed.selectedFile ? "" : "red")}
                                  required="required"
                                  onChange={(event)=>{this.handleFileChange(feed,event);}}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <a type="button"
                            style={{'cursor':'pointer'}}
                            className="amber"
                            title={"Remove feed"}
                            onClick={
                              ()=>{this.props.handleRemoveFeedClick(index)}
                            }>
                            <i className="fa fa-trash amber"></i>
                          </a>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          }
        </div>
      )
    }
    render() {
        return (
          <div>
            <form onSubmit={this.handleOnSubmit}>
              <div className="x_panel">
                  <div className="x_title">
                      <div>
                          <h2>Selected Sources <small>Details of the Source Feed </small>
                              &nbsp;
                              <span>
                                {
                                  this.sourceList.length > 0 &&
                                  <button type="submit" className="btn btn-xs btn-success">
                                    <i className="fa fa-bolt"></i>&nbsp;Process Feeds
                                  </button>
                                }
                              </span>
                          </h2>
                          <div className="clearfix"></div>
                      </div>
                  </div>
                  <div className="x_content">
                    {
                      this.renderSourceList()
                    }
                  </div>
              </div>
            </form>
            <ModalAlert
              ref={(modalAlert) => {this.modalAlert = modalAlert}}
              onClickOkay={this.handleModalOkayClick}
            />
          </div>
        );
    }
}

export default DisplayLoadData;
