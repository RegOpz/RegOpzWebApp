import React, { Component } from 'react';
import { FormControl, FormGroup, ControlLabel, Button, Row, Col } from 'react-bootstrap';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actionFetchUserServices } from './../../actions/CustomizeDashAction';

class CustomizeDashboard extends Component {
    constructor(props) {
        super(props);

        console.log('Customize Dash Props: ', this.props);
        this.state = {
            userServices: this.props.user_services,
            maxIndex: this.props.user_services.length,
            layoutActive: true
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleIndexChange = this.handleIndexChange.bind(this);
        this.handleTileChange = this.handleTileChange.bind(this);
        this.handleChartChange = this.handleChartChange.bind(this);
        this.removeAPI = this.removeAPI.bind(this);
    }

    componentWillMount() {
        this.props.fetchUserServices();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.layoutActive !== this.state.layoutActive) {
            if (nextProps.layoutActive) {
                this.props.fetchUserServices();
                this.setState({ layoutActive: true });
            }
            else
                this.setState({ layoutActive: false });
        }
        console.log('New Props: ', nextProps);
        this.setState({
            userServices: nextProps.user_services,
            maxIndex: nextProps.user_services.length
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        this.props.saveLayout(this.state.userServices);
    }

    handleTileChange(event, index) {
        let value = event.target.value;
        let APIDetails = this.state.userServices;
        APIDetails[index].tileType = value;

        console.log(APIDetails);

        this.setState({ userServices: APIDetails });
    }

    handleChartChange(event, index) {
        let value = event.target.value;
        let APIDetails = this.state.userServices;
        APIDetails[index].chartType = value;

        console.log(APIDetails);

        this.setState({ userServices: APIDetails });
    }

    removeAPI(index) {
        let currentAPIDetails = this.state.userServices;
        currentAPIDetails.splice(index, 1);
        this.setState({ userServices: currentAPIDetails });
    }

    handleIndexChange(index, direction) {
        console.log(index, direction);
        if (index === 0 && direction === 'UP')
            return;
        if (index === this.state.maxIndex - 1 && direction === 'DOWN')
            return;

        if (direction === 'UP') {
            let currentValue = this.state.userServices[index];
            let intendedValue = this.state.userServices[index - 1];
            let otherAPIDetails = [...this.state.userServices];
            otherAPIDetails[index] = intendedValue;
            otherAPIDetails[index - 1] = currentValue;
            this.setState({ userServices: otherAPIDetails });
        }
        else {
            let currentValue = this.state.userServices[index];
            let intendedValue = this.state.userServices[index + 1];
            let otherAPIDetails = [...this.state.userServices];
            otherAPIDetails[index] = intendedValue;
            otherAPIDetails[index + 1] = currentValue;
            this.setState({ userServices: otherAPIDetails });
        }
    }

    render() {
        return (
            <div style={{ padding: '7px' }}>
                <form onSubmit={this.handleSubmit}>
                    {
                        this.state.userServices.map((element, index) => {
                            return (
                                <div key={element.id} style={{ padding: '7px' }}>
                                    <ControlLabel>{element.API}</ControlLabel>
                                    <Row>
                                        <Col xs={10} md={10} lg={10}>
                                            <Row>
                                                <Col xs={12}>
                                                    <FormControl
                                                        componentClass="select"
                                                        placeholder="Select Tile Type:"
                                                        onChange={(event) => { this.handleTileChange(event, index); }}
                                                    >
                                                        {
                                                            element.tileType === "1" ?
                                                                <option value="1" selected>One Third</option> :
                                                                <option value="1">One Third</option>
                                                        }
                                                        {
                                                            element.tileType === "2" ?
                                                                <option value="2" selected>Half</option> :
                                                                <option value="2">Half</option>
                                                        }
                                                        {
                                                            element.tileType === "3" ?
                                                                <option value="3" selected>Full Width</option> :
                                                                <option value="3">Full Width</option>
                                                        }
                                                    </FormControl>
                                                </Col>
                                                <Col xs={12}>
                                                    <FormControl
                                                        componentClass="select"
                                                        placeholder="Select Chart Type"
                                                        onChange={(event) => { this.handleChartChange(event, index); }}
                                                    >
                                                        {
                                                            element.chartType === "1" ?
                                                                <option value="1" selected>Bar</option> :
                                                                <option value="1">Bar</option>
                                                        }
                                                        {
                                                            element.chartType === "2" ?
                                                                <option value="2" selected>Line</option> :
                                                                <option value="2">Line</option>
                                                        }
                                                        {
                                                            element.chartType === "3" ?
                                                                <option value="3" selected>Pie</option> :
                                                                <option value="3">Pie</option>
                                                        }
                                                    </FormControl>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xs={2} md={2} lg={2}>
                                            <div>
                                                {
                                                    index !== 0 &&
                                                    <button
                                                        type="button"
                                                        className="btn btn-circle btn-primary btn-xs"
                                                        onClick={() => { this.handleIndexChange(index, 'UP'); }}
                                                    >
                                                        <i className="fa fa-arrow-up"></i>
                                                    </button>
                                                }
                                                {
                                                    index !== this.state.maxIndex - 1 &&
                                                    <button
                                                        type="button"
                                                        className="btn btn-circle btn-primary btn-xs"
                                                        onClick={() => { this.handleIndexChange(index, 'DOWN'); }}
                                                    >
                                                        <i className="fa fa-arrow-down"></i>
                                                    </button>
                                                }
                                                <button
                                                    type="button"
                                                    className="btn btn-circle btn-warning btn-xs"
                                                    onClick={() => { this.removeAPI(index); }}
                                                >
                                                    <i className="fa fa-trash-o"></i>
                                                </button>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            )
                        })
                    }
                    {
                        this.state.maxIndex > 0 ?
                            <Button type="submit">
                                Save Layout
                            </Button> :
                            <div>
                                There's nothing to show here as of now. Go add a new service, then check back
                            </div>

                    }
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user_services: state.customize_dash
    }
}

const matchDispatchToProps = (dispatch) => {
    return {
        fetchUserServices: () => {
            dispatch(actionFetchUserServices());
        }
    }
}

export default connect(mapStateToProps, matchDispatchToProps)(CustomizeDashboard);