import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import { actionAddUser, actionFetchUsers } from '../../actions/UsersAction';

const renderField = ({ input, label, type, readOnly, meta: { touched, error }}) => (
    <div className="form-group">
      <label className="control-label col-md-3 col-sm-3 col-xs-12">
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

    return errors;
}

class Signup extends Component {
    constructor(props) {
        super(props);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    componentDidMount() {
        document.body.classList.add('signup');
        document.title = "RegOpz Signup";
    }

    render() {
        const { handleSubmit, asyncValidating, pristine, reset, submitting, message } = this.props;
        if (message) {
            return(<div>{ message.msg }</div>);
        }
        return(
          <div className="row">
            <div className="col col-lg-12">
              <div className='x_panel'>

              <div className="x_content">
                <form className="form-horizontal form-label-left" onSubmit={ handleSubmit(this.handleFormSubmit) } >
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

    handleFormSubmit(data) {
        console.log("inside handleFormSubmit",data);
        this.props.signup(data);
    }
}

function mapStateToProps(state) {
    return {
        message: state.user_details.message
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        signup: (data) => {
            dispatch(actionAddUser(data));
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
