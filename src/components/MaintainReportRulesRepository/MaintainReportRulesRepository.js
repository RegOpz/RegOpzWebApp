import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import { Link } from 'react-router';
import { Tab, Tabs } from 'react-bootstrap';
import _ from 'lodash';
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

    this.viewOnly = _.find(this.props.privileges, { permission: "View Report Rules" }) ? true : false;
    this.writeOnly = _.find(this.props.privileges, { permission: "Edit Report Rules" }) ? true : false;
  }

  componentWillMount() {
      // TODO
      this.props.fetchReportCatalogList();
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
          this.props.fetchReportCatalogList();
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
              />
            </Tab>
            <Tab
              key={1}
              eventKey={1}
              title={"Transactional"}
            >
              <MaintainTransactionReportRules
                privileges={this.props.privileges}
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
