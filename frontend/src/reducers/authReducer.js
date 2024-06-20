// src/redux/authReducer.js
const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    user: null,
    loading: false,
    error: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                token: action.payload.token,
                isAuthenticated: true,
                user: action.payload.user,
                loading: false,
                error: null,
            };
        case 'LOGIN_FAILURE':
        case 'LOGOUT':
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
            };
        default:
            return state;
    }
};

export default authReducer;
