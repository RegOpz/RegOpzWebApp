import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { componentMaptoName } from '../../utils/componentMap';
import getDisplayName from 'recompose/getDisplayName';
import _ from 'lodash';
import AccessDenied from './AccessDenied';
import ModalAlert from '../ModalAlert/ModalAlert';
import { actionLogout } from '../../actions/LoginAction';

export default function authenticate(ComposedComponent,ignoreComponentPermission){
  class Authentication extends Component{
     constructor(props){
       super(props);
       // Added for auto timeout due to inactivity
       this.state = {
        warningTime: 1000 * 60 * 10, //10 min
        signoutTime: 1000 * 60 * 11, //11 min
        timeRemaining: 60,
      };

      this.showWarnTimeout = false;
      this.events = [
        'load',
        'mousemove',
        'mousedown',
        'click',
        'scroll',
        'keypress',
        'keydown',
        'focus',
        // 'wheel',
        // 'DOMMouseScroll',
        // 'mouseWheel',
        // 'touchstart',
        // 'touchmove',
        // 'MSPointerDown',
        // 'MSPointerMove'
      ];
      // Methods
      this.clearTimeoutFunc = this.clearTimeoutFunc.bind(this);
      this.setTimeout = this.setTimeout.bind(this);
      this.resetTimeout = this.resetTimeout.bind(this);
      this.warn = this.warn.bind(this);
      this.logout = this.logout.bind(this);
      this.destroy = this.destroy.bind(this);
      this.tick = this.tick.bind(this);
     }

     // Auto logout code injection
     componentDidMount() {
         for (var i in this.events) {
           window.addEventListener(this.events[i], this.resetTimeout);
         }

         this.setTimeout();
       }

     componentWillUnmount() {
         for (var i in this.events) {
           window.removeEventListener(this.events[i], this.resetTimeout);
         }
         this.clearTimeoutFunc();
      }

       clearTimeoutFunc() {
         if (this.warnTimeout) clearTimeout(this.warnTimeout);

         if (this.logoutTimeout) clearTimeout(this.logoutTimeout);

         if(this.intervalID) clearInterval(this.intervalID);
         // console.log('clearTimeout Sending a reset request for timeout ...', this.warnTimeout, this.logoutTimeout);
       };

       setTimeout() {
         // this.intervalID = setInterval(this.tick,1000);
         this.showWarnTimeout = false;
         this.warnTimeout = setTimeout(this.warn, this.state.warningTime);
         this.logoutTimeout = setTimeout(this.logout, this.state.signoutTime);
       };

       resetTimeout() {
         if(this.modalAlert) this.modalAlert.close();
         this.setState({
           timeRemaining: 60
         });
         this.clearTimeoutFunc();
         this.setTimeout();
       };

       warn() {
         if (sessionStorage.RegOpzToken) {
           this.intervalID = setInterval(this.tick,1000);
           this.showWarnTimeout = true;
           // this.modalAlert.isDiscardToBeShown = false;
           // this.modalAlert.open(
           //   <div className="mid_center">
           //     <h1>
           //       <i className="fa fa-clock-o"></i>
           //     </h1>
           //     <h4>
           //       <small>Your session will be logged out automatically in </small>
           //       <strong> {this.state.timeRemaining} </strong>
           //       <small> seconds</small>
           //     </h4>
           //   </div>);
           // window.alert("You will be logged out automatically in " + this.state.timeRemaining + "seconds" )
         }
         // console.log('You will be logged out automatically in 1 minute.');
       };

       logout() {
         // Send a logout request to the API
         if (sessionStorage.RegOpzToken) {
           console.log('Sending a logout request to the API...');
           this.clearTimeoutFunc();
           this.destroy();
         }
       };

       destroy() {
        //clear the session
         this.props.logoutAPI();
         // Force reload the window to clean store values
         window.location.reload();
         // browserHistory.push('/');
         // window.location.assign('/');
       };

       tick() {
         // console.log("Time remaining is ", this.state.timeRemaining)
         this.setState({
           timeRemaining: this.state.timeRemaining - 1
         });

       }

      render(){
        // const name=componentMaptoName[getDisplayName(ComposedComponent).replace("Connect(",'').replace(")",'')];
        // console.log("ComposedComponent......", this.props.route.name);
        const name=this.props.route.name;
        const subscribedComponents=JSON.parse(this.props.login_details.domainInfo.subscription_details);
        // console.log("Render function,Authentication.....",name,ComposedComponent,getDisplayName(ComposedComponent));
        // console.log("Render function called, Authentication.....",this.props.login_details);
        let component = null;
        // Do not check subscriptiondetails for team regopz, else check subscription details to determine access
        if ((this.props.login_details.domainInfo.tenant_id=='regopz')
            || (subscribedComponents && subscribedComponents[name])) {
          component = _.find(this.props.login_details.permission,{component:name});
        }
        if(! component && ! ignoreComponentPermission) {
          return <AccessDenied
                  component={name}/>
        }
        // console.log("Render function called, Authentication.....",component);
        if(this.showWarnTimeout){
          let classSec = "";
          if(this.state.timeRemaining > 40){
            classSec = "dark";
          } else if (this.state.timeRemaining > 25 ) {
            classSec = "blue"
          } else if (this.state.timeRemaining > 10 ) {
            classSec = "amber"
          } else if (this.state.timeRemaining <= 10 ) {
            classSec = "red"
          }
          this.modalAlert.isDiscardToBeShown = false;
          this.modalAlert.isOkayToBeShown = false;
          this.modalAlert.modalTitle = <span><i className={"fa fa-clock-o " + classSec }></i> Session Expiry Warning<small></small></span>;
          this.modalAlert.open(
            <div className="mid_center">
              <h1 className={classSec}>
                <i className="fa fa-coffee"></i>
                <span style={{"font-family": "Arial, Helvetica, sans-serif"}}>&nbsp;timeout</span>
              </h1>
              <h4>
                <small>No user activity noticed for a while.
                  Your session will be logged out automatically if idle session continues for another </small>
                <strong className={classSec}> {this.state.timeRemaining} </strong>
                <small> seconds</small>
              </h4>
            </div>);
        }
        const newProps={user:this.props.login_details.user,
                        tenant_id:this.props.login_details.domainInfo.tenant_id,
                        privileges: ! ignoreComponentPermission ? component.permissions : {}}

        return <div>
                <ComposedComponent {...this.props} {...newProps}/>
                <ModalAlert
                  ref={(modalAlert) => {this.modalAlert = modalAlert}}
                  onClickOkay={this.handleModalOkayClick}
                />
              </div>
      }
    }

  function mapStatetoProps(state){
    console.log("Inside mapStatetoProps, authenticate.....",state);
    return {
      login_details:state.login_store
    };
  }

  const mapDispatchToProps = (dispatch) => {
    return {
      logoutAPI: () => {
        dispatch(actionLogout());
      }
    }
  }

  return connect(mapStatetoProps, mapDispatchToProps)(Authentication);
}
