import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  role: null, // 'admin', 'manager', 'waiter', 'kitchen'
  name: null,
  staffId: null,
  restaurantId: null,
};

const staffAuthSlice = createSlice({
  name: "staffAuth",
  initialState,
  reducers: {
    staffLogin(state, action) {
      const { role, name, staffId, restaurantId } = action.payload;
      state.isLoggedIn = true;
      state.role = role;
      state.name = name;
      state.staffId = staffId;
      state.restaurantId = restaurantId || "spice-garden";
    },

    staffLogout() {
      return initialState;
    },
  },
});

export const { staffLogin, staffLogout } = staffAuthSlice.actions;

export const selectStaffRole = (state) => state.staffAuth.role;
export const selectIsStaffLoggedIn = (state) => state.staffAuth.isLoggedIn;
export const selectStaffName = (state) => state.staffAuth.name;

export default staffAuthSlice.reducer;
