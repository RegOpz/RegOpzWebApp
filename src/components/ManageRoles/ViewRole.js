/*
 * ViewRole: Common component to display role informations
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { Label, Tab, Tabs } from 'react-bootstrap';
import moment from 'moment';
import ComponentPermissions from './AddRoles/ComponentPermissions';
import SourcePermissions from './AddRoles/SourcePermissions';
import ReportPermissions from './AddRoles/ReportPermissions';

export default class ViewRole extends Component {
  constructor(props) {
      super(props);
      this.state = {
          selectedTab: 0,
      };
    }
    render() {
        const { item } = this.props;
        if (typeof item !== 'undefined' && item != null) {
            return(
              <div className="x_panel_overflow x_panel tile fixed_height_000">
                <div className="x_title role_label">
                  <h2>{ item.role }
                    <small>Role Details</small>
                  </h2>
                  {
                      this.props.readOnly ||
                      <ul className="nav navbar-right panel_toolbox">
                        <li>
                          <a onClick={() => this.props.handleButtonClicked(item.role) }>
                            <i className="fa fa-wrench" rel="tooltip" title="Edit Role"></i>
                          </a>
                        </li>
                      </ul>
                  }
                  <div className="clearfix"></div>
                </div>
                <div className="x_content small">
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
                      title={<div className="green" title="Components"><i className="fa fa-support"></i>Component</div>}
                    >
                      <div className="form-group">
                      {
                        item.components &&
                        <ComponentPermissions
                          role = { item.role }
                          componentPermissions = { item.components }
                          viewSummary={ true }
                          />
                      }
                      </div>
                    </Tab>
                    {
                      this.props.tenant_id !='regopz' && // regopz tenant_id for master which does not have any source
                      <Tab
                        key={1}
                        eventKey={1}
                        title={<div className="blue" title="Sources"><i className="fa fa-rss"></i>Source</div>}
                      >
                        <div className="form-group">
                        {
                          item.sources &&
                          <SourcePermissions
                            role = { item.role }
                            sourcePermissions = { item.sources }
                            viewSummary={ true }
                            />
                        }
                        </div>
                      </Tab>
                    }
                    <Tab
                      key={2}
                      eventKey={2}
                      title={<div className="amber" title="Reports"><i className="fa fa-file-text"></i>Report</div>}
                    >
                    <div className="form-group">
                    {
                      item.reports &&
                      <ReportPermissions
                        role = { item.role }
                        reportPermissions = { item.reports }
                        viewSummary={ true }
                        />
                    }
                    </div>
                    </Tab>
                  </Tabs>
                </div>
              </div>
            );
        }
    }

}
