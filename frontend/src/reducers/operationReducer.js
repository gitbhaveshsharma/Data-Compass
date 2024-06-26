// src/redux/operationReducer.js
const initialState = {
    data: null,
    loading: false,
    orderData: [],
    canceledData: [],
    callbackData: [],
    ordersData: null,
    cancelesdData: null,
    callbacskData: null,
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
        case 'FETCH_ORDERED_DATA_SUCCESS':
            return { ...state, ordersData: action.payload, loading: false };
        case 'FETCH_ORDERED_DATA_FAILURE':
            return { ...state, ordersData: null, loading: false, error: action.error };
        case 'FETCH_CANCELED_DATA_SUCCESS':
            return { ...state, canceledsData: action.payload, loading: false };
        case 'FETCH_CANCELED_DATA_FAILURE':
            return { ...state, canceledsData: null, loading: false, error: action.error };
        case 'FETCH_CALLBACK_DATA_SUCCESS':
            return { ...state, callbacksData: action.payload, loading: false };
        case 'FETCH_CALLBACK_DATA_FAILURE':
            return { ...state, callbacksData: null, loading: false, error: action.error };

        default:
            return state;
    }
};

export default operationReducer;
