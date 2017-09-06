import axios from 'axios';
import { BASE_URL } from './../Constant/constant';
import promiseMiddleware from 'redux-promise';

export const ADD_SERVICE = 'ADD_SERVICE';
export const UPDATE_SERVICE = 'UPDATE_SERVICE';
export const REMOVE_SERVICE = 'REMOVE_SERVICE';
export const FETCH_ALL_SERVICES = 'FETCH_ALL_SERVICES';
export const FETCH_USER_SERVICES = 'FETCH_USER_SERVICES';

export function actionFetchALLServices() {
    // Needs to be a get to get and load the API list
    return {
        type: FETCH_ALL_SERVICES,
        payload: null
    };
}

export function actionFetchUserServices() {
    // This needs to be an api call to get all the services
    return {
        type: FETCH_USER_SERVICES,
        payload: null
    };
}

export function actionAddService(API, chartType, tileType) {
    // Here API is the name or whatever the `thing` to uniquely identify and add the API to the user
    return {
        type: ADD_SERVICE,
        payload: {
            api: API,
            chartType: chartType,
            tileType: tileType
        }
    };
}

export function actionUpdateService(allUserServices) {
    // Needs to be post to update all the API details
    return {
        type: UPDATE_SERVICE,
        payload: {
            serviceMap: allUserServices
        }
    };
}

export function actionRemoveService(index) {
    // Again need to be post
    return {
        type: REMOVE_SERVICE,
        payload: index
    };
}