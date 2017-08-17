import {FETCH_DATA_AUDIT_LIST,
        FETCH_DATA_RECORD_DETAIL
      } from '../actions/DataChangeAction';

export default function(state={},action){

  switch(action.type){

    case FETCH_DATA_AUDIT_LIST:
      return Object.assign({},{...state},{audit_list:action.payload.data});
    case FETCH_DATA_RECORD_DETAIL:
      return Object.assign({},{...state},{record_detail:action.payload.data});
    default:
      return state;
  }
}
