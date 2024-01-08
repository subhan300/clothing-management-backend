import { createAsyncThunk } from "@reduxjs/toolkit";
import { managerLogin, employeeLogin, adminLogin } from "../../apis";
import { showPopup } from "../UserSliceAuth";

export const SignIn = createAsyncThunk(
  "SignIn",
  async (
    thunkAPI,
    { dispatch, getState, rejectWithValue, fulfillWithValue }
  ) => {
    try {
      let res;
      if (thunkAPI.role === "manager" || thunkAPI.role==="manager#") {

        res = await managerLogin(thunkAPI.user);
        localStorage.setItem("role", "manager");
      } else if (thunkAPI.role === "employee") {
        localStorage.setItem("role", "employee");
        res = await employeeLogin(thunkAPI.user);
      } else {
        localStorage.setItem("role", "admin");
        res = await adminLogin(thunkAPI.user);
      }
    

      if (res?.status != "200") {
        return rejectWithValue({
          err: thunkAPI.t("Invalid Email or Password"),
          value: false,
        });
      }
      let role =localStorage.getItem("role") 
      let userObj={...res.data,role}
      localStorage.setItem("user", JSON.stringify(userObj));
     
     
      dispatch(
        showPopup({ state: true, message:thunkAPI.t(res.data.message)})
      );

      setTimeout(() => {
        if (thunkAPI.role === "manager" || thunkAPI.role==="manager#") {
        

          thunkAPI.navigate("/manager");
        } else if (thunkAPI.role === "employee") {
          thunkAPI.navigate("/employee");

        } else {
          thunkAPI.navigate("/admin");
        }
      },1000);

      return fulfillWithValue(userObj);
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);
