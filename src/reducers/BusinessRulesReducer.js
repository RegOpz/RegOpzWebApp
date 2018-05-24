import { BASE_URL } from '../Constant/constant';
import {
  FETCH_RULES,
  INSERT_RULES,
  DELETE_RULES,
  UPDATE_RULES,
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
    case INSERT_RULES: case UPDATE_RULES: case DELETE_RULES:
    	return { ...state, message: action.payload.data };
    case EXPORT_RULES_CSV:
      window.location.href = BASE_URL + "../../static/" + action.payload.data.file_name;
      return state;
    default:
      return state;
  }
}
