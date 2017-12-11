import React,{Component} from 'react';
import {dispatch} from 'redux';
import {connect} from 'react-redux';
import {Media, Label, Badge, Modal, Button} from 'react-bootstrap';
import {actionFetchDataRecordDetail} from '../../actions/DataChangeAction';
class DataChangePane extends Component{

  constructor(props){
    super(props);
    this.item=this.props.item;
    this.state={comment:null,
                commentNoOfCharacter:0,
                isModalOpen:false
              };
    this.fetchFlag=true;
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

  render(){
    if(this.item==null){
      return(<div> </div>);
    }

    return(
      <div className="form-horizontal form-label-left form-def-change-detail">
        {
          ((viewOnly,maker)=>{
            if(!viewOnly && maker !='self'){
              return(
                <div>
                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="comment">Reviwer Comment <span className="required">*</span></label>
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <textArea
                        type="text"
                        value={this.state.comment}
                        minLength="20"
                        maxLength="1000"
                        required="required"
                        className="form-control col-md-6 col-sm-12 col-xs-12"
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
                    <button type="button" className="btn btn-warning" onClick={this.handleReject.bind(this)}> Reject</button>
                    <button type="button" className="btn btn-success" onClick={this.handleApprove.bind(this)}>Approve</button>
                  </div>
               </div>

              <div className="clearfix" />
              <div className="ln_solid" />
            </div>


              );
            } else if(maker=='self'){

              return(
                <div>
                <div className="form-group">
                  <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="comment">Regression Comment <span className="required">*</span></label>
                  <div className="col-md-6 col-sm-6 col-xs-12">
                    <textArea
                        type="text"
                        value={this.state.comment}
                        minLength="20"
                        maxLength="1000"
                        required="required"
                        className="form-control col-md-6 col-sm-12 col-xs-12"
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
                    <button type="button" className="btn btn-warning" onClick={this.handleRegress.bind(this)}> Regress</button>
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
         <h3>{this.item.change_type}
           <small> on <span className="badge">{this.item.table_name}</span> of record id :
             <span className="badge"> id: {this.item.id} </span> [{this.item.change_reference}].
             Change initiated by <span className="badge">{this.item.maker}</span> on {this.item.date_of_change}.
           </small>
         </h3>
         <div className="clearfix" />
         <div className="ln_solid" />
         <div><h4>Change Summary</h4>

             {((item)=>{
                 if (item.change_type=="UPDATE"){
                     console.log("Update Info........",item.update_info);
                     const update_list=item.update_info.map((uitem,uindex)=>{
                         console.log("Uitem.....",uitem);
                         return (
                                <tr>
                                   <th scope="row">{uindex + 1}</th>
                                   <td><h4><Label bsStyle="warning">{uitem.field_name}</Label></h4></td>
                                   <td>{uitem.new_val}</td>
                                   <td>{uitem.old_val}</td>
                                </tr>
                              );
                     });
                     return(
                       <table className="table table-hover">
                         <thead>
                           <tr>
                             <th>#</th>
                             <th>Column Name</th>
                             <th>New Value</th>
                             <th>Old Value</th>
                           </tr>
                         </thead>
                         <tbody>
                           {update_list}
                         </tbody>
                       </table>
                     );
                 } else {
                   return (<table className="table table-hover">
                             <thead>
                               <tr>
                               </tr>
                             </thead>
                             <tbody>
                                 <tr><td>This is a {item.change_type} request</td></tr>
                             </tbody>
                           </table>
                       )
                 }
             })(this.item)}

         </div>
         <div className="clearfix" />
         <div className="ln_solid" />
            <p className="preserve-text"><Badge>Comment</Badge>&nbsp;{this.item.maker_comment}</p>
         </div>
         <div className="clearfix" />
         <div className="ln_solid" />
         <div id="def_change_detail"> {this.renderDefChangeDetails(this.props.record_detail,this.item)}</div>

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
      dispatch(actionFetchDataRecordDetail(table_name,id));
    }
  };
}

function mapStateToProps(state){
  return{
    record_detail:state.data_change_store.record_detail,
    login_details:state.login_store
  };
}

const VisibleDataChangePane=connect(mapStateToProps,mapDispatchToProps)(DataChangePane);
export default VisibleDataChangePane;
