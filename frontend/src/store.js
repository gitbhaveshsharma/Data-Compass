import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; // Import Redux Thunk (if needed)
import rootReducer from './reducers/reducers';

const store = createStore(rootReducer, applyMiddleware(thunk)); // Apply middleware

export default store;
