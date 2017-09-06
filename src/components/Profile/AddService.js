import React, { Component } from 'react';
import { FormControl, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import { actionFetchALLServices } from './../../actions/CustomizeDashAction';

class AddService extends Component {
    constructor(props) {
        super(props);

        let apis = [];
        for (let i = 0; i < this.props.apis.length; i++) {
            apis.push({
                value: this.props.apis[i],
                data: this.props.apis[i] + ' Data'
            });
        }
        this.state = {
            APIs: apis,
            currentAPI: this.props.apis[0],
            currentChart: '1',
            currentTile: '1'
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAPIChange = this.handleAPIChange.bind(this);
        this.handleChartChange = this.handleChartChange.bind(this);
        this.handleTileChange = this.handleTileChange.bind(this);
    }

    componentWillMount() {
        this.props.fetchAllServices();
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        let apis = [];
        for (let i = 0; i < nextProps.apis.length; i++) {
            apis.push({
                value: nextProps.apis[i],
                data: nextProps.apis[i] + ' Data'
            });
        }
        this.setState({
            APIs: apis,
            currentAPI: nextProps.apis[0]
        });

    }

    handleAPIChange(event) {
        this.setState({ currentAPI: event.target.value });
    }

    handleChartChange(event) {
        this.setState({ currentChart: event.target.value });
    }

    handleTileChange(event) {
        this.setState({ currentTile: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();

        let API = this.state.currentAPI;
        let chart = this.state.currentChart;
        let tile = this.state.currentTile;

        this.props.addService(API, chart, tile);
    }

    render() {
        return (
            <div style={{ padding: '7px' }}>
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="formAPISelect">
                        <ControlLabel>Select API:</ControlLabel>
                        <FormControl componentClass="select" placeholder="Select API:" onChange={this.handleAPIChange}>
                            {
                                this.state.APIs.map(element => {
                                    return (
                                        <option value={element.value} key={element.value}>{element.data}</option>
                                    );
                                })
                            }
                        </FormControl>
                    </FormGroup>
                    <FormGroup controlId="chartTypeSelect">
                        <ControlLabel>Select Type of Chart:</ControlLabel>
                        <FormControl componentClass="select" placeholder="Select Chart:" onChange={this.handleChartChange}>
                            <option value="1">Bar</option>
                            <option value="2">Line</option>
                            <option value="3">Pie</option>
                        </FormControl>
                    </FormGroup>
                    <FormGroup controlId="tileSizeSelect">
                        <ControlLabel>Select Tile Size:</ControlLabel>
                        <FormControl componentClass="select" placeholder="Select Tile:" onChange={this.handleTileChange}>
                            <option value="1">One Third</option>
                            <option value="2">Half</option>
                            <option value="3">Full Width</option>
                        </FormControl>
                    </FormGroup>
                    <Button type="submit">
                        Submit
                    </Button>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        apis: state.api_details
    };
}

const matchDispatchToProps = (dispatch) => {
    return {
        fetchAllServices: () => {
            dispatch(actionFetchALLServices());
        }
    }
}

export default connect(mapStateToProps, matchDispatchToProps)(AddService);