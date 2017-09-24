import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import { Link } from 'react-router';
import { actionFetchSources } from '../../actions/MaintainSourcesAction';
import { actionLoadData, actionLoadDataFile } from '../../actions/LoadDataAction';
import { Grid, Row, Col, Alert } from 'react-bootstrap';
import SourceCatalogList from './SourceCatalog';
import DisplayLoadData from './DisplayLoadData';

class LoadData extends Component {
    constructor(props) {
        super(props);
        console.log('Props: ', props);

        this.state = {
            selectedItem: null,
            applyRules: false,
            loadInfo: {},
            displayAlertMsg: false
        };

        this.handleSourceClick = this.handleSourceClick.bind(this);
        this.handleLoadFile = this.handleLoadFile.bind(this);

        //this.viewOnly = _.find(this.props.privileges, { permission: "Load Data" }) ? true : false;
        this.writeOnly = _.find(this.props.privileges, { permission: "Load Data" }) ? true : false;
    }

    componentWillMount() {
        this.props.fetchSources();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.loadDataProps.loadDataFileMsg)
            if (nextProps.loadDataProps.loadDataFileMsg.msg === 'Data Uploaded Successfully') {
                this.props.loadData({
                    source_id: this.state.loadInfo.source_id,
                    business_date: this.state.loadInfo.business_date,
                    data_file: nextProps.loadDataProps.loadDataFileMsg.filename
                });
                console.log('Now Loading The Data');
            }
        console.log('Next Props:', nextProps);
    }

    handleSourceClick(item) {
        console.log('Handle Source Click Item: ', item);
        this.setState({ selectedItem: item });
    }

    handleLoadFile(option) {
        console.log('Run handleLoadFile', option);
        // data_file: option.selectedFile.name,
        let loadInfo = {
            source_id: option.item.source_id,
            business_date: option.businessDate.format('YYYYMMDD')
        }
        let applyRules = option.applyRules;

        this.setState({ applyRules: applyRules, loadInfo: loadInfo, displayAlertMsg: true });
        this.props.loadDataFile(option.selectedFile);
    }

    render() {
        if (typeof this.props.sourceCatalog !== 'undefined') {
            return (
                <div>
                    <div className="row form-container">
                        <div className="x_panel">
                            <div className="x_title">
                                <div>
                                    <h2>Load Data <small> Load Data for Available Sources</small></h2>
                                    <div className="row">
                                        <ul className="nav navbar-right panel_toolbox">
                                            <li>
                                                <a className="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                                    <i className="fa fa-rss"></i><small>{' Sources '}</small>
                                                    <i className="fa fa-caret-down"></i>
                                                </a>
                                                <ul className="dropdown-menu dropdown-usermenu pull-right" style={{ "zIndex": 9999 }}>
                                                    <li style={{ "padding": "5px" }}>
                                                        <Link to="/dashboard/load-data"
                                                            onClick={() => { this.setState({ selectedItem: null }) }}
                                                        >
                                                            <i className="fa fa-bars"></i> All Sources List
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <SourceCatalogList
                                                            sourceCatalog={this.props.sourceCatalog.country}
                                                            navMenu={true}
                                                            handleSourceClick={this.handleSourceClick}
                                                        />
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                            </div>
                            <div className="x_content">
                                {
                                    this.state.displayAlertMsg &&
                                    <Alert bsStyle="warning">
                                        Data File is being transferred. This might take a while. Though you can continue working.
                                    </Alert>
                                }
                            </div>
                            <div className="x_content">
                                {
                                    this.state.selectedItem ?
                                        <DisplayLoadData
                                            selectedItem={this.state.selectedItem}
                                            handleLoadFile={this.handleLoadFile}
                                        /> :
                                        <h4>Please Select a Source to Load Data</h4>
                                }
                                {
                                    !this.state.selectedItem &&
                                    <SourceCatalogList
                                        sourceCatalog={this.props.sourceCatalog.country}
                                        navMenu={false}
                                        handleSourceClick={this.handleSourceClick}
                                    />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <h4> Loading.....</h4>
            );
        }
    }
}

function mapStateToProps(state) {
    console.log('State: ', state);
    return {
        sourceCatalog: state.source_feeds.sources,
        loadDataProps: state.loadData
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchSources: (sources, country) => {
            dispatch(actionFetchSources(sources, country));
        },
        loadData: (loadInfo) => {
            dispatch(actionLoadData(loadInfo));
        },
        loadDataFile: (file) => {
            dispatch(actionLoadDataFile(file));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadData);
