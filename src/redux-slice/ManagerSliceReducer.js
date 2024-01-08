import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginState:false,
  loading:false,
  user:{},
};

export const ManagerSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
  
  },
});

export const { increment } = ManagerSlice.actions;

export default ManagerSlice.reducer;
