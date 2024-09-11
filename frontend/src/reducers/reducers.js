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
import productReducer from './productReducer';
import callattemptReducer from './callAttemptReducer';
import alarmReducer from './alarmReducer';
import historyReducer from './historyReducer';
import accessControlReducer from './accessReducer';


const rootReducer = combineReducers({
    admin: adminReducer,
    employees: employeeReducer,
    dataCounts: dataCountsReducer,
    products: productReducer, 
    data: combineReducers({
        data: dataReducer,
        assignedData: assignedDataReducer,
        orderData: orderDataReducer,
        canceledData: canceledDataReducer,
        callbackData: callbackDataReducer,
    }),
    auth: authReducer,
    operation: operationReducer,
    callAttempts: callattemptReducer,
    alarms: alarmReducer,
    history: historyReducer,
    ipAccess: accessControlReducer
});

export default rootReducer;
