import { BASE_URL } from '../Constant/constant';
import {
  FETCH_DATES,
  VIEW_DATA_FETCH_REPORT_LINKAGE,
  SET_FORM_DISPLAY_DATA,
  RESET_FORM_DISPLAY_DATA,
  SET_FORM_DISPLAY_COLS,
  FETCH_SOURCE,
  FETCH_REPORT_BY_DATE,
  FETCH_CHANGE_HISTORY,
  EXPORT_DATA_CSV,
  FETCH_DRILLDOWN_REPORT,
  LEFTMENUCLICK
} from '../actions/ViewDataAction';
import {
  FETCH_SOURCES
} from '../actions/MaintainReportRuleAction';

// TODO:
export default function(state=[], action) {
  console.log("Action received in view data reducer: ", action);
  switch(action.type) {
    case FETCH_DATES:
      return Object.assign({}, state, {
        dates:action.payload.data
      });
    case FETCH_REPORT_BY_DATE:
      return Object.assign({}, state, {
        gridData:action.payload.data
      });
    case FETCH_SOURCE:
      return Object.assign({}, state, {
        dataCatalog:action.payload.data
      });
    case VIEW_DATA_FETCH_REPORT_LINKAGE:
      return Object.assign({}, state, {
        report_linkage:action.payload.data
      });
    case SET_FORM_DISPLAY_DATA:
      return Object.assign({},state,{
        form_data:action.payload
      });
    case SET_FORM_DISPLAY_COLS:
      return Object.assign({},state,{
        form_cols:action.payload.cols,table_name:action.payload.table_name
      });
    case RESET_FORM_DISPLAY_DATA:
      return Object.assign({},state,{form_data:action.payload});
    case FETCH_CHANGE_HISTORY:
      return Object.assign({},state,{
        change_history:action.payload.data
      });
    case FETCH_SOURCES:
      return Object.assign({},state,{
        sources:action.payload.data.source_suggestion
      });
    case FETCH_DRILLDOWN_REPORT:
      return Object.assign({},state,{
        gridData:action.payload.data
      });
    case EXPORT_DATA_CSV:
      window.location.href = BASE_URL + "../../static/" + action.payload.data.file_name;
      return state;
    case LEFTMENUCLICK:
      console.log("Inside LEFTMENUCLICK", action.payload)
      return Object.assign({}, state, {
        leftmenuclick: action.payload });
    default:
    	return state;
  }
}
