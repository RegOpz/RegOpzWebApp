import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import { actionAddUser, actionFetchUsers } from '../../actions/UsersAction';
import {
  actionFetchTenant
} from '../../actions/TenantsAction';

const renderField = ({ input, label, type, readOnly, meta: { touched, error }}) => (
    <div className="form-group">
      <label className="control-label col-md-3 col-sm-3 col-xs-12">
        { label }
      </label>
      <div className="col-md-9 col-sm-9 col-xs-12">
        { type=="textarea" &&
          <textarea {...input}
           placeholder={label}
           readOnly={readOnly}
           className="form-control col-md-4 col-xs-12"/>
        }
        {
          type != "textarea" &&
          <input {...input}
           placeholder={label}
           type={type}
           readOnly={readOnly}
           className="form-control col-md-4 col-xs-12"/>
        }
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
  return dispatch(actionFetchTenant(values.tenant_id))
    .then((action) => {
        console.log("Inside asyncValidate, promise resolved");
        let error = action.payload.data;
        if (Object.getOwnPropertyNames(error).length > 0) {
            console.log("Inside asyncValidate", error);
            throw { tenant_id: "Subscriber ID exists, please try a different ID!" , donotUseMiddleWare: true };
        }
     });
}

const normaliseContactNumber = value => value && value.replace(/[^\d]/g, '')

const validate = (values) => {
    const errors = {};

    if (!values.tenant_id) {
        errors.tenant_id = "Subscription ID is required";
    } else if (values.tenant_id.length < 5 || values.tenant_id.length > 20 ) {
        errors.tenant_id = "Subscription ID must be greater than 4 characters and less than 20 characters";
    }

    if (!values.tenant_email) {
        errors.tenant_email = 'Email address is required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.tenant_email)) {
        errors.tenant_email = 'Invalid email address'
    }

    if (!values.tenant_description) {
        errors.tenant_description = "Oraganisation Name is required"
    }

    if (!values.tenant_phone) {
        errors.tenant_phone = "Contact Number is required"
    }

    if (!values.tenant_address) {
        errors.tenant_address = "Address should not be empty"
    }

    return errors;
}

class Subscribe extends Component {
    constructor(props) {
        super(props);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    componentDidMount() {
        document.body.classList.add('subscribe');
        document.title = "RegOpz Subscription";
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
                      name="tenant_id"
                      type="text"
                      component={renderField}
                      label="Subscription ID"
                      readOnly={asyncValidating}
                    />
                    <Field
                        name="tenant_description"
                        type="text"
                        component={renderField}
                        label="Organisation Name"
                      />

                      <Field
                        name="tenant_phone"
                        type="text"
                        component={renderField}
                        label="Contact number"
                        normalize={normaliseContactNumber}
                      />

                      <Field
                        name="tenant_email"
                        type="email"
                        component={renderField}
                        label="Email"
                      />


                      <Field
                        name="tenant_address"
                        type="textarea"
                        component={renderField}
                        label="Address"
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
        },
    };
}

const VisibleSubscribe = connect(
    mapStateToProps,
    mapDispatchToProps
)(Subscribe);

export default reduxForm({
    form: 'subscribe',
    validate,
    asyncValidate,
    asyncBlurFields: ['tenant_id']
})(VisibleSubscribe);
