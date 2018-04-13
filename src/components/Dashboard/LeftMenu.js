import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import custom from '../../../js/custom';
import { connect } from 'react-redux';
import {
  actionLeftMenuClick,
} from '../../actions/LeftMenuAction';
import TenantLeftMenu from './TenantLeftMenu';
import MasterLeftMenu from './MasterLeftMenu';

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
                            <h3>{this.props.login.domainInfo.tenant_id}</h3>
                            {
                              this.props.login && this.props.login.domainInfo.tenant_id != 'regopz' &&
                              <TenantLeftMenu
                                leftMenuClick={this.handleLeftMenuClick}
                                />
                            }
                            {
                              this.props.login && this.props.login.domainInfo.tenant_id == 'regopz' &&
                              <MasterLeftMenu
                                leftMenuClick={this.handleLeftMenuClick}
                                />
                              }

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
