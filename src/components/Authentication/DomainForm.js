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
    document.getElementsByName('domainName')[0].focus();
    // console.log("Inside onNext DomainForm");

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
                <div className="x_panel">
                  <div className="x_content">
                    <section className="login_content">

                        <form>
                            <h1>RegOpz Login</h1>
                            <h6 className="dark"> Please enter your Subscription ID to proceed </h6>
                            <div className="form-group has-feedback">
                                <input type="text"
                                className="form-control"
                                placeholder="Subscription ID"
                                name="domainName"
                                value={ this.state.domainName }
                                onChange={ this.onChange }
                                title={this.state.domainName ? "" : "Please enter subscription id"}
                                required="required"/>
                                <span className="fa fa-bank form-control-feedback right"></span>
                                { error ? <div className="red">{error}</div> : '' }
                            </div>
                            <div>
                                <button className="btn btn-primary btn-sm submit" onClick={ this.onNext } disabled={!(domainName)}>Next</button>

                            </div>

                            <div className="clearfix"></div>

                            <div className="separator">
                                <div className="clearfix"></div>
                                <p className="change_link">   New to RegOpz?
                                  <button
                                    type="button"
                                    className="to_register btn btn-xs btn-link"
                                    onClick={ this.props.onSubscribe }> Subscribe </button>
                                </p>
                                <div className="copyright">
                                    <h2><img src="../images/logo.png" className="logo img-circle"></img> RegOpz</h2>
                                    <p>©2017-18 All Rights Reserved. RegOpz Pvt. Ltd.</p>
                                </div>
                            </div>
                        </form>
                    </section>
                  </div>
                </div>
              </div>
          </div>
      </div>
    );
  }



}

export default DomainForm;
