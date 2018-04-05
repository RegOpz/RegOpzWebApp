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
            username: null,
            password: null,
            isLoading: false
        };
        this.modalAlert = null;
        this.isModalOpen = false;
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSignup = this.onSignup.bind(this);
    }

    render() {
        const { username, password, isLoading } = this.state;
        const { error } = this.props;
        return (
            <div>
                <a className="hiddenanchor" id="signup"></a>
                <a className="hiddenanchor" id="signin"></a>

                <div className="login_wrapper">
                    <div className="animate form login_form">
                        <section className="login_content">

                            <form>
                                <h1>RegOpz Login</h1>
                                <div>
                                    <input type="text"
                                    className="form-control"
                                    placeholder="Username"
                                    name="username"
                                    value={ this.state.username }
                                    onChange={ this.onChange }
                                    required="required"/>
                                </div>
                                <div>
                                    <input type="password"
                                    className="form-control"
                                    placeholder="Password"
                                    name="password"
                                    value={ this.state.password }
                                    onChange={ this.onChange }
                                    required="required"/>
                                </div>
                                <div>
                                    <button className="btn btn-primary submit" onClick={ this.onSubmit } disabled={!(username && password) || isLoading}>Log in</button>
                                    <button className="btn btn-default" onClick={ this.onSignup }>Sign up</button>
                                </div>

                                <div className="clearfix"></div>

                                { error ? <div className="alert alert-danger">Invalid Credentials</div> : '' }

                                <div className="separator">
                                    <div className="clearfix"></div>
                                    <br/>
                                    <div className="copyright">
                                        <h1><img src="../images/logo.png" className="img-circle "></img> RegOpz</h1>
                                        <p>©2017 All Rights Reserved. RegOpz Pvt. Ltd.</p>
                                    </div>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>

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

    onChange(event) {
      this.setState({ [event.target.name]: event.target.value });
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
