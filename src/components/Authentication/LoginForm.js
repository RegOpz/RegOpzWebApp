import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';

class LoginForm extends Component {
  constructor(props) {
      super(props);
      this.state = {
          username: null,
          password: null
      };
      this.onChange = this.onChange.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  onSubmit(event){
    event.preventDefault();
    this.props.onSubmit(this.state.username,this.state.password);
    this.setState({username:null,password:null});
  }

  render(){
    const { username, password} = this.state;
    const {error}=this.props;
    return(
      <div>
          <a className="hiddenanchor" id="signup"></a>
          <a className="hiddenanchor" id="signin"></a>

          <div className="login_wrapper">
              <div className="animate form login_form">
                  <section className="login_content">

                      <form>
                          <h1>RegOpz Login</h1>
                          <h6> You are logging into domain of <b>{this.props.tenant} </b></h6>
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
                              <button className="btn btn-primary submit" onClick={ this.onSubmit } disabled={!(username && password) || this.props.isLoading}>Log in</button>
                              <button className="btn btn-default" onClick={ this.props.onSignup }>Sign up</button>
                          </div>

                          <div className="clearfix"></div>

                          { error ? <div className="alert alert-danger">"Invalid credential!"</div> : '' }

                          <div className="separator">
                              <div className="clearfix"></div>
                              <br/>
                              <div className="copyright">
                                  <h1><img src="../images/logo.png" className="img-circle "></img> RegOpz</h1>
                                  <p>©2017-18 All Rights Reserved. RegOpz Pvt. Ltd.</p>
                              </div>
                          </div>
                      </form>
                  </section>
              </div>
          </div>
      </div>
    );
  }
}

export default LoginForm;
