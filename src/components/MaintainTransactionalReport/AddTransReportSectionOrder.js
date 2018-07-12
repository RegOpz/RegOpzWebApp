import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import moment from 'moment';
import { actionPostTransOrderTemplate } from '../../actions/TransactionReportAction';

const renderField = ({ input,index, label, handleDelete, moveRow,maxIndex, formSecElements, type, optionList, readOnly, meta: { touched, error }}) => (
    <div className="form-group">
      <label className="control-label col-md-2 col-sm-2 col-xs-2">
        { label }
      </label>
      <div className="col-md-3 col-sm-3 col-xs-12">
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
        input.name !=="ranktype" && input.name !=="rankvalue" && input.name !=="cell_agg_ref" && input.name !=="maker_comment" &&
        <div className="col-md-3 col-sm-3 col-xs-12">
        {
            formSecElements.indexOf(index) !== 0 &&
            <button type="button" onClick={() => { moveRow(index, 'UP') }}><i className="fa fa-arrow-up"></i></button>
        }
        {
            formSecElements.indexOf(index) !== maxIndex &&
            <button type="button" onClick={() => { moveRow(index, 'DOWN') }}><i className="fa fa-arrow-down"></i></button>
        }
         <button type="button" onClick={()=>{handleDelete(index)}}><i className="fa fa-close"></i></button>
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
    if (!values.maker_comment) {
        errors.maker_comment = "Comment can not be empty.";
    }
    return errors;
}

class AddTransReportSectionOrder extends Component {
    constructor(props) {
        super(props);
        this.toInitialise = true;
        this.secColumns= this.props.secDetails.secColumns;
        console.log("Dynamic Columns ",this.secColumns);
        console.log("All available data are::",this.props.secDetails,this.props.gridData);
        console.log("All available data2 are::",this.props.selectedCell);
        //this.secSort = {sortorder:this.props.secDetails.secColumns}; //this.secDetails.secOrders.sortOrder;
        this.state={
          // TODO : Refine based on the structure for columns of the Ordering
          // {ranktype: , rankvalue: , sortorder: [{},{},...]}
          formSecElements: [],
          showColumns: this.secColumns,
        }

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.renderColumns = this.renderColumns.bind(this);
        this.getSecElement = this.getSecElement.bind(this);
        this.renderbuttons = this.renderbuttons.bind(this);
        this.addFormElement = this.addFormElement.bind(this);
        this.moveRow = this.moveRow.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
    // react life cycles
    componentWillReceiveProps(nextProps){
        // TODO
        this.secColumns= (nextprops.secDetails.secColumns)?nextprops.secDetails.secColumns:this.props.secDetails.secColumns;
    }

    componentDidUpdate(){
      // To initialise the redux form values
      if (this.toInitialise) {
        // TODO: Initialise will be based on the new structure to be formed
          //this.props.initialize(this.secSort);
          this.toInitialise = false;
      }
    }

    componentDidMount(){
      // To initialise the redux form values
      //console.log("initialise sec order...", this.secDetails.secOrders.sortOrder)
      if (this.toInitialise) {
        // TODO: Initialise will be based on the new structure to be formed
          //this.props.initialize(this.secSort);
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
                {this.renderbuttons()}
              </div>
              <div className="col-md-offset-3">
              <form className="form-horizontal form-label-left" onSubmit={ handleSubmit(this.handleFormSubmit) } >
                { this.renderColumns()}
                <div className="form-group">
                  <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-2">
                    <button type="button" className="btn btn-primary" onClick={ this.props.handleClose }>Cancel</button>
                    <button type="submit" className="btn btn-success" >Submit</button>
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
        this.state.formSecElements.map((col)=>{content.push({column:col.col_id,order:data.hasOwnProperty(col.col_id)?data[col.col_id]:"ASC"})})
        let groupId=this.props.login_store.user+this.props.login_store.domainInfo.tenant_id+"RR"+moment.utc();
        let cell_agg_render_ref={ranktype:data.ranktype?data.ranktype:null,
                                rankvalue:data.rankvalue?data.rankvalue:null,
                                sortorder:content};
        let update_info={id:null,
                         report_id:this.props.selectedCell.reportId,
                         sheet_id:this.props.selectedCell.sheetName,
                         section_id:this.props.secDetails.section,
                         cell_agg_ref:data.cell_agg_ref,
                         cell_agg_render_ref:cell_agg_render_ref};
        let audit_info={id:null,
                        prev_id:null,
                        origin_id:null,
                        table_name:"report_dyn_trans_agg_def",
                        change_summary:null,
                        change_type:"INSERT",
                        maker:this.props.login_store.user,
                        maker_tenant_id:this.props.login_store.domainInfo.tenant_id,
                        maker_comment:data.maker_comment,
                        group_id:groupId
                        };
        let form_submitted={update_info:update_info,audit_info:audit_info};
        console.log("newData to be submitted",form_submitted);
        this.props.postTransOrder(form_submitted);
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
        let secColumns=[].concat(this.state.showColumns.map(col=>(col)));
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
        columns.push(<button onClick={() => { this.addFormElement(col) }}>{col.col_id}</button>);
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
        columns.push(this.getSecElement("Cell_Agg_Ref"));
        columns.push(this.getSecElement("ranktype"));
        columns.push(this.getSecElement("rankvalue"));
        formSecElements.map((col)=>{columns.push(this.getSecElement(col));
        })
        columns.push(this.getSecElement("Comment"));
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
      }else if (col=="Cell_Agg_Ref") {
        return(
          <Field
              label={"Cell_Agg_Ref "}
              name={"cell_agg_ref"}
              type="input"
              component={renderField}
            />
        )
      }else if (col=="Comment") {
        return(
          <Field
              label={"Description"}
              name={"maker_comment"}
              type="textarea"
              component={renderField}
            />
        )
      }
       else{
        return(
          <Field
              label={<div><i className="fa fa-columns"></i><span>{' '+col.col_id}</span></div>}
              name={col.col_id}
              index={col}
              type="select"
              optionList={[{value:"ASC",description:"Ascending"},{value:"DSC",description:"Descending"}]}
              component={renderField}
              formSecElements={this.state.formSecElements}
              maxIndex={this.state.formSecElements.length - 1}
              moveRow={this.moveRow}
              handleDelete={this.handleDelete}
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
      postTransOrder: (form_submitted) => {
          dispatch(actionPostTransOrderTemplate(form_submitted));
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
