import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import jobsReducer from "./slices/jobsSlice"; // Make sure this path is correct

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "jobs"], // Persist both user and jobs slices
};

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  jobs: jobsReducer,
});

// Wrap combined reducers with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Needed for redux-persist
    }),
});

// Persistor for PersistGate
export const persistor = persistStore(store);

// Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
