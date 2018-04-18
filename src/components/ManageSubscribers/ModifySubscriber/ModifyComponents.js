import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { dispatch } from 'redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import _ from 'lodash';
import {
  actionFetchCountries,
  actionFetchComponents
} from '../../../actions/SharedDataAction';
require('./ModifySubscriber.css');

const renderField = ({ input, label, type, initialValue, readOnly, meta: { touched, error }}) => (
    <div className="form-group">
      <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor={label}>
        { label }
        <span className="required">*</span>
      </label>
      <div className="col-md-9 col-sm-9 col-xs-12">
        {
          type == "text" &&
          <input {...input}
           placeholder={label}
           type={type}
           id={label}
           readOnly={ readOnly }
           defaultValue={initialValue}
           className="form-control col-md-4 col-xs-12"/>
        }
        {
          type == "checkbox" &&
          <label className="switch">
            <input
             type={type}
             id={label}
             onChange={()=>{}}
             />
            <span className="slider round"></span>
          </label>
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

    // Object.keys(values).forEach((item) => {
    //     if (! values[item] && item=="country") {
    //         errors[item] = `${item} cannot be empty.`;
    //     }
    // });

    if (!values.country || values.country.length != 2 ) {
        errors.country = "Must be a 2 character ISO country code.";
    }

    console.log("End of validate", errors);
    return errors;
}

class ModifyComponents extends Component {
    constructor(props) {
        super(props);
        this.defaultComponents={"country": null};
        this.toInitialise = true;
        this.dataSource = this.props.componentDetails ? this.props.componentDetails : this.defaultComponents;

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.renderComponents = this.renderComponents.bind(this);
    }

    componentWillMount() {
        // TODO
        this.props.fetchComponents()
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
        if ( !this.props.components){
          return(
            <div className="x_panel">
              <h5>Loading....</h5>
            </div>
          )
        }
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
                    <Field
                      key={"country"}
                      name={ "country" }
                      type= { "text" }
                      initialValue = { this.dataSource.country}
                      component={renderField}
                      label={ "Country" }
                      normalize={ null}
                      readOnly={ false }
                    />
                    <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
                      <div className="x_panel">
                        <div className="x_title">
                          <h5>Available Components <small> Add or Remove Components</small></h5>
                          <div className="clearfix"></div>
                        </div>
                        <div className="x_content">
                        <table className="table table-hover">
                          <tbody>
                            {
                              this.renderComponents(this.props.components)
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
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

    renderComponents(components) {
        // console.log("inputList.... components.....", components);
        let componentsArray = [];
        components.map((item, index) => {
            componentsArray.push(
              <tr>
                <td>
                  <label className="switch">
                    <Field
                      name={ item.component }
                      type= { "checkbox" }
                      component={"input"}
                    />
                    <span className="slider round"></span>
                  </label>
                </td>
                <td>
                  {item.component}
                </td>
            </tr>
            );
        });
        return componentsArray;
    }


    handleFormSubmit(data) {
        // console.log('Connection Details Submitted!', data);
        this.props.saveComponentChanges(data);
    }

}

function mapStateToProps(state) {
    //console.log("On map state of Manage Users:", state);
    return {
        login_details:state.login_store,
        components: state.sharedData.components
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        // TODO
        fetchComponents:(component) =>{
          dispatch(actionFetchComponents(component));
        }
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
