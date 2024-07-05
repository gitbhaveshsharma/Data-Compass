import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssignedData } from '../redux/dataActions';
import DataTable from './data/DataTable';

const canceledColumns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'number', label: 'Number', minWidth: 100 },
    { id: 'address', label: 'Address', minWidth: 170 },
];

const CanceledData = ({ employeeId, role }) => {
    const dispatch = useDispatch();
    const assignedData = useSelector((state) => state.data.assignedData.assignedData || []);

    useEffect(() => {
        dispatch(fetchAssignedData(employeeId, role));
    }, [dispatch, employeeId, role]);

    const canceledData = assignedData.filter(data => data.status === 'cancel');

    return <DataTable columns={canceledColumns} data={canceledData} title="Canceled Data" baseURL="/data" />;
};

export default CanceledData;
