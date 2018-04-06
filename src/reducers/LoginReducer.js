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
        const { userId, name, role, permission } = helperLogin(action.payload.data);
        localStorage.setItem('RegOpzToken', action.payload.data);
        return { user: userId, name: name, role: role, permission: permission, error: null };
      } catch (err) {
        return { error: err.message };
      }
    case LOGIN_CHECK:
      try {
        const { userId, name, role, permission } = helperLogin(action.payload);
        return { user: userId, name: name, role: role, permission: permission, error: null };
      } catch (err) {
        return { error: err.message };
      }
    case LOGOUT:
      localStorage.removeItem('RegOpzToken');
      setAuthorization(false);
      return {};

    case DOMAIN_REQUEST:
      if(!action.error){
            return {domainInfo:action.payload.data,error:null};
        } else {
            return { error: action.payload.response.data.msg };
        }

    default:
      return state;
  }
}
