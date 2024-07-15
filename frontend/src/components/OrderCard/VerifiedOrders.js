import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderData } from '../../redux/dataActions';
import DataTable from '../data/DataTable';
import { orderColumns } from '../../constants/orderColumns';

const VerifiedOrders = ({ employeeId, role }) => {
    const dispatch = useDispatch();
    const orderData = useSelector((state) => state.data.orderData.data || []);

    useEffect(() => {
        dispatch(fetchOrderData(employeeId, role));
    }, [dispatch, employeeId, role]);

    const displayData = orderData
        .filter(order => order.status === 'verified')
        .map(order => ({
            ...order,
            totalPrice: order.billDetails.reduce((sum, item) => sum + item.totalPrice, 0),
        }));

    return <DataTable columns={orderColumns} data={displayData} title="Verified Orders" baseURL="/data/order" />;
};

export default VerifiedOrders;
