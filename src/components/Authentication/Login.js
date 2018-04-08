import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { bindActionCreators, dispatch } from 'redux';
import {
  actionLoginRequest,
  actionDomainRequest,
  actionSetDomain,
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
                   <DomainForm
                     onNext={this.onNext}
                     error={this.props.error}
                     onSubscribe={this.onSubscribe}
                     />
                   }

                   { this.state.isDomainValid &&
                     <LoginForm
                       onSubmit={this.onSubmit}
                       onSignup={this.onSignup}
                       error={this.props.error}
                       tenant={this.props.domainInfo.tenant_description}
                       isLoading={this.state.isLoading}
                      />
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

      if (nextProps.domainInfo && this.props.domainInfo != nextProps.domainInfo){
        this.props.setDomain(nextProps.domainInfo);
      }

      if (!this.error && this.props.domainInfo != nextProps.domainInfo){
          this.setState({isLoading:false,
                        isDomainValid:(this.whichModal == "Subscribe" && this.state.isModalOpen) ? false : true});
      } else if(this.error){
          this.setState({ isLoading:false});
      }
    }

    onSubmit(username,password) {
        this.setState({ isLoading: true });
        var data = {
          username: username,
          password: password,
          domainInfo:this.props.domainInfo
        };
        console.log("Inside onSubmit Login", data);
        this.props.loginRequest(data);
        this.setState({isLoading: false });
        hashHistory.push(encodeURI('/'));
    }

    onSignup(event) {
      event.preventDefault();
      //this.modalAlert.open(<Signup/>);
      this.whichModal = "Signup";
      this.setState({isModalOpen:true})
      //hashHistory.push('/signup');
    }

    onSubscribe(event) {
      event.preventDefault();
      //this.modalAlert.open(<Signup/>);
      console.log("whichModal",this.whichModal);
      this.whichModal = "Subscribe";
      console.log("whichModal",this.whichModal);
      this.setState({isModalOpen:true})
      //hashHistory.push('/signup');
    }

    onNext(domainName){
      this.props.domainRequest(domainName);
      this.setState({isLoading:true});
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
    },
    setDomain:(domainInfo)=>{
      dispatch(actionSetDomain(domainInfo));
    }
  };
};

const VisibleLogin = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginComponent);

export default VisibleLogin;
