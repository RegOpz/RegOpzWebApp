import {FETCH_AUDIT_LIST,
        FETCH_AUDIT_HISTORY,
        FETCH_RECORD_DETAIL,
        POST_AUDIT_DECISION
        } from '../actions/DefChangeAction';

export default function(state={},action){

  switch(action.type){

    case FETCH_AUDIT_LIST:
      return Object.assign({},{...state},{audit_change_list:action.payload.data});
    case FETCH_AUDIT_HISTORY:
      return Object.assign({},{...state},{audit_list:action.payload.data});
    case FETCH_RECORD_DETAIL:
      return Object.assign({},{...state},{record_detail:action.payload.data});
    case POST_AUDIT_DECISION:
      let responseTime = new Date();
      return Object.assign({},{...state},{post_decision_status: responseTime.toLocaleString()});
    default:
      return state;
  }
}
