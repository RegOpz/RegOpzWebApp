export const DISPLAY_ERROR_MESSAGE = 'DISPLAY_ERROR_MESSAGE';
export const CLEAR_ERROR_MESSAGE = 'CLEAR_ERROR_MESSAGE';

export function actionDisplayErrorMessage(message) {
    return {
        type: DISPLAY_ERROR_MESSAGE,
        payload: message
    };
}

export function actionClearErrorMessage() {
    return {
        type: CLEAR_ERROR_MESSAGE
    }
}