import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Button, Media, Label, Badge } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';

class DefAuditHistory extends Component{
  constructor(props){
    super(props);
    this.state={
      startDate: null,
      endDate: null,
      filterText: null,
      historyReference: this.props.historyReference
    };
    this.linkageData = this.props.data;
    //this.renderChangeHistory = this.renderChangeHistory.bind(this);
  }

  componentWillReceiveProps(nextProps){
      //TODO
      this.linkageData = nextProps.data;
  }

  handleStartDateChange(date) {
    this.setState({ startDate: date });
  }

  handleEndDateChange(date) {
    this.setState({ endDate: date });
  }

  handleFilter(){

      if(typeof this.props.data != 'undefined' && this.props.data.length ){
        let linkageData = this.props.data;
        const { startDate, endDate, filterText } = this.state;
        if (startDate != null) {
            linkageData = linkageData.filter(item => {
                let audit_date = new Date(item.date_of_change);
                let start_date = new Date(startDate)
                return audit_date.getTime() > start_date.getTime();
            });
        }
        if (endDate != null) {
            linkageData = linkageData.filter(item => {
                let audit_date = new Date(item.date_of_change);
                let end_date = new Date(endDate)
                return audit_date.getTime() < end_date.getTime();
            });
        }
        if (filterText != null) {
            let matchText = RegExp(`(${filterText.toString().toLowerCase().replace(/[,+&\:\ ]$/,'').replace(/[,+&\:\ ]/g,'|')})`,'i');
            linkageData = linkageData.filter(element =>
                element.id.toString().match(matchText) ||
                element.change_type.match(matchText) ||
                element.table_name.match(matchText) ||
                element.change_reference.match(matchText) ||
                moment(element.date_of_change).format("DD-MMM-YYYY").match(matchText) ||
                element.maker.match(matchText) ||
                element.maker_comment.match(matchText) ||
                element.status.match(matchText)
            );
        }
        this.linkageData = linkageData;
      }
  }

  render(){
    this.handleFilter();
    return(
          <div className="x_panel">
            <div className="x_title">
              <h2>Change History<small> Time Line </small><small>{this.state.historyReference}</small></h2>
                <ul className="nav navbar-right panel_toolbox">
                  <li>
                    <a className="close-link" onClick={this.props.handleClose}><i className="fa fa-close"></i></a>
                  </li>
                </ul>
              <div className="clearfix"></div>
            </div>
            <div className="x_content">
              <div>
              <div className="row">
                <div className="col col-md-5 col-sm-5 col-xs-12">
                  <div className="input-group">
                    <input
                      className="form-control"
                      placeholder="Enter Filter Text"
                      value={this.state.filterText}
                      onChange={(event) => {
                          this.setState({ filterText: event.target.value });
                      }}
                    />
                    <span className="input-group-addon">
                      <i className="fa fa-filter"></i>
                    </span>
                  </div>
                </div>
                <div className="col col-md-3 col-sm-3 col-xs-12">
                  <div className="calendar">
                      <DatePicker
                        dateFormat="DD-MMM-YYYY"
                        selected={this.state.startDate}
                        onChange={this.handleStartDateChange.bind(this)}
                        isClearable={true}
                        placeholderText="Select start date"
                        className="view_data_date_picker_input form-control"
                    />
                  </div>
                </div>
                <div className="col col-md-3 col-sm-3 col-xs-12">
                  <div className="calendar">
                    <DatePicker
                        dateFormat="DD-MMM-YYYY"
                        selected={this.state.endDate}
                        onChange={this.handleEndDateChange.bind(this)}
                        isClearable={true}
                        placeholderText="Select end date"
                        className="view_data_date_picker_input form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="clearfix"></div>
              </div>
              { this.renderChangeHistory(this.linkageData)}
              </div>
          </div>

    );
  }
  renderChangeHistory(linkageData){
    if(!linkageData || typeof(linkageData) == 'undefined' || linkageData == null || linkageData.length == 0) {
      return(
        <div>
          <h4>No audit change report found!</h4>
        </div>
      )
    }
    else {
      return(
        <div className="dashboard-widget-content">
          <ul className="list-unstyled timeline widget">
          {
            linkageData.map((item,index) => (
                <li key={index}>
                  <div className="block">
                    <div className="block_content">
                      <h2 className="title"></h2>
                        <Media>
                          <Media.Left>
                            <h3>{moment(item.date_of_change?item.date_of_change:"20170624T203000").format('DD')}</h3>
                            <h6>{moment(item.date_of_change?item.date_of_change:"20170624").format('MMM')},
                            <small>{moment(item.date_of_change?item.date_of_change:"20170624").format('YYYY')}</small></h6>
                          </Media.Left>
                          <Media.Body>
                            <Media.Heading>Buisness Rule Change for id: {item.id}
                              <small>{item.change_reference}</small>
                            </Media.Heading>
                            <h6>
                              <Badge>{item.change_type}</Badge> by {item.maker} on {moment(item.date_of_change).format('ll')} {moment(item.date_of_change).format('LTS')}
                            </h6>
                            <i className="fa fa-comments-o"></i>
                            <p className="preserve-text">{item.maker_comment}</p>
                              <div><h5>Change Summary</h5>
                                  {
                                    ((item)=>{
                                      if (item.change_type=="UPDATE"){
                                          //console.log("Update Info........",item.update_info);
                                          const update_list=item.update_info.map((uitem,uindex)=>{
                                              //console.log("Uitem.....",uitem);
                                              return (
                                                     <tr key={uindex}>
                                                        <th scope="row">{uindex + 1}</th>
                                                        <td><h6><Label bsStyle="warning">{uitem.field_name}</Label></h6></td>
                                                        <td>{uitem.new_val}</td>
                                                        <td>{uitem.old_val}</td>
                                                     </tr>
                                                   );
                                          });
                                          return(
                                            <table className="table table-hover table-content-wrap">
                                              <thead>
                                                <tr>
                                                  <th>#</th>
                                                  <th>Column</th>
                                                  <th>New Value</th>
                                                  <th>Old Value</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {update_list}
                                              </tbody>
                                            </table>
                                          );
                                      } else {
                                        return (<table className="table table-hover table-content-wrap">
                                                  <thead>
                                                    <tr>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                      <tr><td>This is a {item.change_type} request</td></tr>
                                                  </tbody>
                                                </table>
                                            )
                                      }
                                  })(item)
                              }
                              </div>
                              <Media>
                                <Media.Left>
                                  {
                                    ((status)=>{
                                      if(status=="PENDING"){
                                        return(<Label bsStyle="primary">{status}</Label>)
                                      } else if (status=="REJECTED"){
                                        return(<Label bsStyle="warning">{status}</Label>)
                                      } else if(status=="APPROVED"){
                                        return(<Label bsStyle="success">{status}</Label>)
                                      } else {
                                        return(<Label>{status}</Label>)
                                      }
                                    }
                                  )(item.status)}
                                </Media.Left>
                                <Media.Body>
                                  <Media.Heading>Verification details</Media.Heading>
                                    {
                                      ((status)=>{
                                        if(status!="PENDING"){
                                          return(
                                            <h6>
                                              by {item.checker} on {moment(item.date_of_checking).format('ll')} {moment(item.date_of_checking).format('LTS')}
                                            </h6>
                                          )
                                        }
                                      }
                                    )(item.status)}
                                  <i className="fa fa-comments"></i>
                                  <p className="preserve-text">{item.checker_comment}</p>
                                </Media.Body>
                              </Media>
                          </Media.Body>
                        </Media>
                      </div>
                  </div>
                </li>
              )
            )
          }
        </ul>
        </div>
      )
    }
  }

}

export default DefAuditHistory;
