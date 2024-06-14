import { combineReducers } from 'redux';
import adminReducer from './adminReducer';
import employeeReducer from './employeeReducer';
import { dataReducer, dataCountsReducer } from './dataReducer';

const rootReducer = combineReducers({
    admin: adminReducer,
    employees: employeeReducer,
    data: dataReducer,
    dataCounts: dataCountsReducer,
});

export default rootReducer;
