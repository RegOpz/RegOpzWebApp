import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { dispatch } from 'redux';
import {
  actionFetchTenant
} from '../../actions/TenantsAction';
import {
  actionLeftMenuClick,
} from '../../actions/LeftMenuAction';
import ModifySubscriber from './ModifySubscriber/ModifySubscriber';
require('./ManageSubscribers.css');


class ManageSubscribersComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
          filterText: null,
          display: false,
          selectedSubscriber : null,
        }
        this.dataSource = null;
        this.fetchFlag = true;
        this.renderUsers = this.renderUsers.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.renderDynamic = this.renderDynamic.bind(this);
        this.handleCloseViewDetails = this.handleCloseViewDetails.bind(this);

        this.viewOnly = _.find(this.props.privileges, { permission: "View Subscribers" }) ? true : false;
        this.writeOnly = _.find(this.props.privileges, { permission: "Edit Subscribers" }) ? true : false;
    }

    componentWillMount() {
        this.props.fetchTenants();
    }

    componentWillUpdate() {
        if (this.fetchFlag) {
            this.dataSource = null;
            this.props.fetchTenants();
        }
    }

    componentWillReceiveProps(nextProps){
      console.log("nextProps",this.props.leftmenu);
      if(this.props.leftmenu){
        this.setState({
          display: false,
        });
      }
    }

    componentDidUpdate(){
        this.fetchFlag = ! this.fetchFlag;
        this.props.leftMenuClick(false);
    }

    componentDidMount() {
        document.title = "RegOpz Dashboard | Manage Users";
    }

    handleFilter(){

        if(typeof this.props.tenantDetails != 'undefined' && this.props.tenantDetails ){
          let userData = this.props.tenantDetails;
          const { filterText } = this.state;
          if (filterText != null) {
              let matchText = RegExp(`(${filterText.toString().toLowerCase().replace(/[,+&\:\ ]$/,'').replace(/[,+&\:\ ]/g,'|')})`,'i');
              console.log("matchText",matchText);
              userData = userData.filter(element =>
                  element.tenant_id.match(matchText) ||
                  element.tenant_description.match(matchText)||
                  element.tenant_email.match(matchText)||
                  element.tenant_phone.match(matchText)||
                  element.tenant_address.match(matchText)||
                  (element.tenant_conn_details ? element.tenant_conn_details.match(matchText) : '')
              );
          }
          this.dataSource = userData;
        }
    }

    handleCloseViewDetails() {
        let isOpen = (this.state.display == "subscriberDetails");
        if (isOpen) {
            this.setState({display: false,
                          selectedSubscriber: null},
                          this.props.fetchTenants()
                        );
        }
    }

    render() {
          return(
              <div>
                { this.renderDisplay() }
              </div>
          );
    }

    renderDisplay() {
        this.handleFilter();

        if(this.dataSource == null) {
            return(
              <h4>Loading....</h4>
            );
        }
        return(
          <div className="row ">
            <div className="col-md-12">
              <div className="x_panel">
                <div className="x_title">
                <h2>Subscriber Management <small>Manage Tenants</small></h2>
                    <div className="clearfix"></div>
                </div>
                { this.renderDynamic(this.state.display)}
              </div>
            </div>
          </div>
        );
    }

    renderDynamic(display){
      switch(display){
        case "subscriberDetails":
          return(
            <ModifySubscriber
              subscriberDetails={this.state.selectedSubscriber}
              onCancel = { this.handleCloseViewDetails }
              />
          )
          break;
        default:
          return(
            <div className="x_content">
              <div className="input-group">
                  <input
                    id="filter"
                    className="form-control col-md-9 col-sm-9 col-xs-12"
                    placeholder="Enter Filter Text"
                    value={this.state.filterText}
                    onChange={(event) => {
                        this.setState({ filterText: event.target.value });
                    }}
                  />
                  <span className="input-group-addon">
                    <i className="fa fa-filter"></i>
                  </span>
              </div>
              <div className="row">
                <div className="col-md-12 col-sm-12 col-xs-12"></div>
                <div classNam="clearfix"></div>
                { this.renderUsers(this.dataSource)  }
              </div>
            </div>
          );
      }
    }

    renderUsers(dataSource) {
      let user_list = [];
      dataSource.map((item, index) => {
          // console.log(index, "From ManageSubscribers", item);
          user_list.push(
              <div key={index} className="col-md-4 col-sm-4 col-xs-12 profile_details">
                <div className="well profile_view">
                  <div className="col-sm-12">
                    <h4 className="brief">
                      <i>Subscriber Details</i>
                    </h4>
                    <div className="left col-xs-7">
                      <h2>
                        <span className="small dark"><strong>{ item.tenant_description }</strong></span>
                      </h2>
                      <ul className="list-unstyled">
                        <li key={"id"}>
                          <i className="fa fa-bank"></i>
                          <strong> ID:</strong> { item.tenant_id }
                        </li>
                        <li key={"phone"}>
                          <i className="fa fa-phone"></i>
                          <strong> Contact:</strong> { item.tenant_phone }
                        </li>
                        <li key={"email"}>
                          <i className="fa fa-paper-plane"></i>
                          <strong> Email:</strong> { item.tenant_email }
                        </li>
                        <li key={"address"}>
                          <i className="fa fa-barcode"></i>
                          <strong> Address:</strong> { item.tenant_address }
                        </li>
                      </ul>
                    </div>
                    <div className="right col-xs-5 text-center">
                      <img src="images/user.png" alt="" className="img-circle img-responsive" />
                    </div>
                  </div>
                  <div className="col-xs-12 bottom text-center">
                    <div className="col-xs-12 col-sm-6 emphasis"></div>
                      <div className="col-xs-12 col-sm-6 emphasis">
                        <button
                          className="btn btn-primary btn-xs"
                          onClick={ ()=>{
                            this.setState({display: "subscriberDetails",
                                          selectedSubscriber: item});
                          }}
                          >
                            <i className="fa fa-user"></i> View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
          );
      });
      return(user_list);
    }
}

function mapStateToProps(state) {
    console.log("On map state of Manage Users:", state);
    return {
        login_details:state.login_store,
        tenantDetails: state.tenant_details.tenants,
        leftmenu: state.leftmenu_store.leftmenuclick,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchTenants: () => {
            dispatch(actionFetchTenant());
        },
        leftMenuClick:(isLeftMenu) => {
          dispatch(actionLeftMenuClick(isLeftMenu));
        },
    };
};

const VisibleManageSubscribers = connect(
    mapStateToProps,
    mapDispatchToProps
)(ManageSubscribersComponent);

export default VisibleManageSubscribers;
