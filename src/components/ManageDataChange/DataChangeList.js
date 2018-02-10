import React, { Component } from 'react';
import {connect} from 'react-redux';
import {dispatch} from 'redux';
import _ from 'lodash';
import moment from 'moment';
import {actionFetchDataAuditList} from '../../actions/DataChangeAction';
require('./ManageDataChange.css');


class DataChangeList extends Component{

  constructor(props){
    super(props);
    this.state = {
      selectedIndex: null ,
      searchTerm:null
    };
    this.fetchFlag = true;
    this.auditListWithPrivilege=[];
    this.queryResult=[];
    this.handleSearch=this.handleSearch.bind(this);


  }

  componentWillMount(){
    this.props.fetchDataAuditList();
  }

  componentWillReceiveProps(nextProps){
    console.log("DefChangeList componentWillReceiveProps......",this.fetchFlag);
    if (this.fetchFlag) {
      this.props.fetchDataAuditList();
    }
  }

  componentWillUpdate(){

    console.log("Inside componentWillUpdate DefChangeList....");
  }


  componentDidUpdate(){
    this.fetchFlag =! this.fetchFlag;
  }

  handleSearch(){
    const { searchTerm } = this.state;
    let queryResult = this.auditListWithPrivilege;
    if ( searchTerm != null ){
        let searchList = RegExp(`(${searchTerm.toLowerCase().replace(/[,+&\:\ ]$/,'').replace(/[,+&\:\ ]/g,'|')})`,'i');

        console.log("handleSearch",searchList)
        queryResult=this.auditListWithPrivilege.filter((element)=>{
            return(
              element.id.toString().match(searchList)||
              element.change_type.match(searchList)||
              element.table_name.match(searchList)||
              element.change_reference.match(searchList)||
              element.date_of_change.match(searchList)||
              element.maker.match(searchList)||
              element.maker_comment.match(searchList)||
              moment(element.business_date,"YYYYMMDD").format("YYYY-MM-DD").match(searchList)
            );
          }
        );
        //console.log("queryResult",queryResult)
    }
    this.queryResult=queryResult;
  }
  render(){
    let {audit_list}=this.props;
    if(!audit_list){
      return(<div> </div>);
    }

    let userOnlyAuditList=audit_list.filter((element)=>{
                                    return( element.maker==this.props.user);
                                  });

    this.auditListWithPrivilege=this.props.viewAllChange?audit_list:userOnlyAuditList;
    this.handleSearch();
    let audit_list_with_search=this.state.searchTerm?this.queryResult:this.auditListWithPrivilege;
    console.log("Audit List........",userOnlyAuditList);
    const msgList=audit_list_with_search.map((item,index)=>{
          //console.log(item,index);
          return(<li className={ this.state.selectedIndex == index ? "list_item_select" : "list_item_active" }
                      key={index}
                      onClick={(event)=>{
                        this.setState({ selectedIndex: index });
                        const maker=item.maker==this.props.user?'self':'other';
                        this.props.onSelectListItem(item,maker);
                      }
                    }>
                    <div className="mail_list">
                      <h3>{item.change_type}
                      <small>on {item.table_name} of record id {item.id} [{item.change_reference.toString().substring(0,20)}...]</small>
                      </h3>
                      {((item)=>{
                          if (item.change_type=="UPDATE"){
                              console.log("Update Info........",item.update_info);
                              const update_list=item.update_info.map((uitem,uindex)=>{
                                  console.log("Uitem.....",uitem);
                                  return (<div key={uindex}>
                                            <p>
                                              <span className="badge">{uitem.field_name}</span> &nbsp;
                                              <small>
                                                <i className="fa fa-circle-o"></i>&nbsp;<i>{uitem.old_val?uitem.old_val.toString().substring(0,30):""} ...</i> &nbsp;
                                                <i className="fa fa-circle"></i>&nbsp;<i>{uitem.new_val?uitem.new_val.toString().substring(0,30):""} ...</i>
                                              </small>
                                            </p>
                                          </div>);
                              });
                              return update_list;
                          }

                      })(item)}

                      <p><span className="badge">Comment</span>{item.maker_comment.toString().substring(0,125)} ...</p>
                    </div>
                </li>
              );
        });

      return(
        <div>
            <input className="form-control"
                  placeholder="Search (YYYY-MM-DD)"
                  value={this.state.searchTerm}
                  onChange={(event) => {
                      this.setState({ searchTerm: event.target.value });
                  }}
            />
            <ul className="list-unstyled msg_list def-change-list">
              {msgList}
            </ul>
        </div>
      );

  }
}

const mapDispatchToProps=(dispatch)=>{
  return{
    fetchDataAuditList:()=>{
      dispatch(actionFetchDataAuditList());
    }
  };
}

function mapStateToProps(state){
  return{
    audit_list:state.data_change_store.audit_list
  };
}

const VisibleDataChangeList=connect(mapStateToProps,mapDispatchToProps)(DataChangeList);

export default VisibleDataChangeList;
