import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { adminEditGlobalFunctions } from "../../global-functions/adminEditGlobalFunction";
import { globalFunctions } from "../../global-functions/GlobalFunctions";
import { Select } from 'antd';
function EditableInput({
  id,
  value,
  updatedInput,
  updateBudgetF,
  showBtn,
  inputBudgetRequest,
  requestAmount,
  refresh,
  triggerState
}) {
  const {t}=useTranslation()
  const [edit, setEdit] = useState({ value: value, inputId: id });

  const setInputFunc = (val) => {
    setEdit((prev) => ({ ...prev, value: val }));
  };

  const updateOnClick = () => {
   if(inputBudgetRequest==false || inputBudgetRequest==undefined){
     setInputFunc(0);
   }
    updateBudgetF();
  };
  useEffect(() => {
 
    updatedInput(edit);
  }, [edit]);

  useEffect(() => {
   
    if (value != undefined && id != undefined) {
      setEdit({ value: value, inputId: id });
    }
  }, [value]);
  useEffect(() => {
    
    if (value != undefined && id != undefined) {
      setEdit({ value: value, inputId: id });
    }
  }, [triggerState]);

 
  return (
    <div className="w-20">

     {/* <div className="flex flex-between align-center items-center block w-full p-2   text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"> */}
     
     {/* <input
        style={{border:"none",width:"80%"}}
       
        className="bg-gray-50"
        
        min={0} 
        onInput={adminEditGlobalFunctions.restrictInputToPositiveIntegers}
        value={globalFunctions.formatPrice(edit.value)}
        onChange={(e) => {
          let value = parseFloat(e.target.value.replace(',', '.'));
          setInputFunc(value);
        }}
      /> */}

     {/* </div> */}
     <Select
      defaultValue={globalFunctions.formatPrice(edit.value)}

      style={{
        // width:105,
        fontWeight:"bold",
        color:"blue"
      }}
      // onChange={handleChange}
      value={globalFunctions.formatPrice(edit.value)}
      onChange={(e) => {
     
        // let value = parseFloat(e.replace(',', '.'));
        setInputFunc(e);
      }}
      options={requestAmount?globalFunctions.budgetRequestOptions:globalFunctions.budgetOptions}
    />
      {showBtn || inputBudgetRequest ? (
        <button
          className="mt-3 flex justify-content-center mx-auto bg-black text-white rounded-md text-xs p-1"
          onClick={() => {
            updateOnClick();
          }}
        >
          {t("Update")}
        </button>
      ) : (
        ""
      )}
    </div>
  );
}

export default EditableInput;
