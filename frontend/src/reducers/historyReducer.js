// reducers/historyReducer.js
const initialState = {
    history: [],
    loading: false,
    error: null,
};

const historyReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'RECORD_HISTORY_SUCCESS':
            return { ...state, history: [...state.history, action.payload], loading: false };
        case 'RECORD_HISTORY_FAILURE':
            return { ...state, error: action.payload, loading: false };
        case 'FETCH_HISTORY_REQUEST':
            return { ...state, loading: true, error: null };
        case 'FETCH_HISTORY_SUCCESS':
            return { ...state, history: action.payload, loading: false };
        case 'FETCH_HISTORY_FAILURE':
            return { ...state, error: action.payload, loading: false };
        default:
            return state;
    }
};

export default historyReducer;
