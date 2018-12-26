import {BASE_URL} from '../Constant/constant';
import {
  FETCH_CAPTURED_FREE_FORMAT_REPORT,
} from '../actions/FreeFormatReportAction';

// TODO:
export default function(state={}, action) {
  console.log("Action received in free format report reducer: ", action);
  switch(action.type){
    case FETCH_CAPTURED_FREE_FORMAT_REPORT:
    return Object.assign({}, state, {
      report_grid: action.payload.data
    });
  default:
  	return state;
  }
}
