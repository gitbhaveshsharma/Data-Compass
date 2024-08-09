import {
    FETCH_CALL_ATTEMPTS_REQUEST,
    FETCH_CALL_ATTEMPTS_SUCCESS,
    FETCH_CALL_ATTEMPTS_FAILURE,
    CREATE_CALL_ATTEMPT_SUCCESS,
    UPDATE_CALL_ATTEMPT_SUCCESS,
    DELETE_CALL_ATTEMPT_SUCCESS
} from '../redux/callAttemptActions';

const initialState = {
    callAttempts: [],
    loading: false,
    error: null
};

const callAttemptReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CALL_ATTEMPTS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case FETCH_CALL_ATTEMPTS_SUCCESS:
            return {
                ...state,
                loading: false,
                callAttempts: action.payload
            };
        case FETCH_CALL_ATTEMPTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case CREATE_CALL_ATTEMPT_SUCCESS:
            return {
                ...state,
                callAttempts: [...state.callAttempts, action.payload]
            };
        case UPDATE_CALL_ATTEMPT_SUCCESS:
            return {
                ...state,
                callAttempts: state.callAttempts.map(callAttempt =>
                    callAttempt._id === action.payload._id ? action.payload : callAttempt
                )
            };
        case DELETE_CALL_ATTEMPT_SUCCESS:
            return {
                ...state,
                callAttempts: state.callAttempts.filter(callAttempt => callAttempt._id !== action.payload)
            };
        default:
            return state;
    }
};

export default callAttemptReducer;
