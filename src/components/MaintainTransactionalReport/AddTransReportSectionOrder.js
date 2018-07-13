import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import moment from 'moment';
import {
  actionTransReportInsertRule,
  actionTransReportUpdateRule } from '../../actions/TransactionReportAction';

const renderField = ({ input,index, label, handleDelete, moveRow,maxIndex, formSecElements, type, optionList, readOnly, meta: { touched, error }}) => (
    <div className="form-group">
      <label className="control-label col-md-2 col-sm-2 col-xs-2">
        { label }
      </label>
      <div className={type=="textarea" ? "col-md-6 col-sm-6 col-xs-12" : "col-md-3 col-sm-3 col-xs-12"}>
        { type=="textarea" &&
          <textarea {...input}
           placeholder={label}
           className="form-control col-md-4 col-xs-12"/>
        }
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
           disabled={readOnly}
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
      {
        input.name !=="ranktype" && input.name !=="rankvalue" &&
        input.name !=="cell_agg_ref" && input.name !=="comment" &&
        !readOnly &&
        <div className="col-md-3 col-sm-3 col-xs-12">
        {
            formSecElements.indexOf(index) !== 0 &&
            <button type="button" className="btn btn-xs btn-link" title="Move Up" onClick={() => { moveRow(index, 'UP') }}><i className="fa fa-caret-up"></i></button>
        }
        {
            formSecElements.indexOf(index) !== maxIndex &&
            <button type="button" className="btn btn-xs btn-link" title="Move Down" onClick={() => { moveRow(index, 'DOWN') }}><i className="fa fa-caret-down"></i></button>
        }
         <button type="button" className="btn btn-xs btn-link amber"  title="Remove" onClick={()=>{handleDelete(index)}}><i className="fa fa-close"></i></button>
       </div>
      }
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
    if (!values.cell_agg_ref) {
        errors.cell_agg_ref = "Cell Aggregation Reference  can not be empty.";
    }
    if (!values.comment || values.comment.length <= 20 ) {
        errors.comment = "Comment can not be less than 20 characters.";
    }
    return errors;
}

class AddTransReportSectionOrder extends Component {
    constructor(props) {
        super(props);
        this.toInitialise = true;
        this.secColumns= this.props.secDetails.secColumns;
        console.log("Props....",this.props.secDetails);
        console.log("Dynamic Columns ",this.secColumns);
        console.log("All available data are::",this.props.secDetails,this.props.gridData);
        console.log("All available data2 are::",this.props.selectedCell);
        this.change_type = this.props.secDetails && this.props.secDetails.secOrders.cell_agg_ref ?
                           "UPDATE" : "INSERT";
        this.secSort={cell_agg_ref: this.props.secDetails && this.props.secDetails.secOrders.cell_agg_ref ?
                                    this.props.secDetails.secOrders.cell_agg_ref
                                    :
                                    this.props.secDetails.section + ".01"}
        this.state={
          // TODO : Refine based on the structure for columns of the Ordering
          // {ranktype: , rankvalue: , sortorder: [{},{},...]}
          formSecElements: [],
          showColumns: this.secColumns,
        }

        this.dml_allowed = this.props.secDetails.secOrders.dml_allowed === 'Y' ||
                           typeof this.props.secDetails.secOrders.dml_allowed == 'undefined'
                           ? true : false;
        this.writeOnly = this.props.writeOnly;

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.renderColumns = this.renderColumns.bind(this);
        this.getSecElement = this.getSecElement.bind(this);
        this.renderbuttons = this.renderbuttons.bind(this);
        this.addFormElement = this.addFormElement.bind(this);
        this.moveRow = this.moveRow.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
    // react life cycles
    componentWillMount(){
      // TODO : Add required data calls
      // Lets rebuild the form element initialisation values from the secDetails received through props
      let formSecElements = this.state.formSecElements;
      if(this.props.secDetails.secOrders){
        let orderCols = this.props.secDetails.secOrders.cell_agg_render_ref;
        orderCols = orderCols ? JSON.parse(orderCols) : {sortorder:[]};
        this.secSort["ranktype"] = orderCols.ranktype;
        this.secSort["rankvalue"] = orderCols.rankvalue;
        orderCols.sortorder.map((col,index)=>{
          this.secSort[col.column] = col.order;
          formSecElements.push(col.column);
        })
        console.log("this.secSort...", this.secSort);
      }
      this.setState({formSecElements});
    }

    componentWillReceiveProps(nextProps){
        // TODO
        // this.secColumns=  nextprops.secDetails.secColumns ?
        //                   nextprops.secDetails.secColumns
        //                   :
        //                   this.props.secDetails.secColumns;
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
      //console.log("initialise sec order...", this.secDetails.secOrders.sortOrder)
      if (this.toInitialise) {
        // TODO: Initialise will be based on the new structure to be formed
          this.props.initialize(this.secSort);
          this.toInitialise = false;
      }
    }

    render() {
      const { handleSubmit, asyncValidating, pristine, reset, submitting, message } = this.props;
      this.viewOnly = !(this.writeOnly && this.dml_allowed);
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
              <div className="x_panel">
                <div className="x_title">
                  <h2>Available columns<small>for sorting order</small></h2>
                  <div className="clearfix"></div>
                </div>
                <div clasName="x_content">
                  <div className="col-md-offset-3">
                    {!this.viewOnly && this.renderbuttons()}
                  </div>
                </div>
              </div>
              <div className="col-md-offset-3">
              <form className="form-horizontal form-label-left" onSubmit={ handleSubmit(this.handleFormSubmit) } >
                { this.renderColumns()}
                <div className="form-group">
                  <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-2">
                    <button type="button" className="btn btn-primary" onClick={ this.props.handleClose }>Cancel</button>
                    {
                      !this.viewOnly &&
                      <button type="submit" className="btn btn-success" >Submit</button>
                    }
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
        let content=[];
        this.state.formSecElements.map((col)=>{content.push({column:col,order:data.hasOwnProperty(col)?data[col]:"ASC"})})
        let cell_agg_render_ref={ranktype:data.ranktype?data.ranktype:null,
                                rankvalue:data.rankvalue?data.rankvalue:null,
                                sortorder:content};
        let update_info={id:null,
                         report_id:this.props.selectedCell.reportId,
                         sheet_id:this.props.selectedCell.sheetName,
                         section_id:this.props.secDetails.section,
                         cell_agg_ref:data.cell_agg_ref,
                         cell_agg_render_ref:JSON.stringify(cell_agg_render_ref)
                       };
        let audit_info={id:null,
                        table_name:"report_dyn_trans_agg_def",
                        change_reference: 'Transaction Section Order for ' + update_info.report_id +
                                          '->' + update_info.sheet_id + '->' + data.cell_agg_ref,
                        change_type: this.change_type,
                        maker:this.props.login_store.user,
                        maker_tenant_id:this.props.login_store.domainInfo.tenant_id,
                        comment:data.comment,
                        group_id:this.props.groupId
                        };
        let form_submitted={
                            table_name: "report_dyn_trans_agg_def",
                            change_type: this.change_type,
                            update_info:update_info,
                            audit_info:audit_info
                          };
        console.log("newData to be submitted for ",this.change_type,form_submitted);
        if (this.change_type == "INSERT"){
          this.props.insertTransOrder(form_submitted);
        }
        else {
          let id = this.props.secDetails.secOrders.id;
          this.props.updateTransOrder(id,form_submitted);
        }
        this.props.handleClose();
    }

    handleDelete(element) {
        console.log("inside handleDelete",element);
        let secColumns = this.state.formSecElements;
        var index = secColumns.indexOf(element);
        if (index > -1) {
          secColumns.splice(index, 1);
        }
        this.setState({formSecElements:secColumns});
    }

    renderbuttons(){
        let columns=[];
        let secColumns=[].concat(this.state.showColumns.map(col=>(col.col_id)));
        let formSecElements= this.state.formSecElements;
        console.log("secColumns::",secColumns);
        console.log("formSecColumns::",formSecElements);
        formSecElements.map((col)=>{
          var index = secColumns.indexOf(col);
          if (index > -1) {
            secColumns.splice(index, 1);
          }
        })
        console.log("secColumns after change::",secColumns);
        secColumns.map((col)=>{
        columns.push(
                      <button type="button"
                        className="btn btn-sm btn-default"
                        title={"Column: " + col}
                        onClick={() => { this.addFormElement(col) }}>
                        {col}
                      </button>
                    );
        });
        return columns;
      }

      addFormElement(col)
      {
        let formSecElements= this.state.formSecElements;
        console.log("On adding, ",col);
        formSecElements.push(col);
        this.setState({formSecElements: formSecElements,});
        console.log("On adding,formSecElements: ",this.state.formSecElements);
      }

     renderColumns(){
        let columns=[];
        let formSecElements = this.state.formSecElements;
        columns.push(this.getSecElement("cell_agg_ref"));
        columns.push(this.getSecElement("ranktype"));
        columns.push(this.getSecElement("rankvalue"));
        formSecElements.map((col)=>{columns.push(this.getSecElement(col));
        })
        !this.viewOnly && columns.push(this.getSecElement("Comment"));
        return columns;
    }

    moveRow(element,direction)
    {
        var currentIndex = this.state.formSecElements.indexOf(element);
        if (currentIndex === 0 && direction === 'UP')
            return;
        if (currentIndex === this.state.formSecElements.length - 1 && direction === 'DOWN')
            return;

        if (direction === 'UP') {
            let currentValue = this.state.formSecElements[currentIndex];
            let intendedValue = this.state.formSecElements[currentIndex - 1];
            let changedformSecElements = [...this.state.formSecElements];
            changedformSecElements[currentIndex] = intendedValue;
            changedformSecElements[currentIndex - 1] = currentValue;
            this.setState({ formSecElements: changedformSecElements });
        }
        else {
            let currentValue = this.state.formSecElements[currentIndex];
            let intendedValue = this.state.formSecElements[currentIndex + 1];
            let changedformSecElements = [...this.state.formSecElements];
            changedformSecElements[currentIndex] = intendedValue;
            changedformSecElements[currentIndex + 1] = currentValue;
            this.setState({ formSecElements: changedformSecElements });
        }
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
              readOnly={this.viewOnly}
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
              readOnly={this.viewOnly}
            />
        )
      }else if (col=="cell_agg_ref") {
        return(
          <Field
              label={"Sec Order Ref"}
              name={"cell_agg_ref"}
              type="input"
              component={renderField}
              readOnly={true}
            />
        )
      }else if (col=="Comment" && !this.viewOnly) {
        return(
          <Field
              label={"Comment"}
              name={"comment"}
              type="textarea"
              component={renderField}
            />
        )
      }
       else{
        return(
          <Field
              label={<div><i className="fa fa-columns"></i><span>{' '+col}</span></div>}
              name={col}
              index={col}
              type="select"
              optionList={[{value:"ASC",description:"Ascending"},{value:"DSC",description:"Descending"}]}
              component={renderField}
              formSecElements={this.state.formSecElements}
              maxIndex={this.state.formSecElements.length - 1}
              moveRow={this.moveRow}
              handleDelete={this.handleDelete}
              readOnly={this.viewOnly}
            />
        )
      }
    }
}

function mapStateToProps(state) {
  console.log("Inside mapStateToProps AddTransReportSectionOrder",state.login_store);
    return {
      login_store: state.login_store,
      leftmenu: state.leftmenu_store.leftmenuclick,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
      insertTransOrder: (data) => {
          dispatch(actionTransReportInsertRule(data));
      },
      updateTransOrder: (id,data) => {
          dispatch(actionTransReportUpdateRule(id,data));
      },
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
