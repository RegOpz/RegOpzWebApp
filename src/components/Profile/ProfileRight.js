import React, { Component } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import AddService from './AddService';
import CustomizeDashboard from './CustomizeDashboard';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    actionAddService,
    actionUpdateService,
    actionRemoveService
} from './../../actions/CustomizeDashAction';

class ProfileRightPane extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tabSelected: 1
        };

        this.saveDashboardLayout = this.saveDashboardLayout.bind(this);
        this.addNewApiService = this.addNewApiService.bind(this);
    }

    saveDashboardLayout(APIDetails) {
        this.props.updateService(APIDetails);
    }

    addNewApiService(API, chart, tile) {
        this.props.addService(API, chart, tile);
    }

    render() {
        return (
            <div className="col-md-7 col-sm-7 col-xs-12">
                <div>
                    <Tabs
                        defaultActiveKey={1}
                        id="Profile"
                        onSelect={(activeKey) => {
                            this.setState({ tabSelected: activeKey });
                        }}
                    >
                        <Tab eventKey={1} title="Customize Dashboard">
                            <CustomizeDashboard
                                layoutActive={this.state.tabSelected === 1}
                                saveLayout={this.saveDashboardLayout}
                            />
                        </Tab>
                        <Tab eventKey={2} title="Add Service">
                            <AddService
                                addService={this.addNewApiService}
                            />
                        </Tab>
                        <Tab eventKey={3} title="Something Else">
                            Lorem Ipsum
                        </Tab>
                    </Tabs>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        apis: state.customize_dash
    }
}

const matchDispatchToProps = (dispatch) => {
    return {
        addService: (api, chartType, tileType) => {
            dispatch(actionAddService(api, chartType, tileType));
        },
        updateService: (index, chartType, tileType) => {
            dispatch(actionUpdateService(index, chartType, tileType));
        },
        removeService: (index) => {
            dispatch(actionRemoveService(index));
        }
    }
}

export default connect(mapStateToProps, matchDispatchToProps)(ProfileRightPane);
