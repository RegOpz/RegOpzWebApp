import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';


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

const normaliseContactNumber = value => value && value.replace(/[^\d]/g, '')

const validate = (values) => {
    const errors = {};

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

class ProfileLeftPane extends Component {
    constructor(props) {
        super(props);
        this.state={
          changePassword: false
        }
        this.toInitialise = true;
        this.userData = this.props.userData;
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    componentDidUpdate(){
      console.log("this.props.userData.error... componentDidUpdate ....",this.props.userData);
      if (this.userData && this.toInitialise) {
        this.props.initialize(this.userData[0]);
        this.toInitialise = false;
      }

    }

    componentWillReceiveProps(nextProps){
      console.log("inside nextProps...",nextProps);
      if(this.userData!=nextProps.userData){
        this.userData = nextProps.userData;
        this.toInitialise = true;
      }
    }

    componentDidMount() {
        document.body.classList.add('profile');
        document.title = "RegOpz User Profile";
        console.log("this.props.userData.error...",this.props.userData);
        if (this.userData && this.toInitialise) {
          this.props.initialize(this.userData[0]);
          this.toInitialise = false;
        }
    }

    render() {
        const { handleSubmit, asyncValidating, pristine, reset, submitting, message } = this.props;
        if (typeof this.props.userData == 'undefined' || this.props.userData.length == 0) {
            return(
              <div className="col-sm-5 col-md-5 col-xs-12">
                <div className='x_panel'>
                  <div className="x_title">
                    <h2>{this.props.username}<small> edit details</small></h2>
                    <div className="clearfix"></div>
                  </div>
                  <div className="x_content">
                    <div><h4>Loading....</h4></div>
                  </div>
                </div>
              </div>
            );
        }
        return(

            <div className="col-sm-5 col-md-5 col-xs-12">
              <div className='x_panel'>
                <div className="x_title">
                  <a className="user-profile left"><img src="images/user.png" alt="..." /></a>
                  <h2>{this.props.userData[0].first_name}<small> edit personal details</small></h2>
                  <div className="clearfix"></div>
                </div>
                <div className="x_content">
                  <form className="form-horizontal form-label-left" onSubmit={ handleSubmit(this.handleFormSubmit) } >
                      <Field
                        name="name"
                        type="text"
                        component={renderField}
                        label="Username"
                        readOnly={true}
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

                        {
                          this.state.changePassword &&
                          <Field
                            name="password"
                            type="password"
                            component={renderField}
                            label="Password"
                          />
                        }
                        {
                          this.state.changePassword &&
                          <Field
                            name="passwordConfirm"
                            type="password"
                            component={renderField}
                            label="Password Confirmation"
                          />
                        }

                        <div className="form-group">
                          <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
                            <button type="button" className="btn btn-sm btn-primary" onClick={ reset } disabled={ pristine || submitting }>Reset</button>
                            <button type="submit" className="btn btn-sm btn-success" disabled={ pristine || submitting }>Submit</button>
                            {
                              !this.state.changePassword &&
                              <button type="button" className="btn btn-sm btn-warning" onClick={ ()=>{this.setState({changePassword:true});} }>
                                <i className="fa fa-edit"></i> Password</button>
                            }
                          </div>
                       </div>
                    </form>
                  </div>
              </div>
            </div>

        );
    }

    handleFormSubmit(data) {
        console.log("inside handleFormSubmit",data);
        this.props.saveEditedData(data);
    }
}

function mapStateToProps(state) {
    return {
        message: state.user_details.message
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        // TBA later if required
    };
}

const VisibleProfileLeftPane = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfileLeftPane);

export default reduxForm({
    form: 'profile',
    validate
})(VisibleProfileLeftPane);
