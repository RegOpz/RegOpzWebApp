import {FETCH_OPERATION_LOG
} from '../actions/OperationLogAction';

export default function(state={},action){

  switch(action.type){
    case FETCH_OPERATION_LOG:
      console.log("Inside FETCH_OPERATION_LOG....", action.payload.data)
      return Object.assign({},{...state},{operation_log:action.payload.data});
    default:
      return state;
  }
}
