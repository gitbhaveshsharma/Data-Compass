import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderData } from './../redux/dataActions';
import DataTable from './data/DataTable';
import { orderColumns } from './../constants/orderColumns';

const YourOrders = ({ employeeId }) => {
    const dispatch = useDispatch();
    const orderData = useSelector((state) => state.data.orderData.data || []);
    const role='admin'
    useEffect(() => {
        if (role) {
            dispatch(fetchOrderData(employeeId, role));
        }
    }, [dispatch, employeeId, role]);

    console.log("All Orders:", orderData); // Debug log

    // Filter orders based on employeeId arrays
    const displayData = orderData.filter(order => {
        return (employeeId && (
            order.fleadEmployeeIds?.includes(employeeId) ||
            order.verifyEmployeeIds?.includes(employeeId) ||
            order.reworkEmployeeIds?.includes(employeeId) ||
            order.rtoEmployeeIds?.includes(employeeId)
        ));
    })
        .map(order => ({
            ...order,
            totalPrice: order.billDetails.reduce((sum, item) => sum + item.totalPrice, 0),
        }));

    return <DataTable columns={orderColumns} data={displayData} title=" Your Order Status" baseURL="/data/order" />;
};

export default YourOrders;