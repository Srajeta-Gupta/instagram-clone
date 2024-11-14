import { combineReducers } from 'redux';

import authReducer from './AuthReducer'
import postReducer from './PostReducer'
import chatUserReducer from './ChatUserReducer'

export const reducers = combineReducers({ authReducer, postReducer, chatUserReducer })