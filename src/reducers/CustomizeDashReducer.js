import {
    ADD_SERVICE,
    UPDATE_SERVICE,
    REMOVE_SERVICE,
    FETCH_ALL_SERVICES,
    FETCH_SERVICE,
    FETCH_USER_SERVICES
} from './../actions/CustomizeDashAction';

const allApis = ['API_1', 'API_2', 'API_3', 'API_4'];
const apiDetails = {
    'API_1': {
        title: 'API 1 Fake Title',
        value: 'Some Value',
        rate: 'inc',
        data: [
            { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
            { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
            { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
            { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
            { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
            { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
            { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
        ]
    },
    'API_2': {
        title: 'API 2 Fake Title',
        value: 'Some Value',
        rate: 'dec',
        data: [
            { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
            { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
            { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
            { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
            { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
            { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
            { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
        ]
    },
    'API_3': {
        title: 'API 3 Fake Title',
        value: 'Some Value',
        rate: 'dec',
        data: [
            { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
            { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
            { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
            { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
            { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
            { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
            { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
        ]
    },
    'API_4': {
        title: 'API_4 Fake Title',
        value: 'Some Value',
        rate: 'inc',
        data: [
            { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
            { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
            { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
            { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
            { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
            { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
            { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
        ]
    }
}

var currentIndex = 1;

export function userDetailsReducer(state = [], action) {
    switch (action.type) {
        case FETCH_USER_SERVICES:
            console.log('User Services: ', state);
            return state;

        case ADD_SERVICE:
            currentIndex;
            let newApiChart = {
                id: currentIndex,
                API: action.payload.api,
                chartType: action.payload.chartType,
                tileType: action.payload.tileType,
                apiData: apiDetails[action.payload.api]
            };
            state.push(newApiChart);
            currentIndex++;
            console.log('Current Index: ', currentIndex);
            console.log('Current State: ', state);
            return state;

        case UPDATE_SERVICE:
            let updatedServiceMap = action.payload.serviceMap;
            state = updatedServiceMap;
            return state;

        case REMOVE_SERVICE:
            return state.filter(element => {
                return element.id !== action.payload;
            });

        default:
            return state;
    }
}

export function apiDetailsReducer(state = [], action) {
    switch (action.type) {
        case FETCH_ALL_SERVICES:
            return allApis;

        default:
            return state;
    }
}
