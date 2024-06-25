import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductPage from './admin/ProductPage';
import Dashboard from './admin/Dashboard';
import Register from './admin/EmployeeRegister';
import EmployeeListComponent from '../components/EmployeeListComponent';
import UploadComponent from '../components/UploadComponent';
import DataCountComponent from '../components/DataCountComponent';
import OrderData from '../components/OrderData';
import CallbackData from '../components/CallbackData';
import CanceledData from '../components/CanceledData';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import AdminDrawer from '../components/CustomDrawer';



const AdminDashboard = () => {
    return (
        <AdminDrawer>
                <Routes>
                     <Route path="/" element={<Dashboard />} />
                    <Route path="/products" element={<ProductPage />} />
                    <Route path="/Register" element={<Register />} />
                     <Route path="/data-assgined" element={<EmployeeListComponent />} />
                </Routes>
        </AdminDrawer>
    );
}

export default AdminDashboard;
