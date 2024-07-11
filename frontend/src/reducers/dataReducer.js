const initialState = {
    data: [],
    loading: false,
    error: null,
};

const dataCountsInitialState = {
    assignedCount: 0,
    unassignedCount: 0,
    loading: false,
    error: null,
};

const assignedDataInitialState = {
    assignedData: [],
    error: null,
};

const orderDataInitialState = {
    data: [],
    loading: false,
    error: null,
};

const canceledDataInitialState = {
    data: [],
    loading: false,
    error: null,
};

const callbackDataInitialState = {
    data: [],
    loading: false,
    error: null,
};

const dataReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_DATA_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_DATA_SUCCESS':
            return { ...state, loading: false, data: action.payload };
        case 'FETCH_DATA_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'DISTRIBUTE_DATA_SUCCESS':
            return { ...state, data: action.payload };
        case 'DISTRIBUTE_DATA_FAIL':
            return { ...state, error: action.payload };
        default:
            return state;
    }
};

const dataCountsReducer = (state = dataCountsInitialState, action) => {
    switch (action.type) {
        case 'FETCH_DATA_COUNTS_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_DATA_COUNTS_SUCCESS':
            return {
                ...state,
                loading: false,
                assignedCount: action.payload.assignedCount,
                unassignedCount: action.payload.unassignedCount,
            };
        case 'FETCH_DATA_COUNTS_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

const assignedDataReducer = (state = assignedDataInitialState, action) => {
    switch (action.type) {
        case 'FETCH_ASSIGNED_DATA_SUCCESS':
            return {
                ...state,
                assignedData: action.payload,
            };
        case 'FETCH_ASSIGNED_DATA_FAILURE':
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
};

const orderDataReducer = (state = orderDataInitialState, action) => {
    switch (action.type) {
        case 'FETCH_ORDER_DATA_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_ORDER_DATA_SUCCESS':
            return { ...state, loading: false, data: action.payload };
        case 'FETCH_ORDER_DATA_FAILURE':
            return { ...state, loading: false, error: action.payload };
        case 'FETCH_VERIFIED_ORDERS_SUCCESS':
            return { ...state, data: action.payload };
        case 'FETCH_VERIFIED_ORDERS_FAILURE':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

const canceledDataReducer = (state = canceledDataInitialState, action) => {
    switch (action.type) {
        case 'FETCH_CANCELED_DATA_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_CANCELED_DATA_SUCCESS':
            return { ...state, loading: false, data: action.payload };
        case 'FETCH_CANCELED_DATA_FAILURE':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

const callbackDataReducer = (state = callbackDataInitialState, action) => {
    switch (action.type) {
        case 'FETCH_CALLBACK_DATA_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_CALLBACK_DATA_SUCCESS':
            return { ...state, loading: false, data: action.payload };
        case 'FETCH_CALLBACK_DATA_FAILURE':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export {
    dataReducer,
    dataCountsReducer,
    assignedDataReducer,
    orderDataReducer,
    canceledDataReducer,
    callbackDataReducer,
};
