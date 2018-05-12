import React,{Component} from 'react';
import {dispatch} from 'redux';
import moment from 'moment';
import {connect} from 'react-redux';
import _ from 'lodash';
import {Media, Label, Badge, Modal, Button} from 'react-bootstrap';
import {actionFetchRecordDetail} from '../../actions/DefChangeAction';

class DefChangePane extends Component{
  constructor(props){
    super(props);
    this.item=this.props.item;
    this.state={comment:null,
                commentNoOfCharacter:0,
                isModalOpen:false,
                actionType:null
              };
    this.fetchFlag=true;
    this.actionList=this.props.actionList ? this.props.actionList : {approve:[],reject:[], regress:[]};
    this.groupChangeList = this.groupChangeList.bind(this);
    this.businessRulesList = this.businessRulesList.bind(this);
    this.reportRulesList = this.reportRulesList.bind(this);
    this.reportTemplatesList = this.reportTemplatesList.bind(this);
    this.rolesList = this.rolesList.bind(this);
    this.permissionsList = this.permissionsList.bind(this);
    this.actionButtons = this.actionButtons.bind(this);
    this.handleAddRemoveItem = this.handleAddRemoveItem.bind(this);
    this.checkDisabled= this.checkDisabled.bind(this);
    }

  componentWillReceiveProps(nextProps){
    if(this.item!=nextProps.item){
      this.item=nextProps.item;
      this.actionList=nextProps.actionList ? nextProps.actionList : {approve:[],reject:[], regress:[]};
    }
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

  actionButtons(changeItem){
    return(
      <span>
        {
          this.props.maker!='self' &&
          <button className="btn btn-link btn-xs"
            disabled={this.checkDisabled("approve",changeItem)}
            onClick={(event)=>{
              this.handleAddRemoveItem("approve",changeItem);
              console.log("actionButtons....",this.actionList);
              event.stopPropagation();
            }}
            title="Add to approval list">
            <i className="fa fa-check-square-o green"></i>
              {
                _.find(this.actionList.approve,changeItem) &&
                <span className="green">Added to approval list</span>
              }
          </button>
        }
        {
          this.props.maker!='self' &&
          <button className="btn btn-link btn-xs"
            disabled={this.checkDisabled("reject",changeItem)}
            onClick={(event)=>{
              this.handleAddRemoveItem("reject",changeItem);
              console.log("actionButtons....",this.actionList);
              event.stopPropagation();
            }}
            title="Add to rejection list">
            <i className="fa fa-ban amber"></i>
              {
                _.find(this.actionList.reject,changeItem) &&
                <span className="amber">Added to rejection list</span>
              }
          </button>
        }
        {
          this.props.maker=='self' &&
          <button className="btn btn-link btn-xs"
            disabled={this.checkDisabled("regress",changeItem)}
            onClick={(event)=>{
              this.handleAddRemoveItem("regress",changeItem);
              console.log("actionButtons....",this.actionList);
              event.stopPropagation();
            }}
            title="Add to regress list">
            <i className="fa fa-eye-slash amber"></i>
              {
                _.find(this.actionList.regress,changeItem) &&
                <span className="amber">Added to regress list</span>
              }
          </button>
        }
        <button className="btn btn-link btn-xs"
          disabled={this.checkDisabled("remove",changeItem)}
          onClick={(event)=>{
            this.handleAddRemoveItem("remove",changeItem);
            console.log("actionButtons....",this.actionList);
            event.stopPropagation();
          }}
          title="Remove from review list">
          <i className="fa fa-undo"></i>
        </button>
      </span>
    )
  }

  handleAddRemoveItem(actionType,changeItem){
    // TODO
    switch(actionType){
      case "approve":
        if (!_.find(this.actionList.approve,changeItem) && !_.find(this.actionList.reject,changeItem)){
          this.actionList.approve.push(changeItem);
          this.setState({actionType: "approve"});
        }
        break;
      case "reject":
        if (!_.find(this.actionList.approve,changeItem) && !_.find(this.actionList.reject,changeItem)) {
          this.actionList.reject.push(changeItem);
          this.setState({actionType: "reject"});
        }
        break;
      case "regress":
        if(!_.find(this.actionList.regress,changeItem)) {
          this.actionList.regress.push(changeItem);
          this.setState({actionType: "regress"});
        }
        break;
      case "remove":
        let index = null;
        if(this.props.maker=='self'){
          index = _.indexOf(this.actionList.regress,changeItem);
          if (index!=-1){
            this.actionList.regress.splice(index,1);
          }
        } else {
          index = _.indexOf(this.actionList.approve,changeItem);
          if (index!=-1){
            this.actionList.approve.splice(index,1);
          } else {
            index = _.indexOf(this.actionList.reject,changeItem);
            if(index!=-1){
              this.actionList.reject.splice(index,1);
            }
          }
        }
        this.setState({actionType: "remove"});
        break;
    }

  }

  checkDisabled(buttonType,changeItem){
    switch(buttonType){
      case "remove":
        return !(_.find(this.actionList.approve,changeItem) || _.find(this.actionList.reject,changeItem) || _.find(this.actionList.regress,changeItem));
        break;
      default:
        return (_.find(this.actionList.approve,changeItem) || _.find(this.actionList.reject,changeItem) || _.find(this.actionList.regress,changeItem))
        break;
    }
  }

  businessRulesList(changeItem) {
    return(
      <div title={changeItem.maker_comment.substring(0,300)}>
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
            Business rule changes &nbsp;
            {this.actionButtons(changeItem)}
            <small>{changeItem.maker}&nbsp;
            </small>
          </h3>
          <p>
            {changeItem.change_type + " " + changeItem.change_reference}
            <br></br>
            <i className="fa fa-comments-o"></i>
            <span className="truncate-text">&nbsp;{changeItem.maker_comment}</span>
            <br></br>
            {
              changeItem.change_type=='UPDATE' &&
              changeItem.update_info.map((uitem,uindex)=>{
                return(
                  <span key={this.item.group_id + uindex}>
                    <small>
                      <span><strong className="amber"><i className="fa fa-leaf"></i>{ " " + uitem.field_name + " "}&nbsp;</strong></span>
                      <span className="truncate-text"><i className="fa fa-circle-o"></i>{" " + uitem.old_val + " "}&nbsp;</span>
                      <span className="truncate-text"><i className="fa fa-circle"></i>{ " " + uitem.new_val + " "}&nbsp;</span>
                      <span className="truncate-text"><i className="fa fa-angle-double-right"></i>&nbsp;</span>
                    </small>
                  </span>
                );
              })
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
      <div title={changeItem.maker_comment.substring(0,300)}>
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
            Report rule & logic changes &nbsp;
            {this.actionButtons(changeItem)}
            <small>{changeItem.maker}</small>
          </h3>
          <p>
            {changeItem.change_type + " " + changeItem.change_reference}
            <br></br>
            <i className="fa fa-comments-o"></i>
            <span className="truncate-text">&nbsp;{changeItem.maker_comment}</span>
            <br></br>
            {
              changeItem.change_type=='UPDATE' &&
              changeItem.update_info.map((uitem,uindex)=>{
                return(
                  <span key={this.item.group_id + uindex}>
                    <small>
                      <span><strong className="amber"><i className="fa fa-leaf"></i>{ " " + uitem.field_name + " "}&nbsp;</strong></span>
                      <span className="truncate-text"><i className="fa fa-circle-o"></i>{" " + uitem.old_val + " "}&nbsp;</span>
                      <span className="truncate-text"><i className="fa fa-circle"></i>{ " " + uitem.new_val + " "}&nbsp;</span>
                      <span className="truncate-text"><i className="fa fa-angle-double-right"></i>&nbsp;</span>
                    </small>
                  </span>
                );
              })
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
      <div title={changeItem.maker_comment.substring(0,300)}>
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
            Report template changes &nbsp;
            {this.actionButtons(changeItem)}
            <small>{changeItem.maker}</small>
          </h3>
          <p>
            {changeItem.change_type + " " + changeItem.change_reference}
            <br></br>
            <i className="fa fa-comments-o"></i>
            <span className="truncate-text">&nbsp;{changeItem.maker_comment}</span>
            <br></br>
            {
              changeItem.change_type=='UPDATE' &&
              changeItem.update_info.map((uitem,uindex)=>{
                return(
                  <span key={this.item.group_id + uindex}>
                    <small>
                      <span><strong className="amber"><i className="fa fa-leaf"></i>{ " " + uitem.field_name + " "}&nbsp;</strong></span>
                      <span className="truncate-text"><i className="fa fa-circle-o"></i>{" " + uitem.old_val + " "}&nbsp;</span>
                      <span className="truncate-text"><i className="fa fa-circle"></i>{ " " + uitem.new_val + " "}&nbsp;</span>
                      <span className="truncate-text"><i className="fa fa-angle-double-right"></i>&nbsp;</span>
                    </small>
                  </span>
                );
              })
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
      <div title={changeItem.maker_comment.substring(0,300)}>
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
            Role Permissions changes &nbsp;
            {this.actionButtons(changeItem)}
            <small>{changeItem.maker}</small>
          </h3>
          <p>
            {(changeItem.change_type=='INSERT'? 'Granted permission ': 'Revoked permission' ) + " " + changeItem.change_reference}
            <br></br>
            <i className="fa fa-comments-o"></i>
            <span className="truncate-text">&nbsp;{changeItem.maker_comment}</span>
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
    if(this.item==null){
      return(
        <h5>
          <i className="fa fa-hand-o-left"></i> Please select a change request item to view details.
        </h5>
      );
    }

    const changeList=this.item.group.map((changeItem,index)=>{
          //console.log(item,index);
          return(<div className="list_item_active"
                      key={index}
                      onClick={(event)=>{
                        let changeItemDetails={
                              changeItem: changeItem,
                              group_tables: this.item.group_tables
                            };
                        this.props.onSelectChangeItem(changeItemDetails,this.actionList);
                      }
                    }>
                    <div className="mail_list">
                      {this.groupChangeList(changeItem)}
                    </div>
                </div>
              );
        });
    return(
      <div className="form-horizontal form-label-left form-def-change-detail">
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
                          {
                            this.actionList.regress.length > 0 &&
                            <button type="button" className="btn btn-sm btn-default"
                              onClick={()=>{
                                this.actionList={approve:[],reject:[], regress:[]};
                                this.setState({comment:"", commentNoOfCharacter:0, actionType:null});
                              }}>Reset</button>
                          }
                          <button type="button" className="btn btn-sm btn-warning" onClick={this.handleRegress.bind(this)}> Regress</button>
                          {
                            this.actionList.regress.length > 0 &&
                            <span className="badge bg-orange"><i className="fa fa-eye-slash">&nbsp;</i>{this.actionList.regress.length}</span>
                          }
                        </div>
                      }
                      {
                        maker!='self' &&
                        (this.actionList.approve.length ==0 && this.actionList.reject.length == 0) &&
                        <div>
                          <button type="button" className="btn btn-sm btn-warning" onClick={this.handleReject.bind(this)}> Reject</button>
                          <button type="button" className="btn btn-sm btn-success" onClick={this.handleApprove.bind(this)}>Approve</button>
                        </div>
                      }
                      {
                        maker!='self' &&
                        (this.actionList.approve.length >0 || this.actionList.reject.length > 0) &&
                        <div>
                          <button type="button" className="btn btn-sm btn-default"
                            onClick={()=>{
                              this.actionList={approve:[],reject:[], regress:[]};
                              this.setState({comment:"", commentNoOfCharacter:0, actionType:null});
                            }}>Reset</button>
                          <button type="button" className="btn btn-sm btn-primary" onClick={()=>{}}>Submit Review</button>
                          <span className="badge bg-green"><i className="fa fa-check-square-o"></i>&nbsp;{this.actionList.approve.length}</span>&nbsp;
                          <span className="badge bg-orange"><i className="fa fa-ban"></i>&nbsp;{this.actionList.reject.length}</span>
                        </div>
                      }
                    </div>
                 </div>
                 <div className="clearfix" />
                 <div className="ln_solid" />
                </div>
              );
            }
          })(this.props.viewOnly,this.props.maker )
        }
        <div>
          <div>
            { changeList }
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

const VisibleDefChangePane=connect(mapStateToProps,mapDispatchToProps)(DefChangePane);
export default VisibleDefChangePane;
