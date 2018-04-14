import { BASE_URL } from '../Constant/constant';
import {
  FETCH_COUNTRY,
} from '../actions/SharedDataAction';

// TODO:
export default function(state=[], action) {
  switch(action.type) {
    case FETCH_COUNTRY:
      return Object.assign({}, state, {
        countries: action.payload.data
      });
    default:
      return state;
  }
}
