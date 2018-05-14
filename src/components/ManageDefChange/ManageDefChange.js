import React,{Component} from 'react';
import {dispatch} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';
import DefChangeList from './DefChangeList';
import DefChangePane from './DefChangePane';
import DefChangeDetails from './DefChangeDetails';
import ModalAlert from '../ModalAlert/ModalAlert';
import {actionFetchAuditList,
        actionPostAuditDecision
        } from '../../actions/DefChangeAction';

require('./ManageDefChange.css');

class ManageDefChange extends Component{
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
    this.handleModalOkayClick = this.handleModalOkayClick.bind(this);
    this.viewOwnChange=_.find(this.props.privileges,{permission:"View Own Def Changes"})?true:false;
    this.viewAllChange=_.find(this.props.privileges,{permission:"View Def Changes"})?true:false;
    this.manageDefChange=_.find(this.props.privileges,{permission:"Manage Def Changes"})?true:false;
    this.user=this.props.user;
    this.fetchFlag=true;

  }

  componentWillMount(){
    this.props.fetchAuditList();
  }

  componentWillReceiveProps(nextProps){
    if (this.fetchFlag) {
      this.props.fetchAuditList();
    }
  }

  componentDidUpdate(){
    this.fetchFlag =! this.fetchFlag;
  }

  componentWillUnmount(){
    // TODO
    const { approve, reject, regress } = this.defChangePane.actionList;
    if(approve.length||reject.length||regress.length){
      alert("There are unsaved items");
    }
  }

  render(){
    let viewAllChange=this.manageDefChange?true:(this.viewAllChange?true:false);
    let viewOnly=this.manageDefChange?false:true;
    return(
     <div className="row form-container">
        <div className="col-md-12">
          <div className="x_panel">
            <div className="x_title">
              <h2>Manage Definition Changes <small> Approve or Reject changes for meta data and mapping rules</small></h2>
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
                      <DefChangeList onSelectListItem={this.handleSelectItem.bind(this)}
                                    viewAllChange={viewAllChange}
                                    user={this.user}
                                    index={this.state.index}
                                    audit_list={this.props.audit_list}
                        />
                  </div>
                }
                <div className={this.state.displayAuidtList ? "col-sm-9 mail_view" : "col-sm-12 mail_view"}>
                  <DefChangePane
                    item={this.state.selectedListItem}
                    index={this.state.index}
                    onApprove={this.handleDecision.bind(this)}
                    onReject={this.handleDecision.bind(this)}
                    onRegress={this.handleDecision.bind(this)}
                    maker={this.state.maker}
                    onRef={(defChangePane) => {this.defChangePane = defChangePane}}
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

  handleSelectItem(item,maker,index){
    console.log('onSelectListItem.......',item,maker,this.defChangePane);
    const { approve, reject, regress } = this.defChangePane.actionList;
    if(approve.length||reject.length||regress.length){
      //this.renderDefChangeDetails(this.props.record_detail,this.item);
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
                  <td className="green">{approve.length}</td>
                </tr>
                <tr>
                  <td className="amber">Reject</td>
                  <td className="amber">{reject.length}</td>
                </tr>
                <tr>
                  <td className="amber">Regress</td>
                  <td className="amber">{regress.length}</td>
                </tr>
              </tbody>
            </table>
            <div>
              Do you want to proceed without saving these changes?
            </div>
          </div>
        );
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
    this.setState(this.selectedListItemitem);

  }

  handleDecision(item){
    this.props.postAuditDecision(item);
    this.setState({selectedListItem:null});

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
    audit_list:state.def_change_store.audit_list
  };
}

const mapDispatchToProps=(dispatch)=>{
  return{
    postAuditDecision:(data)=>{
      dispatch(actionPostAuditDecision(data));
    },
    fetchAuditList:()=>{
      dispatch(actionFetchAuditList());
    }
  };
}

const VisibleManageDefChange=connect(mapStateToProps,mapDispatchToProps)(ManageDefChange);
export default VisibleManageDefChange;
