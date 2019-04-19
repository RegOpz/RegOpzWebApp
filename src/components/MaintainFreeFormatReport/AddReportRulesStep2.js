import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { WithOutContext as ReactTags } from 'react-tag-input';
import CellCalcRuleAssist from './CellCalcRuleAssist';

class AddReportRulesStep2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // TODO
      rulesTags: [],
    };
    // this.rulesTags =[];
    // this.rulesSuggestions =[];
    this.modalAlert = this.props.modalAlert;

    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.searchAnywhere = this.searchAnywhere.bind(this);
    this.flatenTags = this.flatenTags.bind(this);
    this.isFormValid = this.isFormValid.bind(this);

  }

  componentWillMount() {
    // TODO
    let rulesTags=[];
    const {form} = this.props;
    if(form.cell_business_rules) {
      form.cell_business_rules.split(',').map(function(item,index){
        if(item !='') { rulesTags.push({id: item, text: item});}
      });
    }
    console.log("rulesTags",rulesTags);
    this.setState({rulesTags});
  }

  componentWillReceiveProps(nextProps) {
      // TODO
  }

  searchAnywhere(textInputValue, possibleSuggestionsArray) {
    var lowerCaseQuery = textInputValue.toLowerCase()

    return possibleSuggestionsArray.filter(function(suggestion)  {
        return suggestion.toLowerCase().includes(lowerCaseQuery)
    })
  }

  handleDelete(i) {
      let rulesTags = this.state.rulesTags;
      rulesTags.splice(i, 1);
      this.setState({rulesTags: rulesTags},
      ()=>{
        let newform = this.flatenTags();
        this.props.handleSetFormValues(newform);
      });
  }

  handleAddition(tag) {
        let rulesTags = this.state.rulesTags;
        // check whether its a valid rule to be added
        if (this.props.rulesSuggestions.indexOf(tag) != -1){
          if (rulesTags.map(function(r){return r.text;}).indexOf(tag) == -1){
            rulesTags.push({
                id: tag,
                text: tag
            });
            this.setState({rulesTags: rulesTags},
              ()=>{
                let newform = this.flatenTags();
                this.props.handleSetFormValues(newform);
              });
          } else {
            this.modalAlert.isDiscardToBeShown = false;
            this.modalAlert.open(
              <span className="">
                <i className="fa fa-warning amber"></i>
                {" Business rule [ " + tag + " ] already added, please check..."}
              </span>);
          }

        }
        else{
          this.modalAlert.isDiscardToBeShown = false;
          this.modalAlert.open(
            <span className="">
              <i className="fa fa-warning amber"></i>
              {" [ " + tag + " ] is not a valid business rule, please check..."}
            </span>);
        }

    }

  handleDrag(tag, currPos, newPos) {
        let rulesTags = this.state.rulesTags;

        // mutate array
        rulesTags.splice(currPos, 1);
        rulesTags.splice(newPos, 0, tag);

        // re-render
        this.setState({ rulesTags: rulesTags });
    }

  flatenTags(){

    let newform = this.props.form;
    newform.cell_business_rules = '';
    // console.log('inside process',this.state);
    this.state.rulesTags.map(function(item,index){
        newform.cell_business_rules += `${item.text},`;
      });
    return newform;
  }

  isFormValid(){
    let {form} = this.props;
    let valid = (form.cell_business_rules && form.cell_business_rules.length > 0) &&
                  (form.aggregation_ref && form.aggregation_ref.length > 0) &&
                  (form.aggregation_func && form.aggregation_func.length > 0);
    return !valid;
  }


  render(){
      const { handleNextStep, handlePrevStep, handleSetFormValues, handleEditCalcRule, handleChangeRule,
              rulesSuggestions, form, display, viewOnly } = this.props;
      return(
        <form onSubmit={handleNextStep}>
        <div className="form-label-left" >
            <div className="form-group">
              <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Rules <span className="required">*</span></label>
              <div className="col-md-6 col-sm-6 col-xs-12">
                <ReactTags tags={this.state.rulesTags}
                  suggestions={rulesSuggestions}
                  readOnly={viewOnly}
                  handleDelete={this.handleDelete}
                  handleAddition={this.handleAddition}
                  handleDrag={this.handleDrag}
                  handleFilterSuggestions={this.searchAnywhere}
                  allowDeleteFromEmptyInput={false}
                  autocomplete={true}
                  minQueryLength={1}
                  classNames={{
                    tagInput: 'tagInputClass',
                    tagInputField: 'tagInputFieldClass form-control',
                    suggestions: 'suggestionsClass',
                  }}
                  placeholder="Enter Business Rule"
                />
              </div>
            </div>
            {
              !display &&
              <div className="form-group">
                <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Aggregation Logic <span className="required">*</span></label>
                <div className="col-md-6 col-sm-6 col-xs-12">
                  <textarea
                    type="text"
                    required="requried"
                    className="form-control col-md-6 col-sm-6 col-xs-12"
                    placeholder="Enter Aggregation Definition"
                    value={form.aggregation_ref}
                    readOnly={true}
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
                    />
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-xs"
                  disabled={!form.source_id.toString() || viewOnly}
                  onClick={(event)=>{
                    handleEditCalcRule(null,true);
                  }}
                  >
                  Edit
                </button>
              </div>
            }
            {
              display=="editCellRule" &&
              // this.props.source_table_columns &&
              form.source_id.toString() !="" &&
              <CellCalcRuleAssist
                {...form}
                sourceColumns={this.props.sourceColumns}
                handleEditCalcRule={handleEditCalcRule}
                handleChangeRule={handleChangeRule}
                />
            }
            <div className="form-group">
              <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Aggregation Funciton <span className="required">*</span></label>
              <div className="col-md-6 col-sm-6 col-xs-12">
                <input
                  type="text"
                  placeholder="Enter Aggregation function"
                  readOnly={viewOnly}
                  required="required"
                  className="form-control col-md-7 col-xs-12"
                  value={form.aggregation_func}
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
                      newform.aggregation_func = event.target.value;
                      handleSetFormValues(newform);
                    }
                  }
                />
              </div>
            </div>
        </div>
        <div className="form-group">
          <div className="actionBar">
            <button type="button" className="btn btn-default btn-sm"
              onClick={handlePrevStep}>
              Back
            </button>
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


export default AddReportRulesStep2;
