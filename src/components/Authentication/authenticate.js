import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { componentMaptoName } from '../../utils/componentMap';
import getDisplayName from 'recompose/getDisplayName';
import _ from 'lodash';
import AccessDenied from './AccessDenied';

export default function authenticate(ComposedComponent){
  class Authentication extends Component{
     constructor(props){
       super(props);
     }

      render(){
        // const name=componentMaptoName[getDisplayName(ComposedComponent).replace("Connect(",'').replace(")",'')];
        console.log("ComposedComponent......", this.props.route.name);
        const name=this.props.route.name;
        const subscribedComponents=JSON.parse(this.props.login_details.domainInfo.subscription_details);
        console.log("Render function,Authentication.....",name,ComposedComponent,getDisplayName(ComposedComponent));
        console.log("Render function called, Authentication.....",this.props.login_details);
        let component = null;
        // Do not check subscriptiondetails for team regopz, else check subscription details to determine access
        if ((this.props.login_details.domainInfo.tenant_id=='regopz')
            || (subscribedComponents && subscribedComponents[name])) {
          component = _.find(this.props.login_details.permission,{component:name});
        }
        if(! component) {
          return <AccessDenied
                  component={name}/>
        }
        console.log("Render function called, Authentication.....",component);
        const newProps={user:this.props.login_details.user,
                        tenant_id:this.props.login_details.domainInfo.tenant_id, 
                        privileges:component.permissions}

        return <ComposedComponent {...this.props} {...newProps}/>
      }
    }

  function mapStatetoProps(state){
    console.log("Inside mapStatetoProps, authenticate.....",state);
    return {
      login_details:state.login_store
    };
  }
  return connect(mapStatetoProps)(Authentication);
}
