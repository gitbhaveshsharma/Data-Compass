// src/redux/dataReducer.js
const initialState = {
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

export default dataReducer;
