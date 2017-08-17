import React,{Component} from 'react';
import {dispatch} from 'redux';
import {connect} from 'react-redux';
import _ from 'lodash';
import DataChangeList from './DataChangeList';
import DataChangePane from './DataChangePane';
import { actionPostDataAuditDecision } from '../../actions/DataChangeAction';
require('./ManageDataChange.css');


class ManageDataChange extends Component{
  constructor(props){
    super(props);
    this.state={
      selectedListItem:null,
      maker:null
    }
    this.viewOwnChange=_.find(this.props.privileges,{permission:"View Own Data Changes"})?true:false;
    this.viewAllChange=_.find(this.props.privileges,{permission:"View Data Changes"})?true:false;
    this.manageDataChange=_.find(this.props.privileges,{permission:"Manage Data Changes"})?true:false;
    this.user=this.props.user;
  }

  render(){
    let viewAllChange=this.manageDataChange?true:(this.viewAllChange?true:false);
    let viewOnly=this.manageDataChange?false:true;
    return(
      <div className="row form-container">
       <div className="col-md-12">
         <div className="x_panel">
           <div className="x_title">
             <h2>Manage Data <small> Approve changes to data</small></h2>
             <div className="clearfix"></div>
           </div>
           <div className="x_content">
             <div className="row">
               <div className="col-sm-3 mail_list_column">
                   <DataChangeList onSelectListItem={this.handleSelectItem.bind(this)}
                                 viewAllChange={viewAllChange}
                                 user={this.user}
                     />
               </div>
               <div className="col-sm-9 mail_view">
                   <DataChangePane
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
       </div>);
  }
  handleSelectItem(item,maker){
      this.setState({selectedListItem:item,maker:maker});
  }

  handleDecision(item){
    this.props.postDataAuditDecision(item);
    this.setState({selectedListItem:null});

  }
}

const mapDispatchToProps=(dispatch)=>{
  return{
    postDataAuditDecision:(data)=>{
      dispatch(actionPostDataAuditDecision(data));
    }
  };
}

const VisibleManageDataChange=connect(null,mapDispatchToProps)(ManageDataChange);
export default VisibleManageDataChange;
