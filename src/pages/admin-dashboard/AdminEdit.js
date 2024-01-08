import React, { useEffect, useState } from "react";

import CompanyEditComponent from "../../edit-components/CompanyEditComponent";
import { useDeleteCompanyMutation, useGetAllCompaniesQuery } from "../../apis";
import useGlobalApi from "../../global-functions/useGlobalApi";
import { useDispatch } from "react-redux";
import { errorPopup, showPopup } from "../../redux-slice/UserSliceAuth";
import { useTranslation } from "react-i18next";

function AdminEdit() {
  const {t}=useTranslation();
  const { data, error, isLoading, refetch } = useGetAllCompaniesQuery();
  const [company, setCompany] = useState();
  const [callApiState,setCallApiState]=useState(false)
  const [selected, setSelected] = useState({ record: {}, isSelected: false });
  const [deleteCompanyApi, deleteResponse] = useDeleteCompanyMutation();

  const dispatch = useDispatch();
  const refresh = async (isPopoup) => {
    const data = await refetch();

    if (data?.data) {
      const addDataSNO = data?.data.map((val, i) => ({ ...val, SNO: i + 1 }));
      setCompany(addDataSNO);
    }
   if(isPopoup){
    data.isSuccess
    ? dispatch(showPopup({ state: true, message: t("Latest Data is Updated") }))
    : dispatch(errorPopup({ state: true, message: t("failed to update") }));
   }
  };

  const deleteCompany = async (id) => {
    const deleteRes = await useGlobalApi.postApi(
      deleteCompanyApi,
      "",
      id,
      t("The company was successfully deleted."),
      t("The company could not be deleted!"),
      dispatch
    );

    if (deleteRes) {
      const dataRes = await refetch();
      const filterData = data.filter((val) => val._id !== id);
      setCompany(filterData);
    }
  };

  const companyEditProps = {
    data,
    company,
    error,
    isLoading,
    refetch,
    type: "all",
    setCompany,
    selected,
    setSelected,
    deleteCompany,
    setCallApiState,
    callApiState
  };

  useEffect(() => {
    if (data) {
      const addDataSNO = data.map((val, i) => ({ ...val, SNO: i + 1 }));
      setCompany(addDataSNO);
    }
  }, [isLoading,]);
useEffect(()=>{
 refresh(false)
},[callApiState])
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          {" "}
          <h1 className="text-2xl font-semibold">{t("All Companies/Clients")}</h1>
        </div>

        <button
          style={{ display: "flex", justifyContent: "flex-end" }}
          onClick={() => {
            refresh(true);
          }}
          className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1 ml-2"
        >
          <span className="material-symbols-rounded text-base">refresh</span>
        </button>
      </div>

    <CompanyEditComponent {...companyEditProps} />
    </div>
  );
}

export default AdminEdit;
