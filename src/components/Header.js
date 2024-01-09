import React, { useState } from "react";
import { Cart,  Carret, View } from "../assets/images/index.js";
import { useDispatch, useSelector } from "react-redux";
import { userRemove } from "../redux-slice/UserSliceAuth.js";
import {  useNavigate } from "react-router-dom";
import { GrUserAdmin, GrLogout } from "react-icons/gr";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

function Header() {
  const {t}=useTranslation()
  const [dropdown, setDropdown] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const user = useSelector((auth) => auth.authUser.user);

  const userName = user?.name;

  let userRole = () => {
    switch (user?.role) {
      case "manager":
        return "managerEmail";
      case "admin":
        return "adminEmail";

      case "employee":
        return "employeeEmail";

      default:
        return "null";
    }
  };

  const signout = () => {
    dispatch(userRemove());
    navigate("/login?role=manager");
  };

  useEffect(() => {
    let email = user?.result[userRole()];
    setUserEmail(email);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full flex items-center justify-between bg-black text-white py-3 px-5 z-50">
      <div className="relative flex items-center lg:w-[35%] justify-between">
        <div className="flex justify-center items-center">
          <div className="bg-white rounded-lg ">
            <img src="/favicon-32x32.png" alt="logo" className="text-white" />
          </div>
          <div className="flex flex-col ml-1.5 justify-center items-start">
            <h1 className="text-base font-bold leading-3">
             Klick77
            </h1>
            {/* <p className="text-xs mt-1">{t("A platform to sell anything.")}</p>*/}
          </div>
        </div>
        <a href="https://www.stick77.lu" target="_blank" rel="noopener noreferrer">
  <div className="hidden lg:flex items-center cursor-pointer">
    <img src={View} alt="view site" className="h-6 mr-1 -scale-x-[1]" />
    <h1>{t("View Site")}</h1>
  </div>
</a>

      </div>
      <div className="relative">
        <div className="relative flex items-center cursor-pointer">
          <button
            onClick={() => setDropdown(!dropdown)}
            className="flex items-center focus:outline-none"
          >
            <GrUserAdmin className="h-5 w-5 text-[#9B9B9B]" />
            <h1 className="text-lg">{user?.role === "admin" ? "Admin" : userName}</h1>
            <img src={Carret} alt="carret" className="ml-2 mt-1" />
          </button>
          {dropdown === true ? (
            <div className="absolute top-8 right-0 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow mt-2.5 transition-all duration-500 ease-out">
              <ul className="py-1 px-1 text-sm">
                <li className="flex items-center px-4 py-2 rounded-md hover:bg-[#F3F4F6]">
                  <a className="flex items-center justify-between" href="#">
                    <div>
                      <GrUserAdmin className="h-5 w-5 text-[#9B9B9B]" />
                    </div>
                    <div className="flex flex-col ml-2">
                      <span className="text-xs font-semibold text-black">
                        {userName}
                      </span>
                      <span className="text-xs text-[#9B9B9B]">{userEmail}</span>
                    </div>
                  </a>
                </li>
                <li
                  onClick={() => {
                    signout();
                  }}
                  className="flex items-center px-4 py-2 rounded-md text-[#9B9B9B] hover:bg-[#fd4444] hover:text-white"
                >
                  <a href="#" className="text-sm flex items-center w-full">
                    <GrLogout className="h-5 w-5 text-md" />
                    <span className="ml-3">{t("Sign out")}</span>
                  </a>
                </li>
              </ul>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
