import React,{Component} from 'react';
import {dispatch} from 'redux';
import moment from 'moment';
import {connect} from 'react-redux';
import {Media, Label, Badge, Modal, Button} from 'react-bootstrap';
import {actionFetchRecordDetail} from '../../actions/DefChangeAction';

class DefChangeDetails extends Component{
  constructor(props){
    super(props);
    this.item=this.props.changeItem;
    this.actionList = this.props.actionList;
    this.state={comment:null,
                commentNoOfCharacter:0,
                isModalOpen:false
              };
    this.fetchFlag=true;
    this.groupChangeList = this.groupChangeList.bind(this);
    this.businessRulesList = this.businessRulesList.bind(this);
    this.reportRulesList = this.reportRulesList.bind(this);
    this.reportTemplatesList = this.reportTemplatesList.bind(this);
    this.rolesList = this.rolesList.bind(this);
    this.permissionsList = this.permissionsList.bind(this);
    }

  componentWillReceiveProps(nextProps){
    this.item=nextProps.changeItem;
    this.actionList=nextProps.actionList;
    // if (this.fetchFlag){
    //   if(this.item){
    //     this.props.fetchRecordDetail(this.item.table_name,this.item.id);
    //     }
    // }
  }

  // componentWillUpdate(){
  //   if (this.fetchFlag){
  //     if(this.item){
  //       this.props.fetchRecordDetail(this.item.table_name,this.item.id);
  //       }
  //   }
  //
  // }

  componentDidUpdate(){
    if(this.item){
      //this.renderDefChangeDetails(this.props.record_detail,this.item);
      this.fetchFlag=!this.fetchFlag;
    }
  }

  groupChangeList(changeItem){
    if (this.item.group_tables.match(RegExp(`business_rules`))){
      return(this.businessRulesList(changeItem));
    }
    if (this.item.group_tables.match(RegExp(`report_def`))){
      return(this.reportTemplatesList(changeItem));
    }
    if (this.item.group_tables.match(RegExp(`report_calc_def|report_comp_agg_def`))){
      return(this.reportRulesList(changeItem));
    }
    if (this.item.group_tables.match(RegExp(`permissions`))){
      return(this.permissionsList(changeItem));
    }
    if (this.item.group_tables.match(RegExp(`role`))){
      return(this.rolesList(changeItem));
    }

  }

  businessRulesList(changeItem) {
    return(
      <div>
        <div className="left">
          <i className="fa fa-tags"></i>
          <h6>
            {moment.utc(changeItem.date_of_change).format('DD')}
            <br/>
            <small>{moment.utc(changeItem.date_of_change).format('MMM')}</small>
          </h6>
        </div>
        <div className="right">
          <h3>
            Business rule changes<small>{changeItem.maker}</small>
          </h3>
          <p>
            {changeItem.change_type + " " + changeItem.change_reference}
            <br></br>
            <i className="fa fa-comments-o"></i>
            <span className="preserve-text">&nbsp;{changeItem.maker_comment}</span>
            <br></br>
            {
              changeItem.change_type=='UPDATE' &&
              <table className="table table-hover">
                <thead>
                  <th>#</th>
                  <th>Attribute Name</th>
                  <th>Old Value</th>
                  <th>New Value</th>
                </thead>
                <tbody>
                {
                  changeItem.update_info.map((uitem,uindex)=>{
                    return(
                      <tr key={uindex}>
                        <td><strong>{uindex+1}</strong></td>
                        <td>
                          <span><strong className="amber"><i className="fa fa-leaf"></i>{ " " + uitem.field_name + " "}&nbsp;</strong></span>
                        </td>
                        <td>
                          <span className="truncate-text"><i className="fa fa-circle-o"></i>{" " + uitem.old_val + " "}&nbsp;</span>
                        </td>
                        <td>
                          <span className="truncate-text"><i className="fa fa-circle"></i>{ " " + uitem.new_val + " "}&nbsp;</span>
                        </td>
                      </tr>
                    );
                  })
                }
                </tbody>
              </table>
            }
          </p>
          <h3>
            <small>{moment.utc(changeItem.date_of_change).format('hh:mm:ss a')}</small>
          </h3>
        </div>
      </div>
    );
  }

  reportRulesList(changeItem) {
    return(
      <div>
        <div className="left">
          <i className="fa fa-puzzle-piece"></i>
          <h6>
            {moment.utc(changeItem.date_of_change).format('DD')}
            <br/>
            <small>{moment.utc(changeItem.date_of_change).format('MMM')}</small>
          </h6>
        </div>
        <div className="right">
          <h3>
            Report rule & logic changes<small>{changeItem.maker}</small>
          </h3>
          <p>
            {changeItem.change_type + " " + changeItem.change_reference}
            <br></br>
            <i className="fa fa-comments-o"></i>
            <span className="preserve-text">&nbsp;{changeItem.maker_comment}</span>
            <br></br>
            {
              changeItem.change_type=='UPDATE' &&
              <table className="table table-hover">
                <thead>
                  <th>#</th>
                  <th>Attribute Name</th>
                  <th>Old Value</th>
                  <th>New Value</th>
                </thead>
                <tbody>
                {
                  changeItem.update_info.map((uitem,uindex)=>{
                    return(
                      <tr key={uindex}>
                        <td><strong>{uindex+1}</strong></td>
                        <td>
                          <span><strong className="amber"><i className="fa fa-leaf"></i>{ " " + uitem.field_name + " "}&nbsp;</strong></span>
                        </td>
                        <td>
                          <span className="truncate-text"><i className="fa fa-circle-o"></i>{" " + uitem.old_val + " "}&nbsp;</span>
                        </td>
                        <td>
                          <span className="truncate-text"><i className="fa fa-circle"></i>{ " " + uitem.new_val + " "}&nbsp;</span>
                        </td>
                      </tr>
                    );
                  })
                }
                </tbody>
              </table>
            }
          </p>
          <h3>
            <small>{moment.utc(changeItem.date_of_change).format('hh:mm:ss a')}</small>
          </h3>
        </div>
      </div>
    );
  }

  reportTemplatesList(changeItem) {
    return(
      <div>
        <div className="left">
          <i className="fa fa-file-text"></i>
          <h6>
            {moment.utc(changeItem.date_of_change).format('DD')}
            <br/>
            <small>{moment.utc(changeItem.date_of_change).format('MMM')}</small>
          </h6>
        </div>
        <div className="right">
          <h3>
            Report template changes<small>{changeItem.maker}</small>
          </h3>
          <p>
            {changeItem.change_type + " " + changeItem.change_reference}
            <br></br>
            <i className="fa fa-comments-o"></i>
            <span className="preserve-text">&nbsp;{changeItem.maker_comment}</span>
            <br></br>
            {
              changeItem.change_type=='UPDATE' &&
              <table className="table table-hover">
                <thead>
                  <th>#</th>
                  <th>Attribute Name</th>
                  <th>Old Value</th>
                  <th>New Value</th>
                </thead>
                <tbody>
                {
                  changeItem.update_info.map((uitem,uindex)=>{
                    return(
                      <tr key={uindex}>
                        <td><strong>{uindex+1}</strong></td>
                        <td>
                          <span><strong className="amber"><i className="fa fa-leaf"></i>{ " " + uitem.field_name + " "}&nbsp;</strong></span>
                        </td>
                        <td>
                          <span className="truncate-text"><i className="fa fa-circle-o"></i>{" " + uitem.old_val + " "}&nbsp;</span>
                        </td>
                        <td>
                          <span className="truncate-text"><i className="fa fa-circle"></i>{ " " + uitem.new_val + " "}&nbsp;</span>
                        </td>
                      </tr>
                    );
                  })
                }
                </tbody>
              </table>
            }
          </p>
          <h3>
            <small>{moment.utc(changeItem.date_of_change).format('hh:mm:ss a')}</small>
          </h3>
        </div>
      </div>
    );
  }

  permissionsList(changeItem) {
    return(
      <div>
        <div className="left">
          <i className="fa fa-shield"></i>
          <h6>
            {moment.utc(changeItem.date_of_change).format('DD')}
            <br/>
            <small>{moment.utc(changeItem.date_of_change).format('MMM')}</small>
          </h6>
        </div>
        <div className="right">
          <h3>
            Role Permissions changes<small>{changeItem.maker}</small>
          </h3>
          <p>
            {(changeItem.change_type=='INSERT'? 'Granted permission ': 'Revoked permission' ) + " " + changeItem.change_reference}
            <br></br>
            <i className="fa fa-comments-o"></i>
            <span className="preserve-text">&nbsp;{changeItem.maker_comment}</span>
          </p>
          <h3>
            <small>{moment.utc(changeItem.date_of_change).format('hh:mm:ss a')}</small>
          </h3>
        </div>
      </div>
    );
  }

  rolesList(changeItem) {
    return(
      <div>
        <div className="left">
          <i className="fa fa-users"></i>
          <h6>
            {moment.utc(changeItem.date_of_change).format('DD')}
            <br/>
            <small>{moment.utc(changeItem.date_of_change).format('MMM')}</small>
          </h6>
        </div>
        <div className="right">
          <h3>
            Role {changeItem.change_type=='INSERT' ? 'created' : ''} {changeItem.change_type=='DELETE' ? 'deleted' : ''}<small>{changeItem.maker}</small>
          </h3>
          <p>
            {changeItem.change_type + " " + changeItem.change_reference}
            <br></br>
            <i className="fa fa-comments-o"></i>
            <span className="preserve-text">&nbsp;{changeItem.maker_comment}</span>
          </p>
          <h3>
            <small>{moment.utc(changeItem.date_of_change).format('hh:mm:ss a')}</small>
          </h3>
        </div>
      </div>
    );
  }

  render(){
    console.log("Inside render defchangedetails....", this.item, this.props.changeItem);
    if(this.item==null){
      return(
        <h5>
          <i className="fa fa-hand-o-left"></i> Please select a change request item to view details.
        </h5>
      );
    }

    return(
      <div className="form-horizontal form-label-left form-def-change-detail">
        <ul className="nav navbar-right panel_toolbox">
          <li>
            <a className="close-link" onClick={this.props.handleClose} title="Close"><i className="fa fa-close"></i></a>
          </li>
        </ul>
        <button className="btn btn-link"
          onClick={this.props.handleClose}
          title="Back to list">
          <i className="fa fa-arrow-left"></i>
        </button>
        {
          ((viewOnly,maker)=>{
            if(!viewOnly){
              return(
                <div>
                  <div className="form-group">
                    <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="comment">
                      {maker=='self' ? 'Regression Comment' : 'Reviwer Comment'} <span className="required">*</span></label>
                    <div className="col-md-9 col-sm-9 col-xs-12">
                      <textArea
                          type="text"
                          value={this.state.comment}
                          minLength="20"
                          maxLength="1000"
                          required="required"
                          className="form-control col-md-9 col-sm-12 col-xs-12"
                          onChange={(event)=>{
                                       this.setState({comment:event.target.value,commentNoOfCharacter:event.target.value.length});
                                     }
                                   }
                        />
                      <Badge>{this.state.commentNoOfCharacter}</Badge>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
                      {
                        maker=='self' &&
                        <div>
                          <button type="button" className="btn btn-sm btn-warning" onClick={this.handleRegress.bind(this)}> Regress</button>
                        </div>
                      }
                      {
                        maker!='self' &&
                        <div>
                          <button type="button" className="btn btn-sm btn-warning" onClick={this.handleReject.bind(this)}> Reject</button>
                          <button type="button" className="btn btn-sm btn-success" onClick={this.handleApprove.bind(this)}>Approve</button>
                        </div>
                      }
                    </div>
                 </div>
                 <div className="clearfix" />
                 <div className="ln_solid" />
                </div>
              );
            } else {
              return(
                  <div>
                    <div className="x_panel">
                      <div className="x_content">
                        Currently selected review items
                        {
                          this.actionList.approve.length > 0  &&
                          <span>&nbsp;
                            <span className="badge bg-green">
                              <i className="fa fa-check-square-o">&nbsp;</i>{this.actionList.approve.length}
                            </span>&nbsp;
                          </span>
                        }
                        {
                          this.actionList.reject.length > 0 &&
                          <span>&nbsp;
                            <span className="badge bg-orange">
                              <i className="fa fa-ban">&nbsp;</i>{this.actionList.reject.length}
                            </span>&nbsp;
                          </span>
                        }
                        {
                          this.actionList.regress.length > 0 &&
                          <span>&nbsp;
                            <span className="badge bg-orange">
                              <i className="fa fa-eye-slash">&nbsp;</i>{this.actionList.regress.length}
                              </span>&nbsp;
                          </span>
                        }
                        <div>
                        {
                          _.find(this.actionList.approve,this.item.changeItem) &&
                          <h5>Selected change belongs to current review approval list</h5>
                        }
                        {
                          _.find(this.actionList.reject,this.item.changeItem) &&
                          <h5>Selected change belongs to current review rejection list</h5>
                        }
                        {
                          _.find(this.actionList.regress,this.item.changeItem) &&
                          <h5>Selected change belongs to current review regress list</h5>
                        }
                        </div>
                      </div>
                    </div>
                  </div>
                );
            }
          })(this.props.viewOnly,this.props.maker )
        }
        <div>
          <div>
            <div className="mail_list">
              {this.groupChangeList(this.item.changeItem)}
            </div>
          </div>
          <Modal
             show={this.state.isModalOpen}
             container={this}
             onHide={(event) => {
                 this.setState({isModalOpen:false});
               }}
          >
             <Modal.Header closeButton>
               <Modal.Title>Review Comment</Modal.Title>
             </Modal.Header>

             <Modal.Body>
               Please enter review comment at least 20 character long.
             </Modal.Body>

             <Modal.Footer>
               <Button onClick={(event) => {
                   this.setState({isModalOpen:false})
                 }}>Ok</Button>
             </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }

  // renderDefChangeDetails(displayItem,auditItem){
  //   console.log("Inside renderDefChangeDetails........");
  //   // const divElement=document.getElementById("def_change_detail");
  //   // $(divElement).empty();
  //   if (typeof displayItem != 'undefined'){
  //   let key = Object.keys(displayItem);
  //
  //   // for (let key of Object.keys(displayItem)){
  //       // let nodeFormGroup=document.createElement("div");
  //       // nodeFormGroup.className="form-group";
  //       //
  //       // let nodeLabel=document.createElement("label");
  //       // nodeLabel.className="control-label col-md-3 col-sm-3 col-xs-12";
  //       // nodeFormGroup.appendChild(nodeLabel);
  //       //
  //       // let element=document.createTextNode(key);
  //       // nodeLabel.appendChild(element);
  //       //
  //       // let nodeInputDiv=document.createElement("div");
  //       // nodeInputDiv.className="col-md-6 col-sm-6 col-xs-12";
  //       // nodeFormGroup.appendChild(nodeInputDiv);
  //       //
  //       // //nodeInput.className="col-md-5 col-sm-5 col-xs-12";
  //       // let nodeInput=document.createElement("input");
  //       // nodeInput.readOnly="true";
  //       // nodeInput.value=displayItem[key];
  //       // nodeInputDiv.appendChild(nodeInput);
  //       // //element=document.createTextNode(displayItem[key]);
  //       // //nodeFormGroup.appendChild(element);
  //       // divElement.appendChild(nodeFormGroup);
  //   // }
  //   return(
  //     <div className="dashboard-widget-content">
  //       <h3>Record Details</h3>
  //       <ul className="list-unstyled timeline widget">
  //         <table className="table table-hover">
  //           <thead>
  //             <tr>
  //               <th>#</th>
  //               <th>Column Name</th>
  //               <th>Reference Value</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //           {
  //             key.map(function(item,index){
  //               console.log("inside record media body",item,displayItem[item]);
  //               return(
  //                       <tr>
  //                         <th scope="row">{index + 1}</th>
  //                           {((auditItem,column,presentValue)=>{
  //                               let update_list=[];
  //                               if (auditItem.change_type=="UPDATE"){
  //                                   console.log("audit item Update Info........",auditItem.update_info);
  //
  //                                   auditItem.update_info.map((uitem,uindex)=>{
  //                                       console.log("audit item Uitem.....",uitem);
  //                                       if(uitem.field_name==column){
  //                                         update_list.push(<td><Label bsStyle="warning">{column}</Label></td>);
  //                                         update_list.push(
  //                                                   <td>
  //                                                     <p>
  //                                                       <small>
  //                                                         <i className="fa fa-circle-o"></i>&nbsp;<i>  {uitem.old_val}</i>
  //                                                         <br></br>
  //                                                         <i className="fa fa-circle"></i>&nbsp;<i>  {uitem.new_val}</i>
  //                                                       </small>
  //                                                     </p>
  //                                                   </td>
  //                                               );
  //                                       }
  //                                   });
  //                                   console.log("inside update details",update_list)
  //                                   //return update_list.length >0 ? update_list : presentValue;
  //                                   if (update_list.length==0){
  //                                     update_list.push(<td><Label bsStyle="primary">{column}</Label></td>);
  //                                     update_list.push(
  //                                         <td>
  //                                           <p>{presentValue}</p>
  //                                         </td>
  //                                       );
  //                                   }
  //                               }
  //                               else {
  //                                 update_list.push(<td><Label bsStyle="primary">{column}</Label></td>);
  //                                 update_list.push(
  //                                     <td>
  //                                       <p>{presentValue}</p>
  //                                     </td>
  //                                   );
  //                               }
  //                               return update_list;
  //                           })(auditItem,item,displayItem[item])}
  //                     </tr>
  //               )
  //             })
  //           }
  //           </tbody>
  //         </table>
  //       </ul>
  //     </div>
  //   )
  // }
  // else {
  //   return(<div></div>)
  // }
  // }

  handleReject(){
    if(this.state.comment != null && this.state.comment.length > 20){
      this.item.status="REJECTED";
      this.item.checker=this.props.login_details.user;
      this.item.checker_comment=this.state.comment;
      this.props.onReject(this.item);
      this.setState({comment:null});
      this.setState({commentNoOfCharacter:0});
    } else{
      this.setState({isModalOpen:true});
    }

  }

  handleApprove(){
    if(this.state.comment != null && this.state.comment.length > 20){
      this.item.status="APPROVED";
      this.item.checker=this.props.login_details.user;
      this.item.checker_comment=this.state.comment;
      this.props.onApprove(this.item);
      this.setState({comment:null});
      this.setState({commentNoOfCharacter:0});
    } else{
      this.setState({isModalOpen:true});
    }
  }

  handleRegress(){
    console.log("handleRegress........",this.props.login_details);
    if(this.state.comment != null && this.state.comment.length > 20){
      this.item.status="REGRESSED";
      this.item.checker=this.props.login_details.user;
      this.item.checker_comment=this.state.comment;
      this.props.onRegress(this.item);
      this.setState({comment:null});
      this.setState({commentNoOfCharacter:0});
    } else{
      this.setState({isModalOpen:true});
    }

  }

}

const mapDispatchToProps=(dispatch)=>{
  return{
    fetchRecordDetail:(table_name,id)=>{
      dispatch(actionFetchRecordDetail(table_name,id));
    }
  };
}

function mapStateToProps(state){
  return{
    record_detail:state.def_change_store.record_detail,
    login_details:state.login_store
  };
}

const VisibleDefChangeDetails=connect(mapStateToProps,mapDispatchToProps)(DefChangeDetails);
export default VisibleDefChangeDetails;
