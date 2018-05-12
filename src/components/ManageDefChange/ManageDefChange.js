import React,{Component} from 'react';
import {dispatch} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';
import DefChangeList from './DefChangeList';
import DefChangePane from './DefChangePane';
import DefChangeDetails from './DefChangeDetails';
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
                  actionList:null,
                };
    this.viewOwnChange=_.find(this.props.privileges,{permission:"View Own Def Changes"})?true:false;
    this.viewAllChange=_.find(this.props.privileges,{permission:"View Def Changes"})?true:false;
    this.manageDefChange=_.find(this.props.privileges,{permission:"Manage Def Changes"})?true:false;
    this.user=this.props.user;
    this.fetchFlag=true;

    this.onSelectChangeItem = this.onSelectChangeItem.bind(this);
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
                <div className="col-sm-3 mail_list_column def-change-list" id="auditList">
                    <DefChangeList onSelectListItem={this.handleSelectItem.bind(this)}
                                  viewAllChange={viewAllChange}
                                  user={this.user}
                                  audit_list={this.props.audit_list}
                      />
                </div>
                <div className="col-sm-9 mail_view">
                  {
                    !this.state.display &&
                    <DefChangePane
                      item={this.state.selectedListItem}
                      onApprove={this.handleDecision.bind(this)}
                      onReject={this.handleDecision.bind(this)}
                      onRegress={this.handleDecision.bind(this)}
                      maker={this.state.maker}
                      onSelectChangeItem={this.onSelectChangeItem}
                      actionList={this.state.actionList}
                      viewOnly={viewOnly}/>
                  }
                  {
                    this.state.display=="changeItemDetails" &&
                    <DefChangeDetails
                      changeItem={this.state.selectedChangeItem}
                      handleClose={this.onSelectChangeItem}
                      maker={this.state.maker}
                      actionList={this.state.actionList}
                      viewOnly={viewOnly
                                || this.state.actionList.approve.length
                                || this.state.actionList.reject.length
                                || this.state.actionList.regress.length }/>
                  }

                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
    );
  }

  handleSelectItem(item,maker){
    console.log('onSelectListItem.......',item,maker);
    this.setState({
                    selectedListItem:item,
                    maker:maker,
                    display: false,
                    actionList: null
                  });
  }

  onSelectChangeItem(changeItem,actionList){
    console.log('onSelectChangeItem.......',changeItem,actionList);
    let isOpen=(this.state.display=="changeItemDetails");
    if(isOpen){
      this.setState({
                      selectedChangeItem: null,
                      display: false
                    });
    } else {
      this.setState({
                      selectedChangeItem: changeItem,
                      display: "changeItemDetails",
                      actionList: actionList
                    },
                    console.log("onSelectChangeItem actionlist check.....",this.state.actionList,this.state.selectedChangeItem)
                  );
    }

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
