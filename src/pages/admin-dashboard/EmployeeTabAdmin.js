import React, { useEffect, useState } from "react";
import {  useGetAllEmployeesQuery, useGetCompanyDetailsQuery } from "../../apis/companyManager/index";
import Table from "../../components/table/Table";
import { globalFunctions } from "../../global-functions/GlobalFunctions";
import { tableStructureData } from "../../utils/TableStructureData";
import { useDispatch, useSelector } from "react-redux";
import { showPopup } from "../../redux-slice/UserSliceAuth";
import { companySettingsAction } from "../../redux-slice/AdminSliceReducer";
import { useTranslation } from "react-i18next";
function EmployeesTab() {
  const {t}=useTranslation();
  const { data, error, isLoading ,refetch} =  useGetAllEmployeesQuery();
  const dispatch=useDispatch();
  const getAdminReduxStoreData=useSelector(val=>val.admin)
  
  const [tableData, setTableData] = useState([]);

  
  const refresh = () => {
    refetch();
    dispatch(showPopup({ state: true, message: t("Latest Data is Updated") }));
  };
  useEffect(() => {
     
      if (data != undefined && data.length !=0) {
        let tableDataConvert = globalFunctions.employeeTableAdminDataFormatConverter(data);
        setTableData(tableDataConvert);
      }
  }, [data,isLoading]);

  return (
    <div>
      <Table
        tableData={tableData}
        setTableData={setTableData}
        columns={tableStructureData.employeeColumns(getAdminReduxStoreData.companySetting.budgetStatus)}
        tableTitle="Employee Details"
        refresh={refresh}
        
      />
    </div>
  );
}

export default EmployeesTab;
