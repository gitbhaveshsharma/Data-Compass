import logo from './logo.svg';
import './App.css';
import UploadComponent from './components/UploadComponent';
import EmployeeListComponent from './components/EmployeeListComponent';
import DataCountComponent from './components/DataCountComponent';
import OperationPage from './components/OperationPage';

import AdminDashboard from './pages/adminDashboard';
import FleadDasbord from './pages/fleadDashboard'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<FleadDasbord employeeId="some-employee-id" />} />
                <Route path="/data/:id" element={<OperationPage />} />
            </Routes>
        </Router>
    );
};

export default App;
