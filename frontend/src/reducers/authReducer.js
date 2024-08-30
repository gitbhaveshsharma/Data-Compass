// Initial state
const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    user: null,
    loading: false,
    error: null,
};

// Auth Reducer
const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                token: localStorage.getItem('token'),
                isAuthenticated: true,
                loading: false,
                error: null,
            };
        case 'USER_LOADED':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
                loading: false,
                error: null,
            };
        case 'CLEAR_ERRORS':
            return {
                ...state,
                error: null,
            };
        case 'LOGIN_FAILURE':
        case 'LOGOUT':
        case 'AUTH_ERROR':
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                user: null,
                loading: false,
                error: action.payload,
            };
        case 'REGISTER_SUCCESS':
            return {
                ...state,
                loading: false,
                error: null, 
            };
        case 'REGISTER_FAILURE': 
            return {
                ...state,
                loading: false,
                error: action.payload, 
            };
        default:
            return state;
    }
};

export default authReducer;