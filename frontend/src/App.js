import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadUser, logout  } from './redux/authActions';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/adminDashboard';
import FieldDashboard from './pages/fleadDashboard';
import LogisticsDashboard from './pages/LogisticsDashboard';
import VerifyOrder from './components/verification/VerifyOrder';
import VerifyDashboard from './pages/VerifyDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import OperationPage from './components/OperationPage';
import CssBaseline from '@mui/material/CssBaseline';

const App = () => {
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);

    return (
        <>
        <CssBaseline />
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<ProtectedRoute role="admin" />}>
                    <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
                </Route>
                <Route element={<ProtectedRoute role="employee" />}>
                    <Route path="/field-dashboard" element={<FieldDashboard />} />
                    <Route path="/verify-dashboard" element={<VerifyDashboard />} />
                        <Route path="/logistics-dashboard" element={<LogisticsDashboard />} />    
                            <Route path="/data/:id" element={<OperationPage />} />
                            <Route path="/data/order/:id" element={<VerifyOrder />} />
                </Route>
                <Route path="/" element={<LoginPage />} />
            </Routes>
        </Router>
        </>
    );
};

export default App;