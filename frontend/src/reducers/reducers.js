import { combineReducers } from 'redux';
import adminReducer from './adminReducer';
import employeeReducer from './employeeReducer';
import dataReducer from './dataReducer';

const rootReducer = combineReducers({
    admin: adminReducer,
    employees: employeeReducer,
    data: dataReducer,
});

export default rootReducer;
