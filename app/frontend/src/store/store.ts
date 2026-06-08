import { combineReducers, configureStore } from '@reduxjs/toolkit';
import plansReducer from "./slices/plansSlice"

const rootReducer = combineReducers({
  plans: plansReducer,

});


export const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

export type RootState = ReturnType<typeof rootReducer>;



