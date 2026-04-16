"use client";

import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cartSlice";

import {
  persistStore,
  persistReducer,
} from "redux-persist";

import storage from "redux-persist/lib/storage"; // localStorage

// config
const persistConfig = {
  key: "root",
  storage,
};

// wrap reducer
const persistedReducer = persistReducer(persistConfig, cartReducer);

// store
export const store = configureStore({
  reducer: {
    cart: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // ⚠️ required
    }),
});

// persistor
export const persistor = persistStore(store);

// types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;