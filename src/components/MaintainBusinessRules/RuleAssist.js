import React, { Component } from 'react';
import {
    FormControl,
    Col,
    Row,
    ListGroup,
    ListGroupItem,
    Button,
    Well,
    Label
} from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionValidateExp } from './../../actions/RuleAssistAction';
import DatePicker from 'react-datepicker';
import moment from 'moment';

class RuleAssist extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rule: this.props.rule,
            currentFormula: this.props.rule['python_implementation'],
            regex: /\[(.*?)\]/g,
            columns: this.props.rule['data_fields_list'].split(','),
            businessDate: moment(),
            epochTimeStamp: moment().unix(),
            tableName: this.props.sourceTable['source_table_name'],
            sourceId: this.props.sourceTable['source_id'],
            sampleSize: 300,
            result: 'Result Will Be Shown Here After Validation'
        };

        console.log(this.props);

        this.handleClick = this.handleClick.bind(this);
        this.updateFormula = this.updateFormula.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleTableNameChange = this.handleTableNameChange.bind(this);
        this.handleSampleSizeChange = this.handleSampleSizeChange.bind(this);
        this.handleValidationClick = this.handleValidationClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        this.setState({ result: nextProps.rule_assist });
    }

    handleClick(element) {
        let currentFormula = this.state.currentFormula;
        currentFormula += ' [' + element + '] ';

        // let currentColumns = this.state.columns;
        // let match = this.state.regex.exec(currentFormula);
        // while (match !== null) {
        //     currentColumns.push(match[1]);
        //     match = this.state.regex.exec(currentFormula);
        // }
        // let indexOfId = currentColumns.indexOf('id');
        // if (indexOfId === -1)
        //     currentColumns.push('id');
        // let indexOfBusinessDate = currentColumns.indexOf('business_date');
        // if (indexOfBusinessDate === -1)
        //     currentColumns.push('business_date');
        //
        //
        this.setState({
            currentFormula: currentFormula
        });
    }

    updateFormula(event) {
        let value = event.target.value;
        let currentFormula = value;

        // let currentColumns = [];
        // let match = this.state.regex.exec(currentFormula);
        // while (match !== null) {
        //     currentColumns.push(match[1]);
        //     match = this.state.regex.exec(currentFormula);
        // }
        // let indexOfId = currentColumns.indexOf('id');
        // if (indexOfId === -1)
        //     currentColumns.push('id');
        // let indexOfBusinessDate = currentColumns.indexOf('business_date');
        // if (indexOfBusinessDate === -1)
        //     currentColumns.push('business_date');

        this.setState({
            currentFormula: currentFormula
        });
    }

    handleDateChange(date) {
        this.setState({
            businessDate: date,
            epochTimeStamp: date.unix()
        });
    }

    handleTableNameChange(event) {
        let value = event.target.value;
        value = value.replace(/[^a-z0-9_]/g, "");
        this.setState({ tableName: value });
    }

    handleSampleSizeChange(event) {
        let value = event.target.value;
        value = value <= 0 ? 1 : value;
        this.setState({ sampleSize: value });
    }

    handleValidationClick() {
        console.log('State Columns: ', this.state.columns);
        let currentColumns = this.state.columns;
        let indexOfId = currentColumns.indexOf('id');
        if (indexOfId === -1)
            currentColumns.push('id');
        let indexOfBusinessDate = currentColumns.indexOf('business_date');
        if (indexOfBusinessDate === -1)
            currentColumns.push('business_date');

        this.setState({
            columns: currentColumns
        });
        this.props.validateExp(
            this.state.tableName,
            this.state.epochTimeStamp,
            this.state.sampleSize,
            this.state.columns,
            this.state.currentFormula
        );
    }

    render() {
        return (
            <div>
              <div className="row form-container">
                  <div className="col col-lg-12">
                      <div className="x_title">
                          <h2>Business Rule Management <small>Edit business rule</small></h2>
                          <div className="clearfix"></div>
                      </div>

                      <div className="col-md-12 col-sm-12 col-xs-12">
                          {
                            this.renderAvailableFields()
                          }
                      </div>
                      <div className="col-md-12 col-sm-12 col-xs-12">
                          {
                            this.renderPythonLogic()
                          }
                      </div>
                      <div className="x_content">

                        <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
                          <button type="button"
                          className="btn btn-primary"
                          onClick={console.log("this.handleCancel")}>
                            Cancel
                          </button>
                          <button type="submit"
                          className="btn btn-success"
                          disabled="">
                            Submit
                          </button>
                          <button type="button"
                          className="btn btn-warning"
                          disabled=""
                          onClick={this.handleValidationClick}>
                            Validate
                          </button>
                        </div>
                      </div>
                      <div className="col-md-5 col-sm-5 col-xs-12">
                        <div className="x_panel">
                          <div className="x_title">
                            <h2>Sampling Option<Label bsStyle="">{this.state.tableName}</Label>
                              <small> Using Data</small>
                            </h2>
                            <div className="clearfix"></div>
                          </div>
                          <div className="x_content">

                              <div className="row">
                                <label className="control-label col-md-4 col-sm-4 col-xs-4" htmlFor="first-name">Sample Size <span className="required">*</span></label>
                                <FormControl
                                    type='number'
                                    bsClass="col-md-3 col-sm-3 col-xs-3"
                                    value={this.state.sampleSize}
                                    onChange={this.handleSampleSizeChange}
                                    placeholder='Enter the sample size'
                                />
                              </div>
                              <div className="row">
                              <label className="control-label col-md-4 col-sm-4 col-xs-4" htmlFor="first-name">Business Date <span className="required">*</span></label>
                                <DatePicker
                                    className='col-md-7 col-sm-7 col-xs-7'
                                    dateFormat="DD-MMM-YYYY"
                                    placeholderText='Select a date'
                                    onChange={this.handleDateChange}
                                    selected={this.state.businessDate}
                                />
                              </div>
                            </div>
                          </div>

                      </div>
                      <div className="col-md-7 col-sm-7 col-xs-12">
                        <div className="x_panel">
                          <div className="x_title">
                            <h2>Data Fields Value Option<Label bsStyle="">{this.state.tableName}</Label>
                              <small> User Data</small>
                            </h2>
                            <div className="clearfix"></div>
                          </div>
                          <div className="x_content">
                          {
                              this.state.columns.map((item, index) => {
                                  return(
                                    <div className="row">
                                      <label className="control-label col-md-3 col-sm-3 col-xs-12" >{item}</label>
                                      <div className="col-md-6 col-sm-6 col-xs-12">
                                        <input
                                          name={item}
                                          placeholder={item}
                                          value={ item }
                                          type="text"
                                          id={item}
                                          className="col-md-7 col-xs-12"
                                          onChange={ console.log("Testing only") }
                                        />
                                      </div>
                                    </div>
                                  );
                              })
                          }
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                  <Well>
                      {this.state.result}
                  </Well>
            </div >
        );
    }

    renderAvailableFields() {
        if (this.state.columns != null) {
          //let columns = ['buy','sell','nothing','colum2','column4','column6','loooooooong column','another long column'];
            return(
            <div className="x_panel">
              <div className="x_title">
                <h2>Source <Label bsStyle="">{this.state.tableName}</Label>
                  <small> Available Fields</small>
                </h2>
                <div className="clearfix"></div>
              </div>
              <div className="x_content">
              {
                  this.state.columns.map((item, index) => {
                      return(
                              <button type="button"
                              name={ item }
                              className="btn btn-default btn-sm"
                              onClick={ () => { this.handleClick(item); } }>
                                  {item}
                              </button>
                      );
                  })
              }
              </div>
            </div>
          );
      } else {
          return (
            <div className="x_panel">
              <div className="x_title">
                <h2>Fields Available
                  <small> for Rule Definition</small>
                </h2>
                <div className="clearfix"></div>
              </div>
              <div className="x_content">
                <p>Ooops, No component available</p>
              </div>
            </div>
          );
        }
    }

    renderPythonLogic() {
      let operators = ['equal','not equal','begins','ends','contains','>','<','>=','<=','(',')','+','-','/','DERIVED'];
        return(
        <div className="x_panel">
          <div className="x_title">
            <h2>Existing Logic
              <small> for Rule </small>
              <Label bsStyle="default">{this.state.rule['business_rule']}</Label>
            </h2>
            <div className="clearfix"></div>
          </div>
          <div className="x_content">
            <h4><Label>Rule Description </Label></h4>
            <p>{this.state.rule['rule_description']}. {this.state.rule['logical_condition']}.</p>
            <Well>{this.state.rule['python_implementation']}</Well>
            <h4><Label bsStyle="warning">Edited Logic .... </Label></h4>
            <div className="clearfix"></div>
            <button className="btn btn-info btn-xs" disabled><i className="fa fa-wrench"> </i></button>
              {
                  operators.map((item, index) => {
                      return(
                              <button type="button"
                              name={ item }
                              className="btn btn-default btn-xs"
                              onClick={ () => { this.handleClick(item); } }>
                                  {item}
                              </button>
                      );
                  })
              }
            <FormControl
                type='text'
                value={this.state.currentFormula}
                onChange={this.updateFormula}
                placeholder='Enter a formula here...'
            />
          </div>
        </div>
      );
    }
}

function mapStateToProps(state) {
    return {
        rule_assist: state.rule_assist
    };
}

const matchDispatchToProps = (dispatch) => {
    return {
        validateExp: (tableName, businessDate, sampleSize, columns, expression) => {
            dispatch(actionValidateExp(tableName, businessDate, sampleSize, columns, expression));
        }
    };
}

export default connect(mapStateToProps, matchDispatchToProps)(RuleAssist);
