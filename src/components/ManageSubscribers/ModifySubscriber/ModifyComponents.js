import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { dispatch } from 'redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import _ from 'lodash';
import {
  actionFetchCountries
} from '../../../actions/SharedDataAction';
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

const asyncValidate = (values, dispatch) => {
  console.log("asyncValidate components...", values)
  return dispatch(actionFetchCountries(values.country.toUpperCase()))
    .then((action) => {
        console.log("Inside asyncValidate, promise resolved");
        let error = action.payload.data;
        console.log("Inside asyncValidate value of error", error);
        if (error.length == 0) {
            console.log("Inside asyncValidate", error);
            throw { country: "Invalid country code, please enter a subscribable country code!" , donotUseMiddleWare: true };
        }
     });
}

const normaliseContactNumber = value => value && value.replace(/[^\d]/g, '');

const validate = (values) => {
    const errors = {};
    console.log("Inside validate", values);

    Object.keys(values).forEach((item) => {
        if (! values[item]) {
            errors[item] = `${item} cannot be empty.`;
        }
    });

    if (values.country && values.country.length != 2 ) {
        errors.country = "Must be a 2 character ISO country code.";
    }

    console.log("End of validate", errors);
    return errors;
}

class ModifyComponents extends Component {
    constructor(props) {
        super(props);
        this.defaultComponents={"country": null,"components": null};
        this.toInitialise = true;
        this.dataSource = this.props.componentDetails ? this.props.componentDetails : this.defaultComponents;

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    componentWillMount() {
        // TODO
    }
    componentWillReceiveProps(nextProps) {
        console.log('Next Props ModifyComponents: ', nextProps);
        if (this.dataSource != nextProps.componentDetails && !(nextProps.componentDetails == null && this.dataSource==this.defaultComponents)){
            this.dataSource = nextProps.componentDetails ? nextProps.componentDetails : this.defaultComponents;
            this.toInitialise = true;
        }
    }

    componentWillUpdate() {
        // TODO
    }

    componentDidUpdate() {
        // TODO
        console.log("Inside componentDidUpdate ModifyComponents .......",this.toInitialise,this.dataSource)
        if (this.toInitialise) {
            this.props.initialize(this.dataSource);
            this.toInitialise = false;
        }
    }


    componentDidMount(){
          //console.log("Inside componentDidMount", this.initialValues, this.shouldUpdate)
          document.title = "RegOpz Dashboard | Edit Subscriber Components";
          console.log("Inside componentDidMount ModifyComponents .......",this.toInitialise,this.dataSource)
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
                  normalize={ null}
                  readOnly={ false }
                />
            );
        });
        return fieldArray;
    }


    handleFormSubmit(data) {
        console.log('Connection Details Submitted!', data);
        this.props.saveComponentChanges(data);
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

const VisibleModifyComponents = connect(
    mapStateToProps,
    mapDispatchToProps
)(ModifyComponents);

export default reduxForm({
    form: 'edit-component',
    // destroyOnUnmount: false, // <------ preserve form data
    // forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
    validate,
    asyncValidate,
    asyncBlurFields: ['country']
})(VisibleModifyComponents);
