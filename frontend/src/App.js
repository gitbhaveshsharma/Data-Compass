import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadUser } from './redux/authActions';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import FleadDashboard from './pages/FleadDashboard';
import LogisticsDashboard from './pages/LogisticsDashboard';
import VerifyOperationPage from './pages/OperationPages/VerifyOperationPage';
import VerifyDashboard from './pages/VerifyDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import FleadOperationPage from './pages/OperationPages/FleadOperationPage';
import Footer from './pages/Footer';
import ReworkDashboard from './pages/ReworkDashboard';
import RTODashboard from './pages/RTODashboard';
import EmployeeDrawer from './components/EmployeeDrawer';
import Profile from './components/Profile';
import ITDashboard from './pages/ITDashboard';

const App = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                {/* Admin Route */}
                <Route element={<ProtectedRoute role="admin" />}>
                    <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
                </Route>

                {/* Employee Routes with EmployeeDrawer */}
                <Route element={<ProtectedRoute role="employee" />}>
                    <Route
                        path="/*"
                        element={
                            <EmployeeDrawer>
                                {/* Nested Routes inside EmployeeDrawer */}
                                <Routes>
                                    <Route path="/employee-profile" element={<Profile />} />
                                    <Route path="/field-dashboard" element={<FleadDashboard />} />
                                    <Route path="/verify-dashboard" element={<VerifyDashboard />} />
                                    <Route path="/logistics-dashboard" element={<LogisticsDashboard />} />
                                    <Route path="/rework-dashboard" element={<ReworkDashboard />} />
                                    <Route path="/rto-dashboard" element={<RTODashboard />} />
                                    <Route path="/IT-dashboard" element={<ITDashboard />} />
                                    <Route path="/data/:id" element={<FleadOperationPage />} />
                                    <Route path="/data/order/:id" element={<VerifyOperationPage />} />
                                </Routes>
                            </EmployeeDrawer>
                        }
                    />
                </Route>

                {/* Default Route */}
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
