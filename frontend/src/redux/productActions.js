import axios from 'axios';

export const fetchProducts = () => async (dispatch) => {
    try {
        const res = await axios.get('http://localhost:3001/api/products');
        dispatch({ type: 'FETCH_PRODUCTS_SUCCESS', payload: res.data });
    } catch (error) {
        dispatch({ type: 'FETCH_PRODUCTS_FAIL', payload: error.message });
    }
};

export const addProduct = (product) => async (dispatch) => {
    try {
        const res = await axios.post('http://localhost:3001/api/products/add', product);
        dispatch({ type: 'ADD_PRODUCT_SUCCESS', payload: res.data });
    } catch (error) {
        dispatch({ type: 'ADD_PRODUCT_FAIL', payload: error.message });
    }
};

export const removeProduct = (id) => async (dispatch) => {
    try {
        await axios.delete(`http://localhost:3001/api/products/${id}`);
        dispatch({ type: 'REMOVE_PRODUCT_SUCCESS', payload: id });
    } catch (error) {
        dispatch({ type: 'REMOVE_PRODUCT_FAIL', payload: error.message });
    }
};

export const updateProductStatus = (id, status) => async (dispatch) => {
    try {
        const res = await axios.put(`http://localhost:3001/api/products/status/${id}`, { status });
        dispatch({ type: 'UPDATE_PRODUCT_STATUS_SUCCESS', payload: res.data });
    } catch (error) {
        dispatch({ type: 'UPDATE_PRODUCT_STATUS_FAIL', payload: error.message });
    }
};
