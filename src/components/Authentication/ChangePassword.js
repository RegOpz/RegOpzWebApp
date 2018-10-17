import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import { actionFetchUsers, actionUpdateUser } from './../../actions/UsersAction';
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

let pwdRegExp ="";
let pwdPolicyText = "";

const validate = (values) => {
    const errors = {};

    if (!values.password) {
        errors.password = "Password should not be empty"
    }

    if (!values.passwordConfirm || values.password !== values.passwordConfirm) {
        errors.passwordConfirm = "Password must match"
    }

    if (values.password) {
        var strongRegex = new RegExp(pwdRegExp);
        let policy = values.password.match(strongRegex);
        if (policy == null){
          errors.password = pwdPolicyText
        }
    }

    return errors;
}

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state={
          isPasswordChanged: true
        }
        this.username = this.props.username;
        this.toInitialise = true;
        this.userData = null;
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    componentWillMount() {
        this.props.fetchUserDetails(this.username,undefined,true);
        this.props.getSecQuestions()
    }

    componentDidUpdate(){
      console.log("this.props.userData.error... componentDidUpdate ....",this.props.userDetails);
      if (this.userData && this.toInitialise) {
        this.props.initialize(this.userData[0]);
        this.toInitialise = false;
      }

    }

    componentWillReceiveProps(nextProps){
      console.log("inside nextProps...",nextProps);
      if(this.userData!=nextProps.userDetails){
        this.userData = nextProps.userDetails;
        this.toInitialise = true;
      }
      if(this.props.message != nextProps.message){
        if (nextProps.message.status) {
          this.props.handleHideModal();
        } else {
          this.setState({isPasswordChanged: false})
        }
      }
    }

    componentDidMount() {
        document.body.classList.add('profile');
        document.title = "RegOpz User Profile";
        console.log("this.props.userData.error...",this.props.userDetails);
        if (this.userData && this.toInitialise) {
          this.props.initialize(this.userData[0]);
          this.toInitialise = false;
        }
    }

    render() {
        const { handleSubmit, pristine, reset, submitting, message, secretQuestions } = this.props;
        if (secretQuestions){
            pwdRegExp = secretQuestions.reg_exp;
            pwdPolicyText = secretQuestions.policy_statement;
        }

        if (!this.userData || this.userData.length == 0 || this.state.isPasswordChanged=="validating") {
            return(
                <div className='x_panel'>
                  <div className="x_title">
                    <a className="user-profile left"><img src="images/user.png" alt="..." /></a>
                    <h2>{this.username}<small> Change password</small></h2>
                    <div className="clearfix"></div>
                  </div>
                  <div className="x_content">
                    <div className="login_content">
                      <div><img type="image/gif" src="./images/regopz_30pcnt.gif"></img></div>
                      <br/>
                      <div><span>Validating credentials, please wait....</span></div>
                    </div>
                  </div>
                </div>
            );
        }
        return(
              <div className='x_panel'>
                <div className="x_title">
                  <a className="user-profile left"><img src="images/user.png" alt="..." /></a>
                  <h2>{this.username}<small> Change password</small></h2>
                  <div className="clearfix"></div>
                </div>
                <div className="x_content">
                  {
                    !this.state.isPasswordChanged &&
                    <div className="amber">
                      <i className="fa fa-warning"></i>
                      &nbsp;{message.msg}
                      <div><br/></div>
                    </div>
                  }
                  <form className="form-horizontal form-label-left" onSubmit={ handleSubmit(this.handleFormSubmit) } >
                      <Field
                        name="name"
                        type="text"
                        component={renderField}
                        label="Username"
                        readOnly={true}
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
                      <div className="form-group">
                        <div className="col-md-12 col-sm-12 col-xs-12  col-md-offset-2">
                          <button type="button" className="btn btn-sm btn-primary"
                            onClick={ ()=>{ this.setState({isPasswordChanged: true}); reset();} }
                            disabled={ pristine || submitting }>Reset</button>
                          <button type="submit" className="btn btn-sm btn-success" disabled={ pristine || submitting }>Submit</button>
                        </div>
                      </div>
                    </form>
                  </div>
              </div>
        );
    }


    handleFormSubmit(data) {
        console.log("ChangePassword inside handleFormSubmit",data);
        this.setState({isPasswordChanged: "validating"},
                      this.props.updateUserDetails(data)
                    );

    }
}

function mapStateToProps(state) {
    return {
        message: state.user_details.message,
        userDetails: state.user_details.error,
        secretQuestions: state.passwordRecovery.secretQuestions,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
      fetchUserDetails: (user,userCheck,labelList) => {
          dispatch(actionFetchUsers(user,userCheck,labelList));
      },
      updateUserDetails: (data) => {
          dispatch(actionUpdateUser(data));
      },
      getSecQuestions: () => {
          dispatch(actionGetAllSecQuestion());
      }
    };
}

const VisibleChangePassword = connect(
    mapStateToProps,
    mapDispatchToProps
)(ChangePassword);

export default reduxForm({
    form: 'changePassword',
    validate
})(VisibleChangePassword);
