// src/components/EmployeeListComponent.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees } from '../redux/employeeActions';
import { distributeData } from '../redux/dataActions';

const EmployeeListComponent = () => {
    const dispatch = useDispatch();
    const { employees, loading, error } = useSelector((state) => state.employees);
    const { data } = useSelector((state) => state.data);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [dataCount, setDataCount] = useState(0);

    useEffect(() => {
        dispatch(fetchEmployees());
    }, [dispatch]);

    const handleCheckboxChange = (employeeId) => {
        setSelectedEmployees((prev) =>
            prev.includes(employeeId)
                ? prev.filter((id) => id !== employeeId)
                : [...prev, employeeId]
        );
    };

    const handleDistribute = () => {
        dispatch(distributeData(selectedEmployees, dataCount));
    };

    const assignedCount = data.filter(item => item.status === 'assigned').length;
    const unassignedCount = data.filter(item => item.status === 'unassigned').length;

    return (
        <div>
            <h2>Employee List</h2>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <div>
                    <ul>
                        {employees.map((employee) => (
                            <li key={employee._id}>
                                <label>
                                    <input
                                        type="checkbox"
                                        value={employee._id}
                                        onChange={() => handleCheckboxChange(employee._id)}
                                    />
                                    {employee.name}
                                </label>
                            </li>
                        ))}
                    </ul>
                    <div>
                        <input
                            type="number"
                            value={dataCount}
                            onChange={(e) => setDataCount(e.target.value)}
                            placeholder="Number of data to distribute"
                        />
                        <button onClick={handleDistribute}>Distribute Data</button>
                    </div>
                    <div>
                        <h3>Data Status</h3>
                        <p>Assigned: {assignedCount}</p>
                        <p>Unassigned: {unassignedCount}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeListComponent;
