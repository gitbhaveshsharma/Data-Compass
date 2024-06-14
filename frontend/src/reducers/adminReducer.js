// src/redux/uploadReducer.js
const initialState = {
    loading: false,
    success: false,
    error: null,
};

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPLOAD_REQUEST':
            return { ...state, loading: true };
        case 'UPLOAD_SUCCESS':
            return { ...state, loading: false, success: true };
        case 'UPLOAD_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default adminReducer;
