import React, { useEffect, useState } from "react";
import { useGetEmployeesQuery } from "../../apis/companyManager/index";
import Table from "../../components/table/Table";
import { globalFunctions } from "../../global-functions/GlobalFunctions";
import { tableStructureData } from "../../utils/TableStructureData";
import { useDispatch, useSelector } from "react-redux";
import { showPopup } from "../../redux-slice/UserSliceAuth";
import { useGetEmployeesByCompanyIdQuery } from "../../apis";
import { useTranslation } from "react-i18next";
function EmployeesTab() {
  const {t}=useTranslation()

  const authUser = useSelector((val) => val.authUser.user);
  const getAdminReduxStoreData=useSelector(val=>val.admin)
  // remove below one
  // const { data, error, isLoading ,refetch} = useGetEmployeesQuery();
  const { data, isLoading, refetch,error } = useGetEmployeesByCompanyIdQuery({
    companyId:authUser.result.companyId,
  });
  const dispatch=useDispatch();
  
  const [tableData, setTableData] = useState([]);

  const refresh=()=>{
    refetch();
    dispatch(showPopup({ state: true, message: t("Latest Data is Updated") }));
   }
  useEffect(() => {
    
      if (data != undefined && data.length !=0) {
        let tableDataConvert = globalFunctions.employeeTableDataFormatConverter(data);
       
        setTableData(tableDataConvert);
      }
  }, [data,isLoading]);

  return (
    <div>
      <Table
        tableData={tableData}
        setTableData={setTableData}
        columns={tableStructureData.employeeColumns(getAdminReduxStoreData.companySetting.budgetStatus)}
        pricingStatus={getAdminReduxStoreData.companySetting.pricingStatus}
        budgetStatus={getAdminReduxStoreData.companySetting.budgetStatus}
        tableTitle="Employee Details"
        refresh={refresh}
        pagination={true}
      />
    </div>
  );
}

export default EmployeesTab;
