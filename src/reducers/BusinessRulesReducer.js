import { BASE_URL } from '../Constant/constant';
import {
  FETCH_RULES,
  INSERT_RULES,
  DELETE_RULES,
  UPDATE_RULES,
  EXPORT_RULES_CSV,
  FETCH_REPORT_LINKAGE,
  FETCH_FIXEDFORMAT_REPORT_LINKAGE,
} from '../actions/BusinessRulesAction';
import {
  FETCH_DRILLDOWN_RULES_REPORT,
  FETCH_FIXEDFORMAT_DRILLDOWN_RULES_REPORT,
} from '../actions/ViewDataAction';

// TODO:
export default function(state=[], action) {
  console.log("Action received BusinessRulesReducer: ",action);
  switch(action.type) {
    case FETCH_RULES:
      return Object.assign({}, state, {
        gridBusinessRulesData: action.payload.data
      });
    case FETCH_FIXEDFORMAT_DRILLDOWN_RULES_REPORT:
      let origin = action.payload.data.origin;
      let drilldown = {};
      drilldown[origin] = action.payload.data;
      console.log("Action received BusinessRulesReducer FETCH_FIXEDFORMAT_DRILLDOWN_RULES_REPORT : ",action.payload,action.payload.data);
      return Object.assign({}, state, drilldown);
    case FETCH_DRILLDOWN_RULES_REPORT:
      return Object.assign({}, state, {
        gridBusinessRulesData: action.payload.data
      });
    case FETCH_REPORT_LINKAGE:
      return Object.assign({}, state, {
        report_linkage: action.payload.data
      });
    case FETCH_FIXEDFORMAT_REPORT_LINKAGE:
      return Object.assign({}, state, {
        report_linkage_fixedformat: action.payload.data
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
