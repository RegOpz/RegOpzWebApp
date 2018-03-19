import axios from 'axios';
import { BASE_URL } from '../Constant/constant';

export const LOAD_REPORT_TEMPLATE = 'LOAD_REPORT_TEMPLATE';

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
        url += 'TBC-composit';
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
