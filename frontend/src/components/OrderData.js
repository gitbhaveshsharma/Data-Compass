import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderData } from '../redux/dataActions';
import DataTable from './data/DataTable'; // Import the reusable DataTable component

const orderColumns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'number', label: 'Number', minWidth: 100 },
    { id: 'address', label: 'Address', minWidth: 170 },
    { id: 'orderItems', label: 'Order Items', minWidth: 170 },
];

const OrderData = ({ employeeId, role }) => {
    const dispatch = useDispatch();
    const orderData = useSelector((state) => state.data.orderData.data);

    useEffect(() => {
        dispatch(fetchOrderData(employeeId, role));
    }, [dispatch, employeeId, role]);

    return <DataTable columns={orderColumns} data={orderData} title="Order Data" />;
};

export default OrderData;
