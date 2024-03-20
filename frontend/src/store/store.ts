import {
  EnhancedStore,
  PreloadedState,
  configureStore,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { waitManagementApi } from "../services/waitManagement";
import { authSlice } from "../slices/auth";
import { restaurantSlice } from "../slices/restaurant";

export const rootMiddlewares = [waitManagementApi.middleware];

export const store = configureStore({
  reducer: {
    [waitManagementApi.reducerPath]: waitManagementApi.reducer,
    auth: authSlice.reducer,
    restaurant: restaurantSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rootMiddlewares),
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: {
      [waitManagementApi.reducerPath]: waitManagementApi.reducer,
      auth: authSlice.reducer,
      restaurant: restaurantSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(rootMiddlewares),
    preloadedState,
  });
};

export type RootState = ReturnType<typeof store.getState>;
export type AppStore = EnhancedStore;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
