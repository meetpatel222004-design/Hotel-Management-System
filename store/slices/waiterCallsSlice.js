import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  calls: [],
};

const waiterCallsSlice = createSlice({
  name: "waiterCalls",
  initialState,
  reducers: {
    addWaiterCall(state, action) {
      state.calls.push({
        id: `call-${Date.now()}`,
        ...action.payload,
        status: "pending",
        acceptedBy: null,
        createdAt: Date.now(),
      });
    },

    acceptCall(state, action) {
      const call = state.calls.find((c) => c.id === action.payload.callId);
      if (call && call.status === "pending") {
        call.status = "accepted";
        call.acceptedBy = action.payload.waiterName;
      }
    },

    resolveCall(state, action) {
      const call = state.calls.find((c) => c.id === action.payload);
      if (call) {
        call.status = "resolved";
      }
    },

    declineCall(state, action) {
      // Waiter is busy - just remove from their view, keep pending for others
      // No state change needed, other waiters still see it
    },
  },
});

export const { addWaiterCall, acceptCall, resolveCall, declineCall } = waiterCallsSlice.actions;

export const selectPendingCalls = (state) =>
  state.waiterCalls.calls.filter((c) => c.status === "pending");

export const selectAcceptedCalls = (state) =>
  state.waiterCalls.calls.filter((c) => c.status === "accepted");

export const selectAllCalls = (state) => state.waiterCalls.calls;

export default waiterCallsSlice.reducer;
