import React, { useState, useEffect } from "react";
import { useGetAllOrdersQuery, useGetOrdersQuery} from "../../apis/companyManager/index";
import Table from "../../components/table/Table";
import { globalFunctions } from "../../global-functions/GlobalFunctions";
import { tableStructureData } from "../../utils/TableStructureData";
import { useDispatch, useSelector } from "react-redux";
import { showPopup } from "../../redux-slice/UserSliceAuth";
import Drawer from "../../components/drawer/Drawer";
import { useTranslation } from "react-i18next";
function PastOrderTab() {
  const {t}=useTranslation()

  let { data, error, isLoading ,refetch} = useGetOrdersQuery();
  const dispatch=useDispatch();
  const getAdminReduxStoreData = useSelector((val) => val.admin);

  const [showDrawer, setShowDrawer] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedRow,setSelectedRow]=useState({orderInfo:[]});

  
  const refresh = () => {
    refetch();
    dispatch(showPopup({ state: true, message: t("Latest Data is Updated") }));
  };
  const openDrawer = (row) => {
    setShowDrawer(!showDrawer);
    setSelectedRow(row);
  };
  function sortByDateAscending(array) {
   
    array.sort(function(a, b) {
      const numA = parseInt(a.SNO.substring(4));
      const numB = parseInt(b.SNO.substring(4));
      return numB - numA;
      
    });
    return array;
  }
  
  useEffect(() => {
    if (data != undefined && data?.length !=0) {
      
      let tableDataConvert =
        globalFunctions.orderTableDataAdminFormatConverter(data[0].orders);
      tableDataConvert= sortByDateAscending(tableDataConvert)
   
      setTableData(tableDataConvert);
    }
  }, [data,isLoading]);

  return (
    <div>
      <Table
        tableData={tableData}
        setTableData={setTableData}
        columns={tableStructureData.adminOrderColumns(getAdminReduxStoreData.companySetting.pricingStatus)}
        tableTitle={t("Order Details")}
        hideButtons={false}
        refresh={refresh}
        openDrawer={openDrawer}
        pricingStatus={getAdminReduxStoreData.companySetting.pricingStatus}

      ></Table>

        <Drawer
        show={showDrawer}
        setShow={setShowDrawer}
        selectedRow={selectedRow}
        pricingStatus={getAdminReduxStoreData.companySetting.pricingStatus}
      />
    </div>
  );
}

export default PastOrderTab;
