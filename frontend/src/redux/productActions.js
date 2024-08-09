import axios from 'axios';

// Environment variable for the API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL;

// Function to get authentication headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// Fetch products action
export const fetchProducts = () => async (dispatch) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/products`, getAuthHeaders());
        dispatch({ type: 'FETCH_PRODUCTS_SUCCESS', payload: res.data });
    } catch (error) {
        dispatch({ type: 'FETCH_PRODUCTS_FAIL', payload: error.message });
    }
};

// Add product action
export const addProduct = (product) => async (dispatch) => {
    try {
        const res = await axios.post(`${API_BASE_URL}/products/add`, product, getAuthHeaders());
        dispatch({ type: 'ADD_PRODUCT_SUCCESS', payload: res.data });
    } catch (error) {
        dispatch({ type: 'ADD_PRODUCT_FAIL', payload: error.message });
    }
};

// Remove product action
export const removeProduct = (id) => async (dispatch) => {
    try {
        await axios.delete(`${API_BASE_URL}/products/${id}`, getAuthHeaders());
        dispatch({ type: 'REMOVE_PRODUCT_SUCCESS', payload: id });
    } catch (error) {
        dispatch({ type: 'REMOVE_PRODUCT_FAIL', payload: error.message });
    }
};

// Update product status action
export const updateProductStatus = (id, status) => async (dispatch) => {
    try {
        const res = await axios.put(`${API_BASE_URL}/products/status/${id}`, { status }, getAuthHeaders());
        dispatch({ type: 'UPDATE_PRODUCT_STATUS_SUCCESS', payload: res.data });
    } catch (error) {
        dispatch({ type: 'UPDATE_PRODUCT_STATUS_FAIL', payload: error.message });
    }
};
