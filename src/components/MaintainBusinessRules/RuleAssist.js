import React, { Component } from 'react';
import {
    FormControl,
    Col,
    Row,
    ListGroup,
    ListGroupItem,
    Button,
    Well
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
            currentFormula: '',
            regex: /\[(.*?)\]/g,
            columns: [],
            businessDate: moment(),
            epochTimeStamp: moment().unix(),
            tableName: '',
            sampleSize: 3000,
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
        currentFormula += '[' + element + ']';

        let currentColumns = [];
        let match = this.state.regex.exec(currentFormula);
        while (match !== null) {
            currentColumns.push(match[1]);
            match = this.state.regex.exec(currentFormula);
        }
        let indexOfId = currentColumns.indexOf('id');
        if (indexOfId === -1)
            currentColumns.push('id');
        let indexOfBusinessDate = currentColumns.indexOf('business_date');
        if (indexOfBusinessDate === -1)
            currentColumns.push('business_date');


        this.setState({
            currentFormula: currentFormula,
            columns: currentColumns
        });
    }

    updateFormula(event) {
        let value = event.target.value;
        let currentFormula = value;

        let currentColumns = [];
        let match = this.state.regex.exec(currentFormula);
        while (match !== null) {
            currentColumns.push(match[1]);
            match = this.state.regex.exec(currentFormula);
        }
        let indexOfId = currentColumns.indexOf('id');
        if (indexOfId === -1)
            currentColumns.push('id');
        let indexOfBusinessDate = currentColumns.indexOf('business_date');
        if (indexOfBusinessDate === -1)
            currentColumns.push('business_date');

        this.setState({
            currentFormula: currentFormula,
            columns: currentColumns
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
                <Row>
                    <Col xs={12} md={6}>
                        <h1 style={{ textAlign: 'center' }}>Data Attributes Fields</h1>
                        <ListGroup>
                            {
                                this.props.columns.map(element => {
                                    return (
                                        <ListGroupItem
                                            style={{ textAlign: 'center' }}
                                            onClick={() => { this.handleClick(element); }}
                                            key={element}
                                        >
                                            {element}
                                        </ListGroupItem>
                                    );
                                })
                            }
                        </ListGroup>
                    </Col>
                    <Col xs={12} md={6}>
                        <h1 style={{ textAlign: 'center' }}>Enter a formula below:</h1>
                        <Well bsSize='small'>{this.state.currentFormula}</Well>
                        <FormControl
                            type='text'
                            value={this.state.currentFormula}
                            onChange={this.updateFormula}
                            placeholder='Enter a formula here...'
                        />
                        <Row style={{ margin: '14px 0' }}>
                            <Col xs={6} style={{ textAlign: 'center' }}>
                                <h2>Table Name:</h2>
                            </Col>
                            <Col xs={6} style={{ textAlign: 'center' }}>
                                <FormControl
                                    type='text'
                                    value={this.state.tableName}
                                    onChange={this.handleTableNameChange}
                                    placeholder='Enter a table name to run validation on'
                                />
                            </Col>
                        </Row>
                        <Row style={{ margin: '14px 0' }}>
                            <Col xs={6} style={{ textAlign: 'center' }}>
                                <h2>Sample Size:</h2>
                            </Col>
                            <Col xs={6} style={{ textAlign: 'center' }}>
                                <FormControl
                                    type='number'
                                    value={this.state.sampleSize}
                                    onChange={this.handleSampleSizeChange}
                                    placeholder='Enter the sample size'
                                />
                            </Col>
                        </Row>
                        <Row style={{ margin: '14px 0' }}>
                            <Col xs={6} style={{ textAlign: 'center' }}>
                                <h2>Business Date:</h2>
                            </Col>
                            <Col xs={6} style={{ textAlign: 'center' }}>
                                <DatePicker
                                    className='form-control'
                                    placeholderText='Select a date'
                                    onChange={this.handleDateChange}
                                    selected={this.state.businessDate}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} style={{ textAlign: 'center' }}>
                                <Button
                                    bsStyle="primary"
                                    style={{ margin: '14px' }}
                                    onClick={this.handleValidationClick}
                                >
                                    Validate</Button>
                                <Button
                                    bsStyle="success"
                                    style={{ margin: '14px' }}
                                >
                                    Submit</Button>
                            </Col>
                        </Row>
                        <Row style={{ margin: '14px 0' }}>
                            <Col xs={12}>
                                <Well style={{ textAlign: 'center' }}>
                                    {this.state.result}
                                </Well>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div >
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