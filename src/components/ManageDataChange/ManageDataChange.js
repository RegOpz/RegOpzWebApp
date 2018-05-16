import React,{Component} from 'react';
import {dispatch} from 'redux';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';
import _ from 'lodash';
import DataChangeList from './DataChangeList';
import DataChangePane from './DataChangePane';
// import DataChangeDetails from './DataChangeDetails';
import ModalAlert from '../ModalAlert/ModalAlert';
import {actionFetchDataAuditList,
        actionPostDataAuditDecision
        } from '../../actions/DataChangeAction';
require('./ManageDataChange.css');

class ManageDataChange extends Component{
  constructor(props){
    super(props);
    this.state={
                  selectedListItem:null,
                  selectedChangeItem: null,
                  maker:null,
                  display: false,
                  displayAuidtList: true,
                  index: -1,
                  // actionList:null,
                };
    this.modalOkay = false;
    this.nextLocation = null;
    this.user=this.props.user;
    this.tenant_id=this.props.tenant_id;
    this.fetchFlag=true;
    this.handleModalOkayClick = this.handleModalOkayClick.bind(this);
    this.handleUnsavedItems = this.handleUnsavedItems.bind(this);

    this.viewOwnChange=_.find(this.props.privileges,{permission:"View Own Data Changes"})?true:false;
    this.viewAllChange=_.find(this.props.privileges,{permission:"View Data Changes"})?true:false;
    this.ManageDataChange=_.find(this.props.privileges,{permission:"Manage Data Changes"})?true:false;

  }

  componentWillMount(){
    this.props.fetchAuditList();
    this.unregisterLeaveHook = this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave.bind(this));
  }

  componentWillReceiveProps(nextProps){
    console.log("Inside componentWillReceiveProps of manageDataChange..", nextProps)
    if (this.props.submitDecisionStatus!=nextProps.submitDecisionStatus) {
      console.log("Inside componentWillReceiveProps of manageDataChange if block..")
      this.props.fetchAuditList();
    }
  }

  componentWillUpdate(){
    // TODO
  }

  componentDidUpdate(){
    this.fetchFlag =! this.fetchFlag;
  }

  componentWillUnmount(){
    // TODO
    this.routerWillLeave();
  }

  routerWillLeave(nextLocation) {
    this.nextLocation = null;
    const { approve, reject, regress } = this.dataChangePane.actionList;
    if(approve.length||reject.length||regress.length){
      this.handleUnsavedItems(approve.length,reject.length,regress.length);
      this.nextLocation = nextLocation;
      return false;
    }
    return true;
  }

  render(){
    let viewAllChange=this.ManageDataChange?true:(this.viewAllChange?true:false);
    let viewOnly=this.ManageDataChange?false:true;
    return(
     <div className="row form-container">
        <div className="col-md-12">
          <div className="x_panel">
            <div className="x_title">
              <h2>Manage Data Changes <small> Approve or Reject changes for source feed data changes</small></h2>
              <div className="clearfix"></div>
            </div>
            <div className="x_content">
              <div className="row">
                {
                  this.state.selectedListItem &&
                  <button className="btn btn-link btn-xs"
                    title={this.state.displayAuidtList ? "Expand Selection Details" : "Show Review Group List"}
                    onClick={()=>{
                      this.setState({displayAuidtList: !this.state.displayAuidtList})
                    }}><i className={this.state.displayAuidtList ? "fa fa-arrows-alt" : "fa fa-list-ul green"}></i></button>
                }
                {
                  this.state.displayAuidtList &&
                  <div className="col-sm-3 mail_list_column def-change-list" id="auditList">
                      <DataChangeList onSelectListItem={this.handleSelectItem.bind(this)}
                                    viewAllChange={viewAllChange}
                                    user={this.user}
                                    tenant_id={this.tenant_id}
                                    index={this.state.index}
                                    audit_list={this.props.audit_list}
                        />
                  </div>
                }
                <div className={this.state.displayAuidtList ? "col-sm-9 mail_view" : "col-sm-12 mail_view"}>
                  <DataChangePane
                    item={this.state.selectedListItem}
                    index={this.state.index}
                    onSubmitDicision={this.handleDecision.bind(this)}
                    maker={this.state.maker}
                    onRef={(dataChangePane) => {this.dataChangePane = dataChangePane}}
                    viewOnly={viewOnly}/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ModalAlert
          ref={(modalAlert) => {this.modalAlert = modalAlert}}
          onClickOkay={this.handleModalOkayClick}
        />
      </div>
    );
  }

  handleUnsavedItems(approveCount,rejectCount,regressCount) {
    this.modalAlert.isDiscardToBeShown = true;
    this.modalAlert.buttonTextOkay = "Yes";
    this.modalAlert.buttonTextDiscard = "No";
    this.modalAlert.open(
        <div className="x_panel">
          <div>There are unsaved reviews.</div>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Change Type</th>
                <th>Review Count</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="green">Approve</td>
                <td className="green">{approveCount}</td>
              </tr>
              <tr>
                <td className="amber">Reject</td>
                <td className="amber">{rejectCount}</td>
              </tr>
              <tr>
                <td className="amber">Regress</td>
                <td className="amber">{regressCount}</td>
              </tr>
            </tbody>
          </table>
          <div>
            Do you want to proceed without saving these changes?
          </div>
        </div>
      );
  }

  handleSelectItem(item,maker,index){
    // console.log('onSelectListItem.......',item,maker,this.dataChangePane);
    this.selectedListItemitem=null;
    const { approve, reject, regress } = this.dataChangePane.actionList;
    if(approve.length||reject.length||regress.length){
      //this.renderDefChangeDetails(this.props.record_detail,this.item);
      this.handleUnsavedItems(approve.length,reject.length,regress.length);
      this.selectedListItemitem={selectedListItem:item,
                                  maker:maker,
                                  display: false,
                                  index: index};
    } else {
      this.setState({
                      selectedListItem:item,
                      maker:maker,
                      display: false,
                      index: index,
                      // actionList: null,
                      // displayAuidtList: !this.state.displayAuidtList
                    });
    }

  }

  handleModalOkayClick(){
    //TODO
    this.modalAlert.isDiscardToBeShown = false;
    if(this.nextLocation){
      this.dataChangePane.actionList = {approve:[],reject:[],regress:[]};
      hashHistory.push(this.nextLocation);
    }
    if (this.selectedListItemitem){
      this.setState(this.selectedListItemitem);
    }

  }

  handleDecision(itemList){
    this.props.postAuditDecision(itemList);
    this.setState({selectedListItem:null,index:-1});

  }

  // handleReject(item){
  //   let item=this.state.selectedListItem;
  //   item.status="REJECTED";
  //   this.props.postAuditDecision(item);
  //   this.setState({selectedListItem:null});
  //
  // }

}

function mapStateToProps(state){
  return{
    login_details: state.login_store,
    audit_list:state.data_change_store.audit_change_list,
    submitDecisionStatus:  state.data_change_store.post_decision_status,
  };
}

const mapDispatchToProps=(dispatch)=>{
  return{
    postAuditDecision:(data)=>{
      dispatch(actionPostDataAuditDecision(data));
    },
    fetchAuditList:()=>{
      dispatch(actionFetchDataAuditList());
    }
  };
}

const VisibleManageDataChange=connect(mapStateToProps,mapDispatchToProps)(ManageDataChange);
export default VisibleManageDataChange;
