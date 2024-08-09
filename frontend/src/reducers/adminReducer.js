// src/redux/uploadReducer.js
const initialState = {
    loading: false,
    success: false,
    error: null,
    message: '',
    duplicateCount: 0,
};

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPLOAD_REQUEST':
            return { ...state, loading: true };
        case 'UPLOAD_SUCCESS':
            return {
                ...state,
                loading: false,
                success: true,
                message: action.payload.message,
                duplicateCount: action.payload.duplicateCount,
            };
        case 'UPLOAD_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default adminReducer;
