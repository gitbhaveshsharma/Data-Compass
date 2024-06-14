// src/Reducer/employeeReducer.js
const initialState = {
    employees: [],
    loading: false,
    error: null,
};

const employeeReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_EMPLOYEES_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_EMPLOYEES_SUCCESS':
            return { ...state, loading: false, employees: action.payload };
        case 'FETCH_EMPLOYEES_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default employeeReducer;
