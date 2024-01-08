import { Button, Input, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { adminEditGlobalFunctions } from "../global-functions/adminEditGlobalFunction";
import { useDeleteCompanyMutation, useEditCompanyMutation } from "../apis";
import { errorPopup, showPopup } from "../redux-slice/UserSliceAuth";
import { useDispatch, useSelector } from "react-redux";
import useCustomGenerateUrls from "../global-functions/useUpdateImageCustomHook";
import useGlobalApi from "../global-functions/useGlobalApi";
import { globalFunctions } from "../global-functions/GlobalFunctions";
import debounce from "lodash.debounce";
import { selectedCompany } from "../redux-slice/AdminSliceReducer";
import { Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
const { Search } = Input;
function CompanyEditComponent({
  data,
  company,
  setCompany,
  error,
  isLoading,
  refetch,
  type,
  rowSelection,
  selected,
  setSelected,
  deleteCompany,
  setCallApiState,
  callApiState
}) {
  const dispatch = useDispatch();
  const {t}=useTranslation();
  const [editingRow, setEditingRow] = useState({
    state: false,
    record: {},
    updatedValues: {},
  });
  const [editCompany, response] = useEditCompanyMutation();
  const selectedCompanyState = useSelector((state) => state.admin.company);

  const handleSave = async () => {
    let values = { ...editingRow.updatedValues };

    editCompany({ payload: values, id: editingRow.record._id })
      .unwrap()
      .then((res) => {
        const removeCompany = company.filter(
          (val) => val._id !== editingRow.record._id
        );

        const sortedData = adminEditGlobalFunctions.sortData(
          [...removeCompany, { ...res.result, SNO: editingRow.record.SNO }],
          "SNO"
        );

        setCompany((prev) => sortedData);
        dispatch(showPopup({ state: true, message: t("company record updated") }));
      })
      .catch((error) => {
        dispatch(
          errorPopup({
            state: true,
            message: `company edit  not due to ${error}`,
          })
        );
      });
  };
  const onSearch = debounce((values) => {
    const searchResult = globalFunctions.searchContacts(data, values);
    setCompany(searchResult);
  },100)
  const handleEdit = (key, val, selectedRecord) => {
    const editRecord = { [key]: val };
    const updatedRecord = { ...editingRow.record, [key]: val };

    setEditingRow((prev) => ({
      ...prev,
      state: true,
      updatedValues: editRecord,
      record: updatedRecord,
    }));
    setCompanyUpdatedData(updatedRecord, selectedRecord);
  };
  
  const setCompanyUpdatedData = (updatedRecord, selectedRecord) => {
    let filterCompany = company.filter(
      (val) => val._id === selectedRecord._id
    )[0];
    filterCompany = { ...updatedRecord };
    const removeCompany = company.filter(
      (val) => val._id !== selectedRecord._id
    );
    const sordtedData = adminEditGlobalFunctions.sortData(
      [...removeCompany, filterCompany],
      "SNO"
    );
    setCompany(sordtedData);
  };
  const navigate=useNavigate();
const selectedCompanySet=(record)=>{
  dispatch(selectedCompany(record));
  localStorage.setItem("selectedCompany",JSON.stringify(record));
  navigate("/admin/all-companies/edit");
}
useEffect(()=>{
  localStorage.removeItem("selectedCompany");
  setCallApiState(!callApiState)
},[])
  return (
    <div >
       <div
            className="mb-6 mt-3 flex flex-end"
            style={{
              width: "100%",
              display:"flex",
              justifyContent:"flex-end"
            }}
          >
            <Search
              size="large"
              style={{
                width: 400,
              }}
              placeholder={t("search product")}
              onSearch={onSearch}
              onChange={(e) => {
                onSearch(e.target.value);
              }}
            />
          </div>
      <Spin spinning={response.isLoading || isLoading} error={error}>
       
        <Table
          columns={adminEditGlobalFunctions.companyColumns(
            handleEdit,
            handleSave,
            editingRow,
            setEditingRow,
            setSelected,
            false,
            "",
            "",
            "",
            deleteCompany,
            selectedCompanySet,
            t
          )}
          dataSource={company}
          pagination={{
            pageSize: 15,
          }}
          rowKey={(record) => {
            return record._id;
          }}
          
          className="mt-2"
        />
      </Spin>
     
    </div>
  );
}

export default CompanyEditComponent;
