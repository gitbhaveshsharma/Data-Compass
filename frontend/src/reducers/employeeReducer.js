const initialState = {
    employees: [],
    employee: null, 
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
        case 'FETCH_EMPLOYEE_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_EMPLOYEE_SUCCESS':
            return { ...state, loading: false, employee: action.payload };
        case 'FETCH_EMPLOYEE_FAILURE':
            return { ...state, loading: false, error: action.payload };
        case 'UPDATE_EMPLOYEE_SUCCESS':
            const updatedEmployees = state.employees.map((employee) =>
                employee._id === action.payload._id ? action.payload : employee
            );
            return { ...state, employees: updatedEmployees };
        case 'UPDATE_EMPLOYEE_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default employeeReducer;
