import React, { Component } from 'react';
import { Grid, Row, Col, Button } from 'react-bootstrap';

class DisplayLoadData extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Grid>
                    <Row>
                        <Col xs={12} sm={6}>
                            <h4>Country:</h4>
                        </Col>
                        <Col xs={12} sm={6}>
                            {this.props.selectedItem.country}
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={6}>
                            <h4>Source Description:</h4>
                        </Col>
                        <Col xs={12} sm={6}>
                            {this.props.selectedItem.source_description}
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={6}>
                            <h4>Source File Name:</h4>
                        </Col>
                        <Col xs={12} sm={6}>
                            {this.props.selectedItem.source_file_name}
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={6}>
                            <h4>Source Table Name:</h4>
                        </Col>
                        <Col xs={12} sm={6}>
                            {this.props.selectedItem.source_table_name}
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={6}>
                            <h4>Load Data From File:</h4>
                        </Col>
                        <Col xs={12} sm={6}>
                            <input type="file" onChange={this.props.handleFileChange} />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '28px' }}>
                        <Col xs={12} sm={6}>
                            <Button bsStyle='primary' onClick={this.props.runValidation}>Run Validation</Button>
                        </Col>
                        <Col xs={12} sm={6}>
                            <Button bsStyle='success' onClick={this.props.applyRules}>Apply Rules</Button>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default DisplayLoadData;