import { START_LOADING, STOP_LOADING } from './loading-types';

const initialState = {
    loading: false,
};

const loadReducer = (state = initialState, action) => {
    switch (action.type) {
        case START_LOADING:
            return {
                ...state,
                loading: true,
            };
        case STOP_LOADING:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};

export default loadReducer;