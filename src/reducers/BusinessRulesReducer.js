import { BASE_URL } from '../Constant/constant';
import {
  FETCH_RULES,
  INSERT_RULES,
  DELETE_RULES,
  EXPORT_RULES_CSV
} from '../actions/BusinessRulesAction';
import {
  FETCH_DRILLDOWN_RULES_REPORT
} from '../actions/ViewDataAction';

// TODO:
export default function(state=[], action) {
  console.log("Action received: ",action);
  switch(action.type) {
    case FETCH_RULES:
      return Object.assign({}, state, {
        gridBusinessRulesData: action.payload.data
      });
    case FETCH_DRILLDOWN_RULES_REPORT:
      return Object.assign({}, state, {
        gridBusinessRulesData: action.payload.data
      });
    case INSERT_RULES:
    	state[0].rows.splice(action.meta.at, 0, action.payload.data);
    	return state.splice(0, 1, state);
    case DELETE_RULES:
    	// state[0].rows.splice(action.meta.at, 1);
    	// return state.splice(0, 1, state);
      return state;
    case EXPORT_RULES_CSV:
      window.location.href = BASE_URL + "../../static/" + action.payload.data.file_name;
      return state;
    default:
      return state;
  }
}
