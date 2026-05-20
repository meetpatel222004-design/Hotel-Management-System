import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [
    {
      id: "TK-001",
      customerName: "Amit Patel",
      customerPhone: "9876543210",
      items: [
        { id: "sg-4", name: "Butter Chicken", price: 380, qty: 1 },
        { id: "sg-7", name: "Garlic Naan", price: 80, qty: 2 },
      ],
      totalAmount: 540,
      status: "pending_review",
      paymentMethod: "upi",
      createdAt: Date.now() - 10 * 60 * 1000,
    },
    {
      id: "TK-002",
      customerName: "Sneha Roy",
      customerPhone: "9812345678",
      items: [
        { id: "sg-5", name: "Dal Makhani", price: 260, qty: 1 },
        { id: "sg-8", name: "Jeera Rice", price: 180, qty: 1 },
      ],
      totalAmount: 440,
      status: "preparing",
      paymentMethod: "cash",
      createdAt: Date.now() - 25 * 60 * 1000,
    },
  ],
};

const takeawaySlice = createSlice({
  name: "takeaway",
  initialState,
  reducers: {
    addTakeawayOrder(state, action) {
      state.orders.push({
        id: `TK-${Date.now().toString(36).toUpperCase()}`,
        ...action.payload,
        status: "pending_review",
        createdAt: Date.now(),
      });
    },

    acceptTakeawayOrder(state, action) {
      const order = state.orders.find((o) => o.id === action.payload);
      if (order) order.status = "accepted";
    },

    rejectTakeawayOrder(state, action) {
      const order = state.orders.find((o) => o.id === action.payload);
      if (order) order.status = "rejected";
    },

    markTakeawayPreparing(state, action) {
      const order = state.orders.find((o) => o.id === action.payload);
      if (order) order.status = "preparing";
    },

    markTakeawayReady(state, action) {
      const order = state.orders.find((o) => o.id === action.payload);
      if (order) order.status = "ready";
    },

    markTakeawayCompleted(state, action) {
      const order = state.orders.find((o) => o.id === action.payload);
      if (order) order.status = "completed";
    },

    setTakeawayStatus(state, action) {
      state.takeawayStatus = action.payload;
    },

    clearTakeaway() {
      return initialState;
    },
  },
});

export const {
  addTakeawayOrder,
  acceptTakeawayOrder,
  rejectTakeawayOrder,
  markTakeawayPreparing,
  markTakeawayReady,
  markTakeawayCompleted,
  setTakeawayStatus,
  clearTakeaway,
} = takeawaySlice.actions;

export const selectAllTakeawayOrders = (state) => state.takeaway.orders;
export const selectPendingTakeawayOrders = (state) =>
  state.takeaway.orders.filter((o) => o.status === "pending_review");
export const selectActiveTakeawayOrders = (state) =>
  state.takeaway.orders.filter((o) => !["completed", "rejected"].includes(o.status));
export const selectTakeawayOrderById = (state, id) =>
  state.takeaway.orders.find((o) => o.id === id);

export default takeawaySlice.reducer;
