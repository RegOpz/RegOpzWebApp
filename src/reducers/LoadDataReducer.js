import { BASE_URL } from '../Constant/constant';
import {
    LOAD_DATA,
    LOAD_DATA_FILE
} from '../actions/LoadDataAction';


export default function (state = {}, action) {
    console.log("Action received: ", action);

    switch (action.type) {
        case LOAD_DATA:
            return {
                loadDataMsg: action.payload.data
            };

        case LOAD_DATA_FILE:
            return {
                loadDataFileMsg: action.payload.data
            };

        default:
            return state;
    }
}
