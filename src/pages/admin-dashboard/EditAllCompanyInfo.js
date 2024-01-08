import React from "react";
import ManagerEditComponent from "../../edit-components/ManagerEditComponent";
import { useSelector } from "react-redux";
import { Button, Spin } from "antd";
import CompanyIndividualEditComponent from "../../edit-components/CompanyIndividualEdit";
import EmployeeEditComponent from "../../edit-components/EmployeeEditComponent";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function EditAllCompanyInfo() {
  const {t}=useTranslation();
  const selectedCompanyState = useSelector((state) => state.admin.company);
 
  const companyIndividualEditProps = {
    company: selectedCompanyState,
    selected: { record: { ...selectedCompanyState } },
  };

  const EmployeeEditComponentProps = {
    selected: { record: { ...selectedCompanyState } },
  };
  const managerProps = {
    selected: { record: { ...selectedCompanyState } },
  };
const navigate=useNavigate()
  return (
    <div >
       <div className="flex" style={{justifyContent:"space-between"}}>
       <Button
          onClick={() => {
            navigate("/admin/all-companies")
            localStorage.removeItem("selectedCompany");
          }}
        >
          {t("Leave Editing")}
        </Button>
        <div
          style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}
        >
<p style={{ color: "rgba(128, 128, 128, 0.8)", marginRight: "1rem" }}>{t("Refresh for latest data!")}</p>
        <button
          style={{ display: "flex", justifyContent: "flex-end" }}
          onClick={() => {
            // refresh(true);
            window.location.reload();
          }}
          className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1 ml-2"
        >
          <span className="material-symbols-rounded text-base">refresh</span>
        </button>
        </div>
       </div>

      {selectedCompanyState._id ? (
        <>
          <CompanyIndividualEditComponent {...companyIndividualEditProps} />
          <ManagerEditComponent {...managerProps} />
          <EmployeeEditComponent {...EmployeeEditComponentProps} />:
        </>
      ) : (
        <Spin
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "auto auto",
            alignItems: "center",
            marginTop: "8rem",
          }}
          spinning={true}
        />
      )}
    </div>
  );
}
