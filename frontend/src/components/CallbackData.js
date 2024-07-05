import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssignedData } from '../redux/dataActions';
import DataTable from './data/DataTable';

const callbackColumns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'number', label: 'Number', minWidth: 100 },
    { id: 'address', label: 'Address', minWidth: 170 },
];

const CallbackData = ({ employeeId, role }) => {
    const dispatch = useDispatch();
    const assignedData = useSelector((state) => state.data.assignedData.assignedData || []);

    useEffect(() => {
        dispatch(fetchAssignedData(employeeId, role));
    }, [dispatch, employeeId, role]);

    const callbackData = assignedData.filter(data => data.status === 'callback');

    return <DataTable columns={callbackColumns} data={callbackData} title="Call back Data" baseURL="/data" />;
};

export default CallbackData;
