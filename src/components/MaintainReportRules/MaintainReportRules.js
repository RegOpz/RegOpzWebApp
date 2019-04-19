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
  actionFetchReportTemplate,
} from '../../actions/MaintainReportRuleAction';
import MaintainFreeFormatReportRules from '../MaintainFreeFormatReport/MaintainFreeFormatReportRules';

class MaintainReportRules extends Component {
  constructor(props){
    super(props)
    this.state = {
        selectedTab: 0,
    }
    this.groupId = this.props.user + this.props.tenant_id + "RR" + moment.utc();

    this.viewOnly = _.find(this.props.privileges, { permission: "View Report Rules" }) ? true : false;
    this.writeOnly = _.find(this.props.privileges, { permission: "Edit Report Rules" }) ? true : false;
  }

  componentWillMount() {
      // TODO
      this.props.fetchReportTemplateList();
  }

  componentDidUpdate() {
    console.log("Dates",this.state.startDate);
    this.props.leftMenuClick(false);
  }
  componentWillReceiveProps(nextProps){
    // TODO
    console.log("nextProps maintain Report Rules",this.props.leftmenu);
    if(this.props.leftmenu){
      this.setState({
        selectedTab: 0,
        },
        ()=>{
          this.props.fetchReportTemplateList();
        }
      );
    }
  }

  render(){
      return(
        <div >
          <MaintainFreeFormatReportRules
            privileges={this.props.privileges}
            groupId={this.groupId}
            dataCatalog={this.props.dataCatalog}
            />
        </div>
    );
  }
}

function mapStateToProps(state){
  return {
    // TODO
    dataCatalog: state.maintain_report_rules_store.report_template_list,
    login_details: state.login_store,
    leftmenu: state.leftmenu_store.leftmenuclick,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    leftMenuClick:(isLeftMenu) => {
      dispatch(actionLeftMenuClick(isLeftMenu));
    },
    fetchReportTemplateList:(reports,country)=>{
        dispatch(actionFetchReportTemplate(reports,country))
    },
  }
}

const VisibleMaintainReportRules = connect(
  mapStateToProps,
  mapDispatchToProps
)(MaintainReportRules);

export default VisibleMaintainReportRules;
