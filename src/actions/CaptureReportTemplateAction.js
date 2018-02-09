import axios from 'axios';
import { BASE_URL } from '../Constant/constant';

export const LOAD_REPORT_TEMPLATE = 'LOAD_REPORT_TEMPLATE';

export function actionLoadTemplateFile(formElement) {
    //let form = new FormData(formElement);
    //form.append('file', formElement.file);

    let url = BASE_URL + 'document';
    const request = axios.post(url, formElement);

    return {
        type: LOAD_REPORT_TEMPLATE,
        payload: request
    };
}
