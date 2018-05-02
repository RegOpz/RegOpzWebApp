import { BASE_URL } from '../Constant/constant';
import {
  FETCH_REPOSITORY_REPORTS,
} from '../actions/ReportRulesRepositoryAction';

// TODO:
export default function(state=[], action) {
  switch(action.type) {
    case FETCH_REPOSITORY_REPORTS:
      return Object.assign({}, state, {
        reportCatalogList: action.payload.data
      });
    default:
      return state;
  }
}
