import { BASE_URL } from '../Constant/constant';
import {
  DELETE_RULES,
  EXPORT_RULES_CSV
} from '../actions/BusinessRulesAction';
import {
  FETCH_DRILLDOWN_RULES_REPORT
} from '../actions/ViewDataAction';
import {
  FETCH_REPOSITORY_RULES,
  INSERT_REPOSITORY_RULES,
  UPDATE_REPOSITORY_RULES,
  DELETE_REPOSITORY_RULES,
  COPY_REPOSITORY_RULES_TO_TENANT,
  FETCH_MASTER_REPORT_LINKAGE,
  FETCH_MASTER_FIXEDFORMAT_REPORT_LINKAGE,
} from '../actions/BusinessRulesRepositoryAction';

// TODO:
export default function(state=[], action) {
  switch(action.type) {
    case FETCH_REPOSITORY_RULES:
      return Object.assign({}, state, {
        gridBusinessRulesData: action.payload.data
      });
    case FETCH_DRILLDOWN_RULES_REPORT:
      return Object.assign({}, state, {
        gridBusinessRulesData: action.payload.data
      });
    case FETCH_MASTER_REPORT_LINKAGE:
      return Object.assign({}, state, { report_linkage: action.payload.data });
    case FETCH_MASTER_FIXEDFORMAT_REPORT_LINKAGE:
      return Object.assign({}, state, { report_linkage_fixedformat: action.payload.data });
    case INSERT_REPOSITORY_RULES: case UPDATE_REPOSITORY_RULES: case DELETE_REPOSITORY_RULES:
    case COPY_REPOSITORY_RULES_TO_TENANT:
    	return { ...state, message: action.payload.data };
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
