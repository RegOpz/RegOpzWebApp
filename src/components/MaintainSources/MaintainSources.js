import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import { Link } from 'react-router';
import _ from 'lodash';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import {
  actionFetchSources
} from '../../actions/MaintainSourcesAction';
import {
  actionLeftMenuClick,
} from '../../actions/LeftMenuAction';
import SourceCatalogList from './SourceCatalog';
import AddSources from './AddSources/AddSources';
import AuditModal from '../AuditModal/AuditModal';
import ModalAlert from '../ModalAlert/ModalAlert';
require('./MaintainSources.css');
require('react-datepicker/dist/react-datepicker.css');

class MaintainSources extends Component {
  constructor(props){
    super(props)
    this.state = {
      sources:null,
      itemEditable: true,
      display: false,
      sourceFileName: null
    }

    this.formData = {};

    this.renderDynamic = this.renderDynamic.bind(this);

    this.handleSourceClick = this.handleSourceClick.bind(this);
    this.handleAddSourceClick = this.handleAddSourceClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleModalOkayClick = this.handleModalOkayClick.bind(this);
    this.handleAuditOkayClick = this.handleAuditOkayClick.bind(this);

    this.viewOnly = _.find(this.props.privileges, { permission: "View Sources" }) ? true : false;
    this.writeOnly = _.find(this.props.privileges, { permission: "Manage Sources" }) ? true : false;
  }

  componentWillMount() {
      this.props.fetchSources();
  }

  componentDidUpdate() {
    console.log("Dates",this.state.startDate);
     this.props.leftMenuClick(false);
  }
  componentWillReceiveProps(nextProps){
    console.log("nextProps",this.props.leftmenu);
    if(this.props.leftmenu){
      this.setState({
        display: false
      });
    }
  }

  handleSourceClick(item) {
    console.log("selected item",item);
    this.formData=item;
    this.setState({
        display: "editSources",
        sourceFileName: item.source_file_name
     });
  }

  handleAddSourceClick() {
    this.formData={
        source_table_name: null,
        source_id: null,
        country: null,
        id: null,
        source_description: '',
        source_file_name: null,
        source_file_delimiter: null,
        last_updated_by: null
      };
    this.setState({
        display: "addSources",
        sourceFileName: "Adding New Source"
     });
  }

  handleClose() {
    this.setState({
          display: false,
       });
  }

  renderDynamic(displayOption) {
      switch (displayOption) {
          case "addSources":
              return(
                      <AddSources
                        formData={ this.formData }
                        readOnly={ !this.writeOnly }
                        requestType={ "add" }
                        handleClose={ this.handleClose.bind(this) }
                       />
                  );
              break;
          case "editSources":
              return(
                      <AddSources
                        formData={ this.formData }
                        readOnly={ !this.writeOnly }
                        requestType={ "edit" }
                        handleClose={ this.handleClose.bind(this) }
                       />
                  );
              break;
          default:
              return(
                  <SourceCatalogList
                    sourceCatalog={this.props.sourceCatalog.country}
                    navMenu={false}
                    handleSourceClick={this.handleSourceClick}
                    />
              );
      }
  }

  handleModalOkayClick(event){
    // TODO
  }

  handleAuditOkayClick(auditInfo){
    //TODO
  }

  render(){
    if (typeof this.props.sourceCatalog !== 'undefined') {
        return(
          <div>
            <div className="row form-container">
              <div className="x_panel">
                <div className="x_title">
                    {
                        ((displayOption) => {
                            if (!displayOption) {
                                return(
                                    <h2>Maintain Sources <small>Available Sources to Maintain Definition</small></h2>
                                );
                            }
                            return(
                                <h2>Maintain Source <small>{' Source '}</small>
                                  <small><i className="fa fa-file-text"></i></small>
                                  <small>{this.state.sourceFileName }</small>
                                </h2>
                            );
                        })(this.state.display)
                    }
                    <div className="row">
                      <ul className="nav navbar-right panel_toolbox">
                        <li>
                          <a className="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                            <i className="fa fa-rss"></i><small>{' Sources '}</small>
                            <i className="fa fa-caret-down"></i>
                          </a>
                          <ul className="dropdown-menu dropdown-usermenu pull-right" style={{ "zIndex": 9999 }}>
                            <li style={{ "padding": "5px" }}>
                              <Link to="/dashboard/maintain-sources"
                                onClick={()=>{ this.setState({ display: false }) }}
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
                <div className="col col-lg-2">
                    <button
                      className="btn btn-success btn-sm"
                      disabled = { !this.writeOnly }
                      onClick={()=>{this.handleAddSourceClick()}}>
                      New Source
                    </button>
                </div>
                <div className="x_content">
                {
                    this.renderDynamic(this.state.display)
                }
                </div>
            </div>
          </div>
          <ModalAlert
            ref={(modalAlert) => {this.modalAlert = modalAlert}}
            onClickOkay={this.handleModalOkayClick}
          />

          < AuditModal showModal={this.state.showAuditModal}
            onClickOkay={this.handleAuditOkayClick}
          />
        </div>
      );
    } else {
      return(
        <h4> Loading.....</h4>
      );
    }
  }
}

function mapStateToProps(state){
  console.log("On mapState ", state, state.view_data_store, state.report_store);
  return {
    //data_date_heads:state.view_data_store.dates,
    sourceCatalog: state.source_feeds.sources,
    login_details: state.login_store,
    leftmenu: state.leftmenu_store.leftmenuclick,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSources:(sources,country)=>{
      dispatch(actionFetchSources(sources,country))
    },
    leftMenuClick:(isLeftMenu) => {
      dispatch(actionLeftMenuClick(isLeftMenu));
    },
  }
}

const VisibleMaintainSources = connect(
  mapStateToProps,
  mapDispatchToProps
)(MaintainSources);

export default VisibleMaintainSources;
