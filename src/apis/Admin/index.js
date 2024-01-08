// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL, API } from "../../config";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const companyId = () => {
  return JSON.parse(localStorage.getItem("user"))?.result?.companyId;
};
const employeeId = () => {
  return JSON.parse(localStorage.getItem("user"))?.result?._id;
};

export const AdminCreateCompanies = createApi({
  reducerPath: "rtkAdminCreateCompaniesApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseURL }),
  tagTypes: ["addCompany","editCompany","addManager","editManager","addEmployee","editEmployee","deleteManager","deleteEmployee","addCompanyProduct"],
  endpoints: (builder) => ({
    addNewCompany: builder.mutation({
      query: (payload) => {
        return {
          url: "/company/add-company",
          method: "POST",
          body: payload,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      invalidatesTags: [""],
    }),
    getAllCompanies: builder.query({
      query: () => `/company/get-allcompanies`,
      // providesTags: ["addCompany"],
    }),
    getManagersByCompanyId: builder.query({
      query: ({companyId}) => `/manager/get-allmanagerbycompanyId?companyId=${companyId}`,
      providesTags: ["editManager","addManager","deleteEmployee","deleteManager"],
    }),
    getProductsByCompanyId: builder.query({
      query: ({companyId}) => {
       
      return  `/product/get-productsbycompanyId?companyId=${companyId}`
      },
      // providesTags: ["addCompanyProduct"],
    }),
    updateCompanyProductsByCompanyId:builder.mutation({
      query: ({payload,id}) => {
       
        return {
          url: `/product/update-productbycompanyId/${id}`,
          method: "PATCH",
          body: payload,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      invalidatesTags: ["addCompanyProduct"],
    }),
    updateEmployeeProductsByCompanyId:builder.mutation({
      query: ({payload,id}) => {
  
        return {
          url: `/product/update-employeeproductbycompanyid/${id}`,
          method: "PATCH",
          body: payload,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      invalidatesTags: ["addCompanyProduct"],
    }),
    getAllEmployeesProductsByCompanyId: builder.query({
      query: ({companyId}) => {
      
      return  `/product/get-getemployeeproductbycompanyId?companyId=${companyId}`
      },
      // providesTags: ["editManager","addManager","addProducts"],
    }),
    addNewManager: builder.mutation({
      query: (payload) => {
        return {
          url: "/manager/add-manager",
          method: "POST",
          body: payload,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      invalidatesTags: ["editManager","addManager"],
    }),
    addNewEmployee: builder.mutation({
      query: (payload) => {
        return {
          url: "/employee/add-employee",
          method: "POST",
          body: payload,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      invalidatesTags: ["editEmployee","addEmployee"],
    }),
    getEmployeesByCompanyId: builder.query({
      query: ({companyId}) => `/employee/get-employeebycompanyId?companyId=${companyId}`,
      providesTags: ["editCompany","addEmployee"],
    }),
    getAllProductsApi: builder.query({
      query: () => `/product/get-all-products`,
      // providesTags: ["addCompany","addProducts"],
    }),
    addAllProducts: builder.mutation({
      query: (payload) => {
        return {
          url: "/product/add-products",
          method: "POST",
          body: payload,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      invalidatesTags: ["addProducts"],
    }),
    addCompanyProductsById: builder.mutation({
     
      query: ({payload,id}) => {
        
        return {
          url: `/product/add-companyproductbyId/${id}`,
          method: "POST",
          body: payload,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      // invalidatesTags: ["addCompanyProduct"],
    }),
    addEmployeeProducts: builder.mutation({
     
      query: ({payload,id}) => {
       
        return {
          url: `/product/add-employeeproductbyid/${id}`,
          method: "POST",
          body: payload,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      // invalidatesTags: ["addCompanyProduct"],
    }),
    editProduct: builder.mutation({
      query: ({payload,id}) => {
      
        return {
          url: `/product/update-allproduct/${id}`,
          method: "PATCH",
          body: payload,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      invalidatesTags: ["addProducts"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => {
        return {
          url: `/product/delete-product/${id}`,
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      invalidatesTags: ["addProducts"],
    }),
    deleteCompanyProductById: builder.mutation({
       query: ({id}) => {
        return {
          url: `/product/delete-companyproductbyid/${id}`,
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      // invalidatesTags: ["addProducts"],
    }),
    deleteEmployeeProductById: builder.mutation({
      query: ({id}) => {
        return {
          url: `/product/delete-employeeproductbyid/${id}`,
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      // invalidatesTags: ["addProducts"],
    }),
  
    deleteManager: builder.mutation({
      query: ({id}) => {
        return {
          url: `/manager/delete-manager/${id}`,
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      invalidatesTags: ["deleteManager"],
    }),
    deleteEmployee: builder.mutation({
      query: ({id}) => {
        return {
          url: `/employee/delete-employee/${id}`,
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      invalidatesTags: ["deleteEmployee"],
    }),

    editCompany: builder.mutation({
      query: ({payload,id}) => {
        return {
          url: `/company/edit-company/${id}`,
          method: "PATCH",
          body: {...payload},
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      invalidatesTags: ["editCompany","addCompany"],
    }),

    editManager: builder.mutation({
      query: ({payload,id}) => {
      
        return {
          url: `/manager/edit-manager/${id}`,
          method: "PATCH",
          body: payload,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      invalidatesTags: ["editManager","addManager"],
    }),
  
    editEmployee: builder.mutation({
      query: ({payload,id}) => {
        return {
          url: `employee/edit-employee/${id}`,
          method: "PATCH",
          body: payload,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      invalidatesTags: ["editEmployee","addEmployee"],
    }),
   
    deleteCompany: builder.mutation({
  
      query: ({id}) => {
        return {
          url: `/company/delete-company/${id}`,
          method: "DELETE",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      invalidatesTags: ["editCompany","addCompany","editManager","editEmployee"],
    }),
    sendEmail: builder.mutation({
      query: ({payload,id}) => {
        return {
          url: `/auth/send-email`,
          method: "POST",
          body: payload,
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      // providesTags: ["editManager","addManager","deleteEmployee","deleteManager"],
    }),
    getAllCompaniesDataCount: builder.query({
      query: () => `/dashboard/totalDataCount`,
      // providesTags: ["addCompany","addProducts"],
    }),
   
  }),
});

export const {
  useAddNewCompanyMutation,
  useGetAllCompaniesQuery,
  useAddNewManagerMutation,
  useAddNewEmployeeMutation,
  useGetAllProductsApiQuery,
  useAddAllProductsMutation,
  useEditProductMutation,
  useDeleteProductMutation,
  useEditCompanyMutation,
  useEditManagerMutation,
  useDeleteManagerMutation,
  useGetManagersByCompanyIdQuery,
  useGetEmployeesByCompanyIdQuery,
  useEditEmployeeMutation,
  useGetProductsByCompanyIdQuery,
  useDeleteCompanyMutation,
  useDeleteEmployeeMutation,
  useGetProductsByEmployeeIdQuery,
  useGetAllEmployeesProductsByCompanyIdQuery,
  useAddCompanyProductsByIdMutation,
  useUpdateCompanyProductsByCompanyIdMutation,
  useDeleteCompanyProductByIdMutation,
  useDeleteEmployeeProductByIdMutation,
  useAddEmployeeProductsMutation,
  useUpdateEmployeeProductsByCompanyIdMutation,
  useSendEmailMutation,
  useGetAllCompaniesDataCountQuery,
} = AdminCreateCompanies;
