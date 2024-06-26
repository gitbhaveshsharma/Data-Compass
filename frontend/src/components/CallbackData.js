// CallbackData.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCallbackData } from '../redux/dataActions';
import DataTable from './data/DataTable'; // Import the reusable DataTable component

const callbackColumns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'number', label: 'Number', minWidth: 100 },
    { id: 'address', label: 'Address', minWidth: 170 },
];

const CallbackData = ({ employeeId, role }) => {
    const dispatch = useDispatch();
    const callbackData = useSelector((state) => state.data.callbackData.data);

    useEffect(() => {
        dispatch(fetchCallbackData(employeeId, role));
    }, [dispatch, employeeId, role]);

    return <DataTable columns={callbackColumns} data={callbackData} title="Callback Data" />;
};

export default CallbackData;