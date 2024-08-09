import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssignedData } from '../../redux/dataActions';
import DataTable from '../data/DataTable';
import { canceledColumns } from '../../constants/orderColumns';

const CanceledData = ({ employeeId, role }) => {
    const dispatch = useDispatch();
    const assignedData = useSelector((state) => state.data.assignedData.assignedData || []);

    useEffect(() => {
        dispatch(fetchAssignedData(employeeId, role));
    }, [dispatch, employeeId, role]);

    const canceledData = assignedData.filter(data => data.status === 'canceled');

    return <DataTable columns={canceledColumns} data={canceledData} title="Canceled Data" baseURL="/data" />;
};

export default CanceledData;
