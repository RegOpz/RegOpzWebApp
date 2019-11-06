import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import axios from 'axios';
import { actionFetchSources } from '../../actions/MaintainSourcesAction';
import { actionLoadData, actionLoadDataFile } from '../../actions/LoadDataAction';
import {
    actionLeftMenuClick,
} from '../../actions/LeftMenuAction';
import AddSources from './AddSources/AddSources';
import SourceCatalogList from './SourceCatalog';
import DisplayLoadData from './DisplayLoadData';
import LoadingForm from '../Authentication/LoadingForm';
import ModalAlert from '../ModalAlert/ModalAlert';
import { BASE_URL } from '../../Constant/constant';

class LoadData extends Component {
    constructor(props) {
        super(props);
        this.state = {
          // TODO
          sourceList: [],
        };

        // This methods
        this.loadingPage = this.loadingPage.bind(this);
        this.handleSourceClick = this.handleSourceClick.bind(this);
        this.handleLoadFile = this.handleLoadFile.bind(this);
        this.handleRemoveFeedClick = this.handleRemoveFeedClick.bind(this);
        this.handleShowDetailsClick = this.handleShowDetailsClick.bind(this);

        this.writeOnly = _.find(this.props.privileges, { permission: "Load Data" }) ? true : false;
    }

    componentWillMount() {
      // Fetch sources at the begining
        this.props.fetchSources('ALL',this.props.login_details.domainInfo.country);
    }

    componentWillReceiveProps(nextProps) {
      // TODO
    }

    componentDidUpdate() {
        console.log("componentDidUpdate LoadData");
        this.props.leftMenuClick(false);
    }


    loadingPage(icon, color,msg){
      return(
        <LoadingForm
          loadingMsg={
              <div>
                <div>
                  <a className="btn btn-app" style={{"border": "none"}}>
                    <i className={ "fa " + icon + " " + color }></i>
                    <span className={color}>..........</span>
                  </a>
                </div>
                <span className={color}>{msg}</span>
                <br/>
                <span className={color}>Please wait</span>
              </div>
            }
          />
      );
    }

    handleSourceClick(item) {
        console.log('Handle Source Click Item: ', item);
        let {sourceList} = this.state;
        let sourceListItem = {
                                ...item,
                                selectedFile: null,
                                selectedFileAttr: null,
                                businessDate: null,
                                applyRules: false,
                                // showAll: false,
                              };
        sourceList.push(sourceListItem)
        this.setState({sourceList},
          ()=>{
            console.log('Selected Source Clicked Item: ', this.state.sourceList);
          });
    }

    handleShowDetailsClick(item){
      this.modalAlert.isDiscardToBeShown = false;
      this.modalAlert.isCloseButtonTobeShown = true;
      this.modalAlert.modalTitle = "Source Details"
      this.modalAlert.open(
        <div className="small" style={{'max-height':'70vh','overflow':'auto'}}>
          <AddSources
            formData={ item }
            readOnly={ true }
            requestType={ "edit" }
            handleClose={ ()=>{} }
           />
         </div>

        );
    }

    handleRemoveFeedClick(index) {
        console.log('Handle Source Click Remove Item: ', index);
        let {sourceList} = this.state;
        sourceList.splice(index, 1);
        this.setState({sourceList},
          ()=>{
            console.log('Selected Source Remove Clicked Item: ', this.state.sourceList);
          });
    }


    handleLoadFile(sourceList) {
        console.log('Run handleLoadFile', sourceList);
        // data_file: option.selectedFile.name,
        sourceList.map((feed,index)=>{
          // axios call is made in this component to make it synchrounus activity
          // of transfer file and load data as transfer file will have a n output of filename
          // to be used as input for load data file
          let form = new FormData();
          form.append('data_file', feed.selectedFile);
          let url = BASE_URL + 'view-data-management/load-data';
          const file =  axios.post(url,form)
                              .then(function (response) {
                                // console.log("response of axios post for index",index,response)
                                let data = response.data;
                                let loadInfo = {
                                    source_id: feed.source_id,
                                    business_date: feed.businessDate.format('YYYYMMDD'),
                                    file: feed.selectedFile.name,
                                    data_file: data.filename,
                                    business_or_validation: "ALL",
                                }
                                this.props.loadData(loadInfo);
                                // return(response);
                                // console.log("loadInfo of axios post for index",loadInfo)
                              }.bind(this));
                              // .catch(function (error) {
                              //   alert(error);
                              //   });
        })
        this.setState({sourceList: [],},
          ()=>{
            // alert("Hello")
          }
        );

    }

    render() {
        if (typeof this.props.sourceCatalog !== 'undefined') {
            return (
                <div>
                  <div className="col-sm-6 col-md-6 col-xs-12">
                    <SourceCatalogList
                        sourceCatalog={this.props.sourceCatalog.country}
                        navMenu={false}
                        handleSourceClick={this.handleSourceClick}
                        handleShowDetailsClick={this.handleShowDetailsClick}
                    />
                  </div>
                  <div className="col-sm-6 col-md-6 col-xs-12">
                    <DisplayLoadData
                        sourceList={this.state.sourceList}
                        handleLoadFile={this.handleLoadFile}
                        handleRemoveFeedClick={this.handleRemoveFeedClick}
                        handleShowDetailsClick={this.handleShowDetailsClick}
                    />
                  </div>
                  <ModalAlert
                    ref={(modalAlert) => {this.modalAlert = modalAlert}}
                    onClickOkay={this.handleModalOkayClick}
                  />
                </div>
            )
        } else {
            return (
              <div>
                {
                  this.loadingPage("fa-rss", "blue","Loading Source Feed List")
                }
              </div>
            );
        }
    }
}

function mapStateToProps(state) {
    console.log('State: ', state);
    return {
        sourceCatalog: state.source_feeds.sources,
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
        leftMenuClick: (isLeftMenu) => {
            dispatch(actionLeftMenuClick(isLeftMenu));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadData);
