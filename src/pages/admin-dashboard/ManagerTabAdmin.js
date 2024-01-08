import React, { useEffect, useState } from "react";
import { useGetAllManagersQuery, useGetCompanyDetailsQuery } from "../../apis/companyManager/index";
import Table from "../../components/table/Table";
import { globalFunctions } from "../../global-functions/GlobalFunctions";
import { tableStructureData } from "../../utils/TableStructureData";
import { useDispatch } from "react-redux";
import { showPopup } from "../../redux-slice/UserSliceAuth";
import { companySettingsAction } from "../../redux-slice/AdminSliceReducer";
import { useTranslation } from "react-i18next";

function ManagerTabAdmin() {
  const {t}=useTranslation();
  const { data, error, isLoading, refetch } = useGetAllManagersQuery();
  const companyApiRes =useGetCompanyDetailsQuery();
  
  const dispatch = useDispatch();

  const [tableData, setTableData] = useState([]);

  const refresh = () => {
    refetch();
    dispatch(showPopup({ state: true, message: t("Latest Data is Updated") }));
  };

  useEffect(() => {
   
    if (data != undefined && data.length != 0) {
      let tableDataConvert =
        globalFunctions.managerTableDataFormatConverter(data);
      
      setTableData(tableDataConvert);
    }
  }, [data, isLoading]);
 useEffect(()=>{
   if(companyApiRes.data){
    dispatch(
      companySettingsAction({
        pricingStatus: companyApiRes.data.pricingStatus,
        budgetStatus: companyApiRes.data.budgetStatus,
        companyId: companyApiRes.data._id,
      })
    );
   }
 },[companyApiRes.isLoading]);

  return (
    <div>
      <Table
        tableData={tableData}
        setTableData={setTableData}
        columns={tableStructureData.managerColumns}
        tableTitle={t("Manager Details")}
        refresh={refresh}
      />
    </div>
  );
}

export default ManagerTabAdmin;
