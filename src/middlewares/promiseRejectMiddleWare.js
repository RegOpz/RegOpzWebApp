import {
    actionDisplayErrorMessage
} from './../actions/MiddleWareAction';

const promiseReject = store => next => action => {
    if (action.error) {
        console.error('Error Occurred');
        console.error(action.payload);
        store.dispatch(actionDisplayErrorMessage(`${action.payload.message}. Please check back in a bit`));
    }

    return next(action);
}

export default promiseReject;