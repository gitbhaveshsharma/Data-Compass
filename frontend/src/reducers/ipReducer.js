const initialState = {
    ips: [],
    loading: false,
    error: null,
};

export const ipReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'REGISTER_IP_SUCCESS':
            return {
                ...state,
                ips: [...state.ips, action.payload],
                loading: false,
            };
        case 'REGISTER_IP_FAILURE':
            return { ...state, error: action.error, loading: false };

        case 'UPDATE_IP_SUCCESS':
            return {
                ...state,
                ips: state.ips.map(ip => ip.ip === action.payload.ip ? action.payload : ip),
                loading: false,
            };
        case 'UPDATE_IP_FAILURE':
            return { ...state, error: action.error, loading: false };

        case 'DELETE_IP_SUCCESS':
            return {
                ...state,
                ips: state.ips.filter(ip => ip.ip !== action.payload),
                loading: false,
            };
        case 'DELETE_IP_FAILURE':
            return { ...state, error: action.error, loading: false };

        case 'FETCH_IPS_SUCCESS':
            return { ...state, ips: action.payload, loading: false };
        case 'FETCH_IPS_FAILURE':
            return { ...state, error: action.error, loading: false };
        case 'TOGGLE_IP_STATUS_SUCCESS':
            console.log("Reducer Payload:", action.payload); // Log payload data
            return {
                ...state,
                ips: state.ips.map((ip) =>
                    ip.ip === action.payload.ip ? { ...ip, status: action.payload.status } : ip
                ),
                loading: false,
            };
        case 'TOGGLE_IP_STATUS_FAILURE':
            return { ...state, error: action.error, loading: false };

        default:
            return state;
    }
};
