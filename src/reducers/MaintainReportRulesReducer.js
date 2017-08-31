import {BASE_URL} from '../Constant/constant';
import {
  FETCH_REPORT_TEMPLATE_LIST,
  FETCH_BUSINESS_RULES_BY_SOURCE_ID,
  FETCH_SOURCES,
  FETCH_TABLE_COLUMNS_LIST,
  INSERT_MAINTAIN_RULE_DATA,
  UPDATE_MAINTAIN_RULE_DATA,
  DELETE_MAINTAIN_RULE_DATA,
  EXPORT_REPORT_XLSX,
  EXPORT_REPORT_RULE_XLSX
} from '../actions/MaintainReportRuleAction';

// TODO:
export default function(state=[], action) {
  console.log("Action received in maintain report rules reducer: ", action);
  switch(action.type){
    case FETCH_REPORT_TEMPLATE_LIST:
    return Object.assign({}, state, {
      report_template_list: action.payload.data
    });
    case FETCH_BUSINESS_RULES_BY_SOURCE_ID:
		return Object.assign({}, state, {
			business_rules: action.payload.data
		});
	case FETCH_SOURCES:
		return Object.assign({}, state, {
			sources: action.payload.data
		});
  case FETCH_TABLE_COLUMNS_LIST:
  return Object.assign({}, state, {
    source_table_columns:action.payload.data
  })
  case DELETE_MAINTAIN_RULE_DATA:
    console.log('In capturereport reducer for delete cell calc rules', state,
    action.meta);
    //state.drill_down_result.cell_rules.splice(action.meta.at,1);
    //return state.splice(0,1,state)
    return state;
  case EXPORT_REPORT_RULE_XLSX:
    window.location.href = BASE_URL + "../../static/" + action.payload.data.file_name;
    return state;
  case EXPORT_REPORT_XLSX:
    window.location.href = BASE_URL + "../../static/" + action.payload.data.file_name;
    return state;
  default:
  	return state;
  }
}
