import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import { Link } from 'react-router';
import { actionFetchSources } from '../../actions/MaintainSourcesAction';
import { actionLoadData, actionLoadDataFile } from '../../actions/LoadDataAction';
import {
  actionLeftMenuClick,
} from '../../actions/LeftMenuAction';
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
            displayAlertMsg: false,
            alertMsg : "Data File is being transferred. This might take a while. Though you can continue working.",
            alertStyle: "warning"
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
        if(this.props.leftmenu){
            this.setState({
              selectedItem: null,
              displayAlertMsg: false,
            });
        } else {
            let { alertMsg, alertStyle } = this.state;
            console.log('At the begining of Next Props:', nextProps,nextProps.loadDataProps);
            if (nextProps.loadDataProps.error || nextProps.loadDataProps.message){
              alertMsg = nextProps.loadDataProps.message;
              alertMsg += nextProps.loadDataProps.error ? " " + nextProps.loadDataProps.error.data.msg : "";
              alertStyle = "danger";
              console.log('Error Loading The Data',this.state);
            }
            if (nextProps.loadDataProps.loadDataFileMsg) {
                if (nextProps.loadDataProps.loadDataFileMsg.msg === 'File Transferred Successfully') {
                    alertMsg = "File Transferred Successfully. Now Loading Data. This might take a while. Though you can continue working.";
                    alertStyle = "info";
                    this.props.loadData({
                        source_id: this.state.loadInfo.source_id,
                        business_date: this.state.loadInfo.business_date,
                        data_file: nextProps.loadDataProps.loadDataFileMsg.filename,
                        file: this.state.loadInfo.file.name
                    });
                    console.log('Now Loading The Data');
                }
                else if (nextProps.loadDataProps.loadDataFileMsg.msg === 'Data Loaded Successfully') {
                  alertMsg = "Data Loaded Successfully.";
                  alertStyle = "success";
                  console.log('Now waiting for Data Load to complete');
                }
            }
            this.setState({alertMsg:alertMsg, alertStyle: alertStyle},()=>{console.log('End of setState...',this.state);});
            console.log('Next Props:', nextProps,nextProps.loadDataProps);
        }
    }

    componentDidUpdate() {
      console.log("componentDidUpdate LoadData");
       this.props.leftMenuClick(false);
    }

    handleSourceClick(item) {
        console.log('Handle Source Click Item: ', item);
        this.setState({ selectedItem: item,
                        alertMsg: "Data File is being transferred. This might take a while. Though you can continue working.",
                         alertStyle: "warning" });
    }

    handleLoadFile(option) {
        console.log('Run handleLoadFile', option);
        // data_file: option.selectedFile.name,
        let loadInfo = {
            source_id: option.item.source_id,
            business_date: option.businessDate.format('YYYYMMDD'),
            file: option.selectedFile
        }
        let applyRules = option.applyRules;

        this.setState({ applyRules: applyRules, loadInfo: loadInfo, displayAlertMsg: true });
        window.document.body.scrollTop = 0;
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
                                                            onClick={() => { this.setState({ selectedItem: null, displayAlertMsg: false, }) }}
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
                                    <Alert bsStyle={this.state.alertStyle}>
                                        {this.state.alertMsg}
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
        loadDataProps: state.loadData,
        login_details: state.login_store,
        leftmenu: state.leftmenu_store.leftmenuclick,
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
        },
        leftMenuClick:(isLeftMenu) => {
          dispatch(actionLeftMenuClick(isLeftMenu));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadData);
