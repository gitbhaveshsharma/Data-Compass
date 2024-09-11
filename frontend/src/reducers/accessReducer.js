const initialState = {
    ipAddresses: [], // List of IP addresses
    loading: false,
    error: null,
};

const accessControlReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_IP_SUCCESS':
            return { 
                ...state, 
                ipAddresses: action.payload, 
                loading: false 
            };
        case 'FETCH_IP_FAILED':
            return { 
                ...state, 
                error: action.error, 
                loading: false 
            };
        case 'IP_REGISTER_SUCCESS':
            return {
                ...state,
                ipAddresses: [...state.ipAddresses, action.payload], // Add new IP to the list
                loading: false,
                error: null,
            };
        case 'IP_REGISTER_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case 'IP_DELETE_SUCCESS':
            return {
                ...state,
                ipAddresses: state.ipAddresses.filter(ip => ip._id !== action.payload),
                loading: false,
                error: null,
            };
        case 'IP_DELETE_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case 'IP_UPDATE_SUCCESS':
            return {
                ...state,
                ipAddresses: state.ipAddresses.map(ip => ip._id === action.payload._id ? action.payload : ip),
                loading: false,
                error: null,
            };
        case 'IP_UPDATE_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default accessControlReducer;
