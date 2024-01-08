import React, { useState, useEffect } from "react";

function EditableInput({ id, value, updatedInput,updateBudgetF }) {
  const [edit, setEdit] = useState({ value: value, inputId: id });

  const setInputFunc = (val) => {
    setEdit((prev) => ({ ...prev, value: val }));
  };
  useEffect(() => {
    updatedInput(edit);
  }, [edit]);
  return (
    <div >
      <input
        type="number"
        className="block w-full p-2  text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500"
        value={edit.value}

        onChange={(e) => {
          setInputFunc(e.target.value);
        }}
      />
      <button className="mt-3 flex justify-content-center mx-auto bg-black text-white rounded-md text-xs p-1" onClick={()=>{updateBudgetF()}}>Update Budget</button>
    </div>
  );
}

export default EditableInput;
