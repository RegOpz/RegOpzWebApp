import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import custom from '../../../js/custom';
import { connect } from 'react-redux';
import {
  actionLeftMenuClick,
} from '../../actions/LeftMenuAction';

class LeftMenu extends Component {
  constructor(props){
    super(props)
    this.handleLeftMenuClick = this.handleLeftMenuClick.bind(this);
  }
  handleLeftMenuClick(){
      this.props.leftMenuClick(true);
  }
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
                            <img src="images/user.png" alt="..." className="img-circle profile_img" />
                        </div>
                        <div className="profile_info">
                            <span>Welcome,</span>
                            <h2>{this.props.login.name}</h2>
                        </div>
                    </div>
                    <br />
                    <div id="sidebar-menu" className="main_menu_side hidden-print main_menu">
                        <div className="menu_section">
                            <h3>General</h3>
                            <ul className="nav side-menu">
                                <li>
                                    <a>
                                        <i className="fa fa-cube"></i> Meta Data Management<span className="fa fa-chevron-down"></span>
                                    </a>
                                    <ul className="nav child_menu">
                                        <li>
                                            <a href="#/dashboard/capture-report-template"> Capture Report Template</a>
                                        </li>
                                        <li>
                                            <a href="#/dashboard/maintain-business-rules" onClick={this.handleLeftMenuClick}>Maintain Business Rules</a>
                                        </li>
                                        <li>
                                            <a href="#/dashboard/maintain-report-rules" onClick={this.handleLeftMenuClick}>Maintain Report Rules</a>
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
                                            <a href="#/dashboard/maintain-sources" onClick={this.handleLeftMenuClick}>Maintain Sources</a>
                                        </li>
                                        <li>
                                            <a href="#/dashboard/view-data" onClick={this.handleLeftMenuClick}>View Data</a>
                                        </li>
                                        <li>
                                            <a href="#/dashboard/load-data" onClick={this.handleLeftMenuClick}>Load Data</a>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <a>
                                        <i className="fa fa-file-excel-o"></i> Reports Management<span className="fa fa-chevron-down"></span>
                                    </a>
                                    <ul className="nav child_menu">
                                        <li>
                                            <a href="#/dashboard/view-report" onClick={this.handleLeftMenuClick}>View Report</a>
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
                                            <a href="#/dashboard/variance-analysis" onClick={this.handleLeftMenuClick}>Variance Analysis</a>
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
                                            <Link to="/dashboard/manage-roles" onClick={this.handleLeftMenuClick}>Manage Roles</Link>
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
    componentDidMount() {
        var customScript = new custom();
        customScript.runScript();

    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    leftMenuClick:(isLeftMenu) => {
      dispatch(actionLeftMenuClick(isLeftMenu));
    },
  }
}

function mapStateToProps(state) {
    return {
        login: state.login_store,
        leftmenu: state.leftmenu_store,
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(LeftMenu);
