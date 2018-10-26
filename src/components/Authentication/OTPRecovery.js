import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Tab, Tabs } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import { actionAddUser, actionFetchUsers } from '../../actions/UsersAction';
import {
          actionGetUserOtp,
          actionValidateUserOtp,
        } from '../../actions/PasswordRecoveryAction';

const renderField = ({ input, label, type, readOnly, meta: { touched, error }}) => (
    <div className="form-group">
      <label className={"control-label col-md-3 col-sm-3 col-xs-12"}>
        { label }
      </label>
      <div className="col-md-9 col-sm-9 col-xs-12">
        <input {...input}
         placeholder={label}
         type={type}
         readOnly={readOnly}
         className="form-control col-md-4 col-xs-12"/>
        {
            touched &&
            ((error &&
             <div className="red">
               { error }
             </div>))
        }
      </div>
    </div>
);

const asyncValidate = (values, dispatch) => {
  return dispatch(actionFetchUsers(values.name,'Y'))
    .then((action) => {
        console.log("Inside asyncValidate, promise resolved");
        let error = action.payload.data;
        if (Object.getOwnPropertyNames(error).length < 1) {
            console.log("Inside asyncValidate", error);
            throw { name: 'User name not found, please enter a valid user name' , donotUseMiddleWare: true };
        }
     });
}

let pwdRegExp ="";
let pwdPolicyText = "";

const validate = (values) => {
    const errors = {};

    if (!values.name) {
        errors.name = "User name is required";
    }

    if (!values.otp) {
        errors.otp = "OTP can not be empty! Please enter valid OTP";
    }

    return errors;
}

class OTPRecovery extends Component {
    constructor(props) {
        super(props);
        this.state ={
                      isOTPGenerated: false,
                      isValidating: false,
                    };
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.onGetOTP = this.onGetOTP.bind(this);
    }

    componentWillMount(){
      // TODO
    }

    componentWillReceiveProps(nextProps){
      if(this.props.pwdValidation != nextProps.pwdValidation){
        this.props.onValidation(nextProps.pwdValidation);
      }
    }

    componentDidMount() {
        document.body.classList.add('OTPRecovery');
        document.title = "RegOpz OTPRecovery";
    }

    render() {
        const { handleSubmit, asyncValidating, pristine, reset, submitting, invalid, secretQuestions } = this.props;
        let questions = null;
        if (secretQuestions){
            questions = secretQuestions.questions;
        }

        if (this.state.isValidating) {
            return(
              <div className="login_content">
                <div><img type="image/gif" src="./images/regopz_30pcnt.gif"></img></div>
                <br/>
                <div><span>Validating credentials, please wait....</span></div>
              </div>
            );
        }
        return(
          <div className="row">
            <div className="col col-lg-12">
              <div className=''>
                <div className="x_content">
                  <form className="form-horizontal form-label-left" onSubmit={ handleSubmit(this.handleFormSubmit) } >
                    <Field
                      name="name"
                      type="text"
                      component={renderField}
                      label="Username"
                      readOnly={asyncValidating||this.state.isOTPGenerated}
                    />
                    {
                      this.state.isOTPGenerated &&
                      <Field
                        name="otp"
                        type="text"
                        component={renderField}
                        label="OTP"
                      />
                    }
                    <div className="form-group">
                      <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
                        <button type="button" className="btn btn-primary"
                          onClick={ ()=>{
                                          this.setState({isOTPGenerated: false }, reset());
                                        }
                                  }
                          disabled={ pristine || submitting }>Reset</button>
                        <button type="button" className="btn btn-info" onClick={ ()=>{this.setState({isOTPGenerated: true });} } disabled={ pristine || submitting || invalid }>Already Have OTP</button>
                        <button type="button" className="btn btn-dark" onClick={ ()=>{this.onGetOTP()} } disabled={ pristine || submitting || invalid }>Send OTP</button>
                        <button type="submit" className="btn btn-success" disabled={ pristine || submitting || !this.state.isOTPGenerated}>Validate</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        );
    }

    onGetOTP(){
      const {values} = this.props.form;
      if (values.name)
      {
        this.setState({isOTPGenerated: true},
                      this.props.getOTP(values.name)
                    );
      }

    }

    handleFormSubmit(data) {
        const {reset} = this.props;
        console.log("inside handleFormSubmit",data);
        this.setState({isOTPGenerated: false, isValidating: true},
                      this.props.validateOTP(data)
                    );

        reset();
    }
}

function mapStateToProps(state) {
    return {
        message: state.user_details.message,
        secretQuestions: state.passwordRecovery.secretQuestions,
        pwdValidation: state.passwordRecovery.validation,
        form: state.form.OTPRecovery,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        validateOTP: (data) => {
            dispatch(actionValidateUserOtp(data));
        },
        getOTP: (username) => {
            dispatch(actionGetUserOtp(username));
        }
    };
}

const VisibleOTPRecovery = connect(
    mapStateToProps,
    mapDispatchToProps
)(OTPRecovery);

export default reduxForm({
    form: 'OTPRecovery',
    validate,
    asyncValidate,
    asyncBlurFields: ['name']
})(VisibleOTPRecovery);
