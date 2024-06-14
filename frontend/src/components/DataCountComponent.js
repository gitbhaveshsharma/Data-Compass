// src/components/DataCountComponent.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataCounts } from '../redux/dataActions';
import "../Style/DataCount.css";

const DataCountComponent = () => {
    const dispatch = useDispatch();
    const { assignedCount, unassignedCount, loading, error } = useSelector((state) => state.dataCounts);

    useEffect(() => {
        dispatch(fetchDataCounts());
    }, [dispatch]);

    return (
        <div>
            <h2>Data Status</h2>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <div>
                    <div class="count-box">
                        <div class="count-box-1">
                            <h5>{assignedCount}</h5>
                            <p>Assigned </p>
                        </div>
                        <div class="count-box-2">
                            <h5>{unassignedCount}</h5>
                            <p>Unassigned</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataCountComponent;
