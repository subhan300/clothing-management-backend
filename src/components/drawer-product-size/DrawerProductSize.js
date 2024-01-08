import React, { useState } from "react";
import "../product-size/CustomProductSize.css";
import { useTranslation } from "react-i18next";
import "./DrawerProductSize.css"
function DrawerProductSize(props) {
  const { t } = useTranslation();
  const {
    selectedEmployee,
    setAllProductEmployeeSizeCollection,
    allProductEmployeeSizeCollection,
    product,
  } = props;

  const handleChange = (key, value) => {
    const sizeProductEmployee = {
      empId: selectedEmployee.id,
      productId: product._id,
      productSize: value,
    };
    const isProductSizeIndex = allProductEmployeeSizeCollection.findIndex(
      (val) =>
        val.empId === selectedEmployee.id && val.productId === product._id
    );
    if (isProductSizeIndex > -1) {
      setAllProductEmployeeSizeCollection((prev) => {
        prev[isProductSizeIndex] = sizeProductEmployee;
        return [...prev];
      });
    } else {
      setAllProductEmployeeSizeCollection((prev) => [
        ...prev,
        sizeProductEmployee,
      ]);
    }
  };

  const sizeOfSelectedEmployee = () => {
    const sizeOfSelectedEmployee = allProductEmployeeSizeCollection?.filter(
      (val) =>
        val.empId === selectedEmployee.id && val.productId === product._id
    );
    if (sizeOfSelectedEmployee?.length > 0) {
      return sizeOfSelectedEmployee[0].productSize;
    } else {
      return "";
    }
  };

  return (
    <div className="input_size_div_drawer ">
      <span className="text-white" style={{ fontSize: "16px" }}>
        {t("size")} : &nbsp;
      </span>
      <input
        className="input_size_drawer text-white"
        placeholder={t("size")}
        value={sizeOfSelectedEmployee()}
        onChange={(e) => {
          handleChange("productSize", e.target.value.toUpperCase());
        }}
        style={{ textTransform: "uppercase", width: "100%" }}
      />
    </div>
  );
}

export default DrawerProductSize;
