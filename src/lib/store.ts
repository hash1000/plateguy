import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import cartReducer from "./features/cartSlice";
import checkoutReducer from "./features/checkoutSlice";

const rootReducer = combineReducers({
  cart: cartReducer,
  checkout: checkoutReducer,
});

const persistConfig = {
  key: "plateguy",
  version: 1,
  storage,
  whitelist: ["cart", "checkout"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

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
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
