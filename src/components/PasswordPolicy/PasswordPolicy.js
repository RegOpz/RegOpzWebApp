import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { bindActionCreators, dispatch } from 'redux';
import moment from 'moment';
import {
  actionGetPasswordPolicy,
  actionSavePasswordPolicy
} from '../../actions/PasswordRecoveryAction';


const renderField = ({ input, label, type, min, max, labelClass, className, readOnly, meta: { touched, error }}) => (
    <div className="form-group">
      <label className={labelClass ? labelClass : "control-label col-md-9 col-sm-9 col-xs-9"}>
        { label }
      </label>
      <div className={className ? className : "col-md-3 col-sm-3 col-xs-3"}>
        {
          type=="textarea" &&
          <textarea {...input}
           placeholder={label}
           type={type}
           id={label}
           maxlength={1000}
           readOnly={ readOnly }
           required={true}
           className={"form-control " + className}/>
        }
        {
          type != "textarea" &&
          <input {...input}
           placeholder={label}
           type={type}
           min={min}
           max={max}
           readOnly={readOnly}
           className="form-control col-md-3 col-xs-3"/>
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

const validate = (values) => {
    const errors = {};
    if(!values.comment || values.comment.length < 20 || values.comment > 1000){
      errors.comment="Please enter a comment with length between 20 and 1000 characters"
    }
    return errors;
}

class PasswordPolicy extends Component {
    constructor(props) {
        super(props);
        this.state={
          changePassword: false,
        }
        this.fieldList = [
          {field: "tenant_id", narration: "Tenant ID", type: "text", min: null, max: null},
	        {field: "no_ans_to_capture", narration: "No of security questions to register", type: "number", min: 2, max: 5},
	        {field: "no_ques_to_throw", narration: "No of password recovery questions", type: "number", min: 0, max: 4},
	        {field: "no_prev_pwd_not_to_use", narration: "No of recent passwords can not be re-used", type: "number", min: 3, max: 10},
	        {field: "expiry_period", narration: "Password expiry period", type: "number", min: 7, max: 365},
          {field: "length", narration: "Minimum Length of Password", type: "number", min: 5, max: 20, reg_exp:'(?=.{length,})'},
        ];
        this.pwdRestrictionFields = [
          {field: "lowercase", narration: "Lower Case", reg_exp: '(?=.*[a-z])'},
	        {field: "uppercase", narration: "Upper Case", reg_exp: '(?=.*[A-Z])'},
	        {field: "number", narration: "Number", reg_exp: '(?=.*[0-9])'},
	        {field: "special_char", narration: "Special Character", reg_exp: '(?=.*[!@#\$%\^&\*])'},
        ];
        this.toInitialise = true;
        this.policy = this.props.policy;
        this.handleFormSubmit = this.handleFormSubmit.bind(this);

        this.groupId = this.props.user + this.props.tenant_id + "PP" + moment.utc();

        this.viewPolicy=_.find(this.props.privileges,{permission:"View Policy"})?true:false;
        this.editPolicy=_.find(this.props.privileges,{permission:"Edit Policy"})?true:false;
    }

    componentWillMount(){
      this.props.getPolicy();
    }

    componentDidUpdate(){
      console.log("this.props.userData.error... componentDidUpdate ....",this.props.policy);
      if (this.policy && this.toInitialise) {
        let policy_with_restrictions= JSON.parse(this.policy['pwd_restrictions'])
        policy_with_restrictions = Object.assign(policy_with_restrictions,this.policy)
        this.props.initialize(policy_with_restrictions);
        this.toInitialise = false;
      }

    }

    componentWillReceiveProps(nextProps){
      console.log("inside nextProps...",nextProps);
      if(this.policy!=nextProps.policy){
        this.policy = nextProps.policy;
        this.toInitialise = true;
      }
    }

    componentDidMount() {
        // document.body.classList.add('profile');
        document.title = "RegOpz User Profile";
        console.log("this.props.userData.error...",this.props.policy);
        if (this.policy && this.toInitialise) {
          let policy_with_restrictions= JSON.parse(this.policy['pwd_restrictions'])
          policy_with_restrictions = Object.assign(policy_with_restrictions,this.policy)
          this.props.initialize(policy_with_restrictions);
          this.toInitialise = false;
        }
    }

    render() {
        const { handleSubmit, asyncValidating, pristine, reset, submitting } = this.props;

        if (typeof this.props.policy == 'undefined' || this.props.policy.length == 0) {
            return(
              <div className="row form-container">
                <div className='x_panel'>
                  <div className="x_title">
                    <h2>Password Policy<small> Policy Details</small></h2>
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

            <div className="row form-container">
              <div className='x_panel'>
                <div className="x_title">
                  <h2><i className="fa fa-bullhorn"></i>{" " + this.props.policy.tenant_id + " Password Policy "}<small> Policy Details</small></h2>
                  <div className="clearfix"></div>
                </div>
                <div className="x_content">
                  <form className="form-horizontal form-label-left" onSubmit={ handleSubmit(this.handleFormSubmit) } >
                    <div className="col-sm-5 col-md-5 col-xs-12">
                      {
                        this.fieldList.map((f,i)=>{
                          return(
                            <Field
                            name={f.field}
                            type={f.type}
                            min={f.min}
                            max={f.max}
                            component={renderField}
                            label={f.narration}
                            readOnly={f.field=="tenant_id" || !this.editPolicy || this.props.policy.dml_allowed!='Y'}
                            />
                          )
                        })
                      }

                    </div>
                    <div className="col-sm-5 col-md-5 col-xs-12">
                      <div className="x_panel">
                        <div className="x_title">
                          <h5>Password should include </h5>
                          <div className="clearfix"></div>
                        </div>
                        <table className="table table-hover">
                          <tbody>
                            {
                              this.pwdRestrictionFields.map((fr,i)=>{
                                return(
                                  <tr>
                                    <td>
                                      <label className="switch">
                                        <Field
                                          name={ fr.field }
                                          type= { "checkbox" }
                                          component={"input"}
                                          disabled={!this.editPolicy || this.props.policy.dml_allowed!='Y'}
                                        />
                                        <span className="slider round"></span>
                                      </label>
                                    </td>
                                    <td>
                                      {fr.narration}
                                    </td>
                                  </tr>
                                )
                              })
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {
                       this.editPolicy &&
                       this.props.policy.dml_allowed =='Y' &&
                       <Field
                       name={"comment"}
                       type={"textarea"}
                       min={20}
                       max={1000}
                       component={renderField}
                       label={"Comment"}
                       labelClass="control-label col-md-3 col-sm-3 col-xs-12"
                       className="col-md-6 col-sm-6 col-xs-12"
                       readOnly={!this.editPolicy}
                       />
                    }
                    <div className="form-group">
                      {
                        this.editPolicy &&
                        this.props.policy.dml_allowed =='Y' &&
                        <div className="col-md-9 col-sm-9 col-xs-12  col-md-offset-3">
                          <button type="button" className="btn btn-sm btn-primary"
                            onClick={ ()=>{
                                            this.setState({changePassword: false});
                                            reset();} }
                            disabled={ pristine || submitting }>Reset</button>
                          <button type="submit" className="btn btn-sm btn-success" disabled={ pristine || submitting }>Submit</button>
                        </div>
                      }
                    </div>
                  </form>
                </div>
              </div>
            </div>
        );
    }


    handleFormSubmit(data) {
        console.log("inside handleFormSubmit",data);
        let newData = {pwd_restrictions:{reg_exp:''}};
        this.fieldList.map((f,i)=>{
          if(f.field == "length"){
            newData.pwd_restrictions[f.field] = data[f.field];
            newData.pwd_restrictions['reg_exp'] += f.reg_exp.replace('length',data[f.field]);
          } else {
            newData[f.field] = data[f.field]
          }
          console.log("inside handleFormSubmit newData",newData);
        })
        this.pwdRestrictionFields.map((fr,i)=>{
          newData.pwd_restrictions[fr.field] = data[fr.field] ? true : false;
          newData.pwd_restrictions['reg_exp'] += (data[fr.field] ? fr.reg_exp : '');
          console.log("inside handleFormSubmit pwdRestrictionFields newData",newData);
        })
        newData.pwd_restrictions = JSON.stringify(newData.pwd_restrictions)
        let formData = {
          table_name: "pwd_policy",
          update_info: newData,
          change_type: 'UPDATE',
        };
        console.log("inside handleFormSubmit final data 0",formData);

        let audit_info = {
          id: data.id,
          table_name: formData.table_name,
          change_type: formData.change_type,
          change_reference: `Password policy amended for : ${data.tenant_id}`,
          maker: this.props.login_details.user,
          maker_tenant_id: this.props.login_details.domainInfo.tenant_id,
          group_id: this.groupId,
          comment: data.comment
        };
        // Object.assign(audit_info, this.state.audit_form);

        formData['audit_info'] = audit_info;
        console.log("inside handleFormSubmit final data ",formData);
        this.props.savePolicy(formData, data.id);
        hashHistory.push(encodeURI('/'));
    }
}

function mapStateToProps(state) {
    return {
        login_details: state.login_store,
        policy: state.passwordRecovery.policy
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
      getPolicy: () => {
          dispatch(actionGetPasswordPolicy());
      },
      savePolicy: (data, id) => {
          dispatch(actionSavePasswordPolicy(data, id));
      },
    };
}

const VisiblePasswordPolicy = connect(
    mapStateToProps,
    mapDispatchToProps
)(PasswordPolicy);

export default reduxForm({
    form: 'profile',
    validate
})(VisiblePasswordPolicy);
