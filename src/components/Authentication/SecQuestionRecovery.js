import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Tab, Tabs } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import { actionAddUser, actionFetchUsers } from '../../actions/UsersAction';
import {
          actionGetUserSecQuestion,
          actionValidateUserSecQuestion,
        } from '../../actions/PasswordRecoveryAction';

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
        if (Object.getOwnPropertyNames(error).length < 1) {
            console.log("Inside asyncValidate", error);
            throw { name: 'User name not found, please enter a valid user name' , donotUseMiddleWare: true };
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
    }

    return errors;
}

class SecQuestionRecovery extends Component {
    constructor(props) {
        super(props);
        this.state ={
                      showQuestions: false,
                      isValidating: false,
                    };
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.renderSecretQuestions = this.renderSecretQuestions.bind(this);
        this.onGetUserSecQuestion = this.onGetUserSecQuestion.bind(this);
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
        document.body.classList.add('SecQuestionRecovery');
        document.title = "RegOpz SecQuestionRecovery";
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
                      readOnly={asyncValidating||this.state.showQuestions}
                    />
                    {
                      this.state.showQuestions &&
                      <div className="x_panel">
                        <div className="x_title">
                          <h5>Security Questions <small> Please enter answers for security questions</small></h5>
                          <div className="clearfix"></div>
                        </div>
                        <div className="x_content">
                          {
                            this.renderSecretQuestions(questions)
                          }
                        </div>
                      </div>
                    }
                    <div className="form-group">
                      <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
                        <button type="button" className="btn btn-primary"
                          onClick={ ()=>{
                                          this.setState({showQuestions: false}, reset());
                                        }
                                  }
                          disabled={ pristine || submitting }>Reset</button>
                        <button type="button" className="btn btn-dark" onClick={ ()=>{this.onGetUserSecQuestion()} } disabled={ pristine || submitting || invalid || this.state.showQuestions }>Get Questions</button>
                        <button type="submit" className="btn btn-success" disabled={ pristine || submitting || !this.state.showQuestions}>Validate</button>
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

    onGetUserSecQuestion(){
      const {values} = this.props.form;
      if (values.name)
      {
        this.setState({showQuestions: true},
                      this.props.getSecQuestions(values.name)
                    );
      }

    }

    handleFormSubmit(data) {
        const {reset} = this.props;
        console.log("inside handleFormSubmit",data);
        this.setState({showQuestions: false, isValidating: true},
                      this.props.validateAnswer(data));

        reset();
    }
}

function mapStateToProps(state) {
    return {
        message: state.user_details.message,
        secretQuestions: state.passwordRecovery.secretQuestions,
        pwdValidation: state.passwordRecovery.validation,
        form: state.form.SecQuestionRecovery,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        validateAnswer: (data) => {
            dispatch(actionValidateUserSecQuestion(data));
        },
        getSecQuestions: (username) => {
            dispatch(actionGetUserSecQuestion(username));
        }
    };
}

const VisibleSecQuestionRecovery = connect(
    mapStateToProps,
    mapDispatchToProps
)(SecQuestionRecovery);

export default reduxForm({
    form: 'SecQuestionRecovery',
    validate,
    asyncValidate,
    asyncBlurFields: ['name']
})(VisibleSecQuestionRecovery);
