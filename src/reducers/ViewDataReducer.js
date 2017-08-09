import {
  FETCH_DATES,
  VIEW_DATA_FETCH_REPORT_LINKAGE,
  SET_FORM_DISPLAY_DATA,
  RESET_FORM_DISPLAY_DATA,
  SET_FORM_DISPLAY_COLS
} from '../actions/ViewDataAction';

// TODO:
export default function(state=[], action) {
  console.log("Action received in view data reducer: ", action);
  switch(action.type) {
    case FETCH_DATES:
      return Object.assign({}, state, {
        dates:action.payload.data
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

    default:
    	return state;
  }
}
