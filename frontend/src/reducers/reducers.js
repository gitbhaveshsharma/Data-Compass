import { combineReducers } from 'redux';
import adminReducer from './adminReducer';
import employeeReducer from './employeeReducer';
import { dataReducer, dataCountsReducer, assignedDataReducer, orderDataReducer, canceledDataReducer, callbackDataReducer } from './dataReducer';
import authReducer from './authReducer';
import operationReducer from './operationReducer';

const rootReducer = combineReducers({
    admin: adminReducer,
    employees: employeeReducer,
    data: combineReducers({
        data: dataReducer,
        dataCounts: dataCountsReducer,
        assignedData: assignedDataReducer,
        orderData: orderDataReducer,
        canceledData: canceledDataReducer,
        callbackData: callbackDataReducer,
    }),
    auth: authReducer,
    operation: operationReducer,
});

export default rootReducer;
