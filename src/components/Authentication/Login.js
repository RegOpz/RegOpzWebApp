import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { Modal, Tab, Tabs } from 'react-bootstrap';
import { bindActionCreators, dispatch } from 'redux';
import {
  actionLoginRequest,
  actionDomainRequest
} from '../../actions/LoginAction';
import Signup from './Signup';
import LoginForm from './LoginForm';
import DomainForm from './DomainForm';
import Subscribe from './Subscribe';
import SecQuestionRecovery from './SecQuestionRecovery';
import OTPRecovery from './OTPRecovery';
import ChangePassword from './ChangePassword';

class LoginComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isDomainValid:false,
            selectedTab: 0
        };
        this.modalAlert = null;
        this.isModalOpen = false;
        this.whichModal = "None";
        this.recoveryUserName = null;
        this.onSubmit = this.onSubmit.bind(this);
        this.onSignup = this.onSignup.bind(this);
        this.onSubscribe = this.onSubscribe.bind(this);
        this.onNext =this.onNext.bind(this);
        this.onResetPassword = this.onResetPassword.bind(this);
        this.getModalTitle = this.getModalTitle.bind(this);
        this.onValidation = this.onValidation.bind(this);
        this.handleHideModal = this.handleHideModal.bind(this);
    }

    render() {

        return (
            <div>
                 { !this.state.isDomainValid &&
                   !this.state.isLoading &&
                   <DomainForm
                     onNext={this.onNext}
                     error={this.props.error}
                     onSubscribe={this.onSubscribe}
                     />
                   }

                   { this.state.isDomainValid &&
                     !this.state.isLoading &&
                     <LoginForm
                       onSubmit={this.onSubmit}
                       onSignup={this.onSignup}
                       error={this.props.error}
                       tenant={this.props.domainInfo.tenant_description}
                       isLoading={this.state.isLoading}
                       onResetPassword={ this.onResetPassword}
                      />
                   }
                   {
                     this.state.isLoading &&
                     <div className="login_wrapper">
                       <div className="animate form login_form">
                         <div className="x_panel">
                           <div className="x_content">
                             <section className="login_content">
                              <form>
                               <h1>RegOpz Login</h1>
                               <div>
                                 <div><img type="image/gif" src="./images/regopz_30pcnt.gif"></img></div>
                                 <br/>
                                 <div><span>Validating credentials, please wait....</span></div>
                               </div>
                               <div className="separator">
                                 <div className="clearfix"></div>
                                 <div className="copyright">
                                     <h2></h2>
                                     <p>©2017-18 All Rights Reserved. RegOpz Pvt. Ltd.</p>
                                 </div>
                               </div>
                              </form>
                             </section>
                           </div>
                         </div>
                       </div>
                     </div>
                   }
                <Modal
                  show={this.state.isModalOpen}
                  container={this}
                  backdrop={false}
                  onHide={(event) => {
                      this.setState({isModalOpen:false});
                    }}
                >
                  <Modal.Header closeButton >
                    { this.getModalTitle()}
                  </Modal.Header>

                  <Modal.Body>
                    {
                      this.whichModal == "Signup" &&
                      <Signup/>
                    }
                    {
                      this.whichModal == "Subscribe" &&
                      <Subscribe/>
                    }
                    {
                      this.whichModal == "ResetPassword" &&
                      <Tabs
                        defaultActiveKey={0}
                        activeKey={this.state.selectedTab}
                        onSelect={(key) => {
                            this.setState({selectedTab:key});
                        }}
                        >
                        <Tab
                          key={0}
                          eventKey={0}
                          title={<div className="green"><i className="fa fa-key"></i> Using Security Questions</div>}
                        >
                          <br/>
                          <SecQuestionRecovery
                            onValidation={this.onValidation}/>
                        </Tab>
                        <Tab
                          key={1}
                          eventKey={1}
                          title={<div className="purple"><i className="fa fa-envelope"></i> Using OTP</div>}
                        >
                          <br/>
                          <OTPRecovery
                            onValidation={this.onValidation}/>
                        </Tab>
                      </Tabs>
                    }
                    {
                      this.whichModal == "ChangePassword" &&
                      <ChangePassword
                        username={this.recoveryUserName}
                        handleHideModal={this.handleHideModal}
                        />
                    }
                  </Modal.Body>
                </Modal>
            </div>
        );
    }

    componentDidMount() {
        document.body.classList.add('login');
        document.title = "RegOpz Login";
    }

    componentWillReceiveProps(nextProps){

      console.log("Component Recieved Props Login",nextProps.validation)

      if (!nextProps.error && this.props.domainInfo != nextProps.domainInfo){
          this.setState({isLoading:false,
                        isDomainValid:(this.whichModal == "Subscribe" && this.state.isModalOpen) ? false : true});
      } else if(nextProps.error && this.state.isLoading && this.props !== nextProps){
          this.setState({ isLoading:false});
          // Check if the password expired, then force to change password to access application
          if(nextProps.validation && nextProps.validation.isPasswordExpired){
            this.onValidation({status: true, name: nextProps.validation.name})
          }
      } else if (nextProps.permissions){
        this.setState({ isLoading:false},
                      hashHistory.push(encodeURI('/'))
                      );
      }
    }

    getModalTitle(){
      switch (this.whichModal) {
        case "Signup":
          return(<h2>Signup  <small>Add your signin details</small></h2>)
          break;
        case "Subscribe":
          return(<h2>Subscribe  <small>Add your subscriber details</small></h2>)
          break;
        case "ResetPassword":
          return(<h2>Reset Password  <small>Password recovery</small></h2>)
          break;
        case "ChangePassword":
          return(<h2>Change Password  <small>Please enter new password</small></h2>)
          break;
        default:
          return(<h2 className="amber mid_center">{this.whichModal}</h2>)
          break;
      }
    }

    onSubmit(username,password) {
        var data = {
          username: username,
          password: password
        };
        this.setState({ isLoading: true },
                      this.props.loginRequest(data)
                      );
    }

    onSignup(event) {
      event.preventDefault();
      this.whichModal = "Signup";
      this.setState({isModalOpen:true})
    }

    onSubscribe(event) {
      event.preventDefault();
      console.log("whichModal",this.whichModal);
      this.whichModal = "Subscribe";
      console.log("whichModal",this.whichModal);
      this.setState({isModalOpen:true})
    }

    onNext(domainName){
      this.setState({isLoading:true},
                    this.props.domainRequest(domainName)
                    );
    }

    onResetPassword(){
      event.preventDefault();
      console.log("whichModal",this.whichModal);
      this.whichModal = "ResetPassword";
      console.log("whichModal",this.whichModal);
      this.setState({isModalOpen:true})
    }

    onValidation(validation){
      event.preventDefault();
      if (validation.status){
        this.whichModal = "ChangePassword";
        this.recoveryUserName = validation.name;
      } else {
        // Validation failed, so just through the message
        this.whichModal = validation.msg;
      }

      this.setState({isModalOpen: true})
    }

    handleHideModal(){
      this.setState({isModalOpen: false})
    }
}

function mapStateToProps(state) {
  console.log("On map state of Login", state);
  return {
    token: state.login_store.token,
    error: state.login_store.error,
    validation: state.login_store.validation,
    domainInfo:state.login_store.domainInfo
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginRequest: (data) => {
      dispatch(actionLoginRequest(data));
    },
    domainRequest:(domainName)=>{
      dispatch(actionDomainRequest(domainName));
    }
  };
};

const VisibleLogin = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginComponent);

export default VisibleLogin;
