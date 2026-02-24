import { combineReducers, configureStore } from '@reduxjs/toolkit';
import agencyPlansReducer from "./slices/agencyPlansSlice"

const rootReducer = combineReducers({
    plans: agencyPlansReducer,

});


export const setupStore = (preloadedState?: Partial<RootState>) => {
    return configureStore({
        reducer: rootReducer,
        preloadedState,
    });
};

export type RootState = ReturnType<typeof rootReducer>;