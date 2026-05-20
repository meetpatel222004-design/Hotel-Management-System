import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  entries: [],
};

const waitingListSlice = createSlice({
  name: "waitingList",
  initialState,
  reducers: {
    addWaitingEntry(state, action) {
      state.entries.push({
        id: `wait-${Date.now()}`,
        ...action.payload,
        status: "waiting",
        assignedTableId: null,
        createdAt: Date.now(),
      });
    },

    callCustomer(state, action) {
      const entry = state.entries.find((e) => e.id === action.payload);
      if (entry) {
        entry.status = "called";
      }
    },

    seatCustomer(state, action) {
      const { entryId, tableId } = action.payload;
      const entry = state.entries.find((e) => e.id === entryId);
      if (entry) {
        entry.status = "seated";
        entry.assignedTableId = tableId;
      }
    },

    cancelWaitingEntry(state, action) {
      const entry = state.entries.find((e) => e.id === action.payload);
      if (entry) {
        entry.status = "cancelled";
      }
    },

    removeWaitingEntry(state, action) {
      state.entries = state.entries.filter((e) => e.id !== action.payload);
    },
  },
});

export const { addWaitingEntry, callCustomer, seatCustomer, cancelWaitingEntry, removeWaitingEntry } =
  waitingListSlice.actions;

export const selectAllWaitingEntries = (state) => state.waitingList.entries;

export const selectActiveWaitingEntries = (state) =>
  state.waitingList.entries.filter((e) => e.status === "waiting" || e.status === "called");

export default waitingListSlice.reducer;
