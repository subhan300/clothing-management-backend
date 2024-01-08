import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  FaUsers,
  FaUsersCog,
  FaShoppingCart,
  FaRegBuilding,
  FaClock,
  FaImage,
} from "react-icons/fa";
import { Card, Col, Row, Spin } from "antd";
import { useTranslation } from "react-i18next";
import {
  useGetAllCompaniesDataCountQuery,

} from "../../apis";

const { Meta } = Card;

function DashboardTab() {
  const { t } = useTranslation();
  const user = useSelector((auth) => auth.authUser.user);

  const userName = user?.result?.name;
 
  const [data, setData] = useState([

    {
      icon: <FaRegBuilding />,

      tileTitle: t("Total Companies"),
      tileQty: 0,
    },
    {
      icon: <FaUsersCog />,
      tileTitle: t("Companies Managers"),
      tileQty: 0,
    },
    {
      icon: <FaUsers />,
      tileTitle: t("Companies Employees"),
      tileQty: 0,
    },
    {
      icon: <FaShoppingCart />,

      tileTitle: t("Total Orders"),
      tileQty: 0,
    },
    {
      icon: <FaImage />,

      tileTitle: t("Total Product Images"),
      tileQty: 0,
    },
  ]);
  const [totalDataCount, setTotalDataCount] = useState(null);
  const [loadingState, setLoading] = useState(false);

  const [greeting, setGreeting] = useState(" ");

  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return t("Good Morning");
    } else if (currentHour >= 12 && currentHour < 18) {
      return t("Good Afternoon");
    } else {
      return t("Good Evening");
    }
  };



  const [time, setTime] = useState({
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
  });
  const adminTotalDataCountQuery = useGetAllCompaniesDataCountQuery();


  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime({
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString(),
      });
      setGreeting(getGreeting());
    });
    return () => clearInterval(timer);
  }, []);


  const apiCall = async () => {
    await adminTotalDataCountQuery.refetch();
  }
  useEffect(() => {
    apiCall()
    if (adminTotalDataCountQuery.data) {
      setTotalDataCount(adminTotalDataCountQuery.data.totalData);
    }
  }, [adminTotalDataCountQuery.isLoading]);
 
  useEffect(() => {
    if (totalDataCount) {
      const updatedData = [
        {
          icon: <FaRegBuilding />,
          tileTitle: t("Total Companies"),
          tileQty: totalDataCount.totalCompanies,
        },
        {
          icon: <FaUsersCog />,
          tileTitle: t("Companies Managers"),
          tileQty: totalDataCount.totalManagers,
        },
        {
          icon: <FaUsers />,
          tileTitle: t("Companies Employees"),
          tileQty: totalDataCount.totalEmployees,
        },
        {
          icon: <FaShoppingCart />,
          tileTitle: t("Total Orders"),
          tileQty: totalDataCount.totalOrders,
        },
        {
          icon: <FaImage />,
          tileTitle: t("Total Product Images"),
          tileQty: totalDataCount.totalAllProducts,
        },
      ];
      setData(updatedData);
    }
  }, [totalDataCount]);
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
              {greeting}{greeting !== " " && ","} {userName??"Sebastian"}
            </h1>
          </div>
        </div>
        <p className="mt-2 text-lg md:text-xl font-medium text-gray-500">
          {t("Here is what's happening with your profile today.")}
        </p>
      </div>
      {/* Stats part */}
      <div className="xs:grid sm:grid md:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 2xl:flex flex-wrap justify-center my-8">
        {/* card */}
        {loadingState ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "5rem",
            }}
          >
            <Spin spinning={true} />
          </div>
        ) : (
          <>
            {data.map((val) => (
              <div className="m-2 flex items-center justify-center h-36 rounded-md bg-[#fef9e6] border-2 border-[rgb(247,229,167)] 2xl:min-w-[25rem] transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-85 shadow-md">
                <span className="material-symbols-rounded  text-3xl md:text-2xl  lg:text-5xl text-yellow-500">
                  {val?.icon}
                </span>
                <div className="flex flex-col items-start justify-start ml-3">
                  <h1 className="text-sm   font-medium" style={{fontSize:"1.2vw"}}>
                    {val?.tileTitle}
                  </h1>
                  <h1 className="text-2xl md:text-3xl font-semibold">
                    {val?.tileQty}
                  </h1>
                </div>
              </div>
            ))}

            <div className="m-2 flex items-center justify-center h-36 rounded-md bg-[#fef9e6] border-2 border-[rgb(247,229,167)] 2xl:min-w-[25rem] transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-85 shadow-md">
              <span className="material-symbols-rounded text-6xl text-yellow-500">
                <FaClock />
              </span>
              <div className="flex flex-col items-start justify-start ml-3">
                <h2 className="text-sm md:text-lg font-semibold">
                  {time.date}
                </h2>
                <h2 className="text-sm md:text-lg font-semibold">
                  {time.time}
                </h2>
              </div>
            </div>

          </>
        )}
      </div>
    </div>
  );
}

export default DashboardTab;
