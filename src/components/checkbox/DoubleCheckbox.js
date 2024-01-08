import React from "react";

function DoubleCheckbox({ budgetDecisionF, i,row }) {
  const onChangeInput = (e) => {
    budgetDecisionF(e.target.value,row);
  };

  return (
    <div
      scope="row"
      className="py-6 w-170 font-medium text-gray-900 whitespace-nowrap"
      style={{width:"120px"}}
    >
      <label className="pl-2" htmlFor={`A-${i}`}>
        A
      </label>
      <input
        className="px-2"
        value={1}
        type="radio"
        id={`A-${i}`}
        name={"budgetDecision"}
        onClick={(e) => {
          onChangeInput(e);
        }}
      ></input>
      <label className="pl-4" htmlFor={`R-${i}`}>
        R
      </label>
      <input
        value={2}
        id={`R-${i}`}
        name={"budgetDecision"}
        type="radio"
        onClick={(e) => {
          onChangeInput(e);
        }}
      ></input>
    </div>
  );
}

export default DoubleCheckbox;
