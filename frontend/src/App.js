import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadUser } from './redux/authActions';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import FieldDashboard from './pages/FleadDashboard';
import LogisticsDashboard from './pages/LogisticsDashboard';
import VerifyOperationPage from './pages/OperationPages/VerifyOperationPage';
import VerifyDashboard from './pages/VerifyDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import FieldOperationPage from './pages/OperationPages/FieldOperationPage';
import Footer from './pages/Footer';

const App = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);

    return (
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
                    <Route path="/data/:id" element={<FieldOperationPage />} />
                    <Route path="/data/order/:id" element={<VerifyOperationPage />} />
                </Route>
                <Route path="/" element={<LoginPage />} />
            </Routes>
            <ConditionalFooter />
        </Router>
    );
};

// Component to conditionally render Footer
const ConditionalFooter = () => {
    const location = useLocation();

    // Exclude the login page from displaying the footer
    if (location.pathname === '/login' || location.pathname === '/') {
        return null;
    }

    return <Footer />;
};

export default App;
