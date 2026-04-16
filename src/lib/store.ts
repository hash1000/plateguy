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

// 🔹 Combine reducers
const rootReducer = combineReducers({
  cart: cartReducer,
  checkout: checkoutReducer,
});

// 🔹 Persist config
const persistConfig = {
  key: "plateguy",
  version: 1,
  storage,
  whitelist: ["cart", "checkout"], // only persist these
};

// 🔹 Wrap root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 🔹 Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
});

// 🔹 Persistor
export const persistor = persistStore(store);

// 🔹 Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;