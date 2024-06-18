// src/redux/operationReducer.js
const initialState = {
    data: null,
    loading: false,
    orderData: [],
    canceledData: [],
    callbackData: [],
    error: null,
};

const operationReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_DATA_BY_ID_SUCCESS':
            return { ...state, data: action.payload, loading: false };
        case 'FETCH_DATA_BY_ID_FAILURE':
            return { ...state, error: action.error, loading: false };
        case 'UPDATE_DATA_SUCCESS':
            return { ...state, data: action.payload, loading: false };
        case 'UPDATE_DATA_FAILURE':
            return { ...state, error: action.error, loading: false };
        case 'ORDER_DATA_SUCCESS':
            return { ...state, data: action.payload, loading: false };
        case 'ORDER_DATA_FAILURE':
            return { ...state, error: action.error, loading: false };
        case 'CANCEL_DATA_SUCCESS':
            return { ...state, data: action.payload, loading: false };
        case 'CANCEL_DATA_FAILURE':
            return { ...state, error: action.error, loading: false };
        case 'CALLBACK_DATA_SUCCESS':
            return { ...state, data: action.payload, loading: false };
        case 'CALLBACK_DATA_FAILURE':
            return { ...state, error: action.error, loading: false };
        default:
            return state;
    }
};

export default operationReducer;
