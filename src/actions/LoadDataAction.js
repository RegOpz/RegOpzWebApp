import axios from 'axios';
import { BASE_URL } from '../Constant/constant';
import promiseMiddleware from 'redux-promise';

export const LOAD_DATA_FILE = 'LOAD_DATA_FILE';
export const LOAD_DATA = 'LOAD_DATA';


export function actionLoadDataFile(file) {
    let form = new FormData();
    form.append('data_file', file);

    let url = BASE_URL + 'view-data-management/load-data';
    const request = axios.post(url, form);

    return {
        type: LOAD_DATA_FILE,
        payload: request
    };
}

export function actionLoadData(loadInfo) {
    let url = BASE_URL + "data-feed-management/load-data";

    console.log("in action actionLoadData ", loadInfo);
    const request = axios.post(url, loadInfo);

    return {
        type: LOAD_DATA,
        payload: request
    }
}
