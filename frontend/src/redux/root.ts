import { combineReducers } from '@reduxjs/toolkit';
import { counterReducer } from './reducers';
import { settingsReducer } from './reducers/settingsSlice';

const rootReducer = combineReducers({
  counterReducer,
  settings: settingsReducer,
});

export default rootReducer;
