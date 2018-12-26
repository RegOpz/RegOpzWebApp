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
import MaintainFixedFormatReportRules from '../MaintainFixedFormatReport/MaintainFixedFormatReportRules';
import MaintainTransactionReportRules from '../MaintainTransactionalReport/MaintainTransactionReportRules';
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
              title={"Free Format"}
            >
              <MaintainFreeFormatReportRules
                privileges={this.props.privileges}
                groupId={this.groupId}
                />
            </Tab>
          </Tabs>
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
