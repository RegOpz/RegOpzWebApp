import axios from 'axios';
import { BASE_URL } from '../Constant/constant';

export const LOAD_REPORT_TEMPLATE = 'LOAD_REPORT_TEMPLATE';
export const CHECK_REPORT_TEMPLATE = 'CHECK_REPORT_TEMPLATE';

export function actionLoadTemplateFile(formElement,reportType) {
    //let form = new FormData(formElement);
    //form.append('file', formElement.file);
    console.log("inside action loadTemplate....",reportType);

    let url = BASE_URL ;
    switch (reportType) {
      case 'FIXEDFORMAT':
        url += 'document';
        break;
      case 'TRANSACTION':
        url += 'transactionalReport/captureTemplate';
        break;
      case 'DYNAGG':
        url += 'TBC-dynAgg';
        break;
      case 'COMPOSIT':
        url += 'free-format-report/capture-template-xls';
        break;
      default:
        break;
    }
    const request = axios.post(url, formElement);

    return {
        type: LOAD_REPORT_TEMPLATE,
        payload: request
    };
}

export function actionCheckReportId(report_id,country,domain_type){

  let url = BASE_URL + "document/"+ encodeURI(report_id) + "?domain_type="+domain_type ;
  const request = axios.get(url);
  return {
      type: CHECK_REPORT_TEMPLATE,
      payload: request
  };

}
