import {
  FETCH_REPORT_BY_DATE,
  //FETCH_DRILLDOWN_REPORT,
  //FETCH_DRILLDOWN_RULES_REPORT,
  FETCH_TABLE_DATA_REPORT,
  INSERT_SOURCE_DATA,
  UPDATE_SOURCE_DATA,
  DELETE_SOURCE_ROW,
  FETCH_DATE_FOR_REPORT,
  FETCH_REPORT_CATALOG
} from '../actions/ViewDataAction';
import {
  DRILL_DOWN
} from '../actions/CaptureReportAction';

// TODO:
export default function(state=[], action) {
  console.log("Action received in report reducer: ", action, state);
  switch(action.type) {
    // case FETCH_REPORT_BY_DATE:
    // 	state = [];
    //   return state.concat(action.payload.data);
    // case FETCH_DRILLDOWN_REPORT:
    // 	state = [];
    //   return state.concat(action.payload.data);
    case FETCH_TABLE_DATA_REPORT:
      state = [];
      return state.concat(action.payload.data);
    case INSERT_SOURCE_DATA:
      state[0].rows.splice(action.meta.at, 0, action.payload.data);
      return state.splice(0, 1, state);
    case DELETE_SOURCE_ROW:
      state[0].rows.splice(action.meta.at, 1);
      return state.splice(0, 1, state);
    case FETCH_REPORT_CATALOG:
      console.log("FETCH_REPORT_CATALOG",action.payload.data)
      return Object.assign({},state,{
        reports: action.payload.data
      });
    case DRILL_DOWN:
      return Object.assign({}, state, {
        cell_rules: action.payload.data
      });
    default:
    	return state;
  }
}
