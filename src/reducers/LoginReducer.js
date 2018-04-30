import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_CHECK, LOGOUT,DOMAIN_REQUEST } from '../actions/LoginAction';
import setAuthorization from '../utils/setAuthorization';
var jwtDecode = require('jwt-decode');

function helperLogin(webToken) {
  setAuthorization(webToken);
  try {
    const decrypt_token = jwtDecode(webToken);
    return decrypt_token;
  } catch (err) {
    throw err;
  }
}

// TODO: Create Redux state for user containing token
export default function(state = {}, action) {
  console.log("Action received at Login: ", action);
  switch (action.type) {
    case LOGIN_REQUEST:
      try {
        if (action.error){
          let loginTime = new Date()
          return Object.assign({}, state, {
            user: null, name: null, role: null, permission: null,error: loginTime.toLocaleString()+" " +action.payload.response.data.msg
          });
        } else {
          const { userId, name, role, permission, domainInfo } = helperLogin(action.payload.data);
          sessionStorage.setItem('RegOpzToken', action.payload.data);
          return Object.assign({}, state, {
            user: userId, name: name, role: role, permission: permission, error: null
          });
        }
      } catch (err) {
        return Object.assign({}, state, { error: err.message });
      }
    case LOGIN_CHECK:
      try {
        const { userId, name, role, permission, domainInfo } = helperLogin(action.payload);
        // setTenantDetail(domainInfo);
        return { user: userId, name: name, role: role, permission: permission, error: null, domainInfo: JSON.parse(domainInfo) };
      } catch (err) {
        return { error: err.message };
      }
    case LOGOUT:
      sessionStorage.removeItem('RegOpzToken');
      setAuthorization(false);
      return {};

    case DOMAIN_REQUEST:
      if(!action.error){
            // Lets keep token and login_details store data separate. Also ensure that
            // tenant and master connection details are always encrypted and not available in store.
            const { token, subscriptionInfo } = action.payload.data;
            // const { domainInfo } = helperLogin(token);
            sessionStorage.setItem('RegOpzToken', token);
            return {domainInfo: subscriptionInfo, error:null};
        } else {
            let loginTime = new Date()
            return { error: loginTime.toLocaleString() + " : " + action.payload.response.data.msg };
        }

    default:
      return state;
  }
}
