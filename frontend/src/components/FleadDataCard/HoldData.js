import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssignedData } from '../../redux/dataActions';
import DataTable from '../data/DataTable';
import { columns } from '../../constants/orderColumns';

const HoldData = ({ employeeId, role }) => {
    const dispatch = useDispatch();
    const assignedData = useSelector((state) => state.data.assignedData.assignedData || []);

    useEffect(() => {
        dispatch(fetchAssignedData(employeeId, role));
    }, [dispatch, employeeId, role]);

    const holdData = assignedData.filter(data => data.status === 'hold');

    return <DataTable columns={columns} data={holdData} title="Hold Data" baseURL="/data" />;
};

export default HoldData;
