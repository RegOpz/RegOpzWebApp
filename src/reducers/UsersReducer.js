import {
    ADD_USER_ACTION,
    FETCH_USER_ACTION,
    CHECK_USER_ACTION,
    UPDATE_USER_ACTION,
    DELETE_USER_ACTION
} from '../actions/UsersAction.js';

// TODO: Create redux state to store User Details
export default function(state = {}, action) {
  console.log("Action received at UserReducer:", action);
  switch (action.type) {
    case ADD_USER_ACTION: case UPDATE_USER_ACTION: case DELETE_USER_ACTION:
      return { ...state, message: action.payload.data };
    case CHECK_USER_ACTION:
      return { ...state, error: action.payload.data };
    case FETCH_USER_ACTION:
      return Object.assign({}, state, {
        data: action.payload.data
      });
      // return { ...state, data: action.payload.data };
    default:
      return state;
  }
}
