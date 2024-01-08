import React from "react";
import "./groupButton.css";
import { useTranslation } from "react-i18next";

export default function GroupButton({ budgetDecisionF, i, row }) {
  const {t}=useTranslation()
  const onChangeInput = (e, row) => {
   
    budgetDecisionF(e.target.value, row);
  };

  const radioIdApprove = `approveAll_${i}`;
  const radioIdDeny = `denyAll_${i}`;

  return (
    <div className="radio-toolbar w-190">
      <input
        type="radio"
        id={radioIdApprove}
        value={1}
        name={`allReqs_${i}`}
        onClick={(e) => onChangeInput(e, row)}
      />
      <label className="approve" htmlFor={radioIdApprove}>
        <i className="fas fa-check-circle"></i> {t("Approve")}
      </label>

      <input
        type="radio"
        id={radioIdDeny}
        value={2}
        name={`allReqs_${i}`}
        onClick={(e) => onChangeInput(e, row)}
      />
      <label className="reject" htmlFor={radioIdDeny}>
        <i className="fas fa-times-circle"></i> {t("Reject")}
      </label>
    </div>
  );
}
