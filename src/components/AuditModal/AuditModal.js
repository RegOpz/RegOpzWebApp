import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Modal,Button, Badge } from 'react-bootstrap';

export default class AuditModal extends Component{
  constructor(props){
    super(props);
    this.state={
      showModal:this.props.showModal,
      commentNoOfCharacter:0,
      form:{comment:null}
    };
  }

  componentWillReceiveProps(nextProps){
      let form=this.state.form;
      form.comment=null;
      this.setState({showModal:nextProps.showModal,commentNoOfCharacter:0,form: form});
      //console.log('componentWillReceiveProps.....',this.state.showModal,nextProps.showModal);
  }

  render(){
    //console.log(this.state.showModal,this.props.showModal);
    return(
      <Modal show={this.state.showModal}>
        <Modal.Header>
          <Modal.Title>Please Provide Change Comment </Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <form className="form-horizontal form-label-left"
            >
            <div className="form-group">
              <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="comment">Change Comment <span className="required">*</span></label>
              <div className="col-md-9 col-sm-9 col-xs-12">
                <textArea
                    type="text"
                    value={this.state.form.comment}
                    minLength="20"
                    maxLength="1000"
                    required="required"
                    className="form-control col-md-9 col-sm-9 col-xs-12"
                    onChange={(event)=>{
                                  let form=this.state.form;
                                  form.comment=event.target.value;
                                  this.setState({form:form,commentNoOfCharacter:event.target.value.length});
                               }
                             }
                  />
                <Badge>{this.state.commentNoOfCharacter}</Badge>
                <small>{' Please provide a comment min 20 character long.'}</small>
              </div>
            </div>

          </form>


        </Modal.Body>

        <Modal.Footer>
        <Button onClick={(event) => {
            if(this.state.commentNoOfCharacter > 20) {
              this.close();
              if(typeof(this.props.onClickOkay) != 'undefined')
                this.props.onClickOkay(this.state.form);
            }
          }}>Ok</Button>
        </Modal.Footer>
      </Modal>
    );
  }

open(){
  this.setState({showModal:true});

}

close(){
  this.setState({showModal:false});
}
}
