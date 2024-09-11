import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductPage from './admin/ProductPage';
import Dashboard from './admin/Dashboard';
import Register from './admin/EmployeeRegister';
import DataAssigned from './admin/DataAssgined';
import AdminDrawer from '../components/AdminCustomDrawer';
import AnalysisPage from './admin/AnalysisPage';
import Profile from '../components/Profile';
import AccessControl from './admin/AccessControl'

const AdminDashboard = () => {

    return (
        <AdminDrawer>
            <Routes>
                     <Route path="/" element={<Dashboard />} />
                    <Route path="/products" element={<ProductPage />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/analysis" element={<AnalysisPage />} />
                <Route path="/data-assgined" element={<DataAssigned />} />
                <Route path="/employee-profile" element={<Profile />} />
                <Route path="/access-control" element={<AccessControl />} />
                </Routes>
        </AdminDrawer>
    );
}

export default AdminDashboard;
