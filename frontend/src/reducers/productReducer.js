const initialState = {
    products: [],
    loading: false,
    error: null,
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_PRODUCTS_SUCCESS':
            return { ...state, products: action.payload, loading: false };
        case 'FETCH_PRODUCTS_FAIL':
        case 'ADD_PRODUCT_FAIL':
        case 'REMOVE_PRODUCT_FAIL':
        case 'UPDATE_PRODUCT_STATUS_FAIL':
            return { ...state, error: action.payload, loading: false };
        case 'ADD_PRODUCT_SUCCESS':
            return { ...state, products: [...state.products, action.payload], loading: false };
        case 'REMOVE_PRODUCT_SUCCESS':
            return { ...state, products: state.products.filter(product => product._id !== action.payload), loading: false };
        case 'UPDATE_PRODUCT_STATUS_SUCCESS':
            return {
                ...state,
                products: state.products.map(product =>
                    product._id === action.payload._id ? action.payload : product
                ),
                loading: false,
            };
        default:
            return state;
    }
};

export default productReducer;
