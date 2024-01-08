import React, { useState, useEffect } from "react";
import Table from "../components/table/Table";
import { tableStructureData } from "../utils/TableStructureData";
import ProductDrawer from "../components/ProductDrawer";
import {
  p1,
  p2,
  p3,
  p4,
  p5,
  p6,
  p7,
  p8,
  p9,
  p10,
  p11,
} from "../assets/images/index";
import { useSelector } from "react-redux";
import { useGetEmployeesProductsQuery } from "../apis/companyManager/index";
import { globalFunctions } from "../global-functions/GlobalFunctions";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { data, error, isLoading } = useGetEmployeesProductsQuery();
 const {t}=useTranslation();
  const [tableData, setTableData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const products = [
    { id: 1, src: p1 },
    { id: 2, src: p2 },
    { id: 3, src: p3 },
    { id: 4, src: p4 },
    { id: 5, src: p5 },
    { id: 6, src: p6 },
    { id: 7, src: p7 },
    { id: 8, src: p8 },
    { id: 9, src: p9 },
    { id: 10, src: p10 },
    { id: 11, src: p11 },
  ];



  const openDrawer = (row) => {
    setShowDrawer(!showDrawer);
  
    setSelectedEmployee(row);
  };
  const addMoreProduct = (products) => {
    
    let emp = selectedEmployee.slider.showProducts[0].products;
    const obj = { ...selectedEmployee };
    emp = [...emp, products];
    obj.slider.showProducts = [{ products: emp }];
    let updateCollection = tableData.filter(
      (val) => val.id != selectedEmployee.id
    );
    updateCollection.push(obj);

    setTableData([...updateCollection]);
  };

  const addItem = (row) => {
    alert("product added in cart");
    let cartItems = [];
    let getLocalStorageCartData = JSON.parse(localStorage.getItem("addToCart"));

    let totalBilled = row.slider.showProducts[0].products.map(val=>val.productPrice);
  totalBilled=totalBilled.reduce(
    (previousScore, currentScore, index)=>previousScore+currentScore, 
    0);
  
    if (totalBilled <= row.budget) {
      if (
        getLocalStorageCartData != undefined ||
        getLocalStorageCartData != null
      ) {
        let filterData = getLocalStorageCartData.filter(
          (val) => val.id != row.id
        );
        filterData.push(row);
        localStorage.setItem("addToCart", JSON.stringify(filterData));
      } else {
        cartItems.push(row);
        localStorage.setItem("addToCart", JSON.stringify(cartItems));
      }
    } else {
      alert("Plz Increase The budget");
    }
  };
  useEffect(() => {
    let getLocalStorageCartData = JSON.parse(localStorage.getItem("addToCart"));
   
    if (data != undefined) {
      let tableDataConvert = globalFunctions.tableDataFormatConverter(data);
      setTableData(tableDataConvert);
    }
  }, [data]);

  return (
    <div style={{ padding: "7rem 6rem" }}>
      <Table
        tableData={tableData}
        setTableData={setTableData}
        columns={tableStructureData.columns}
        tableTitle={t("Create Order")}
        openDrawer={openDrawer}
        addItem={addItem}
      />
      <ProductDrawer
        show={showDrawer}
        setShow={setShowDrawer}
        img={products}
        addMoreProduct={addMoreProduct}
      />
    </div>
  );
};

export default Index;
