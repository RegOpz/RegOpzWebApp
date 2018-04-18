import { BASE_URL } from '../Constant/constant';
import {
  FETCH_COUNTRY,
  FETCH_COMPONENT,
  TEST_CONNECTION
} from '../actions/SharedDataAction';

// TODO:
export default function(state=[], action) {
  switch(action.type) {
    case FETCH_COUNTRY:
      return Object.assign({}, state, {
        countries: action.payload.data
      });
    case FETCH_COMPONENT:
      return Object.assign({}, state, {
        components: action.payload.data
      });
    case TEST_CONNECTION:
      return Object.assign({}, state, {
        testConnection: action.payload.data
      });
    default:
      return state;
  }
}
