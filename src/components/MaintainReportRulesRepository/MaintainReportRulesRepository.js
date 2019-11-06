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
import MaintainFreeFormatReportRepoRules from '../MaintainFreeFormatReportRepository/MaintainFreeFormatReportRepositoryRules';

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
      this.props.fetchReportRepoCatalogList(this.country);
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
          this.props.fetchReportRepoCatalogList(this.country);
        }
      );
    }
  }

  render(){
      return(
        <div >
          <MaintainFreeFormatReportRepoRules
            {...this.props}
            groupId={this.groupId}
            />
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
    fetchReportRepoCatalogList:(country)=>{
        dispatch(actionFetchReportCatalog(country))
    },
  }
}

const VisibleMaintainReportRulesRepository = connect(
  mapStateToProps,
  mapDispatchToProps
)(MaintainReportRulesRepository);

export default VisibleMaintainReportRulesRepository;
