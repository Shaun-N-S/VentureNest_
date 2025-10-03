import { combineReducers, configureStore } from "@reduxjs/toolkit";
import tokenSlice from "../store/Slice/tokenSlice";
import userAuthData from "./Slice/authDataSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["authData"],
};

const rootReducer = combineReducers({
  token: tokenSlice,
  authData: userAuthData,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer
});

export const persistor = persistStore(store);

export type Rootstate = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
