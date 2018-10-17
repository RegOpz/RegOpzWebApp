import {
  GET_ALL_SEC_QUESTION,
  GET_USER_SEC_QUESTION,
  VALIDATE_USER_SEC_QUESTION,
} from '../actions/PasswordRecoveryAction';


// TODO: Create Redux state for user containing token
export default function(state = {}, action) {
  console.log("Action received at PasswordRecovery: ", action);
  switch (action.type) {
    case GET_ALL_SEC_QUESTION: case GET_USER_SEC_QUESTION:
      return Object.assign({}, state, {secretQuestions: action.payload.data});
    case VALIDATE_USER_SEC_QUESTION:
      return Object.assign({}, state, {validation: action.payload.data});
    default:
      return state;
  }
}
