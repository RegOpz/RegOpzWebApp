import { BASE_URL } from '../Constant/constant';
import {
  LOAD_DATA
} from '../actions/LoadDataAction';

// TODO:
export default function(state={}, action) {
  console.log("Action received: ",action);
  switch(action.type) {
    case LOAD_DATA:
      return Object.assign({}, state, {
        loadDataMsg: action.payload.data
      });
    default:
      return state;
  }
}
