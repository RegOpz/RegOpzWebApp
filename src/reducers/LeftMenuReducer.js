import {
  LEFTMENUCLICK
} from '../actions/LeftMenuAction';

// TODO:
export default function(state=[], action) {
  console.log("Action received in left menu reducer: ", action);
  switch(action.type) {
    case LEFTMENUCLICK:
      console.log("Inside LEFTMENUCLICK", action.payload)
      return Object.assign({}, state, {
        leftmenuclick: action.payload
      });
    default:
    	return state;
  }
}
