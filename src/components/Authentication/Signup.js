import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Tab, Tabs } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import { actionAddUser, actionFetchUsers } from '../../actions/UsersAction';
import { actionGetAllSecQuestion } from '../../actions/PasswordRecoveryAction';

const renderField = ({ input, label, type, secQuestion, readOnly, meta: { touched, error }}) => (
    <div className="form-group">
      <label className={secQuestion ? "col-md-12 col-sm-12 col-xs-12" : "control-label col-md-3 col-sm-3 col-xs-12"}>
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
        if (Object.getOwnPropertyNames(error).length > 0) {
            console.log("Inside asyncValidate", error);
            throw { name: error.msg , donotUseMiddleWare: true };
        }
     });
}

const normaliseContactNumber = value => value && value.replace(/[^\d]/g, '')
const required = value => value && value.length >= 3 ? undefined : 'Answer can not be less than 3 characters'

let pwdRegExp ="";
let pwdPolicyText = "";

const validate = (values) => {
    const errors = {};

    if (!values.name) {
        errors.name = "User name is required";
    } else if (values.name.length < 5 || values.name.length > 20 ) {
        errors.name = "User name must be greater than 4 characters and less than 20 characters";
    }

    if (!values.email) {
        errors.email = 'Email address is required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
    }

    if (!values.first_name) {
        errors.first_name = "First name is required"
    }

    if (!values.last_name) {
        errors.last_name = "Last name is required"
    }

    if (!values.password) {
        errors.password = "Password should not be empty"
    }

    if (!values.passwordConfirm || values.password !== values.passwordConfirm) {
        errors.passwordConfirm = "Password must match"
    }

    // var strongRegex = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    // (?=.*[a-z])	The string must contain at least 1 lowercase alphabetical character
    // (?=.*[A-Z])	The string must contain at least 1 uppercase alphabetical character
    // (?=.*[0-9])	The string must contain at least 1 numeric character
    // (?=.*[!@#\$%\^&\*])	The string must contain at least one special character, but we are escaping reserved RegEx characters to avoid conflict
    // (?=.{8,})	The string must be eight characters or longer

    if (values.password) {
        var strongRegex = new RegExp(pwdRegExp);
        let policy = values.password.match(strongRegex);
        if (policy == null){
          errors.password = pwdPolicyText
        }
    }

    return errors;
}

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state ={
                      selectedTab: 0,
                      showMessage: false
                    };
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.renderSecretQuestions = this.renderSecretQuestions.bind(this);
    }

    componentWillMount(){
      this.props.getSecQuestions();
    }

    componentWillReceiveProps(nextProps){
      console.log("inside Signup nextProps...",nextProps);
      if(this.props.message != nextProps.message){
        this.setState({showMessage: true})
      }
    }

    componentDidMount() {
        document.body.classList.add('signup');
        document.title = "RegOpz Signup";
    }

    render() {
        const { handleSubmit, asyncValidating, pristine, reset, submitting, message, secretQuestions } = this.props;
        let questions = null;
        if (secretQuestions){
            pwdRegExp = secretQuestions.reg_exp;
            pwdPolicyText = secretQuestions.policy_statement;
            questions = secretQuestions.questions;
        } else {
          return(<h5>Checking password policy....</h5>)
        }

        if (message && this.state.showMessage) {
            return(<div>{ message.msg }</div>);
        }
        return(
          <div className="row">
            <div className="col col-lg-12">
              <div className='x_panel'>
                <div className="x_content">
                  <form className="form-horizontal form-label-left" onSubmit={ handleSubmit(this.handleFormSubmit) } >
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
                        title={<div className="green"><i className="fa fa-user"></i> User Details</div>}
                      >
                        <br/>
                        <Field
                          name="name"
                          type="text"
                          component={renderField}
                          label="Username"
                          readOnly={asyncValidating}
                        />
                        <Field
                            name="first_name"
                            type="text"
                            component={renderField}
                            label="First name"
                          />

                        <Field
                          name="last_name"
                          type="text"
                          component={renderField}
                          label="Last name"
                        />

                        <Field
                          name="contact_number"
                          type="text"
                          component={renderField}
                          label="Contact number"
                          normalize={normaliseContactNumber}
                        />

                        <Field
                          name="email"
                          type="email"
                          component={renderField}
                          label="Email"
                        />


                        <Field
                          name="password"
                          type="password"
                          component={renderField}
                          label="Password"
                        />

                        <Field
                          name="passwordConfirm"
                          type="password"
                          component={renderField}
                          label="Password Confirmation"
                        />
                      </Tab>
                      <Tab
                        key={1}
                        eventKey={1}
                        title={<div className="purple"><i className="fa fa-key"></i> Secrect Questions</div>}
                      >
                        <br/>
                        {
                          this.renderSecretQuestions(questions)
                        }
                      </Tab>
                    </Tabs>
                    <div className="form-group">
                      <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
                        <button type="button" className="btn btn-primary" onClick={ reset } disabled={ pristine || submitting }>Reset</button>
                        <button type="submit" className="btn btn-success" disabled={ pristine || submitting }>Submit</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        );
    }

    renderSecretQuestions(questions){
      let content =[]
      questions && questions.map((q,index)=>{
            content.push(
              <Field
                name={"ans_" + q.id.toString()}
                type="text"
                component={renderField}
                secQuestion={true}
                label={q.question + "?"}
                validate={[required]}
              />
            )
          });

      return content;

    }

    handleFormSubmit(data) {
        console.log("inside handleFormSubmit",data);
        this.props.signup(data);
    }
}

function mapStateToProps(state) {
    return {
        message: state.user_details.message,
        secretQuestions: state.passwordRecovery.secretQuestions,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        signup: (data) => {
            dispatch(actionAddUser(data));
        },
        getSecQuestions: () => {
            dispatch(actionGetAllSecQuestion());
        }
    };
}

const VisibleSignUp = connect(
    mapStateToProps,
    mapDispatchToProps
)(Signup);

export default reduxForm({
    form: 'signup',
    validate,
    asyncValidate,
    asyncBlurFields: ['name']
})(VisibleSignUp);
