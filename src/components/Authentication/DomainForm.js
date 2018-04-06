import React, { Component } from 'react';

class DomainForm extends Component{
  constructor(props) {
      super(props);
      this.state = {
          domainName:null
      };
      this.onChange = this.onChange.bind(this);
      this.onNext = this.onNext.bind(this);
  }

  onChange(event){
      this.setState({ [event.target.name]: event.target.value });
  }

  onNext(event){
    event.preventDefault();
    this.props.onNext(this.state.domainName);
    console.log("Inside onNext DomainForm");

  }

  render(){
    const {domainName}=this.state;
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
                          <h6> Please enter your domain name </h6>
                          <div>
                              <input type="text"
                              className="form-control"
                              placeholder="Domain Name"
                              name="domainName"
                              value={ this.state.domainName }
                              onChange={ this.onChange }
                              required="required"/>
                          </div>

                          <div>
                              <button className="btn btn-primary submit" onClick={ this.onNext } disabled={!(domainName)}>Next</button>
                          </div>

                          <div className="clearfix"></div>

                          { error ? <div className="alert alert-danger">{error}</div> : '' }

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

export default DomainForm;
