import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderData } from '../redux/dataActions';
import DataTable from './data/DataTable'; 

const orderColumns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'number', label: 'Number', minWidth: 100 },
    { id: 'address', label: 'Address', minWidth: 170 },
    { id: 'orderItems', label: 'Order Items', minWidth: 170 },
];

const getTitleByStatus = (data) => {
    if (!data || data.length === 0) return 'Under Verification';
    const status = data[0].status;
    switch (status) {
        case 'under verification':
            return 'Under Verification';
        case 'verified':
            return 'Verified Order';
        case 'callback':
            return 'Call back Order';
        case 'canceled':
            return 'Canceled Order';
        case 'pending':
            return 'Pending Order';
        default:
            return 'Order Data';
    }
};

const OrderData = ({ employeeId, role, data, department }) => {
    const dispatch = useDispatch();
    const orderData = useSelector((state) => state.data.orderData.data);

    useEffect(() => {
        dispatch(fetchOrderData(employeeId, role));
    }, [dispatch, employeeId, role, department]);

    const displayData = data || orderData;
    const title = getTitleByStatus(displayData);

    return <DataTable columns={orderColumns} data={displayData} title={title} />;
};

export default OrderData;
