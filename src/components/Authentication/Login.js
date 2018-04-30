import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { bindActionCreators, dispatch } from 'redux';
import {
  actionLoginRequest,
  actionDomainRequest
} from '../../actions/LoginAction';
import Signup from './Signup';
import LoginForm from './LoginForm';
import DomainForm from './DomainForm';
import Subscribe from './Subscribe';

class LoginComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isDomainValid:false
        };
        this.modalAlert = null;
        this.isModalOpen = false;
        this.whichModal = "None";
        this.onSubmit = this.onSubmit.bind(this);
        this.onSignup = this.onSignup.bind(this);
        this.onSubscribe = this.onSubscribe.bind(this);
        this.onNext =this.onNext.bind(this);
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
                  onHide={(event) => {
                      this.setState({isModalOpen:false});
                    }}
                >
                  <Modal.Header closeButton >
                    <h2>{this.whichModal}  <small>Add your {this.whichModal == "Signup" ? "signin": "subscription"} details</small></h2>
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

      if (!nextProps.error && this.props.domainInfo != nextProps.domainInfo){
          this.setState({isLoading:false,
                        isDomainValid:(this.whichModal == "Subscribe" && this.state.isModalOpen) ? false : true});
      } else if(nextProps.error && this.state.isLoading && this.props !== nextProps){
          this.setState({ isLoading:false});
      } else if (nextProps.permissions){
        this.setState({ isLoading:false},
                      hashHistory.push(encodeURI('/'))
                      );
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
}

function mapStateToProps(state) {
  console.log("On map state of Login", state);
  return {
    token: state.login_store.token,
    error: state.login_store.error,
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
