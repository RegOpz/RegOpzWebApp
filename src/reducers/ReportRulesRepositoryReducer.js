import { BASE_URL } from '../Constant/constant';
import {
  FETCH_REPOSITORY_REPORTS,
  FETCH_REPOSITORY_REPORT_TEMPLATE,
  FETCH_REPOSITORY_REPORT_DRILLDOWN,
  INSERT_REPOSITORY_REPORT_RULE,
  UPDATE_REPOSITORY_REPORT_RULE,
  FETCH_REPOSITORY_REPORT_CHANGE_HISTORY,
} from '../actions/ReportRulesRepositoryAction';

// TODO:
export default function(state=[], action) {
  switch(action.type) {
    case FETCH_REPOSITORY_REPORTS:
      return Object.assign({}, state, {
        reportCatalogList: action.payload.data
      });
    case FETCH_REPOSITORY_REPORT_TEMPLATE:
      return Object.assign({}, state, {
        capturedTemplate: action.payload.data
      });
    case FETCH_REPOSITORY_REPORT_DRILLDOWN:
      return Object.assign({}, state, {
        cellRules: action.payload.data
      });
    case INSERT_REPOSITORY_REPORT_RULE: case UPDATE_REPOSITORY_REPORT_RULE:
      return { ...state, message: action.payload.data };
    case FETCH_REPOSITORY_REPORT_CHANGE_HISTORY:
      return Object.assign({}, state, {
        changeHistory: action.payload.data
      });
    default:
      return state;
  }
}
