import { BASE_URL } from '../Constant/constant';
import {
    FETCH_TRANS_REPORT_TEMPLATE,
    DEFINE_TRANS_REPORT_SEC,
    FETCH_TRANS_REPORT_SEC
} from '../actions/TransactionReportAction';


export default function (state = {}, action) {

    if (action.error) {
        return {
          error: action.payload.response,
          message: action.payload.message
        };
    }

    switch (action.type) {
        case FETCH_TRANS_REPORT_TEMPLATE:
            return Object.assign({}, state, {
              reportGridData: action.payload.data
            });
        case FETCH_TRANS_REPORT_SEC:
            return Object.assign({}, state, {
              sectionDetails: action.payload.data
            });
        case DEFINE_TRANS_REPORT_SEC:
            return state;
        default:
            return state;
    }
}
