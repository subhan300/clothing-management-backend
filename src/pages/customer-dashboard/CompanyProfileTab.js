import React from 'react'
import {
  useGetCompanyDetailsQuery
} from "../../apis/companyManager/index";
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

function CompanyProfileTab() {
  const {t}=useTranslation();
  const { data, error, isLoading } =useGetCompanyDetailsQuery();

const auth=useSelector(state=>state.authUser);
const managerName=auth?.user?.result?.name;
const managerPassword=auth?.user?.result?.managerPassword
  return (
    <div>
     {isLoading || data == undefined?<h1>...loading</h1>: <div className="bg-white text-black shadow-md p-6">
  <div className="flex items-center mb-6">
    <img src={data.companyLogo} alt="Company Logo" className="w-36 mr-2" />
  </div>
  <div className="flex flex-wrap md:grid md:grid-cols-2 gap-4">
    <div>
      <p className="font-medium">{t("Company")}:</p>
      <p>{t(data.companyName)}</p>
    </div>
    <div>
      <p className="font-medium">{t("Telephone")}:</p>
      <p>{t(data.companyPhone)}</p>
    </div>
    <div>
      <p className="font-medium">{t("Fax")}:</p>
      <p>{t(data.companyFax)}</p>
    </div>
    <div>
      <p className="font-medium">{t("Email")}:</p>
      <p>{t(data.companyEmail)}</p>
    </div>
    <div className="col-span-2">
      <p className="font-medium">{t("Username")}:</p>
      <p>{t(managerName)}</p>
    </div>
    <div className="col-span-2">
      <p className="font-medium">{t("Password")}:</p>
      <p>{t(managerPassword)}</p>
    </div>
  </div>
</div>}

    </div>
  )
}

export default CompanyProfileTab