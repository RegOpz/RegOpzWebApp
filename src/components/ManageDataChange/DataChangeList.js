import React,{Component} from 'react';
import {connect} from 'react-redux';
import {dispatch} from 'redux';
import _ from 'lodash';
import moment from 'moment';
import {actionFetchAuditList} from '../../actions/DefChangeAction';

require('./ManageDataChange.css');

class DataChangeList extends Component{

  constructor(props){
    super(props);
    this.state = {
      selectedIndex: null ,
      searchTerm:null
    };
    this.auditListWithPrivilege=[];
    this.queryResult=[];

    this.handleSearch = this.handleSearch.bind(this);
    this.groupSummary = this.groupSummary.bind(this);

  }


  handleSearch(){
    const { searchTerm } = this.state;
    let queryResult = this.auditListWithPrivilege;
    if ( searchTerm != null ){
        let searchList = RegExp(`(${searchTerm.toLowerCase().replace(/\\/g,'\\\\').replace(/[,+&\:\ ]$/,'').replace(/[,+&\:\ ]/g,'|').replace(/\|\|/g,'|')})`,'i');

        console.log("handleSearch",searchList)
        queryResult=this.auditListWithPrivilege.filter((element)=>{
            let strElement=JSON.stringify(element)+" changed on: " + moment.utc(element.group_date_of_change).format('DD-MMM-YYYY');
            return(
              strElement.toString().match(searchList)
            );
          }
        );
        //console.log("queryResult",queryResult)
    }
    this.queryResult=queryResult;
  }

  groupSummary(group){
      return(
        <div>
          <div className="left">
            <i className="fa fa-th"></i>
            <h6>
              {moment.utc(group.group_date_of_change).format('DD')}
              <br/>
              <small>{moment.utc(group.group_date_of_change).format('MMM')}</small>
            </h6>
          </div>
          <div className="right">
            <h3>
              {group.group_tables.toUpperCase().replace(/_/g,' ')}<small>{group.maker}</small>
            </h3>
            <p>
              <small>
                <span>Business Date: &nbsp; {group.business_date}</span><br></br>
                <span><i className="fa fa-circle green"></i>&nbsp; {group.inserts + " new rules added"}</span>
                <br></br>
                <span><i className="fa fa-circle amber"></i>&nbsp; {group.updates + " existing rules amended"}</span>
                <br></br>
                <span><i className="fa fa-circle red"></i>&nbsp; {group.deletes + " rules requested to be marked as deleted"}</span>
              </small>
            </p>
            <h3>
              <small>{moment.utc(group.group_date_of_change).format('hh:mm:ss a')}</small>
            </h3>
          </div>
        </div>
      );
  }
  render(){
    let {audit_list}=this.props;
    if(!audit_list){
      return(<div><h4>Loading....</h4> </div>);
    }
    else if(audit_list && audit_list.length ==0){
      return(<div><h5>No pending change found.</h5> </div>);
    }

    let userOnlyAuditList=audit_list.filter((element)=>{
                                    return( element.maker==this.props.user );
                                  });

    this.auditListWithPrivilege=this.props.viewAllChange?audit_list:userOnlyAuditList;
    // Now filter records if any according to the filterText
    console.log("this.state.searchTerm", this.state.searchTerm)
    this.handleSearch();
    let audit_list_with_search=this.state.searchTerm?this.queryResult:this.auditListWithPrivilege;
    console.log("Audit List........",audit_list_with_search);
    const msgList=audit_list_with_search.map((item,index)=>{
          //console.log(item,index);
          return(<a className={ this.props.index == index ? "list_item_select" : "list_item_active" }
                      key={index}
                      onClick={(event)=>{
                        this.setState({ selectedIndex: index });
                        const maker=(item.maker==this.props.user)?'self':'other';
                        this.props.onSelectListItem(item,maker,index);
                      }
                    }>
                    <div className="mail_list">
                      {this.groupSummary(item)}
                    </div>
                </a>
              );
        });

      return(
        <div>
            <div className="input-group">
              <input className="form-control"
                    placeholder="Serach for ..."
                    value={this.state.searchTerm}
                    onChange={(event) => {
                        this.setState({ searchTerm: event.target.value });
                    }}
              />
            </div>
            {
              audit_list_with_search.length>0 ?
              msgList
              :
              <div className="mail_list">
                <div className="left">
                  <i className="fa fa-warning amber"></i>
                </div>
                <div className="right">
                  <p>
                    No matching record found for search condition
                    <br/>
                    <span className="amber">{this.state.searchTerm}</span>
                  </p>
                </div>
              </div>
            }
        </div>
      );

  }
}



export default DataChangeList;
