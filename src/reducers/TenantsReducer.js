import {
    CHECK_TENANT_ACTION,
    FETCH_TENANT_ACTION,
    UPDATE_TENANT_ACTION,
    ADD_TENANT_ACTION,
} from '../actions/TenantsAction.js';

// TODO: Create redux state to store User Details
export default function(state = {}, action) {
  console.log("Action received at TenantsReducer:", action);
  switch (action.type) {
    case CHECK_TENANT_ACTION:
      return Object.assign({}, state, {
        error: action.payload.data
      });
      // return { ...state, error: action.payload.data };
    case FETCH_TENANT_ACTION:
      return Object.assign({}, state, {
        tenants: action.payload.data
      });
    case UPDATE_TENANT_ACTION: case ADD_TENANT_ACTION:
      return { ...state, message: action.payload.data };
    default:
      return state;
  }
}
