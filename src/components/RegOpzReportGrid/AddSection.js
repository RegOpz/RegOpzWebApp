import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import { WithContext as ReactTags } from 'react-tag-input';
import _ from 'lodash';
import ModalAlert from '../ModalAlert/ModalAlert';

class AddSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //TODO
      range: '',
      section_id: '',
      section_type: '',
      sectionTags: [],
      sectionSuggestions: [],
      audit_form: {
        comment: null
      },
    };
    this.sections = this.props.sections;
    this.selectedSection = this.props.selectedSection;
    this.selectedCellRange = this.props.selectedCellRange;
    this.alphaSequence = this.alphaSequence.bind(this);

    this.handleSectionsDelete = this.handleSectionsDelete.bind(this);
    this.handleSectionsAddition = this.handleSectionsAddition.bind(this);
    this.handleSave = this.handleSave.bind(this);

    this.searchAnywhere = this.searchAnywhere.bind(this);


  }

  componentWillReceiveProps(nextProps) {
    console.log('Next Props: ', nextProps,this.state.range);
    this.selectedCellRange = nextProps.selectedCellRange;
    this.sections = nextProps.sections;

      let {sectionTags,sectionSuggestions,section_id,section_type,range} =this.state;
      if(this.selectedCellRange.length == 0){
        range = '';
      } else if (this.selectedCellRange[0]!=null || this.selectedCellRange[0]!=undefined){
        range = this.alphaSequence(this.selectedCellRange[1])+(this.selectedCellRange[0]+1) +
                ':' + this.alphaSequence(this.selectedCellRange[3])+(this.selectedCellRange[2]+1);
        console.log("Inside range creation",range);
      }
      if(!_.isEqual(this.selectedSection,nextProps.selectedSection)){
        this.selectedSection = nextProps.selectedSection;
      if (this.selectedSection){
        // Populate the selected section values
        this.selectedSection.section_position.map((tag,index)=>{sectionTags.push({id: index+1, text: tag})})
        section_id = this.selectedSection.section_id;
        section_type = this.selectedSection.section_type;
        console.log("Inside selected section creation 1",range,'|',this.selectedSection.range);
        range = range=='' ? this.selectedSection.range : range;
        console.log("Inside selected section creation",range,'|',this.selectedSection.range);
      } else {
        section_id = '';
        section_type = '';
        range = '';
      }
      sectionSuggestions = [];
      this.sections.map((sec,index)=>{
        console.log("sec.section_position.indexOf(section_id)",_.isEqual(sec, this.selectedSection),sec.section_position.indexOf(section_id))
        if(!_.isEqual(sec, this.selectedSection) && sec.section_position.indexOf(section_id)==-1){sectionSuggestions.push(sec.section_id)}
      });

    }
    this.setState({range,sectionSuggestions,sectionTags,section_id,section_type});

  }

  componentWillMount() {
    //TODO
  }

  componentDidUpdate() {
    //TODO
  }

  alphaSequence(i) {
      return i < 0
          ? ""
          : this.alphaSequence((i / 26) - 1) + String.fromCharCode((65 + i % 26) + "");
  }

  handleSectionsDelete(i) {

    let sectionTags = this.state.sectionTags;
    sectionTags.splice(i, 1);
    this.setState({ sectionTags: sectionTags });
  }

  handleSectionsAddition(tag) {
    let sectionTags = this.state.sectionTags;
    console.log('inside sectionTags addition 0', sectionTags, this.state.sectionTags);
    // check whether its a valid rule to be added
    if (this.state.sectionSuggestions.indexOf(tag) != -1) {
      if (sectionTags.map(function(r){return r.text;}).indexOf(tag) == -1){
        sectionTags.push({
            id: sectionTags.length + 1,
            text: tag
        });
        this.setState({ sectionTags: sectionTags });
      } else {
        this.modalAlert.isDiscardToBeShown = false;
        this.modalAlert.open(
          <span className="">
            <i className="fa fa-warning amber"></i>
            {" Source column attribute [ " + tag + " ] already added, please check..."}
          </span>);
      }
    }
    else {
      this.modalAlert.isDiscardToBeShown = false;
      this.modalAlert.open(
        <span className="">
          <i className="fa fa-warning amber"></i>
          {" [ " + tag + " ] is not a valid source column attribute, please check..."}
        </span>);
    }
  }


  searchAnywhere(textInputValue, possibleSuggestionsArray) {
    var lowerCaseQuery = textInputValue.toLowerCase()

    return possibleSuggestionsArray.filter(function (suggestion) {
      return suggestion.toLowerCase().includes(lowerCaseQuery)
    })
  }

  isRangeConflict(){
    let noIntersect = false;
    let [rowStart,colStart,rowEnd,colEnd] = this.selectedCellRange;
    let r1 ={x:[rowStart,rowEnd], y: [colStart,colEnd]}
    this.sections.map((sec,index)=>{
      console.log("sec and selected sec ", sec, this.selectedSection, noIntersect,_.isEqual(sec, this.selectedSection));
      if(!noIntersect && !_.isEqual(sec, this.selectedSection)){
        let [secRowStart,secColStart,secRowEnd,secColEnd] = sec.ht_range;
        // If one rectangle is on left side of other
        if (colStart > secColEnd || secColStart > colEnd){
          // noIntersect = false;
        }
        // If one rectangle is above other, please check the > sign here as our report grid
        // Y axis is inverted (starts at 0 row and increaes as we go down the rows....)
        else if (rowStart > secRowEnd || secRowStart > rowEnd){
          // noIntersect = false;
        } else {
          noIntersect = true;
        }
        console.log("Nointersect ", noIntersect, JSON.stringify(this.selectedCellRange), JSON.stringify(sec.ht_range));
        // false (4) [7, 3, 8, 3] (4) [8, 2, 10, 3]
            // return noIntersect ? false : true;
      }
    })

    if(noIntersect){
      this.setState({range :''});
      this.modalAlert.isDiscardToBeShown = false;
      this.modalAlert.open(
        <span className="">
          <i className="fa fa-warning amber"></i>
          {" Selected range is conflicting with existing sections. Please check and select a different range..."}
        </span>);
    }

    return noIntersect;
  }

  isValidSectionId(){
    let invalidSectionID = false;
    this.sections.map((sec,index)=>{
      if(!invalidSectionID && !_.isEqual(sec, this.selectedSection)){
        invalidSectionID = sec.section_id == this.state.section_id;
      }
    })

    if(invalidSectionID){
      this.setState({section_id :''});
      document.getElementById("sectionId").focus();
      this.modalAlert.isDiscardToBeShown = false;
      this.modalAlert.open(
        <span className="">
          <i className="fa fa-warning amber"></i>
          {" Section ID already exists. Please check and use a different Section ID..."}
        </span>);
    }

    return !invalidSectionID;
  }

  handleSave(event){
    event.preventDefault();
    // First check whether range selected is conflicting with other sections
    if(! this.isRangeConflict() && this.isValidSectionId()){
      let section = {
        range: this.state.range,
        section_id : this.state.section_id,
        section_type : this.state.section_type,
        section_position : this.state.sectionTags.map((r)=>{return r.text}),
        ht_range: this.selectedCellRange,
      };
      if(this.selectedSection && this.selectedSection.section_id!=''){
        // update all the references of the section id (if any) for the amended section
        this.sections.map((sec,index)=>{
          if(sec.section_id==this.selectedSection.section_id){
            this.sections.splice(index,1,section);
          } else {
            let indexOfSecRef = sec.section_position.indexOf(this.selectedSection.section_id);
            if(indexOfSecRef != -1){
              this.sections[index].section_position.splice(indexOfSecRef,1,this.state.section_id);
            }
          }
        })
        // Directly assign the new values for the section in the sections object
        this.setState({range: '', sectionTags: [], section_id: '', section_type: ''},
                      ()=>{this.props.handleSave(null)});

      } else {
        this.setState({range: '', sectionTags: [], section_id: '', section_type: ''},
                      ()=>{this.props.handleSave(section)});
      }
    }
  }

  render() {
    const { range,sectionTags, sectionSuggestions } = this.state;
    return(
      <div className="x_panel">
        <div className="x_title">
          <h2>{
            this.state.range
          }<small> Manage section details</small></h2>

          <div className="clearfix"></div>
        </div>
        <div className="x_content">
        <form id="addSectionForm" className="form-horizontal form-label-left"
          onSubmit={this.handleSave}
        >

            <div className="col-md-6 col-sm-6 col-xs-12 form-group has-feedback">
              <input
                value={this.state.range}
                placeholder="range"
                readOnly={false}
                type="text"
                title={"Section Cell Range"}
                required={true}
                className="form-control has-feedback-left"
              />
            <span className="fa fa-crop form-control-feedback left" aria-hidden="true"></span>
            </div>
            <div className="col-md-6 col-sm-6 col-xs-12 form-group has-feedback">
              <input
                id="sectionId"
                value={this.state.section_id}
                placeholder="Section ID"
                readOnly={false}
                type="text"
                maxLength={20}
                required={true}
                title={"Enter Section ID"}
                className="form-control has-feedback-left"
                onChange={
                  (e)=>{
                    this.setState({section_id: e.target.value});
                  }
                }
              />
            <span className="fa fa-paperclip form-control-feedback left" aria-hidden="true"></span>
            </div>

            <div className="col-md-6 col-sm-6 col-xs-12 form-group has-feedback">
              <select
                value={this.state.section_type}
                placeholder="Section Type"
                readOnly={false}
                type="text"
                maxLength={12}
                required={true}
                title={"Select Section Type"}
                className="form-control has-feedback-left"
                onChange={
                  (e)=>{
                    this.setState({section_type: e.target.value})
                  }
                }
              >
                <option value="">Section Type</option>
                <option key="1" value="FIXEDFORMAT">Fixed Format</option>
                <option key="2" value="TRANSACTION">Transactional</option>
              </select>
            <span className="fa fa-cubes form-control-feedback left" aria-hidden="true"></span>
            </div>

            <div className="col-md-1 col-sm-1 col-xs-1 form-group" title="Section dependency">
              <i className="fa fa-code-fork"></i>
            </div>

            <div className="col-md-5 col-sm-5 col-xs-12 form-group" title="Section dependency">

              <ReactTags tags={sectionTags}
                suggestions={sectionSuggestions}
                readOnly={this.state.readOnly}
                handleDelete={this.handleSectionsDelete}
                handleAddition={this.handleSectionsAddition}
                handleFilterSuggestions={this.searchAnywhere}
                allowDeleteFromEmptyInput={false}
                autocomplete={true}
                minQueryLength={1}
                inline={true}
                classNames={{
                  tagInput: 'tagInputClass',
                  tagInputField: 'tagInputFieldClass form-control ',
                  suggestions: 'suggestionsClass',
                }}
                placeholder="Section dependency"
                required="required"
              />

            </div>
            <ul className="nav navbar-right panel_toolbox">
              <li>
                <button  type="submit" className="btn btn-xs btn-success"
                  title="Save Changes"
                  >
                  <i className="fa fa-save "></i>
                </button>
              </li>
            </ul>
        </form>
      </div>
        <ModalAlert
          ref={(modalAlert) => {this.modalAlert = modalAlert}}
          onClickOkay={this.handleModalOkayClick}
        />
    </div>

    );

  }
}


function mapStateToProps(state) {
  console.log("On map state of Add report rule", state);
  return {
    // sources: state.maintain_report_rules_store.sources,
    // business_rules: state.business_rules,
    // source_table_columns: state.maintain_report_rules_store.source_table_columns,
    // login_details: state.login_store,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // fetchSources: (sourceId) => {
    //   dispatch(actionFetchSources(sourceId));
    // },
  }
}
const VisibleAddSection = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddSection);
export default VisibleAddSection;
