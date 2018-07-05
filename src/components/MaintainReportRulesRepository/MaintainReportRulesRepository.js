import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import { Link } from 'react-router';
import { Tab, Tabs } from 'react-bootstrap';
import _ from 'lodash';
import moment from 'moment';
import {
  actionLeftMenuClick,
} from '../../actions/LeftMenuAction';
import {
  actionFetchReportCatalog,
} from '../../actions/ReportRulesRepositoryAction';
import MaintainFixedFormatReportRules from '../MaintainFixedFormatReportRepository/MaintainFixedFormatReportRepoRules';
import MaintainTransactionReportRules from '../MaintainTransactionalReportRepository/MaintainTransactionReportRepoRules';

class MaintainReportRulesRepository extends Component {
  constructor(props){
    super(props)
    this.state = {
        selectedTab: 0,
    }
    this.country = this.props.country ? this.props.country
                :
                (this.props.login_details.domainInfo.tenant_id != "regopz" ?
                  this.props.login_details.domainInfo.country
                  :
                  null);
    this.tenantRenderType = this.props.tenantRenderType;
    this.groupId = this.props.groupId ?
                    this.props.groupId
                    :
                    this.props.user + this.props.tenant_id + "RRR" + moment.utc();
    this.tenant_report_details = this.props.tenant_report_details;//Done Changes here

    this.viewOnly = _.find(this.props.privileges, { permission: "View Report Rules Repository" }) ? true : false;
    this.writeOnly = _.find(this.props.privileges, { permission: "Edit Report Rules Repository" }) ? true : false;
  }

  componentWillMount() {
      // TODO
      this.props.fetchReportCatalogList(this.country);
  }

  componentDidUpdate() {
    console.log("Dates",this.state.startDate);
    this.props.leftMenuClick(false);
  }
  componentWillReceiveProps(nextProps){
    // TODO
    this.country = nextProps.country ? nextProps.country
                :
                (nextProps.login_details.domainInfo.tenant_id != "regopz" ?
                  nextProps.login_details.domainInfo.country
                  :
                  null);
    console.log("nextProps maintain Report Rules",this.props.leftmenu);
    if(this.props.leftmenu){
      this.setState({
        selectedTab: 0,
        },
        ()=>{
          this.props.fetchReportCatalogList(this.country);
        }
      );
    }
  }

  render(){
      return(
        <div >
          {
            this.props.tenantRenderType=="copyRule" &&
            this.props.reportFormat == "FIXEDFORMAT" &&
            <MaintainFixedFormatReportRules
              {...this.props}
              />
          }
          {
            this.props.tenantRenderType=="copyRule" &&
            this.props.reportFormat == "TRANSACTION" &&
            <MaintainTransactionReportRules
              {...this.props}
              />
          }
          {
            !this.props.tenantRenderType &&
            <Tabs
              defaultActiveKey={0}
              activeKey={this.state.selectedTab}
              onSelect={(key) => {
                  this.setState({selectedTab:key});
              }}
              >
              <Tab
                key={0}
                eventKey={0}
                title={"Fixed Format"}
              >
              <MaintainFixedFormatReportRules
                privileges={this.props.privileges}
                groupId={this.groupId}
                />
              </Tab>
              <Tab
                key={1}
                eventKey={1}
                title={"Transactional"}
              >
                <MaintainTransactionReportRules
                  privileges={this.props.privileges}
                  groupId={this.groupId}
                  />
              </Tab>
              <Tab
                key={2}
                eventKey={2}
                title={"Dynamic Aggregation"}
              >
                <div className="x_panel">
                  <div className="x_content">
                    <h4><i className="fa fa-cogs"></i> <i className="fa fa-wrench"></i>  Build in progress ....</h4>
                  </div>
                </div>
              </Tab>
            </Tabs>
          }
        </div>
    );
  }
}

function mapStateToProps(state){
  return {
    // TODO
    dataCatalog: state.report_rules_repo.reportCatalogList,
    login_details: state.login_store,
    leftmenu: state.leftmenu_store.leftmenuclick,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    leftMenuClick:(isLeftMenu) => {
      dispatch(actionLeftMenuClick(isLeftMenu));
    },
    fetchReportCatalogList:(country)=>{
        dispatch(actionFetchReportCatalog(country))
    },
  }
}

const VisibleMaintainReportRulesRepository = connect(
  mapStateToProps,
  mapDispatchToProps
)(MaintainReportRulesRepository);

export default VisibleMaintainReportRulesRepository;
