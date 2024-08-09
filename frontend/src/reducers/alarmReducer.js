const initialState = {
    alarms: [],
    loading: false,
    error: null,
};

const alarmReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CREATE_ALARM_SUCCESS':
            return { ...state, alarms: [...state.alarms, action.payload], loading: false };
        case 'CREATE_ALARM_FAILURE':
            return { ...state, error: action.error, loading: false };
        case 'FETCH_ALARMS_SUCCESS':
            return { ...state, alarms: action.payload, loading: false };
        case 'FETCH_ALARMS_FAILURE':
            return { ...state, error: action.error, loading: false };
        case 'UPDATE_ALARM_SUCCESS':
            return {
                ...state,
                alarms: state.alarms.map((alarm) => (alarm._id === action.payload._id ? action.payload : alarm)),
                loading: false,
            };
        case 'UPDATE_ALARM_FAILURE':
            return { ...state, error: action.error, loading: false };
        case 'DELETE_ALARM_SUCCESS':
            return { ...state, alarms: state.alarms.filter((alarm) => alarm._id !== action.payload), loading: false };
        case 'DELETE_ALARM_FAILURE':
            return { ...state, error: action.error, loading: false };
        case 'FETCH_ALARMS_BY_EMPLOYEE_ID_SUCCESS':
            return { ...state, alarms: action.payload, loading: false };
        case 'FETCH_ALARMS_BY_EMPLOYEE_ID_FAILURE':
            return { ...state, error: action.error, loading: false };
        default:
            return state;
    }
};

export default alarmReducer;