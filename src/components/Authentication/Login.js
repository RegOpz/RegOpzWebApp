import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { bindActionCreators, dispatch } from 'redux';
import {
  actionLoginRequest
} from '../../actions/LoginAction';
import Signup from './Signup';
import LoginForm from './LoginForm';

class LoginComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
        this.modalAlert = null;
        this.isModalOpen = false;
        this.onSubmit = this.onSubmit.bind(this);
        this.onSignup = this.onSignup.bind(this);
    }

    render() {

        return (
            <div>
                <LoginForm
                  onSubmit={this.onSubmit}
                  onSignup={this.onSignup}
                  error={this.props.error}
                  />
                
                <Modal
                  show={this.state.isModalOpen}
                  container={this}
                  onHide={(event) => {
                      this.setState({isModalOpen:false});
                    }}
                >
                  <Modal.Header closeButton >
                    <h2>Signup <small>Add your signin detail</small></h2>
                  </Modal.Header>

                  <Modal.Body>
                    <Signup/>
                  </Modal.Body>
                </Modal>
            </div>
        );
    }

    componentDidMount() {
        document.body.classList.add('login');
        document.title = "RegOpz Login";
    }

    onSubmit(username,password) {
        this.setState({ isLoading: true });
        var data = {
          username: username,
          password: password
        };
        this.props.loginRequest(data);
        this.setState({isLoading: false });
        hashHistory.push(encodeURI('/'));
    }

    onSignup(event) {
      event.preventDefault();
      //this.modalAlert.open(<Signup/>);
      this.setState({isModalOpen:true})
      //hashHistory.push('/signup');
    }
}

function mapStateToProps(state) {
  console.log("On map state of Login", state);
  return {
    token: state.login_store.token,
    error: state.login_store.error
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginRequest: (data) => {
      dispatch(actionLoginRequest(data));
    }
  };
};

const VisibleLogin = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginComponent);

export default VisibleLogin;
