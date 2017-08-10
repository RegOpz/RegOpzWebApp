import React, { Component } from 'react';
import {
    FormControl,
    Col,
    Row,
    ListGroup,
    ListGroupItem,
    Button,
    Well,
    Label,
    FormGroup,
    ControlLabel,
    Pagination,
    Table
} from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionValidateExp } from './../../actions/RuleAssistAction';
import DatePicker from 'react-datepicker';
import moment from 'moment';

class RuleAssist extends Component {
    constructor(props) {
        super(props);

        let currentDate = moment();
        let date = currentDate.date();
        date = date < 10 ? '0' + date : date;
        let month = currentDate.month();
        month = month < 10 ? '0' + month : month;
        this.state = {
            rule: this.props.rule,
            currentFormula: this.props.rule['python_implementation'],
            regex: /\[(.*?)\]/g,
            columns: this.props.rule['data_fields_list'].split(','),
            businessDate: moment(),
            epochTimeStamp: currentDate.year() + '' + month + '' + date,
            tableName: this.props.sourceTable['source_table_name'],
            sourceId: this.props.sourceTable['source_id'],
            sampleSize: 300,
            result: [],
            displayResult: [],
            activePage: 1,
            totalItems: 0
        };

        console.log(this.props);

        this.handleFormFieldClick = this.handleFormFieldClick.bind(this);
        this.updateFormula = this.updateFormula.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleSampleSizeChange = this.handleSampleSizeChange.bind(this);
        this.handleValidationClick = this.handleValidationClick.bind(this);
        this.activatePage = this.activatePage.bind(this);
        this.renderResultTableRow = this.renderResultTableRow.bind(this);
        this.renderTableHeader = this.renderTableHeader.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        console.log('Next Props: ', nextProps);
        let slicedResults = nextProps.rule_assist.slice(0, 10);
        this.setState({
            result: nextProps.rule_assist,
            displayResult: slicedResults
        });
    }

    handleFormFieldClick(element) {
        let currentFormula = this.state.currentFormula;
        currentFormula += ' [' + element + '] ';
        this.setState({
            currentFormula: currentFormula
        });
    }

    updateFormula(event) {
        let value = event.target.value;
        let currentFormula = value;

        this.setState({
            currentFormula: currentFormula
        });
    }

    handleDateChange(date) {
        let dayDate = date.date();
        dayDate = dayDate < 10 ? '0' + dayDate : dayDate;
        let month = date.month();
        month = month < 10 ? '0' + month : month;
        let tempDate = date.year() + '' + month + '' + dayDate;
        this.setState({
            businessDate: date,
            epochTimeStamp: tempDate
        });
    }

    handleSampleSizeChange(event) {
        let value = event.target.value;
        value = value <= 0 ? 1 : value;
        this.setState({ sampleSize: value });
    }

    handleValidationClick() {
        console.log('State Columns: ', this.state.columns);
        let currentColumns = [...this.state.columns];
        let indexOfId = currentColumns.indexOf('id');
        if (indexOfId === -1)
            currentColumns.push('id');
        let indexOfBusinessDate = currentColumns.indexOf('business_date');
        if (indexOfBusinessDate === -1)
            currentColumns.push('business_date');

        this.props.validateExp(
            this.state.tableName,
            this.state.epochTimeStamp,
            this.state.sampleSize,
            this.state.columns,
            this.state.currentFormula
        );
    }

    activatePage(eventKey) {
        console.log('Event Key: ', eventKey);
        eventKey = eventKey - 1;
        let slicedResults = this.state.result.slice(eventKey * 10, eventKey * 10 + 10);
        this.setState({ displayResult: slicedResults });
    }

    renderResultTableRow(message, status, attributes) {
        let keys = [];
        for (let key in attributes)
            keys.push(key);

        return (
            <tr>
                <td>{status}</td>
                <td>{message}</td>
                {
                    keys.map(element => {
                        return (
                            <td
                                key={element}
                            >
                                {attributes[element]}
                            </td>
                        );
                    })
                }
            </tr>
        );
    }

    renderTableHeader(attributes) {
        let keys = [];
        for (let key in attributes)
            keys.push(key);

        return (
            <thead>
                <tr>
                    <th>Status</th>
                    <th>Message</th>
                    {
                        keys.map(element => {
                            return (
                                <th key={element}>
                                    {element}
                                </th>
                            );
                        })
                    }
                </tr>
            </thead>
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
                        <div className="col-md-5 col-sm-5 col-xs-12">
                            <div className="x_panel">
                                <div className="x_title">
                                    <h2>Sampling Option<Label>{this.state.tableName}</Label>
                                        <small> Using Data</small>
                                    </h2>
                                    <div className="clearfix"></div>
                                </div>
                                <div className="x_content">

                                    <div className="row">
                                        <FormGroup>
                                            <ControlLabel>Sample Size <span className="required">*</span></ControlLabel>
                                            <FormControl
                                                type='number'
                                                value={this.state.sampleSize}
                                                onChange={this.handleSampleSizeChange}
                                                placeholder='Enter the sample size'
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="row">
                                        <FormGroup>
                                            <ControlLabel>Business Date <span className="required">*</span></ControlLabel>
                                            <br />
                                            <DatePicker
                                                dateFormat="DD-MMM-YYYY"
                                                placeholderText='Select a date'
                                                onChange={this.handleDateChange}
                                                selected={this.state.businessDate}
                                                className="form-control"
                                            />
                                        </FormGroup>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="col-md-7 col-sm-7 col-xs-12">
                            <div className="x_panel">
                                <div className="x_title">
                                    <h2>Data Fields Value Option<Label>{this.state.tableName}</Label>
                                        <small> User Data</small>
                                    </h2>
                                    <div className="clearfix"></div>
                                </div>
                                <div className="x_content">
                                    {
                                        this.state.columns.map((item, index) => {
                                            return (
                                                <div
                                                    className="row"
                                                    key={item}
                                                >
                                                    <label
                                                        className="control-label col-md-3 col-sm-3 col-xs-12"
                                                        style={{ margin: '7px 0' }}
                                                    >
                                                        {item}
                                                    </label>
                                                    <div className="col-md-6 col-sm-6 col-xs-12">
                                                        <FormControl
                                                            placeholder={'Enter ' + item.toUpperCase()}
                                                            value=''
                                                            type="text"
                                                            className="col-md-7 col-xs-12"
                                                            style={{ margin: '5px 0' }}
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
                <div style={{ margin: '7px 0', textAlign: 'center' }}>
                    <button type="button"
                        className="btn btn-primary"
                        onClick={this.props.cancelEditing}>
                        Cancel
                    </button>
                    {
                        this.props.displaySubmit &&
                        <button type="submit"
                            className="btn btn-success"
                            disabled="">
                            Submit
                        </button>
                    }
                    <button type="button"
                        className="btn btn-warning"
                        disabled=""
                        onClick={this.handleValidationClick}>
                        Validate
                    </button>
                </div>
                {
                    this.state.result.length > 0 &&
                    <Well style={{ textAlign: 'center' }}>
                        <Table striped bordered condensed>
                            {
                                this.renderTableHeader(this.state.result[0].attr)
                            }
                            <tbody>
                                {
                                    this.state.displayResult.map(element => {
                                        return this.renderResultTableRow(element.msg, element.status, element.attr);
                                    })
                                }
                            </tbody>
                        </Table>
                        <Pagination
                            next
                            prev
                            first
                            last
                            ellipsis
                            boundaryLinks
                            maxButtons={5}
                            items={this.state.result.length}
                            activePage={this.state.activePage}
                            onSelect={this.activatePage}
                        />
                    </Well>
                }
            </div >
        );
    }

    renderAvailableFields() {
        if (this.state.columns != null) {
            //let columns = ['buy','sell','nothing','colum2','column4','column6','loooooooong column','another long column'];
            return (
                <div className="x_panel">
                    <div className="x_title">
                        <h2>Source <Label>{this.state.tableName}</Label>
                            <small> Available Fields</small>
                        </h2>
                        <div className="clearfix"></div>
                    </div>
                    <div className="x_content">
                        {
                            this.state.columns.map((item, index) => {
                                return (
                                    <button type="button"
                                        name={item}
                                        className="btn btn-default btn-sm"
                                        onClick={() => { this.handleFormFieldClick(item); }}
                                        key={item}
                                    >
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
        let operators = ['equal', 'not equal', 'begins', 'ends', 'contains', '>', '<', '>=', '<=', '(', ')', '+', '-', '/', 'DERIVED'];
        return (
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
                            return (
                                <button type="button"
                                    name={item}
                                    className="btn btn-default btn-xs"
                                    onClick={() => { this.handleFormFieldClick(item); }}
                                    key={item}
                                >
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
