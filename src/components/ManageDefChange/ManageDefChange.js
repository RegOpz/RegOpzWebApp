import React,{Component} from 'react';
import {dispatch} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';
import DefChangeList from './DefChangeList';
import DefChangePane from './DefChangePane';
import {actionFetchAuditList,
        actionPostAuditDecision
        } from '../../actions/DefChangeAction';

require('./ManageDefChange.css');

class ManageDefChange extends Component{
  constructor(props){
    super(props);
    this.state={selectedListItem:null,maker:null};
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

  render(){
    let viewAllChange=this.manageDefChange?true:(this.viewAllChange?true:false);
    let viewOnly=this.manageDefChange?false:true;
    return(
     <div className="row form-container">
        <div className="col-md-12">
          <div className="x_panel">
            <div className="x_title">
              <h2>Manage Definition <small> Approve changes to report definition</small></h2>
              <div className="clearfix"></div>
            </div>
            <div className="x_content">
              <div className="row">
                <div className="col-sm-3 mail_list_column">
                    <DefChangeList onSelectListItem={this.handleSelectItem.bind(this)}
                                  viewAllChange={viewAllChange}
                                  user={this.user}
                                  audit_list={this.props.audit_list}
                      />
                </div>
                <div className="col-sm-9 mail_view">
                    <DefChangePane
                      item={this.state.selectedListItem}
                      onApprove={this.handleDecision.bind(this)}
                      onReject={this.handleDecision.bind(this)}
                      onRegress={this.handleDecision.bind(this)}
                      maker={this.state.maker}
                      viewOnly={viewOnly}/>
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
    this.setState({selectedListItem:item,maker:maker});
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
