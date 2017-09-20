import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import { Link } from 'react-router';
import { actionFetchSources } from '../../actions/MaintainSourcesAction';
import { Grid, Row, Col } from 'react-bootstrap';
import SourceCatalogList from './SourceCatalog';
import DisplayLoadData from './DisplayLoadData';

class LoadData extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedItem: null,
            selectedFile: null
        };

        this.handleSourceClick = this.handleSourceClick.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.runValidation = this.runValidation.bind(this);
        this.applyRules = this.applyRules.bind(this);
    }

    componentWillMount() {
        this.props.fetchSources();
    }

    handleSourceClick(item) {
        console.log('Handle Source Click Item: ', item);
        this.setState({ selectedItem: item });
    }

    handleFileChange(event) {
        this.setState({ selectedFile: event.target.files[0] });
    }

    runValidation() {
        console.log('Run Validation Clicked');
        // TODO: Bind With Actions
    }

    applyRules() {
        console.log('Apply Rules Clicked');
        // TODO: Bind With Actions
    }

    render() {
        if (typeof this.props.sourceCatalog !== 'undefined') {
            return (
                <div>
                    <div className="row form-container">
                        <div className="x_panel">
                            <div className="x_title">
                                <div>
                                    <h2>Maintain Sources <small>Available Sources to Load Data Definition</small></h2>
                                    <div className="row">
                                        <ul className="nav navbar-right panel_toolbox">
                                            <li>
                                                <a className="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                                    <i className="fa fa-rss"></i><small>{' Sources '}</small>
                                                    <i className="fa fa-caret-down"></i>
                                                </a>
                                                <ul className="dropdown-menu dropdown-usermenu pull-right" style={{ "zIndex": 9999 }}>
                                                    <li style={{ "padding": "5px" }}>
                                                        <Link to="/dashboard/maintain-sources">
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
                                <Grid>
                                    <Row>
                                        <Col xs={12} sm={6}>
                                            <SourceCatalogList
                                                sourceCatalog={this.props.sourceCatalog.country}
                                                navMenu={false}
                                                handleSourceClick={this.handleSourceClick}
                                            />
                                        </Col>
                                        <Col xs={12} sm={6} style={{ textAlign: 'center' }}>
                                            {
                                                this.state.selectedItem ?
                                                    <DisplayLoadData
                                                        selectedItem={this.state.selectedItem}
                                                        handleFileChange={this.handleFileChange}
                                                        runValidation={this.runValidation}
                                                        applyRules={this.applyRules}
                                                    /> :
                                                    <h3>Please select an item to load data...</h3>
                                            }
                                        </Col>
                                    </Row>
                                </Grid>
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
    return {
        sourceCatalog: state.source_feeds.sources
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchSources: (sources, country) => {
            dispatch(actionFetchSources(sources, country))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadData);