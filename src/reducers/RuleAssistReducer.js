import { VALIDATE_EXP } from './../actions/RuleAssistAction';

export default function (state = [], action) {
    console.log('Action received: ', action);
    switch (action.type) {
        case VALIDATE_EXP:
            if (action.payload.data === undefined)
                return 'Something happened at our end. Check back in a few moments';
            else
                return action.payload.data;
        default:
            return state;
    }
}