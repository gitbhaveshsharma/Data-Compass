import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductPage from './admin/ProductPage';
import Dashboard from './admin/Dashboard';
import Register from './admin/EmployeeRegister';
import DataAssigned from './admin/DataAssgined';
import AdminDrawer from '../components/CustomDrawer';



const AdminDashboard = () => {
    return (
        <AdminDrawer>
                <Routes>
                     <Route path="/" element={<Dashboard />} />
                    <Route path="/products" element={<ProductPage />} />
                    <Route path="/Register" element={<Register />} />
                <Route path="/data-assgined" element={<DataAssigned />} />
                </Routes>
        </AdminDrawer>
    );
}

export default AdminDashboard;
