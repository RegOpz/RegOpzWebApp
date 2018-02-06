import {
    actionDisplayMessage
} from './../actions/MiddleWareAction';

const promiseReject = store => next => action => {
    console.log("inside promiseReject",action.payload)
    if (action.error) {
        console.error('Error Occurred');
        console.error(action.payload);
        let date = new Date();
        let formattedTime = date.toLocaleTimeString('en-US')
        store.dispatch(actionDisplayMessage(
            `${action.payload.message}. ${action.payload.response.data.msg}`,
            formattedTime,
            'error'
        ));
    }
    else if (action.payload && action.payload.status==200 && action.payload.data.msg) {
        console.log('Info message');
        console.log(action.payload);
        let date = new Date();
        let formattedTime = date.toLocaleTimeString('en-US')
        store.dispatch(actionDisplayMessage(
            `${action.payload.status}. ${action.payload.data.msg}`,
            formattedTime,
            'info'
        ));
    }

    return next(action);
}

export default promiseReject;
