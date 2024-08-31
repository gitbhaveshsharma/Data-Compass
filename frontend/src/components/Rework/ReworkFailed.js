import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderData, fetchAssignedData } from '../../redux/dataActions';
import DataTable from '../data/DataTable';
import { orderColumns } from '../../constants/orderColumns';

const ReworkFailed = React.memo(({ employeeId, role }) => {
    const dispatch = useDispatch();
    console.log(employeeId);

    // Fetching the required data from the Redux store
    const orderData = useSelector((state) => state.data.orderData.data || []);
    const assignedData = useSelector((state) => state.data.assignedData.assignedData || []);
    console.log(assignedData);

    useEffect(() => {
        if (role) {
            dispatch(fetchOrderData(employeeId, role));  // Dispatch action to fetch order data
            dispatch(fetchAssignedData(employeeId, role)); // Dispatch action to fetch assigned data
        }
    }, [dispatch, employeeId, role]);

    // Combine orderData and assignedData, then filter and map the result
    const displayData = useMemo(() => {
        const combinedData = [...orderData, ...assignedData]; // Merging the two datasets
        return combinedData
            .filter(order => order.status === 'rework-failed' && (role === 'admin' || order.assignedTo === employeeId))
            .map(order => ({
                ...order,
                totalPrice: (order.billDetails && Array.isArray(order.billDetails))
                    ? order.billDetails.reduce((sum, item) => sum + (item.totalPrice || 0), 0)
                    : 0, // Ensure totalPrice is 0 if billDetails is undefined or not an array
            }));
    }, [orderData, assignedData, employeeId, role]);

    // Determine baseURL based on totalPrice
    const baseURL = useMemo(() => {
        const hasNonZeroPrice = displayData.some(order => order.totalPrice > 0);
        return hasNonZeroPrice ? "/data/order" : "/data";
    }, [displayData]);

    return <DataTable columns={orderColumns} data={displayData} title="Rework Failed" baseURL={baseURL} />;
});

export default ReworkFailed;
