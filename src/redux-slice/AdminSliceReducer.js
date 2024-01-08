import { createSlice } from "@reduxjs/toolkit";


const getCompanyFromLocalStorage = () => {
 
  return JSON.parse(localStorage.getItem("selectedCompany"))}
const initialState = {
  companySetting: {
    pricingStatus: 0,
    budgetStatus: 0,
    companyId: "",
  },
  company:getCompanyFromLocalStorage() ||  {
    SNO: "",
    budgetStatus: "",
    companyEmail: "",
    companyFax: "",
    companyLocation: "",
    companyLogo: "",
    companyName: "",
    companyPhone: "",
    createdAt: "",
    pricing: 0,
    pricingStatus: 0,
    _id: "",
  },
};

export const AdminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {

    companySettingsAction: (state, { payload }) => {
     
      return {
        ...state,
        companySetting: {
          pricingStatus: payload.pricingStatus,
          budgetStatus: payload.budgetStatus,
          companyId: payload.companyId,
        },
      };
    },
    selectedCompany: (state, { payload }) => {
      return { ...state, company: { ...payload } };
    },
  },
});

export const { companySettingsAction, selectedCompany } = AdminSlice.actions;

export default AdminSlice.reducer;
