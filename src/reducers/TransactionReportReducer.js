import { BASE_URL } from '../Constant/constant';
import {
    FETCH_TRANS_REPORT_TEMPLATE,
    DEFINE_TRANS_REPORT_SEC,
    FETCH_TRANS_REPORT_SEC,
    FETCH_TRANS_REPORT_CALC_RULES,
    UPDATE_TRANS_REPORT_CALC_RULE,
    CREATE_TRANS_REPORT,
    FETCH_TRANS_REPORT,
    INSERT_TRANS_REPORT_CALC_RULE,
    POST_TRANS_ORDER_TEMPLATE
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
        case FETCH_TRANS_REPORT:
            return Object.assign({}, state, {
              reportGridData: action.payload.data
            });
        case FETCH_TRANS_REPORT_SEC:
            return Object.assign({}, state, {
              sectionDetails: action.payload.data
            });
        case FETCH_TRANS_REPORT_CALC_RULES:
            return Object.assign({}, state, {
              secRules: action.payload.data
            });
        case DEFINE_TRANS_REPORT_SEC:
            return state;
        case UPDATE_TRANS_REPORT_CALC_RULE:
            return state;
        case INSERT_TRANS_REPORT_CALC_RULE:
            return state;
        case CREATE_TRANS_REPORT:
            return state;
        case POST_TRANS_ORDER_TEMPLATE:
            return{state,postTransOrder: action.payload.data};
        default:
            return state;
    }
}
