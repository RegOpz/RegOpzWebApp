import { BASE_URL } from '../Constant/constant';
import {
    COPY_REPORT_TEMPLATE
} from '../actions/CopyReportRuleAction';


export default function (state = {}, action) {

    if (action.error) {
        return {
          error: action.payload.response,
          message: action.payload.message
        };
    }

    switch (action.type) {
        case COPY_REPORT_TEMPLATE:
            return {
                copyReportTemplate: action.payload.data
            };

        default:
            return state;
    }
}
