import {
    DISPLAY_ERROR_MESSAGE,
    CLEAR_ERROR_MESSAGE
} from './../actions/MiddleWareAction';

export default function (state = 'Error', action) {
    switch (action.type) {
        case DISPLAY_ERROR_MESSAGE:
            return action.payload;
            break;

        case CLEAR_ERROR_MESSAGE:
            return '';
            break;

        default:
            return state;
    }
}