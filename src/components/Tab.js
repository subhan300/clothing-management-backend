import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BsFillGridFill,
  BsClipboardDataFill,
  BsCartPlusFill,
  BsPeopleFill,
  BsInfoSquare,
  BsCurrencyExchange,
  BsArchiveFill,
} from "react-icons/bs";
import { uid } from "uid";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

function Tab({ element }) {
  const { t } = useTranslation();
  const getAdminReduxStoreData = useSelector((val) => val.admin);
  const OriginalData = [
    {
      id: 1,
      icon: <BsFillGridFill />,
      label: t("Dashboard"),
      path: "",
    },
    {
      id: 2,
      icon: <BsClipboardDataFill />,
      label: t("Order Now"),
      path: "order-tab",
    },
    {
      id: 3,
      icon: <BsCartPlusFill />,
      label: t("Cart"),
      path: "cart",
    },
    {
      id: 4,
      icon: <BsPeopleFill />,
      label: t("Employees"),
      path: "employee",
    },
    {
      id: 5,
      icon: <BsInfoSquare />,
      label: t("Company Profile Detail"),
      path: "company-profile",
    },
     {
      id: 6,
      icon: <BsCurrencyExchange />,
      label: t("Request for Budget"),
      path: "budget-request",
    },
    
    {
      id: 7,
      icon: <BsArchiveFill />,
      label: t("Past Orders"),
      path: "past-order",
    },
  ];
  let data=[];
  if(!getAdminReduxStoreData.companySetting.budgetStatus){
    OriginalData.splice(5,1)
    data=OriginalData
  }else{
    data=[...OriginalData]
  }
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div>
      <aside className="fixed top-14 left-0 z-40 whitespace-nowrap w-14 hover:w-64 h-screen transition-all duration-500 ease-in-out transform ">
        <div className="h-full pl-3 py-4 overflow-y-auto bg-[#dfdfdf]">
          <ul className="space-y-2 mt-7">
            {/* Tabs Labels*/}
            {data.map((item, index) => (
              <Link key={uid()} to={item.path}>
                <li
                  className={
                    activeTab === item.id
                      ? `mb-3 border-r-4 border-black`
                      : `mb-3`
                  }
                >
                  <span
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100 cursor-pointer`}
                  >
                    <span className="material-symbols-rounded w-6 h-6 text-gray-900 transition duration-75 ">
                      {item.icon}
                    </span>
                    <span className="ml-3">{item.label}</span>
                  </span>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </aside>
      <main className="ml-14 p-10 h-[91.5vh] top-[56px] relative">
        {element}
      </main>
    </div>
  );
}

export default Tab;
