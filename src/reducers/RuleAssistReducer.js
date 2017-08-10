import { VALIDATE_EXP } from './../actions/RuleAssistAction';

export default function (state = [], action) {
    console.log('Action received: ', action);
    switch (action.type) {
        case VALIDATE_EXP:
            if (action.payload.data === undefined)
                return [];
            else
                return action.payload.data;
        default:
            return state;
    }
}