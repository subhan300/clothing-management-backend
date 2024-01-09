import React, { useState, useEffect } from "react";
import { login, logo } from "../../assets/images";
import { SignIn } from "../../redux-slice/middleware/authMiddleware";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import {
  errorRemove,
  showPopup,
  errorPopup,
} from "../../redux-slice/UserSliceAuth";
import { Input, Button } from "antd"; // <-- Added Button
import { useTranslation } from "react-i18next";

function Login() {
  const { t } = useTranslation();
  const [activeRole, setActiveRole] = useState("manager"); // <-- Added this

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("manager");
  let url =
    process.env.REACT_APP_LOCAL || "https://clothing-management-frontend.vercel.app";

  const auth = useSelector((state) => state.authUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onSubmit = (e) => {
    let user;
    e.preventDefault();
    if (email != "" && password != "") {
      if (role == "manager" || role == "manager#") {
        user = {
          managerEmail: email,
          managerPassword: password,
        };
      } else if (role == "employee") {
        user = {
          employeeEmail: email,
          employeePassword: password,
        };
      } else if (role == "admin") {
        user = {
          adminEmail: email,
          adminPassword: password,
        };
      } else {
        user = "404";
      }
      if (user != "404") {
        dispatch(SignIn({ user, navigate, role,t }));
      } else {
        alert("role is no valid", role);
      }
    }
  };
  useEffect(() => {
    dispatch(errorRemove());
    const getRoleFrombrowserPath = window.location.href.replace(
      `${url}/login?role=`,
      ""
    );
    if (getRoleFrombrowserPath != `${url}/login` || role === "manager") {
      if (
        getRoleFrombrowserPath == "manager" ||
        getRoleFrombrowserPath == "admin" ||
        getRoleFrombrowserPath == "employee"
      ) {
        setRole(getRoleFrombrowserPath);
      }
    }
  }, [window.location.href]);

  const handleRoleClick = (role) => {
    setRole(role);
    setActiveRole(role); // <-- Added this
    navigate(`/login?role=${role}`); // <-- Added this
  };

  const RoleButton = ({ role, activeRole, handleRoleClick, children }) => (
    <button
      style={{
        backgroundColor: activeRole === role ? "#FF781f" : "white",
        color: activeRole === role ? "white" : "black",
        padding: "4px 8px", // Reduced the padding to make the buttons smaller
        borderRadius: "5px",
        margin: "5px",
        border: "none",
        outline: "none",
        cursor: "pointer",
        boxShadow: "1px 2px 5px rgba(0, 0, 0, 0.25)",
        fontSize: "1em", // Reduced the font size to make the text smaller
      }}
      onClick={() => handleRoleClick(role)}
    >
      {children}
    </button>
  );

  return (
    <div>
      <div className="flex col-span-12 h-[100vh] overflow-hidden">
        <div className="hidden lg:flex lg:flex-col lg:col-span-6 h-screen w-[50%] bg-black   items-center justify-center relative">
          <img
            src={login}
            alt=""
            srcset=""
            className="animate__bounceInUp -ml-5 -mt-20"
          />
          <div className="-mt-10 mx-auto w-[80%]">
            <h1 className="text-3xl font-extrabold text-white">
              {t("Our philosophy is simple")}
            </h1>
            <h1 className="text-xl font-semibold text-white">
              {t("Streamline your operations with our solutions.")}
            </h1>
          </div>
          <div className="absolute bottom-[20px] left-[65px]">
            <p className="font-semibold text-white text-sm">
              {t("2023 © Klick77")}
            </p>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 w-[100%] lg:w-[50%] flex justify-center items-center">
          <div className="text-center bg-red- w-[80%] mx-auto">
            <img src={logo} alt="" className="w-44 mx-auto py-5" />
            <h1 className="text-2xl font-semibold">
              {role === "manager"
                ? t("Manager")
                : role == "employee"
                ? t("Employee")
                : role == "admin"
                ? t("Admin")
                : t("Manager")}
              &nbsp;{t("Login")}
            </h1>
            <form
              onSubmit={(e) => {
                onSubmit(e);
              }}
            >
              <div className="animate__bounceInRight max-w-lg lg:max-w-md mt-4 bg-white border-b-4 border-b-black rounded-xl shadow p-4 mx-auto">
                <h1 className="text-2xl font-medium text-left ml-2">{t("Sign in")}</h1>
                <div className="form_element w-full p-2 relative">
                  <Input
                    style={{
                      borderTop: "none",
                      borderLeft: "none",
                      borderRight: "none",
                    }}
                    type="text"
                    name="email"
                    onFocus={() => {
                      dispatch(errorRemove());
                    }}
                    onChange={(e) => {
                      setEmail(e.target.value.trim());
                    }}
                    required
                    placeholder="Email"
                    className="w-full p-2 active:outline-none focus:outline-none border-[#2070e9] border-b-2 rounded-md"
                  />
                  <div className="validation text-xs absolute top-[50%] right-[0.5rem]">
                    Required
                  </div>
                </div>
                <div className="form_element w-full p-2 mt-1 relative">
                  <Input.Password
                    type="password"
                    style={{
                      borderTop: "none",
                      borderLeft: "none",
                      borderRight: "none",
                    }}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    name="password"
                    onFocus={() => {
                      dispatch(errorRemove());
                    }}
                    required
                    placeholder="Password"
                    className="w-full p-2 active:outline-none focus:outline-none border-[#2070e9] border-b-2 rounded-md"
                  />
                  <div className="validation text-xs absolute top-[50%] right-[0.5rem]">
                  {t("Required")}
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-black hover:bg-[#aca9a9] transition-all ease-in-out duration-500 w-[90%] text-white font-medium p-2 rounded-lg mt-5"
                >
                  {t("Sign in")}
                </button>
              </div>
            </form>
            {auth.authErr != "" ? (
              <p className="mt-2" style={{ color: "red" }}>
                {auth?.authErr}
              </p>
            ) : (
              ""
            )}
            <div
              style={{ display: "flex", justifyContent: "center" }}
              className="mt-4"
            >
              <div className="text-center bg-red- w-[80%] mx-auto">
                {/* ... other components ... */}
                <div className="mt-4">
                  <RoleButton
                    role="manager"
                    activeRole={activeRole}
                    handleRoleClick={handleRoleClick}
                  >
                    {t("Manager Login")}
                  </RoleButton>
                  <RoleButton
                    role="employee"
                    activeRole={activeRole}
                    handleRoleClick={handleRoleClick}
                  >
                    {t("Employee Login")}
                  </RoleButton>
                  <RoleButton
                    role="admin"
                    activeRole={activeRole}
                    handleRoleClick={handleRoleClick}
                  >
                    {t("Admin Login")}
                  </RoleButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
