import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetTotalManagersLengthQuery,
  useGetTotalEmployeesLengthbyCompanyIdQuery,
  useGetTotalOrdersLengthbyCompanyIdQuery,
} from "../../apis/companyManager/index";
import { AiOutlineShoppingCart, AiOutlineTeam, AiOutlineFileText } from "react-icons/ai";
import { useTranslation } from "react-i18next";

function DashboardTab() {
  const {t}=useTranslation();
  let obj = {};
  let { data, error, isLoading } = useGetTotalOrdersLengthbyCompanyIdQuery();
  let data2 = useGetTotalEmployeesLengthbyCompanyIdQuery();

  const user = useSelector((auth) => auth.authUser.user);
  const userName = user?.result?.name;

  const [datas, setDatas] = useState([
    {
      icon: <AiOutlineFileText />,
      tileTitle: t("Total Orders"),
      tileQty: 0,
    },
    {
      icon: <AiOutlineTeam />,
      tileTitle: t("My Workers"),
      tileQty: 0,
    },
    {
      icon: <AiOutlineShoppingCart />,
      tileTitle: t("Product in Cart"),
      tileQty: 0,
    },
  ]);

  useEffect(() => {
    let getLocalStorageCartData = JSON.parse(localStorage.getItem("addToCart"));
    if (getLocalStorageCartData == null) {
      getLocalStorageCartData = 0;
    }
    if (data && data2.data != undefined) {
      obj.totalOrders = data[0]?.totalOrder ? data[0]?.totalOrder : 0;
      obj.totalEmployees = data2?.data[0]?.totalEmployee
        ? data2.data[0].totalEmployee
        : 0;

      obj.totalItems =
        getLocalStorageCartData.length != undefined
          ? getLocalStorageCartData.length
          : 0;

      setDatas([
        {
          icon: <AiOutlineFileText />,
          tileTitle: t("Total Orders"),
          tileQty: obj.totalOrders,
        },
        {
          icon: <AiOutlineTeam />,
          tileTitle: t("My Workers"),
          tileQty: obj.totalEmployees,
        },
        {
          icon: <AiOutlineShoppingCart />,
          tileTitle: t("Product in Cart"),
          tileQty: obj.totalItems,
        },
      ]);
    }
  }, [isLoading, data2]);

  return (
    <div>
      {/* Header of Order Tab*/}
      <div>
        <div className="flex justify-start items-center">
          <div className="flex relative w-fit">
            <span className="bg-[#FFDB58] w-7 h-7"></span>
            <span className="bg-[#FFDB58] w-3.5 h-3.5 absolute -bottom-3 -right-5 "></span>
          </div>
          <div className="ml-10 flex justify-start items-center">
            <h1 className="text-2xl md:text-4xl font-semibold">
            {t("Good Evening")}, {t(userName)}
            </h1>
          </div>
        </div>
        <p className="mt-2 text-lg md:text-xl font-medium text-gray-500">
        {t("Here is what's happening with your profile today.")}
        </p>
      </div>
      {/* Stats part */}
      <div className="xs:grid sm:grid md:grid-cols-3 xl:grid-cols-4 2xl:flex flex-wrap justify-center my-8">
        {/* card */}
        {datas.map((item, index) => (
          <div
            key={index}
            className="m-2 flex items-center justify-center h-36 rounded-md bg-[#fef9e6] border-2 border-[rgb(247,229,167)] 2xl:min-w-[25rem]"
          >
            <span className="material-symbols-rounded text-6xl text-yellow-500 ">
              {item.icon}
            </span>
            <div className="flex flex-col items-start justify-start ml-3">
              <h1 className="text-lg"> {t(item.tileTitle)} </h1>
              <h1 className="text-4xl font-semibold"> {item.tileQty} </h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardTab;
