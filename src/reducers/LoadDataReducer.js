import { BASE_URL } from '../Constant/constant';
import {
    LOAD_DATA,
    LOAD_DATA_FILE
} from '../actions/LoadDataAction';


export default function (state = {}, action) {
    console.log("Action received loadDtaReducer : ", action);
    if (action.error) {
        return {
          error: action.payload.response,
          message: action.payload.message
        };
    }

    switch (action.type) {
        case LOAD_DATA:
            return {
                loadDataFileMsg: action.payload.data
            };

        case LOAD_DATA_FILE:
            return {
                loadDataFileMsg: action.payload.data
            };

        default:
            return state;
    }
}
