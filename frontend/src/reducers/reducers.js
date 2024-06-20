import { combineReducers } from '@reduxjs/toolkit';
import adminReducer from './adminReducer';
import employeeReducer from './employeeReducer';
import {
    dataReducer,
    dataCountsReducer,
    assignedDataReducer,
    orderDataReducer,
    canceledDataReducer,
    callbackDataReducer,
} from './dataReducer';
import authReducer from './authReducer';
import operationReducer from './operationReducer';

const rootReducer = combineReducers({
    admin: adminReducer,
    employees: employeeReducer,
    dataCounts: dataCountsReducer,
    data: combineReducers({
        data: dataReducer,
        assignedData: assignedDataReducer,
        orderData: orderDataReducer,
        canceledData: canceledDataReducer,
        callbackData: callbackDataReducer,
    }),
    auth: authReducer,
    operation: operationReducer,
});

export default rootReducer;
