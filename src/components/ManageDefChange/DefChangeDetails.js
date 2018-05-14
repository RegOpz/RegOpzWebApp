import React,{Component} from 'react';
import {dispatch} from 'redux';
import moment from 'moment';
import {connect} from 'react-redux';
import {Media, Label, Badge, Modal, Button} from 'react-bootstrap';
import {actionFetchRecordDetail} from '../../actions/DefChangeAction';

class DefChangeDetails extends Component{
  constructor(props){
    super(props);
    this.item=this.props.item;
    this.actionList = this.props.actionList;
    this.fetchFlag=true;
    }


  componentWillMount(){
    console.log("componentWillMount fetchRecordDetail ....");
    this.props.fetchRecordDetail(this.item.table_name,this.item.id);
    console.log("componentWillMount fetchRecordDetail ....end of the call");

  }

  componentWillReceiveProps(nextProps){
    this.item=nextProps.item;
    if (this.fetchFlag){
      if(this.item){
        this.props.fetchRecordDetail(this.item.table_name,this.item.id);
        }
    }
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
      // return(this.businessRulesList(changeItem));
    }
    if (this.item.group_tables.match(RegExp(`report_def`))){
      // return(this.reportTemplatesList(changeItem));
    }
    if (this.item.group_tables.match(RegExp(`report_calc_def|report_comp_agg_def`))){
      // return(this.reportRulesList(changeItem));
    }
    if (this.item.group_tables.match(RegExp(`permissions`))){
      // return(this.permissionsList(changeItem));
    }
    if (this.item.group_tables.match(RegExp(`role`))){
      // return(this.rolesList(changeItem));
    }

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
      <div className="x_panel">
        <div className="x_title">
          <h2>Record Details<small>Change details for the selected record</small></h2>
          <div className="clearfix"></div>
        </div>
        <div className="x_content">
          <div id="def_change_detail"> {this.renderDefChangeDetails(this.props.record_detail,this.item)}</div>
        </div>
      </div>
    );
  }

  renderDefChangeDetails(displayItem,auditItem){
    console.log("Inside renderDefChangeDetails........");
    // const divElement=document.getElementById("def_change_detail");
    // $(divElement).empty();
    if (typeof displayItem != 'undefined'){
    let key = Object.keys(displayItem);

    // for (let key of Object.keys(displayItem)){
        // let nodeFormGroup=document.createElement("div");
        // nodeFormGroup.className="form-group";
        //
        // let nodeLabel=document.createElement("label");
        // nodeLabel.className="control-label col-md-3 col-sm-3 col-xs-12";
        // nodeFormGroup.appendChild(nodeLabel);
        //
        // let element=document.createTextNode(key);
        // nodeLabel.appendChild(element);
        //
        // let nodeInputDiv=document.createElement("div");
        // nodeInputDiv.className="col-md-6 col-sm-6 col-xs-12";
        // nodeFormGroup.appendChild(nodeInputDiv);
        //
        // //nodeInput.className="col-md-5 col-sm-5 col-xs-12";
        // let nodeInput=document.createElement("input");
        // nodeInput.readOnly="true";
        // nodeInput.value=displayItem[key];
        // nodeInputDiv.appendChild(nodeInput);
        // //element=document.createTextNode(displayItem[key]);
        // //nodeFormGroup.appendChild(element);
        // divElement.appendChild(nodeFormGroup);
    // }
    return(
      <div className="dashboard-widget-content">
        <h3>Record Details</h3>
        <ul className="list-unstyled timeline widget">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Column Name</th>
                <th>Reference Value</th>
              </tr>
            </thead>
            <tbody>
            {
              key.map(function(item,index){
                console.log("inside record media body",item,displayItem[item]);
                return(
                        <tr>
                          <th scope="row">{index + 1}</th>
                            {((auditItem,column,presentValue)=>{
                                let update_list=[];
                                if (auditItem.change_type=="UPDATE"){
                                    console.log("audit item Update Info........",auditItem.update_info);

                                    auditItem.update_info.map((uitem,uindex)=>{
                                        console.log("audit item Uitem.....",uitem);
                                        if(uitem.field_name==column){
                                          update_list.push(<td><Label bsStyle="warning">{column}</Label></td>);
                                          update_list.push(
                                                    <td>
                                                      <p>
                                                        <small>
                                                          <i className="fa fa-circle-o"></i>&nbsp;<i>  {uitem.old_val}</i>
                                                          <br></br>
                                                          <i className="fa fa-circle"></i>&nbsp;<i>  {uitem.new_val}</i>
                                                        </small>
                                                      </p>
                                                    </td>
                                                );
                                        }
                                    });
                                    console.log("inside update details",update_list)
                                    //return update_list.length >0 ? update_list : presentValue;
                                    if (update_list.length==0){
                                      update_list.push(<td><Label bsStyle="primary">{column}</Label></td>);
                                      update_list.push(
                                          <td>
                                            <p>{presentValue}</p>
                                          </td>
                                        );
                                    }
                                }
                                else {
                                  update_list.push(<td><Label bsStyle="primary">{column}</Label></td>);
                                  update_list.push(
                                      <td>
                                        <p>{presentValue}</p>
                                      </td>
                                    );
                                }
                                return update_list;
                            })(auditItem,item,displayItem[item])}
                      </tr>
                )
              })
            }
            </tbody>
          </table>
        </ul>
      </div>
    )
  }
  else {
    return(<div></div>)
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
