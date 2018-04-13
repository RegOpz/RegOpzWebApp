import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { dispatch } from 'redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import _ from 'lodash';
require('./ModifySubscriber.css');

const renderField = ({ input, label, type, initialValue, readOnly, meta: { touched, error }}) => (
    <div className="form-group">
      <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor={label}>
        { label }
        <span className="required">*</span>
      </label>
      <div className="col-md-9 col-sm-9 col-xs-12">
        <input {...input}
         placeholder={label}
         type={type}
         id={label}
         readOnly={ readOnly }
         defaultValue={initialValue}
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


const normaliseContactNumber = value => value && value.replace(/[^\d]/g, '');

const validate = (values) => {
    const errors = {};
    console.log("Inside validate", values);

    Object.keys(values).forEach((item) => {
        if (! values[item]) {
            errors[item] = `${item} cannot be empty.`;
        }
    });

    if (isNaN(Number(values["port"]))) {
        errors["Contact Number"] = "Must be a number.";
    }

    console.log("End of validate", errors);
    return errors;
}

class ModifyConnection extends Component {
    constructor(props) {
        super(props);
        this.defaultConn={"host": null,"user": null,"password": null,"db": null,"type": null,"port":null}
        this.toInitialise = true;
        this.connType = this.props.connType; //this.props.location.query['userId'];
        this.dataSource = this.props.connDetails ? this.props.connDetails : this.defaultConn;

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    componentWillMount() {
        // TODO
    }
    componentWillReceiveProps(nextProps) {
        console.log('Next Props ModifyConnection: ', nextProps);
        if (this.dataSource != nextProps.connDetails && this.connType != nextProps.connType){
            this.dataSource = nextProps.connDetails ? nextProps.connDetails : this.defaultConn;
            this.connType = nextProps.connType;
            this.toInitialise = true;
        }
    }

    componentWillUpdate() {
        // TODO
    }

    componentDidUpdate() {
        // TODO
        console.log("Inside componentDidUpdate ModifyConnection .......",this.toInitialise,this.dataSource)
        if (this.toInitialise) {
            this.props.initialize(this.dataSource);
            this.toInitialise = false;
        }
    }


    componentDidMount(){
          //console.log("Inside componentDidMount", this.initialValues, this.shouldUpdate)
          document.title = "RegOpz Dashboard | Edit Subscriber";
          console.log("Inside componentDidMount ModifyConnection .......",this.toInitialise,this.dataSource)
          if (this.toInitialise) {
              this.props.initialize(this.dataSource);
              this.toInitialise = false;
          }
    }

    render() {
        console.log("Inside Modify Subscriber Render:", this.dataSource);
        return(
            <div>
              { this.renderForm() }
            </div>
        );
    }

    renderForm() {
        const { dataSource, renderFields, handleFormSubmit } = this;
        const { handleSubmit, reset, pristine, dirty, submitting } = this.props;
        if (dataSource == null) {
            return(<h1>Loading...</h1>);
        } else if (typeof dataSource == 'undefined') {
            return (<h1>Data not found...</h1>);
        }
        return(
            <div className="">
              <div className="x_panel">
                <div className="x_title">
                  <h5>{ this.connType.toUpperCase() +" Space "}<small>Edit connection Details</small></h5>
                  <div className="clearfix"></div>
                </div>
                <div className="x_content">
                  <form className="form-horizontal form-label-left" >
                    { renderFields(dataSource) }
                    <div className="form-group">
                      <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
                        <button type="button" className="btn btn-xs btn-default" onClick={reset} disabled={ submitting }>
                          <i className="fa fa-undo"></i>{ " Undo"}
                        </button>
                        <button type="button" className="btn btn-xs btn-success" onClick={handleSubmit(handleFormSubmit)} disabled={ pristine || submitting }>
                          <i className="fa fa-check"></i>{ " Ok"}
                        </button>
                      </div>
                   </div>
                  </form>
                  <div className="clearfix"></div>
                </div>
              </div>
            </div>
        );
    }

    renderFields(data) {
        console.log("inputList....", data);
        let fieldArray = [];
        let localValues = {};
        const inputList = Object.keys(data);
        inputList.map((item, index) => {
            ['master_conn_details','tenant_conn_details','id'].includes(item) ?
            '':
            fieldArray.push(
                <Field
                  key={index}
                  name={ item }
                  type= { "text" }
                  initialValue = { data[item]}
                  component={renderField}
                  label={ _.capitalize(item.replace(/\_/g,' ')) }
                  normalize={ item == "port" ? normaliseContactNumber : null}
                  readOnly={ false }
                />
            );
        });
        return fieldArray;
    }


    handleFormSubmit(data) {
        console.log('Connection Details Submitted!', data, this.connType);
        this.props.saveConnChanges(data, this.connType);
    }

}

function mapStateToProps(state) {
    //console.log("On map state of Manage Users:", state);
    return {
        login_details:state.login_store,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        // TODO
    };
};

const VisibleModifyConnection = connect(
    mapStateToProps,
    mapDispatchToProps
)(ModifyConnection);

export default reduxForm({
    form: 'edit-conn',
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
    validate
})(VisibleModifyConnection);
