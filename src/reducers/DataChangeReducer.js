import {FETCH_DATA_AUDIT_LIST,
        FETCH_DATA_AUDIT_HISTORY,
        FETCH_DATA_RECORD_DETAIL,
        POST_DATA_AUDIT_DECISION
      } from '../actions/DataChangeAction';

export default function(state={},action){

  switch(action.type){

    case FETCH_DATA_AUDIT_LIST:
      return Object.assign({},{...state},{audit_change_list:action.payload.data});
    case FETCH_DATA_AUDIT_HISTORY:
      return Object.assign({},{...state},{audit_list:action.payload.data});
    case FETCH_DATA_RECORD_DETAIL:
      return Object.assign({},{...state},{record_detail:action.payload.data});
    case POST_DATA_AUDIT_DECISION:
      let responseTime = new Date();
      return Object.assign({},{...state},{post_decision_status: responseTime.toLocaleString()});
    default:
      return state;
  }
}
