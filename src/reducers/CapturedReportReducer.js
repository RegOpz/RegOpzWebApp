import {
  FETCH_CAPTURED_REPORT,
  //DRILL_DOWN
} from '../actions/CaptureReportAction';
import {
  DELETE_MAINTAIN_RULE_DATA
} from '../actions/MaintainReportRuleAction';

// TODO:
export default function(state=[], action){
  console.log("Action received in captured report reducer: ",action,state);
  switch(action.type){
    case FETCH_CAPTURED_REPORT:
      state = [];
      return state.concat(action.payload.data);
    // case DRILL_DOWN:
    //   return Object.assign({}, state, {
    //     drill_down_result: action.payload.data
    //   });
    case DELETE_MAINTAIN_RULE_DATA:
      console.log('In capturereport reducer for delete cell calc rules',
      state.drill_down_result.cell_rules.length, state.drill_down_result.cell_rules,
      action.meta);
      //state.drill_down_result.cell_rules.splice(action.meta.at,1);
      //console.log('In capturereport reducer after splice cell calc rules',state.drill_down_result.cell_rules.length)
      //return state.splice(0,1,state)
      return state;
    default:
      return state;
  }
}
