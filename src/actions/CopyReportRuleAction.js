import axios from 'axios';
import { BASE_URL } from '../Constant/constant';
import promiseMiddleware from 'redux-promise';

export const COPY_REPORT_TEMPLATE = 'COPY_REPORT_TEMPLATE';
export const CHECK_REPORT_ID = 'CHECK_REPORT_ID';

export function actionCopyReportTemplate(formElement) {
    console.log("inside action copyReportTemplate....",formElement);
    let url = BASE_URL+ "report-rules-repo/copy-report-template" ;
    const request = axios.post(url, formElement);
    return {
        type: COPY_REPORT_TEMPLATE,
        payload: request
    };
}

export function actionFetchReportId(reportId,country) {
    console.log("inside action Fetch Report Id Check....",reportId);
    let url = BASE_URL+ "fetch-ReportId";
    url += "?report_id="+reportId+"&country="+country;
    const request = axios.get(url);
    return {
        type: CHECK_REPORT_ID,
        payload: request
    };
}
