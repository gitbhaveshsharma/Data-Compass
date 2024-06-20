import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/adminDashboard';
import FieldDashboard from './pages/fleadDashboard';
import VerifyDashboard from './pages/VerifyDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import OperationPage from './components/OperationPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<ProtectedRoute role="admin" />}>
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                </Route>
                <Route element={<ProtectedRoute role="employee" />}>
                    <Route path="/field-dashboard" element={<FieldDashboard />} />
                    <Route path="/verify-dashboard" element={<VerifyDashboard />} />
                    <Route path="/data/:id" element={<OperationPage />}/>
                </Route>
                <Route path="/" element={<LoginPage />} />
            </Routes >
        </Router >
    );
};

export default App;
