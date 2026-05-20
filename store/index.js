import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import dineInReducer from "./slices/dineInSlice";
import takeawayReducer from "./slices/takeawaySlice";
import uiReducer from "./slices/uiSlice";
import ordersReducer from "./slices/ordersSlice";
import tablesReducer from "./slices/tablesSlice";
import menuReducer from "./slices/menuSlice";
import waiterCallsReducer from "./slices/waiterCallsSlice";
import waitingListReducer from "./slices/waitingListSlice";
import staffAuthReducer from "./slices/staffAuthSlice";

const persistConfig = {
  key: "plate-v7",
  storage,
  whitelist: ["auth", "cart", "dineIn", "takeaway", "orders", "tables", "menu", "waiterCalls", "waitingList", "staffAuth"],
};

const rootReducer = {
  auth: authReducer,
  cart: cartReducer,
  dineIn: dineInReducer,
  takeaway: takeawayReducer,
  ui: uiReducer,
  orders: ordersReducer,
  tables: tablesReducer,
  menu: menuReducer,
  waiterCalls: waiterCallsReducer,
  waitingList: waitingListReducer,
  staffAuth: staffAuthReducer,
};

const persistedRootReducer = (state, action) => {
  const combined = {};
  Object.keys(rootReducer).forEach((key) => {
    combined[key] = rootReducer[key](state?.[key], action);
  });
  return combined;
};

const persistedReducer = persistReducer(persistConfig, (state, action) => {
  if (action.type === "persist/REHYDRATE") {
    const incoming = action.payload;
    if (incoming) {
      return {
        auth: authReducer(incoming.auth, action),
        cart: cartReducer(incoming.cart, action),
        dineIn: dineInReducer(incoming.dineIn, action),
        takeaway: takeawayReducer(incoming.takeaway, action),
        ui: uiReducer(undefined, action),
        orders: ordersReducer(incoming.orders, action),
        tables: tablesReducer(incoming.tables, action),
        menu: menuReducer(incoming.menu, action),
        waiterCalls: waiterCallsReducer(incoming.waiterCalls, action),
        waitingList: waitingListReducer(incoming.waitingList, action),
        staffAuth: staffAuthReducer(incoming.staffAuth, action),
      };
    }
  }
  return persistedRootReducer(state, action);
});

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
