import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { SignIn } from "./middleware/authMiddleware";
// import { getFromLocalStorage } from "../../utils";

let user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  authErr: "",
  loading: false,
  user: user != (undefined || null) ? user : {},
  userLoggedIn: user ? true : false,
  // successPopup:false
  successPopup: {
    state: false,
    message: "",
  },
  errorPopup: {
    state: false,
    message: "",
  },
};

export const auth = createSlice({
  name: "user-auth",
  initialState,
  reducers: {
    signin: (state) => state,
    InvalidUserName: (state, { payload }) => {
      state.authErr = payload;
    },
    userLoggedInState: (state, { payload }) => {
      state.userLoggedIn = payload;
    },
    userRemove: (state, { payload }) => {
      state.userLoggedIn = false;
      state.user = {};
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      localStorage.removeItem("addToCart");
    },
    errorRemove: (state) => {
      state.authErr = "";
    },
    showPopup: (state, { payload }) => {
      state.successPopup = {
        state: true,
        message: payload.message,
      };
    },
    errorPopup: (state, { payload }) => {
      state.errorPopup = {
        state: true,
        message: payload.message,
      };
    },
    hidePopup: (state) => {state.successPopup.state = false;
      state.errorPopup.state=false
  },
  },

  extraReducers: {
    [SignIn.pending]: (state) => {
      state.loading = true;
    },
    [SignIn.fulfilled]: (state, {payload}) => {
      
      state.loading = false;
      state.authErr = "";
      state.user = payload;
      state.userLoggedIn = true;
    },
    [SignIn.rejected]: (state, { payload }) => {
      state.loading = false;
      state.authErr = payload.err;
    },

    // [SignOut.pending]: (state, { payload }) => {
    //   state.loading = true;
    // },
    // [SignOut.fulfilled]: (state, { payload }) => {
    //   // state.loading = false
    //   state.authErr = "";
    //   state.userLoggedIn = false;
    // },
    // [SignOut.rejected]: (state, { payload }) => {
    //   state.loading = false;
    //   state.authErr = payload.err;
    //   state.userLoggedIn = false;
    // },
  },
});

// Action creators are generated for each case reducer function
export const {
  InvalidUserName,
  errorRemove,
  userLoggedInState,
  showPopup,
  userRemove,
  hidePopup,
  errorPopup
} = auth.actions;

export default auth.reducer;
