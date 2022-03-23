import loginReducer from './loginREducer'
import { configureStore } from '@reduxjs/toolkit';

export const allMyreducers = configureStore({
    reducer: {
        loginReducer,
    },
});
