import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import custom from '../../../js/custom';
import { connect } from 'react-redux';

class MasterLeftMenu extends Component {
  constructor(props){
    super(props)
    this.handleLeftMenuClick = this.handleLeftMenuClick.bind(this);
  }
  handleLeftMenuClick(){
      this.props.leftMenuClick(true);
  }
    render() {
        return (
              <ul className="nav side-menu">
                  <li>
                      <a>
                          <i className="fa fa-cube"></i> Meta Data Management<span className="fa fa-chevron-down"></span>
                      </a>
                      <ul className="nav child_menu">
                          <li>
                              <a href="#/dashboard/capture-report-template"> Capture Report Template</a>
                          </li>
                      </ul>
                  </li>
                  <li>
                      <a>
                          <i className="fa fa-pencil-square-o"></i> Content Management<span className="fa fa-chevron-down"></span>
                      </a>
                      <ul className="nav child_menu">
                        <li>
                            <a href="#/dashboard/maintain-business-rules-repo" onClick={this.handleLeftMenuClick}>Maintain Business Rules Repository</a>
                        </li>
                        <li>
                            <a href="#/dashboard/maintain-report-rules-repo" onClick={this.handleLeftMenuClick}>Maintain Report Rules Repository</a>
                        </li>
                      </ul>
                  </li>
                  <li>
                      <a>
                          <i className="fa fa-pie-chart"></i> KPIs<span className="fa fa-chevron-down"></span>
                      </a>
                      <ul className="nav child_menu">
                      </ul>
                  </li>
                  <li>
                      <a>
                          <i className="fa fa-code-fork"></i> Work Flow Management<span className="fa fa-chevron-down"></span>
                      </a>
                      <ul className="nav child_menu">
                          <li>
                              <Link to="/dashboard/workflow/manage-def-change"> Manage Definition Change</Link>
                          </li>
                      </ul>
                  </li>
                  <li>
                      <a>
                          <i className="fa fa-bar-chart"></i> Data Analytics<span className="fa fa-chevron-down"></span>
                      </a>
                  </li>
                  <li>
                      <a>
                          <i className="fa fa-users"></i> Access Management<span className="fa fa-chevron-down"></span>
                      </a>
                      <ul className="nav child_menu">
                          <li>
                              <Link to="/dashboard/manage-subscribers" onClick={this.handleLeftMenuClick}>Manage Subscribers</Link>
                          </li>
                          <li>
                              <Link to="/dashboard/manage-users">Manage Users</Link>
                          </li>
                          <li>
                              <Link to="/dashboard/manage-roles" onClick={this.handleLeftMenuClick}>Manage Roles</Link>
                          </li>
                      </ul>
                  </li>
              </ul>
        )
    }
}

export default connect()(MasterLeftMenu);
