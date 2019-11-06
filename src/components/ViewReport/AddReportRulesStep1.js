import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class AddReportRulesStep1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // TODO
    };

    this.isFormValid = this.isFormValid.bind(this);

  }

  componentWillMount() {
    // TODO
  }

  componentWillReceiveProps(nextProps) {
      // TODO
  }

  isFormValid(){
    let {form} = this.props;
    let valid = (form.cell_calc_extern_ref && form.cell_calc_extern_ref.length > 0) &&
                  (form.cell_calc_decsription && form.cell_calc_decsription.length >= 20) &&
                  (form.source_id &&  form.source_id.toString().length > 0);
    // alert(valid)
    return !valid;
  }


  render(){
      const { handleNextStep, form, viewOnly } = this.props;
      return(
        <form onSubmit={handleNextStep}>
        <div className="form-label-left" >
            <div className="form-group">
              <label className="control-label col-md-3 col-sm-3 col-xs-12 ">
                Reference <span className="required">*</span></label>
              <div className="col-md-8 col-sm-8 col-xs-12">
                <input
                  type="text"
                  placeholder="Enter Calculation External Ref"
                  readOnly={viewOnly}
                  required
                  className="form-control col-md-9 col-xs-12"
                  value={form.cell_calc_extern_ref}
                  draggable
                  onDragStart = {
                    (event)=>{
                      event.preventDefault();
                      event.stopPropagation();
                    }
                  }
                  onDoubleClick = {
                    (event)=>{
                      event.preventDefault();
                      event.stopPropagation();
                    }
                  }
                  onChange={
                    (event) => {
                      let newform=form;
                      newform.cell_calc_extern_ref = event.target.value;
                      this.props.handleSetFormValues(newform);
                    }
                  }
                />

              </div>
            </div>
            <div className="form-group">
              <label className="control-label col-md-3 col-sm-3 col-xs-12 ">Description <span className="required">*</span></label>
              <div className="col-md-8 col-sm-8 col-xs-12">
                <textarea
                  type="text"
                  required
                  minLength="20"
                  className="form-control col-md-8 col-sm-8 col-xs-12"
                  placeholder="Enter Calculation Description"
                  value={form.cell_calc_decsription}
                  readOnly={viewOnly}
                  disabled={viewOnly}
                  draggable
                  onDragStart = {
                    (event)=>{
                      event.preventDefault();
                      event.stopPropagation();
                    }
                  }
                  onDoubleClick = {
                    (event)=>{
                      event.preventDefault();
                      event.stopPropagation();
                    }
                  }
                  onChange={
                    (event) => {
                      let newform=form;
                      newform.cell_calc_decsription = event.target.value.slice(0,1000);
                      this.props.handleSetFormValues(newform);
                      // if(form.cell_calc_decsription.length < 20){
                      //   throw new Error('Description should be more than 20 characters!')
                      // }
                    }
                  }
                  />
                  {
                    form.cell_calc_decsription && form.cell_calc_decsription.length < 20 &&
                    <span className="red">Please enter description atleast 20 character long</span>
                  }
              </div>
            </div>

              <div className="form-group">
                <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Source Data <span className="required">*</span></label>
                <div className="col-md-6 col-sm-6 col-xs-12">
                  {
                    (()=>{
                    // if(!viewOnly){
                       return(
                          <select
                            value = {form.source_id}
                            className="form-control"
                            required="requried"
                            disabled={viewOnly}
                            onChange={
                              (event) => {
                                if(event.target.value){
                                  let table_name = (event.target.options[event.target.selectedIndex].getAttribute('target'));
                                  let newform=form;
                                  newform.source_id = event.target.value;
                                  // alert(event.target.value)
                                  newform.aggregation_ref = null;
                                  newform.aggregation_func = null;
                                  newform.cell_business_rules = null;
                                  this.props.handleSetFormValues(newform);
                                  console.log('Source ID............',this.props.form.source_id);
                                  this.props.fetchBusinessRulesBySourceId(this.props.form.source_id);
                                  console.log('table name in change event',table_name);
                                  this.props.fetchSourceColumnList(table_name,null);
                                      // this.handleEditCalcRule(null,true);
                                } else {
                                  let newform=form;
                                  newform.source_id = event.target.value;
                                  // alert(event.target.value)
                                  newform.aggregation_ref = null;
                                  newform.aggregation_func = null;
                                  newform.cell_business_rules = null;
                                  this.props.handleSetFormValues(newform);
                                }
                              }
                            }
                          >
                            <option key={9999999} target={"Choose option"} value={null}>Choose option</option>
                            {
                              this.props.source_suggestion.map(function(item,index){
                                return(
                                  <option key={index} target={item.source_table_name} value={item.source_id}>{item.source_id} - {item.source_table_name}</option>
                                )
                              })
                            }
                          </select>);
                    // }
                    // else{
                    //   return(
                    //     <input value={form.source_id}  type="text" required="required" className="form-control col-md-7 col-xs-12" readOnly="readonly" />
                    //   );
                    // }
                  })()
                }
                </div>
              </div>
        </div>
        <div className="form-group">
          <div className="actionBar">
            <button type="submit" className="btn btn-primary btn-sm"
              disabled={this.isFormValid()}>
              Next
            </button>
          </div>
        </div>
      </form>
      )
    }
  }


export default AddReportRulesStep1;
