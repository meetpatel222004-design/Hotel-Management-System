import { createSlice } from "@reduxjs/toolkit";

const makeQR = (tableNumber) =>
  `plate://restaurant/spice-garden/table/T${tableNumber}`;

const initialState = {
  tables: [
    {
      id: "table-1",
      number: 1,
      capacity: 4,
      status: "occupied",
      currentOrderId: "ORD001",
      runningBill: 450,
      activeGroups: 1,
      qrEnabled: true,
      qrCode: makeQR(1),
      restaurantId: "spice-garden",
    },
    {
      id: "table-2",
      number: 2,
      capacity: 2,
      status: "empty",
      currentOrderId: null,
      runningBill: 0,
      activeGroups: 0,
      qrEnabled: true,
      qrCode: makeQR(2),
      restaurantId: "spice-garden",
    },
    {
      id: "table-3",
      number: 3,
      capacity: 6,
      status: "occupied",
      currentOrderId: "ORD002",
      runningBill: 280,
      activeGroups: 1,
      qrEnabled: true,
      qrCode: makeQR(3),
      restaurantId: "spice-garden",
    },
    {
      id: "table-4",
      number: 4,
      capacity: 4,
      status: "waiting-bill",
      currentOrderId: "ORD003",
      runningBill: 650,
      activeGroups: 0,
      qrEnabled: true,
      qrCode: makeQR(4),
      restaurantId: "spice-garden",
    },
    {
      id: "table-5",
      number: 5,
      capacity: 2,
      status: "empty",
      currentOrderId: null,
      runningBill: 0,
      activeGroups: 0,
      qrEnabled: true,
      qrCode: makeQR(5),
      restaurantId: "spice-garden",
    },
    {
      id: "table-6",
      number: 6,
      capacity: 4,
      status: "empty",
      currentOrderId: null,
      runningBill: 0,
      activeGroups: 0,
      qrEnabled: true,
      qrCode: makeQR(6),
      restaurantId: "spice-garden",
    },
  ],
};

const tablesSlice = createSlice({
  name: "tables",
  initialState,
  reducers: {
    updateTableStatus(state, action) {
      const { tableId, status } = action.payload;
      const table = state.tables.find((t) => t.id === tableId);
      if (table) {
        table.status = status;
      }
    },

    assignOrderToTable(state, action) {
      const { tableId, orderId, amount } = action.payload;
      const table = state.tables.find((t) => t.id === tableId);
      if (table) {
        table.currentOrderId = orderId;
        table.status = "occupied";
        table.runningBill = amount;
        table.activeGroups = 1;
      }
    },

    updateTableBill(state, action) {
      const { tableId, amount } = action.payload;
      const table = state.tables.find((t) => t.id === tableId);
      if (table) {
        table.runningBill = amount;
      }
    },

    updateTableActiveGroups(state, action) {
      const { tableId, count } = action.payload;
      const table = state.tables.find((t) => t.id === tableId);
      if (table) {
        table.activeGroups = count;
      }
    },

    closeTable(state, action) {
      const tableId = action.payload;
      const table = state.tables.find((t) => t.id === tableId);
      if (table) {
        table.status = "empty";
        table.currentOrderId = null;
        table.runningBill = 0;
        table.activeGroups = 0;
      }
    },

    addTable(state, action) {
      const table = action.payload;
      state.tables.push({
        ...table,
        qrCode: makeQR(table.number),
        qrEnabled: true,
        restaurantId: table.restaurantId || "spice-garden",
      });
    },

    toggleTableQR(state, action) {
      const table = state.tables.find((t) => t.id === action.payload);
      if (table) {
        table.qrEnabled = !table.qrEnabled;
      }
    },

    regenerateQR(state, action) {
      const table = state.tables.find((t) => t.id === action.payload);
      if (table) {
        table.qrCode = makeQR(table.number);
      }
    },
  },
});

export const {
  updateTableStatus,
  assignOrderToTable,
  updateTableBill,
  updateTableActiveGroups,
  closeTable,
  addTable,
  toggleTableQR,
  regenerateQR,
} = tablesSlice.actions;

export const selectAllTables = (state) => state.tables.tables;

export const selectOccupiedTables = (state) =>
  state.tables.tables.filter((t) => t.status === "occupied");

export const selectTablesWaitingBill = (state) =>
  state.tables.tables.filter((t) => t.status === "waiting-bill");

export const selectTableById = (state, tableId) =>
  state.tables.tables.find((t) => t.id === tableId);

export default tablesSlice.reducer;
