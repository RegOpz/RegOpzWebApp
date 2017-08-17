import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import custom from '../../../js/custom';

class LeftMenu extends Component {
    render() {
        return (
            <div className="col-md-3 left_col">
                <div className="left_col scroll-view">
                    <div className="navbar nav_title">
                        <a href="#/dashboard" className="site_title">
                            <i className="fa fa-paw"></i>
                            <span> RegOpz Dash!</span>
                        </a>
                    </div>
                    <div className="clearfix"></div>
                    <div className="profile clearfix">
                        <div className="profile_pic">
                            <img src="images/img.jpg" alt="..." className="img-circle profile_img"/>
                        </div>
                        <div className="profile_info">
                            <span>Welcome,</span>
                            <h2>John Smith</h2>
                        </div>
                    </div>
                    <br/>
                    <div id="sidebar-menu" className="main_menu_side hidden-print main_menu">
                        <div className="menu_section">
                            <h3>General</h3>
                            <ul className="nav side-menu">
                                <li>
                                    <a>
                                        <i className="fa fa-home"></i> Meta Data Management<span className="fa fa-chevron-down"></span>
                                    </a>
                                    <ul className="nav child_menu">
                                        <li>
                                            <a href="#/dashboard/capture-report-template"> Capture Report Template</a>
                                        </li>
                                        <li>
                                            <a href="#/dashboard/maintain-business-rules">Maintain Business Rules</a>
                                        </li>
                                        <li>
                                            <a href="#/dashboard/maintain-report-rules">Maintain Report Rules</a>
                                        </li>
                                        <li>
                                            <a href="#">Data Reteintion</a>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <a>
                                        <i className="fa fa-rss"></i> Data Feed Management<span className="fa fa-chevron-down"></span>
                                    </a>
                                    <ul className="nav child_menu">
                                        <li>
                                            <a href="#/dashboard/maintain-sources">Maintain Sources</a>
                                        </li>
                                        <li>
                                            <a href="#/dashboard/view-data">View Data</a>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <a>
                                        <i className="fa fa-file-excel-o"></i> Reports Management<span className="fa fa-chevron-down"></span>
                                    </a>
                                    <ul className="nav child_menu">
                                      <li>
                                          <a href="#/dashboard/view-report">View Report</a>
                                      </li>
                                      <li>
                                          <a href="#/dashboard/create-report">Create Report</a>
                                      </li>
                                    </ul>
                                </li>
                                <li>
                                    <a>
                                        <i className="fa fa-pencil-square-o"></i> Content Management<span className="fa fa-chevron-down"></span>
                                    </a>
                                    <ul className="nav child_menu">
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
                                      <li>
                                          <Link to="/dashboard/workflow/manage-data-change"> Manage Data Change</Link>
                                      </li>
                                    </ul>
                                </li>
                                <li>
                                    <a>
                                        <i className="fa fa-bar-chart"></i> Data Analytics<span className="fa fa-chevron-down"></span>
                                    </a>
                                    <ul className="nav child_menu">
                                      <li>
                                          <a href="#/dashboard/variance-analysis">Variance Analysis</a>
                                      </li>
                                    </ul>
                                </li>
                                <li>
                                    <a>
                                        <i className="fa fa-users"></i> Access Management<span className="fa fa-chevron-down"></span>
                                    </a>
                                    <ul className="nav child_menu">
                                      <li>
                                        <Link to="/dashboard/manage-users">Manage Users</Link>
                                      </li>
                                      <li>
                                        <Link to="/dashboard/manage-roles">Manage Roles</Link>
                                      </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    componentDidMount(){
      var customScript = new custom();
      customScript.runScript();

    }
}
export default LeftMenu;
