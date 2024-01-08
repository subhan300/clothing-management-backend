import { baseURL, API } from "../../config";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const companyId = () => {
  return JSON.parse(localStorage.getItem("user"))?.result?.companyId;
};
const employeeId = () => {
  return JSON.parse(localStorage.getItem("user"))?.result?._id;
};

export const ManagerApi = createApi({
  reducerPath: "rtkManagerApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseURL }),
  tagTypes: ["employeeProducts", "budgetRequest", "orders", "companyUpload"],
  endpoints: (builder) => ({
    getEmployeesProducts: builder.query({
      query: () => `/product/get-products/`,
      providesTags: ["employeeProducts"],
    }),
    getAllManagers: builder.query({
      query: () => `/manager/get-manager`,
      providesTags: ["employeeProducts"],
    }),
    uploadCompany: builder.mutation({
      query: (payload) => {
        return {
          url: "/upload/upload-file",
          method: "POST",
          body: payload,
          headers: {
            "Content-type": "application/json",
          },
        };
      },
      providesTags: ["companyUpload"],
    }),
    getCompanyAllProducts: builder.query({
      query: () => `/product/get-productsbycompanyId?companyId=${companyId()}`,
    }),
    getEmployees: builder.query({
      query: () => `/employee/get-employeebycompanyId?companyId=${companyId()}`,
    }),
    getAllEmployees: builder.query({
      query: () => `/employee/get-employee`,
    }),

    getOrders: builder.query({
      query: () => `/order/get-orderbycompanyId?companyId=${companyId()}`,
      providesTags: ["orders"],
    }),
    getAllOrders: builder.query({
      query: () => `/order/get-order`,
      providesTags: ["orders"],
    }),
    getOrdersForEmployees: builder.query({
      query: () => `/order/get-orderbyemployeeId?companyId=${employeeId()}`,
      providesTags: ["orders"],
    }),
    getCompanyProducts: builder.query({
      query: () =>
        `product/get-getemployeeproductbycompanyId?companyId=${companyId()}`,
    }),

    getBudgetRequest: builder.query({
      query: () => `/request/get-request/${companyId()}`,
      providesTags: ["budgetRequest"],
    }),
    getTotalOrdersLength: builder.query({
      query: () => `/order/get-TotalOrder`,

      providesTags: ["order"],
    }),
    getTotalManagersLength: builder.query({
      query: () => `/manager/get-totalmanager`,
    }),
    getTotalOrdersLengthbyCompanyId: builder.query({
      query: () => `/order/get-TotalOrder?companyId=${companyId()}`,
      providesTags: ["order"],
    }),
    getTotalEmployeesLength: builder.query({
      query: () => `/employee/get-Totalemployee`,
    }),
    getTotalEmployeesLengthbyCompanyId: builder.query({
      query: () => `/employee/get-Totalemployee?companyId=${companyId()}`,
    }),
    getCompanyDetails: builder.query({
      query: () => `/company/getCompanyDetails?companyId=${companyId()}`,
    }),
    employeeGetProduct: builder.query({
      query: (id) => `/product/get-productsbyemployeeId?employeeId=${id}`,
      providesTags: ["orders"],
    }),
    employeeRequestBudgetIncrement: builder.mutation({
      query: (payload) => {
        return {
          url: "/request/add-request",
          method: "POST",
          body: payload,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      invalidatesTags: ["budgetRequest"],
    }),
    actionBudgetRequest: builder.mutation({
      query: (payload) => {
        return {
          url: "/request/approved-request",
          method: "PUT",
          body: payload,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      invalidatesTags: ["budgetRequest"],
    }),
    actionEmployeeBudgetRequest: builder.mutation({
      query: (payload) => {
        return {
          url: "/request/approved-request",
          method: "PUT",
          body: payload,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      invalidatesTags: ["budgetRequest"],
    }),
    updateBudget: builder.mutation({
      query: (payload) => {
        return {
          url: "/request/change-budget",
          method: "PUT",
          body: payload,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      invalidatesTags: ["employeeProducts"],
    }),

    addNewOrder: builder.mutation({
      query: (payload) => {
        return {
          url: "/order/add-order",
          method: "POST",
          body: payload,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      invalidatesTags: ["employeeProducts", "orders"],
    }),
  }),
});

export const {
  useGetEmployeesProductsQuery,
  useGetCompanyProductsQuery,
  useGetEmployeesQuery,
  useGetBudgetRequestQuery,
  useActionBudgetRequestMutation,
  useActionEmployeeBudgetRequestMutation,
  useGetOrdersQuery,
  useAddNewOrderMutation,
  useUpdateBudgetMutation,
  useEmployeeRequestBudgetIncrementMutation,
  useGetOrdersForEmployeesQuery,
  useGetTotalEmployeesLengthQuery,
  useGetTotalOrdersLengthQuery,
  useGetTotalEmployeesLengthbyCompanyIdQuery,
  useGetTotalOrdersLengthbyCompanyIdQuery,
  useGetCompanyDetailsQuery,
  useEmployeeGetProductQuery,
  useGetCompanyAllProductsQuery,
  useGetAllOrdersQuery,
  useUploadCompanyMutation,
  useGetTotalManagersLengthQuery,
  useGetAllEmployeesQuery,
  useGetAllManagersQuery,
} = ManagerApi;

export const managerLogin = (data) =>
  API.post("auth/manager-login", data)
    .then((res) => res)
    .catch((err) => err);

export const employeeLogin = (data) =>
  API.post("auth/login", data)
    .then((res) => res)
    .catch((err) => err);

export const adminLogin = (data) =>
  API.post("auth/admin-login", data)
    .then((res) => res)
    .catch((err) => err);
