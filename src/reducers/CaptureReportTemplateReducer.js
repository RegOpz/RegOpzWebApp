import { BASE_URL } from '../Constant/constant';
import {
    LOAD_REPORT_TEMPLATE
} from '../actions/CaptureReportTemplateAction';


export default function (state = {}, action) {

    if (action.error) {
        return {
          error: action.payload.response,
          message: action.payload.message
        };
    }

    switch (action.type) {
        case LOAD_REPORT_TEMPLATE:
            return {
                loadReportTemplateMsg: action.payload.data
            };

        default:
            return state;
    }
}
