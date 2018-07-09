import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';

const renderField = ({ input, label, handleDelete, type, optionList, readOnly, meta: { touched, error }}) => (
    <div className="form-group">
      <label className="control-label col-md-2 col-sm-2 col-xs-2">
        { label }
      </label>
      <div className="col-md-3 col-sm-3 col-xs-12">
        {
          type=="input" &&
          <input {...input}
            readOnly={readOnly}
            className="form-control col-md-4 col-xs-12" />
        }
        {
          type=="select" &&
          <select {...input}
           readOnly={readOnly}
           className="form-control col-md-4 col-xs-12">
           {
             optionList.map((opt,index)=>{
               return(<option value={opt.value}>{opt.description}</option>)
             })
           }
          </select>
        }
        {
            touched &&
            ((error &&
             <div className="red">
               { error }
             </div>))
        }
      </div>
      <div className="col-md-3 col-sm-3 col-xs-12">
        <button onClick={()=>{handleDelete(input.name)}}><i className="fa fa-close"></i></button>
      </div>
    </div>
);

const normaliseNumber = value => value && value.replace(/[^\d]/g, '')

const validate = (values) => {
    const errors = {};
    // Nothing to add this time
    if(values.ranktype && (!values.rankvalue || values.rankvalue==0) ){
      errors.rankvalue = "Ranking should have a value greater than 0";
    }
    if(!values.ranktype && values.rankvalue ){
      errors.ranktype = "Select a valid Ranking type";
    }
    return errors;
}

class AddTransReportSectionOrder extends Component {
    constructor(props) {
        super(props);
        this.toInitialise = true;
        this.secDetails = this.props.secDetails;
        this.secSort = {sortorder:[{D:"ASC"},{E:"DSC"}]}; //this.secDetails.secOrders.sortOrder;

        this.state={
          // TODO : Refine based on the structure for columns of the Ordering
          // {ranktype: , rankvalue: , sortorder: [{},{},...]}
          formSecElements: this.secSort.sortorder ? Object.keys(this.secSort.sortorder):[]
        }

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.renderColumns = this.renderColumns.bind(this);
        this.getSecElement = this.getSecElement.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
    // react life cycles
    componentWillReceiveProps(nextProps){
        // TODO
    }

    componentDidUpdate(){
      // To initialise the redux form values
      if (this.toInitialise) {
        // TODO: Initialise will be based on the new structure to be formed
          this.props.initialize(this.secSort);
          this.toInitialise = false;
      }
    }

    componentDidMount(){
      // To initialise the redux form values
      console.log("initialise sec order...", this.secDetails.secOrders.sortOrder)
      if (this.toInitialise) {
        // TODO: Initialise will be based on the new structure to be formed
          this.props.initialize(this.secSort);
          this.toInitialise = false;
      }
    }

    render() {
      const { handleSubmit, asyncValidating, pristine, reset, submitting, message } = this.props;
      if (message) {
          return(<div>{ message.msg }</div>);
      }
      return(
        <div className="row">
          <div className='x_panel'>
            <div className="x_title">
              <h2>Maintain Section Order <small> Order of columns for the section</small></h2>
              <div className="clearfix"></div>
            </div>
            <div className="x_content">
              <div className="col-md-offset-3">
              <form className="form-horizontal form-label-left" onSubmit={ handleSubmit(this.handleFormSubmit) } >
                { this.renderColumns()}
                <div className="form-group">
                  <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-2">
                    <button type="button" className="btn btn-primary" onClick={ this.handleCancel }>Cancel</button>
                    <button type="submit" className="btn btn-success" disabled={ pristine || submitting }>Submit</button>
                  </div>
                </div>
              </form>
              </div>
            </div>
          </div>
        </div>
      )
    }

    handleFormSubmit(data) {
        console.log("inside handleFormSubmit",data, JSON.stringify(data));
        // Call your function here
    }

    handleDelete(element) {
        console.log("inside handleDelete",element);
        // Call your function here
        let secColumns = this.state.formSecElements;
        var index = secColumns.indexOf(element);
        if (index > -1) {
          secColumns.splice(index, 1);
        }
        this.setState({formSecElements:secColumns});
    }

    renderColumns(){
      // Code to be added
      let columns=[];
      let formSecElements = this.state.formSecElements;
      let secColumns = ["ranktype","rankvalue"].concat(
                          this.secDetails.secColumns.map(col=>(col.col_id)));
      formSecElements.map((col, index)=>{
        columns.push(this.getSecElement(col));
        var index = secColumns.indexOf(col);
        if (index > -1) {
          secColumns.splice(index, 1);
        }
      })
      secColumns.map((col, index)=>{
        // columns.push(
        // );
      })

      return columns;

    }

    getSecElement(col){
      if(col=="ranktype"){
        return(
          <Field
              label={"Ranking Type"}
              name={"ranktype"}
              type="select"
              optionList={[{value:"",description:"Select"},{value:"TOP",description:"Top"},{value:"BOTTOM",description:"Bottom"}]}
              component={renderField}
            />
        )
      } else if (col=="rankvalue") {
        return(
          <Field
              label={"Rank Value"}
              name={"rankvalue"}
              type="input"
              normalize={normaliseNumber}
              component={renderField}
            />
        )
      } else{
        return(
          <Field
              label={<div><i className="fa fa-columns"></i><span>{'  ' + col}</span></div>}
              name={col}
              type="select"
              optionList={[{value:"ASC",description:"Ascending"},{value:"DSC",description:"Decending"}]}
              component={renderField}
              handleDelete={this.handleDelete}
            />
        )
      }
    }
}

function mapStateToProps(state) {
    return {
      login_details: state.login_store,
      leftmenu: state.leftmenu_store.leftmenuclick,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        // Nothing to add at this stage
    };
}

const VisibleAddTransReportSectionOrder = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddTransReportSectionOrder);

export default reduxForm({
    form: 'trnasOrder',
    validate
})(VisibleAddTransReportSectionOrder);
