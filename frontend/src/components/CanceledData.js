import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCanceledData } from '../redux/dataActions';
import DataTable from './data/DataTable'; // Import the reusable DataTable component

const canceledColumns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'number', label: 'Number', minWidth: 100 },
    { id: 'address', label: 'Address', minWidth: 170 },
    { id: 'orderItems', label: 'Order Items', minWidth: 170 },
];

const CanceledData = ({ employeeId, role }) => {
    const dispatch = useDispatch();
    const canceledData = useSelector((state) => state.data.canceledData.data);

    useEffect(() => {
        dispatch(fetchCanceledData(employeeId, role));
    }, [dispatch, employeeId, role]);

    return <DataTable columns={canceledColumns} data={canceledData} title="Canceled Data" />;
};

export default CanceledData;
