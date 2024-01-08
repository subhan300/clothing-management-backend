import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  useGetBudgetRequestQuery,
  useActionBudgetRequestMutation,
} from "../../apis/companyManager/index";
import Table from "../../components/table/Table";
import { globalFunctions } from "../../global-functions/GlobalFunctions";
import { tableStructureData } from "../../utils/TableStructureData";

import { showPopup, errorPopup } from "../../redux-slice/UserSliceAuth";

import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Spin } from "antd";
import { I18nContext } from "../../translation-wrapper/I8nProvider";

const BudgetRequestTab = () => {
  const { t } = useTranslation();
  const { selectedLanguage } = useContext(I18nContext)
  const { data, error, isLoading, refetch } = useGetBudgetRequestQuery();
  const [actionBudgetRequest, response] = useActionBudgetRequestMutation();
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const [inputBudget, setInputBudget] = useState(0);
 const [triggerState,setTriggerState]=useState(false)
  const [inputSelectedResult, setInputSelectedResult] = useState("pending");
  const [budgetDecisionState, setBudgetDescisionState] = useState(0);
  const updatedInput = (selectedInput) => {
    setInputBudget(selectedInput.value);
  };
  const getAdminReduxStoreData = useSelector((val) => val.admin);
  const addItem = (row) => {
    if (budgetDecisionState != "0") {
      let budgetRequestActionData = {
        requestId: row.id,
        employeeId: row.employeeId,
        approvedAmount: globalFunctions.convertToRegularNumber(inputBudget),
        status: budgetDecisionState,
        language:selectedLanguage 
      };

      actionBudgetRequest(budgetRequestActionData)
        .unwrap()
        .then((res) => {
          dispatch(
            showPopup({
              state: true,
              message: `${
                budgetDecisionState == 1
                  ? t("Budget Request Accepted")
                  : t("Budget Request Rejected")
              } `,
            })
          );
        })
        .catch((error) => {
          dispatch(
            errorPopup({ state: true, message: t("Try again or refresh page") })
          );
        });
    } else {
      dispatch(errorPopup({ state: true, message: t("Approve Or Reject") }));
    }
  };

  const refresh = async() => {
    const dataRefetch= await  refetch();
      statesUpdates(dataRefetch.data)
      setTriggerState(!triggerState)
      dispatch(showPopup({ state: true, message: t("Latest Data is Updated") }));
    }

  const budgetDecisionF = (value, row) => {
    let status;
    if (value == 1) {
      status = t("approved");
    } else {
      status = t("rejected");
    }
    row.status = status;
    let data = [...tableData];
    let filterData = data.filter((val) => val.id != row.id);
    let tableDataConvert = [];

    setTableData([row, ...filterData].sort((a, b) => a.SNO - b.SNO));
    setBudgetDescisionState(value);
  };
 const statesUpdates=(data)=>{
 
  let tableDataConvert =
        globalFunctions.budgetRequestTableDataFormatConverter(data,t);

      setTableData(tableDataConvert);
      tableDataConvert.map((val) => {
        setInputSelectedResult(val.select.result);
      });
 }
  useEffect(() => {
    if (data != undefined && data.length != 0) {
      let tableDataConvert =
        globalFunctions.budgetRequestTableDataFormatConverter(data,t);

      setTableData(tableDataConvert);
      tableDataConvert.map((val) => {
        setInputSelectedResult(val.select.result);
      });
    } else {
      setTableData([]);
    }
  }, [data,]);
  return (
    <div>
      <Spin spinning={isLoading || response.isLoading}>

      <Table
        tableData={tableData}
        setTableData={setTableData}
        columns={tableStructureData.budgetRequestColumns}
        tableTitle={t("Budget Requests")}
        inputBudget={inputBudget}
        setInputBudget={setInputBudget}
        inputSelectedResult={inputSelectedResult}
        setInputSelectedResult={setInputSelectedResult}
        updatedInput={updatedInput}
        addItem={addItem}
        budgetDecisionF={budgetDecisionF}
        refresh={refresh}
        hideCounter={true}
        budgetStatus={getAdminReduxStoreData.companySetting.budgetStatus}
        pricingStatus={getAdminReduxStoreData.companySetting.pricingStatus}
        triggerState={triggerState}
        setTriggerState={setTriggerState}
        // inputBudgetRequest={true}
        // updateBudgetF={budgetDecisionF}
      />
      </Spin>
      
    </div>
  );
};

export default BudgetRequestTab;
