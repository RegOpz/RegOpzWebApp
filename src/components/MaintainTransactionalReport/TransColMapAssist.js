import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { actionValidateExp } from './../../actions/RuleAssistAction';

class TransColMapAssist extends Component {
    constructor(props) {
        super(props);
        this.state={
          filterText: null,
          currentFormula: this.props.mapped_column,
          validationState: false,
          mappingColumns: null,
          businessDate: moment(),
          sampleSize: 0,
          validationform:{}
        };

        this.renderSourceColumns = this.renderSourceColumns.bind(this);
        this.renderValidationColumns = this.renderValidationColumns.bind(this);
        this.validationformAttr = this.validationformAttr.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.updateFormula = this.updateFormula.bind(this);
        this.checkColumnInMapping = this.checkColumnInMapping.bind(this);

    }

    // React life cycle
    componentWillMount() {
        // TODO
        let mappingColumns = this.checkColumnInMapping(this.state.currentFormula);
        let validationform = this.validationformAttr(mappingColumns);
        this.setState({
            mappingColumns: mappingColumns,
            validationform: validationform,
        });

    }

    componentWillReceiveProps(nextProps) {
        // TODO

    }

    // User defined functions
    handleDateChange(date){
      this.setState({businessDate: date});
    }
    renderSourceColumns(){
      let filteredColumns= this.props.sourceColumns;
      let columns=[];
      const { filterText } = this.state;


      if (filterText !== null) {
          let matchText = RegExp(`(${filterText.toString().toLowerCase().replace(/[,+&\:\ ]$/,'').replace(/[,+&\:\ ]/g,'|')})`,'i');
          filteredColumns = this.props.sourceColumns.filter(item =>
              item.Field.toString().match(matchText)
          );
      }
      filteredColumns.map((item,index)=>{
        columns.push(
          <button
            type="button"
            className="btn btn-default btn-xs"
            name={item.Field}
            key={item.Field}
            title="Add to mapping"
            onClick={() => { this.handleFormFieldClick(item.Field); }}
            >
          {item.Field}
          </button>
        )
      });
      return columns;
    }

    renderValidationSection(){
      return(
        <div>
          <div className="col-md-6 col-sm-6 col-xs-12">
            <div className="x_panel">
              <div className="x_title">
                <h5>Sample Data Size<small> for validation</small></h5>
                <div className="clearfix"></div>
              </div>
              <div className="x_content">
                <div className="form-group">
                  <label className="control-label col-md-4 col-sm-4 col-xs-12">Business Date </label>
                  <DatePicker
                      dateFormat="DD-MMM-YYYY"
                      className="col-md-7 col-sm-7 col-xs-7"
                      placeholderText='Select a date'
                      onChange={this.handleDateChange}
                      selected={this.state.businessDate}
                  />
                </div>
                <div className="form-group">
                  <label className="control-label col-md-4 col-sm-4 col-xs-12">Sample Size </label>
                    <input
                        type='number'
                        value={this.state.sampleSize}
                        onChange={(event)=>{
                          this.setState({sampleSize: event.target.value})
                        }}
                        className="col-md-3 col-sm-3 col-xs-6"
                        placeholder='Enter the sample size'
                    />
                </div>
              </div>
            </div>
            <div className="col-md-offset-3">
              <button
                type="button"
                className="btn btn-warning btn-xs"
                onClick={this.props.handleEditColMapping}
                >
                Validate
              </button>
            </div>
          </div>
          <div className="col-md-6 col-sm-6 col-xs-12">
            <div className="x_panel">
              <div className="x_title">
                <h5>Input Data <small> for validation</small></h5>
                <div className="clearfix"></div>
              </div>
              <div className="x_content ">
                <div>
                  {
                    this.renderValidationColumns()
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    renderValidationColumns(){
      let validationColumns=[];

      // this.state.mappingColumns && this.state.mappingColumns.map((item,index)=>{
      this.state.validationform && Object.keys(this.state.validationform).map((item,index)=>{
        validationColumns.push(
          <div className="form-group">
            <label className="control-label col-md-4 col-sm-4 col-xs-12" htmlFor={item.Field}><small>{item}</small></label>
            <div className="col-md-6 col-sm-6 col-xs-12">
              <input
                placeholder={item}
                value={this.state.validationform[item]}
                type="text"
                name={item}
                key={item}
                title={item}
                onChange={(event)=>{
                  let validationform=this.state.validationform;
                  validationform[item]=event.target.value;
                  this.setState({validationform});
                }}
                className="form-control col-md-6 col-xs-12"
              />
            </div>
          </div>
        )
      });
      return validationColumns;

    }

    handleFormFieldClick(element) {
        let currentFormula = this.state.currentFormula ? this.state.currentFormula : "";
        if ( currentFormula != "" && (this.formulaInput.selectionStart || this.formulaInput.selectionStart == '0')) {
            let startPos = this.formulaInput.selectionStart;
            let endPos = this.formulaInput.selectionEnd;
            currentFormula = currentFormula.substring(0, startPos) +
                element +
                currentFormula.substring(endPos, this.state.currentFormula.length);
            this.formulaInput.selectionStart = startPos + element.length;
            this.formulaInput.selectionEnd = startPos + element.length;
        }
        else
            currentFormula += element;

        let mappingColumns = this.checkColumnInMapping(currentFormula);
        let validationform = this.validationformAttr(mappingColumns);

        this.setState({
            currentFormula: currentFormula,
            validationState: false,
            mappingColumns: mappingColumns,
            validationform: validationform,
        });
        this.formulaInput.focus();
    }

    updateFormula(event) {
        let value = event.target.value;
        let currentFormula = value;
        let mappingColumns = this.checkColumnInMapping(currentFormula);
        let validationform = this.validationformAttr(mappingColumns);
        this.setState({
            currentFormula: currentFormula,
            validationState: false,
            mappingColumns: mappingColumns,
            validationform: validationform,
        });
    }

    checkColumnInMapping(currentFormula){
      let mappingColumns = this.props.sourceColumns.filter(item =>
          currentFormula && currentFormula.includes(item.Field.toString())
      );
      return mappingColumns;
    }

    validationformAttr(columns){
      let validationform = {};
      let currentColumns = Object.keys(this.state.validationform);
      console.log("validationform...",this.state.validationform);
      columns.map(item=>{
        if(currentColumns.indexOf(item.Field)==-1){
          validationform[item.Field]= null;
        } else {
          validationform[item.Field]= this.state.validationform[item.Field];
        }
      })
      return validationform;
    }


    render() {
        return (
          <div className="">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <div className="x_panel">
              <div className="x_title">
                <h2>Edit Mapping<small> for the column </small><small><strong>{this.props.col_id}</strong></small></h2>
                  <ul className="nav navbar-right panel_toolbox">
                    <li>
                      <a
                        className="close-link"
                        onClick={this.props.handleEditColMapping}
                        title="To mapping list">
                        <i className="fa fa-close"></i>
                      </a>
                    </li>
                  </ul>
                <div className="clearfix"></div>
              </div>
              <div className="x_content">
                <div className="x_panel">
                    <div className="x_title">
                        <h4>
                          <strong>Existing Mapping </strong>
                          <i className="fa fa-leaf"></i>
                          <small>{" " + this.props.mapped_column}</small>
                        </h4>
                        <div className="clearfix"></div>
                    </div>
                    <div className="x_content">
                      <div className="form-group">
                        <textarea
                            className="form-control"
                            type="text"
                            disabled={false}
                            value={this.state.currentFormula}
                            onChange={this.updateFormula}
                            placeholder='Enter a formula here...'
                            ref={(textArea) => { this.formulaInput = textArea }}
                        />
                      </div>
                      <div className="form-group">
                        <button
                          type="button"
                          className="btn btn-success btn-xs"
                          onClick={(event)=>{
                            event.target.value=this.state.currentFormula;
                            this.props.handleChange(event, 'mappedColumn', this.props.index);
                            this.props.handleEditColMapping();
                          }}
                          >
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn btn-default btn-xs"
                          onClick={this.props.handleEditColMapping}
                          >
                          Cancel
                        </button>
                      </div>
                    </div>
                    {
                      this.renderValidationSection()
                    }
                </div>
                <h2><small><strong>Available Attributes</strong></small></h2>
                <div className="input-group">
                    <input
                      id="filter"
                      className="form-control col-md-9 col-sm-9 col-xs-12"
                      placeholder="Enter Filter Text"
                      value={this.state.filterText}
                      onChange={(event) => {
                          this.setState({ filterText: event.target.value });
                      }}
                    />
                    <span className="input-group-addon">
                      <i className="fa fa-filter"></i>
                    </span>
                </div>
                <div>
                  { this.renderSourceColumns() }
                </div>
              </div>
              </div>
            </div>
          </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        // TODO
    };
}

const matchDispatchToProps = (dispatch) => {
    return {
        // TODO
        // validateExp: (tableName, businessDate, sampleSize, columns, expression, attr) => {
        //     dispatch(actionValidateExp(tableName, businessDate, sampleSize, columns, expression, attr));
        // }
    };
}

export default connect(mapStateToProps, matchDispatchToProps)(TransColMapAssist);
